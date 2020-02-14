import m from 'mithril';
import { colors } from '$app/shapeup/colors';

const targets = [128,64,32,16,8,4,2,1];

let highest_colors = {};
let target_shape_vnodes = {};

const shuffle = a => {
	let j, x, i;
	for(i = a.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = a[i];
		a[i] = a[j];
		a[j] = x;
	}

	return a;
}

const processTargetShapeState = (i, config, retries) => {
	if(target_shape_vnodes[i] === undefined) {
		retries === undefined && (retries = 0);
		retries < 10 && setTimeout(() => processTargetShapeState(i, config, ++retries), 10);
		return;
	}

	const v = target_shape_vnodes[i];
	const { coordinates, color } = config;

	let min_x = false, min_y = false, max_x = 0, max_y = 0;
	for(let coordinate of coordinates) {
		coordinate.x > max_x && (max_x = coordinate.x);
		(min_x === false || coordinate.x < min_x) && (min_x = coordinate.x);
		coordinate.y > max_y && (max_y = coordinate.y);
		(min_y === false || coordinate.y < min_y) && (min_y = coordinate.y);
	}

	v.state.ready = true;
	v.state.coordinates = coordinates;
	v.state.min_x = min_x;
	v.state.min_y = min_y;
	v.state.max_x = max_x;
	v.state.max_y = max_y;
	v.state.color = color;
	v.state.width = ((max_x-min_x)*v.attrs.size)+'px';
	v.state.height = ((max_y-min_y)*v.attrs.size)+'px';
};

const updateShapeUpComponent = (v) => {
	const [ height, width ] = v.attrs.configuration;
	const use_colors = shuffle(colors);
	let x = -1, y = -1, data_index = 2, target_index = 0, color_index = 0, grid = [], unassigned = [];
	let random_target = 0.3;
	let count_by_color = {}, coordinates_by_color = {};

	const getColor = index => `rgb(${use_colors[index]})`;

	const assign = (target, adjacent) => {
		if(adjacent.empty || adjacent.unassigned) {
			return false;
		}

		target.color_index = adjacent.color_index;
		target.color = getColor(target.color_index);
		count_by_color[target.color]++;
		coordinates_by_color[target.color].push({x: target.x, y: target.y});
		target.unassigned = false;
		return true;
	};

	while(++y < height) {
		let row = [];

		while(++x < width) {
			let obj = {x,y};
			let byte = v.attrs.configuration[data_index];
			obj.empty = (byte & targets[target_index]) === 0;

			if(obj.empty) {
				obj.color = '#fff';
				row.push(obj);
			} else {
				obj.unassigned = true;

				let checks = [];
				grid.length && checks.push('up');
				x > 0 && checks.push('left');
				checks.length > 1 && Math.random() < .5 && (checks = [checks[1], checks[0]]);

				for(let check of checks) {
					if(Math.random() > random_target) {
						continue;
					}

					let cell;
					switch(check) {
						case 'up': cell = grid[grid.length-1][x]; break;
						case 'left': cell = row[x-1]; break;
					}

					if(assign(obj, cell)) {
						break;
					}
				}

				if(obj.unassigned) {
					obj.color_index = color_index++;
					obj.color_index % 5 === 0 && (random_target = Math.max(random_target + .5, .9));

					if(obj.color_index >= colors.length) {
						delete obj.color_index;
						obj.color = '#000';
						unassigned.push(obj);
					} else {
						obj.color = getColor(obj.color_index);
						count_by_color[obj.color] = 1;
						coordinates_by_color[obj.color] = [{x: obj.x, y: obj.y}];
						obj.unassigned = false;
					}
				}

				row.push(obj);
			}

			if(target_index++ === 7) {
				++data_index;
				target_index = 0;
			}
		}

		grid.push(row);
		x = -1;
	}

	let tries = 0;
	while(unassigned.length && tries++ < 10) {
		unassigned = unassigned.filter(obj => {
			let checks = [];
			obj.x > 1 && checks.push(grid[obj.y][obj.x-1]);
			obj.y > 1 && checks.push(grid[obj.y-1][obj.x]);
			obj.x+1 < width && checks.push(grid[obj.y][obj.x+1]);
			obj.y+1 < height && checks.push(grid[obj.y+1][obj.x]);

			while(checks.length) {
				let random_index = Math.floor(Math.random()*checks.length);
				let check = checks.splice(random_index, 1);

				if(assign(obj, check)) {
					return true;
				}
			}

			return false;
		});
	}

	var color_keys = Object.keys(count_by_color);
	var highest = 0;
	var highest_color;
	for(let color of color_keys) {
		if(count_by_color[color] > highest) {
			highest_color = color;
			highest = count_by_color[color];

			// randomly quit early to avoid only picking the largest object
			if(highest > 10 && Math.random() < .5) {
				break;
			}
		}
	}

	v.state.width = width;
	v.state.height = height;
	v.state.grid = grid;
	v.state.highest_color = highest_color;

	v.attrs.behaviour === 'click-target' && processTargetShapeState(
		v.attrs.i,
		{
			color: highest_color,
			coordinates: coordinates_by_color[highest_color]
		}
	);

	setTimeout(m.redraw, 10);

	v.attrs.behaviour === 'blink' && setTimeout(
		() => updateShapeUpComponent(v),
		v.attrs.blink_delay ? (typeof v.attrs.blink_delay === 'function' ? v.attrs.blink_delay() : v.attrs.blink_delay) : 100
	);
};

export const Cell = {
	view: v => m(
		'div',
		{
			style: { width: `${v.attrs.size}px`, height: `${v.attrs.size}px`, backgroundColor: v.attrs.color, float: 'left' }
		}
	)
};

export const ShapeUp = {
	oninit: v => {
		v.state = {};
		updateShapeUpComponent(v);
	},
	view: v => m(
		'.dib',
		{
			id: v.attrs.id,
			style: v.attrs.style,
			onclick: v.attrs.behaviour === 'click-target' ? e => e.target.style.backgroundColor.replace(/ /g, '') === v.state.highest_color && updateShapeUpComponent(v) : false
		},
		v.state.grid.map(row => m('div', { style: `height: ${v.attrs.size}px;` }, row.map(cell => m(Cell, {...cell, size: v.attrs.size}))))
	)
};

export const TargetShape = {
	oninit: v => {
		v.state = {
			ready: false
		};

		target_shape_vnodes[v.attrs.i] = v;
	},
	view: v => {
		const { ready, min_x, min_y, max_x, max_y, color, coordinates, width, height } = v.state;
		return ready && m(
			'.relative.dib.mr2',
			{ style: { width, height } },
			coordinates.map(
				coordinate => m('.absolute', {
					style: {
						left: ((coordinate.x-min_x)*v.attrs.size)+'px',
						top: ((coordinate.y-min_y)*v.attrs.size)+'px'
					}
				}, m(Cell, { color, size: v.attrs.size }))
			)
		);
	}
};