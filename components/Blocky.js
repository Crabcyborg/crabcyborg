import m from 'mithril';
import { Trigger } from '$app/components';
import { levels } from '$app/blocky/levels';

const size = 32;

const AIR = 0, BLOCKY = 1, WALL = 2, ENEMY = 3;
let color_by_type = {};
color_by_type[AIR] = 'lightblue';
color_by_type[WALL] = 'darkgray';
color_by_type[BLOCKY] = 'tomato';
color_by_type[ENEMY] = 'green';

export const Cell = {
	view: v => m(
		'div',
		{
			style: { width: `${v.attrs.size}px`, height: `${v.attrs.size}px`, backgroundColor: color_by_type[v.attrs.type], float: 'left' }
		}
	)
};

const frameDuration = v => {
	return v.attrs.frame_duration || 600;
}

const initialize = v => {
	const level = levels[(v.state.level_index + levels.length) % levels.length];
	const [ height ] = level;
	const row_size = (level.length-1)/height;
	
	let grid = [], row = [], index = 0, blocky_coordinates = false;
	while(++index < level.length) {
		level[index] === BLOCKY && (blocky_coordinates = {index, x: row.length, y: grid.length});
		row.push({type: level[index]});

		if(row.length === row_size) {
			grid.push(row);
			row = [];
		}
	}

	v.state.grid = grid;
	v.state.x_speed = 1;
	v.state.y_speed = 0;
	v.state.blocky_coordinates = blocky_coordinates;
};

const moveBlocky = v => {
	const { grid } = v.state;
	const height = grid.length;
	const { x, y } = v.state.blocky_coordinates;
	const width = grid[y].length;

	x >= 0 && x < width && (grid[y][x].type = AIR);

	v.state.blocky_coordinates.x += v.state.x_speed;
	v.state.blocky_coordinates.y += v.state.y_speed;

	let move = false;

	if(v.state.x_speed > 0) {
		if(v.state.blocky_coordinates.x < grid[y].length) {
			move = true;
		} else {
			++v.state.level_index;
			initialize(v);
		//	v.state.x_speed = -1;
		}
	} else {
		if(v.state.blocky_coordinates.x >= 0) {
			move = true;
		} else {
		//	--v.state.level_index;
		//	initialize(v);
			v.state.x_speed = 1;
		}
	}

	if(v.state.blocky_coordinates.y === grid.length) {
		move = false;
		setTimeout(() => initialize(v), frameDuration(v));
	}

	if(move) {
		const target = grid[v.state.blocky_coordinates.y][v.state.blocky_coordinates.x];

		switch(target.type) {
			case ENEMY: {
				if(v.state.y_speed > 0) {
					grid[v.state.blocky_coordinates.y][v.state.blocky_coordinates.x].type = AIR;
					grid[v.state.blocky_coordinates.y-1][v.state.blocky_coordinates.x].type = BLOCKY;
					v.state.blocky_coordinates.y = y;
					v.state.y_speed = -2;
				} else {
					initialize(v);
				}
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

			case AIR: {
				grid[v.state.blocky_coordinates.y][v.state.blocky_coordinates.x].type = BLOCKY;

				if(v.state.blocky_coordinates.y+1 === grid.length || grid[v.state.blocky_coordinates.y+1][v.state.blocky_coordinates.x].type === AIR) {
					v.state.y_speed = 1;					
				}
			} break;
		}
	}

	switch(v.state.y_speed) {
		case -2: v.state.y_speed = -1; break;
		case -1: v.state.y_speed = 1; break;
	}

	m.redraw();
	setTimeout(() => moveBlocky(v), frameDuration(v));
};

export const Blocky = {
	oninit: v => {
		v.state = { level_index: v.attrs.level_index };
		initialize(v);
		setTimeout(() => moveBlocky(v), frameDuration(v));
	},
	view: v => m(
		'.dib',
		{ onclick: () => v.state.y_speed === 0 && (v.state.y_speed = -1) },
		v.state.grid.map(row => m('div', { style: `height: ${size}px;` }, row.map(cell => m(Cell, {...cell, size})))),
		v.attrs.display_level_picker && m(
			'div',
			levels.map((level, index) => m(
				Trigger,
				{
					onclick: () => {
						v.state.level_index = index;
						initialize(v)
					},
					style: { marginRight: '4px' }
				},
				index
			))
		)
	)
};