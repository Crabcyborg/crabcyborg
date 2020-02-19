import m from 'mithril';
import { Trigger } from '$app/components';
import { levels } from '$app/blocky/levels';
import { between, injectClassDefinition, injectClassDefinitions } from '$app/helpers';

const class_prefix = 'bl';
const color_class_prefix = 'c';
let index = 0;
let initialized = false;

const
AIR = 0,
BLOCKY = 1,
WALL = 2,
ENEMY = 3,
BLINK = 4,
SPIKE = 5,
TRAMPOLINE = 6,
WATER = 7,
PIPE = 8,
LOCK = 9,
KEY = 10,
CRUMBLING_PLATFORM = 11;

const color_by_type = {
	[AIR]: 'lightblue',
	[WALL]: 'darkgray',
	[BLOCKY]: 'tomato',
	[ENEMY]: 'green',
	[BLINK]: 'lightgray',
	[SPIKE]: 'yellow',
	[TRAMPOLINE]: 'blue',
	[WATER]: 'teal',
	[PIPE]: 'lightgreen',
	[LOCK]: 'black',
	[KEY]: 'gold',
	[CRUMBLING_PLATFORM]: 'brown'
};

const useType = (v, type, details) => {
	switch(type) {
		case LOCK: return v.state.has_key ? AIR : (details && details.rendering ? LOCK : WALL);
		case BLINK: return getBlinkType(v);
		case CRUMBLING_PLATFORM: return details && details.occupying ? WALL : CRUMBLING_PLATFORM;
		default: return type;
	}
};

const frameDuration = v => v.attrs.frame_duration || 600;
const getBlinkType = v => v.state.frame_index % 6 <= 3 ? WALL : AIR;
const getLevel = v => levels[(v.state.level_index + levels.length) % levels.length];

const updateWaterPhysics = (v, force) => {
	if(v.state.y_speed === -1) {
		v.state.offset_water_physics = v.state.frame_index % 2;
	}

	if(force || v.state.previous_target_type === WATER) {
		if(v.state.y_speed >= 0) {
			v.state.y_speed = 1 - v.state.y_speed;
		} else if(v.state.frame_index % 2 === (v.state.offset_water_physics || 0)) {
			v.state.y_speed++;
		}

		v.state.water_physics_timeout && clearTimeout(v.state.water_physics_timeout);
		v.state.water_physics_timeout = setTimeout(() => updateWaterPhysics(v), frameDuration(v)*2);
	}
};

const checkSpaceUnderneath = v => {
	if(v.state.y_speed < 0) {
		return;
	}

	const { grid } = v.state;
	const height = grid.length;
	if(v.state.blocky_coordinates.y+1 < height) {
		const grid_space_underneath = grid[v.state.blocky_coordinates.y+1][v.state.blocky_coordinates.x];
		switch(useType(v, grid_space_underneath.type)) {
			case AIR: v.state.y_speed = 1; break;
			case WATER: updateWaterPhysics(v, true); break;
			case CRUMBLING_PLATFORM: setTimeout(() => grid_space_underneath.type = AIR, frameDuration(v)*2); break;
			case TRAMPOLINE: v.state.y_speed === 0 && (v.state.y_speed = -2); break;
		}
	} else {
		v.state.y_speed = 1;
	}
};

const initialize = v => {
	const level = getLevel(v);
	const [ height ] = level;
	const row_size = (level.length-1)/height;
	
	let grid = [], row = [], level_index = 0, blocky_coordinates = false;
	while(++level_index < level.length) {
		level[level_index] === BLOCKY && (blocky_coordinates = {level_index, x: row.length, y: grid.length});
		row.push({type: level[level_index]});

		if(row.length === row_size) {
			grid.push(row);
			row = [];
		}
	}

	v.state.safe = true;
	v.state.has_key = false;
	v.state.previous_target_type = false;
	v.state.grid = grid;
	v.state.frame_index = 0;
	v.state.x_speed = 1;
	v.state.y_speed = 0;
	v.state.blocky_coordinates = blocky_coordinates;
};

const moveBlocky = v => {
	const { grid } = v.state;
	const height = grid.length;
	const { x, y } = v.state.blocky_coordinates;
	const width = grid[y].length;

	v.state.blocky_coordinates.x += v.state.x_speed;
	v.state.blocky_coordinates.y += v.state.y_speed;
	const safe_x_range = between(v.state.blocky_coordinates.x, 0, width-1);
	const safe_y_range = between(v.state.blocky_coordinates.y, 0, height-1);
	const safe = safe_x_range && safe_y_range;

	if(!safe) {
		v.state.y_speed = 0;
		v.state.blocky_coordinates.y = y;

		if(!safe_y_range) {
			setTimeout(() => initialize(v), frameDuration(v));
		} else {
			if(v.state.x_speed > 0) {
				!v.attrs.repeat && ++v.state.level_index;
				setTimeout(() => initialize(v), frameDuration(v));
			} else {
				v.state.x_speed = 1;
			}
		}

		v.state.safe && (grid[y][x].type = v.state.previous_target_type);
	} else {
		const target = grid[v.state.blocky_coordinates.y][v.state.blocky_coordinates.x];
		v.state.safe && (grid[y][x].type = v.state.previous_target_type === false ? target.type : v.state.previous_target_type);

		switch(useType(v, target.type, {occupying: true})) {
			case AIR: {
				v.state.previous_target_type = target.type;
				target.type = BLOCKY;
				checkSpaceUnderneath(v);
			} break;

			case WALL: {
				if(v.state.y_speed === 0) {
					v.state.x_speed *= -1;
				} else {
					v.state.y_speed = 0;
				}

				v.state.blocky_coordinates.y = y;
				v.state.blocky_coordinates.x = x;
				grid[y][x].type = BLOCKY;
				moveBlocky(v);
				return;
			} break;

			case ENEMY: {
				if(v.state.y_speed > 0) {
					target.type = AIR;
					grid[v.state.blocky_coordinates.y-1][v.state.blocky_coordinates.x].type = BLOCKY;
					v.state.blocky_coordinates.y = y;
					v.state.y_speed = -2;
				} else {
					initialize(v);
				}
			} break;

			case SPIKE: {
				initialize(v);
			} break;

			case TRAMPOLINE: {
				grid[v.state.blocky_coordinates.y-1][v.state.blocky_coordinates.x].type = BLOCKY;
				v.state.blocky_coordinates.y = y;
				v.state.y_speed = -3;
			} break;

			case WATER: {
				v.state.previous_target_type = target.type;
				target.type = BLOCKY;
				v.state.frame_index % 2 === (v.state.offset_water_physics || 0) && checkSpaceUnderneath(v);
			} break;

			case PIPE: {
				const current_index = v.state.blocky_coordinates.y*width + v.state.blocky_coordinates.x;
				const level_data = getLevel(v).slice(1);

				let pipe_index = -1;
				do pipe_index = level_data.indexOf(PIPE, pipe_index+1);
				while(pipe_index >= 0 && pipe_index === current_index);

				const pipe_y = Math.floor(pipe_index/width);
				const pipe_x = pipe_index-pipe_y*width+v.state.x_speed;			
				const type_at_new_position = level_data[pipe_y*width + pipe_x];

				grid[pipe_y][pipe_x].type = BLOCKY;
				v.state.previous_target_type = type_at_new_position; 
				v.state.blocky_coordinates.x = pipe_x;
				v.state.blocky_coordinates.y = pipe_y;
			} break;

			case KEY: {
				v.state.has_key = true;
				target.type = BLOCKY;
				checkSpaceUnderneath(v);
			} break;
		}
	}

	switch(v.state.y_speed) {
		case -3: v.state.y_speed = -2; break;
		case -2: v.state.y_speed = -1; break;
		case -1: v.state.y_speed = 1; break;
	}

	v.state.safe = safe;
	v.state.frame_index++;

	m.redraw();
	setTimeout(() => moveBlocky(v), frameDuration(v));
};

export const Blocky = {
	oninit: v => {
		if(!initialized) {
			let definitions = [];
			let color_index = 0;

			const types = Object.keys(color_by_type);

			for(let type of types) {
				definitions.push({
					selector: `.${class_prefix}${color_class_prefix}${type}`,
					style: `background-color: ${color_by_type[type]}`
				});
			}
			injectClassDefinitions(definitions);
			initialized = true;
		}

		v.state = { level_index: v.attrs.level_index, index: index++ };
		initialize(v);
		setTimeout(() => moveBlocky(v), frameDuration(v));
		injectClassDefinition(`.${class_prefix}${v.state.index} > div > div`, `float: left; width: ${v.attrs.size}px; height: ${v.attrs.size}px;`);
	},
	view: v => m(
		'.dib',
		m(
			`.${class_prefix}${v.state.index}`,
			{ onclick: () => v.state.y_speed === 0 && (v.state.y_speed = -1) },
			v.state.grid.map(row => m('div', row.map(cell => m(`.${class_prefix}${color_class_prefix}`+useType(v, cell.type, {rendering: true})))))
		),
		v.attrs.display_level_picker && m(
			'.dib',
			levels.map((level, level_index) => m(
				Trigger,
				{
					onclick: () => {
						v.state.level_index = level_index;
						initialize(v)
					},
					style: { marginRight: '4px' }
				},
				level_index
			))
		)
	)
};