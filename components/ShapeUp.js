import m from 'mithril';
import { colors } from '$app/shapeup/colors';

const targets = [128,64,32,16,8,4,2,1];

let vnodes = {
	shapes: {},
	targets: {},
	scores: {}
};

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

const processTargetShapeState = i => {
	if(!vnodes.shapes[i] || !vnodes.targets[i]) {
		return;
	}

	const shape = vnodes.shapes[i];
	const target = vnodes.targets[i];
	const color = shape.state.highest_color;
	const coordinates = shape.state.highest_color_coordinates;

	let min_x = false, min_y = false, max_x = 0, max_y = 0;
	for(let coordinate of coordinates) {
		coordinate.x > max_x && (max_x = coordinate.x);
		(min_x === false || coordinate.x < min_x) && (min_x = coordinate.x);
		coordinate.y > max_y && (max_y = coordinate.y);
		(min_y === false || coordinate.y < min_y) && (min_y = coordinate.y);
	}

	target.state.ready = true;
	target.state.coordinates = coordinates;
	target.state.min_x = min_x;
	target.state.min_y = min_y;
	target.state.max_x = max_x;
	target.state.max_y = max_y;
	target.state.color = color;
	target.state.width = ((max_x-min_x)*target.attrs.size)+'px';
	target.state.height = ((max_y-min_y)*target.attrs.size)+'px';
};

const updateShapeUpComponent = v => {
	const configuration = typeof v.attrs.configuration === 'function' ? v.attrs.configuration() : v.attrs.configuration;

	const [ height, width ] = configuration;
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
			let byte = configuration[data_index];
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
	v.state.highest_color_coordinates = coordinates_by_color[highest_color];

	switch(v.attrs.behaviour) {
		case 'click-target': {
			processTargetShapeState(v.attrs.i);
		} break;

		case 'blink': {
			setTimeout(
				() => {
					updateShapeUpComponent(v);
					m.redraw();
				},
				v.attrs.blink_delay ? (typeof v.attrs.blink_delay === 'function' ? v.attrs.blink_delay() : v.attrs.blink_delay) : 100
			);
		} break;
	}
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
		v.attrs.i && (vnodes.shapes[v.attrs.i] = v);
		updateShapeUpComponent(v);
	},
	view: v => m(
		'.dib',
		{
			id: v.attrs.id,
			style: v.attrs.style,
			onclick: v.attrs.behaviour === 'click-target' ? e => {
				if(e.target.style.backgroundColor.replace(/ /g, '') === v.state.highest_color) {
					vnodes.scores[v.attrs.i] && vnodes.scores[v.attrs.i].state.score++;
					updateShapeUpComponent(v);
				}
			} : false
		},
		v.state.grid.map(row => m('div', { style: `height: ${v.attrs.size}px;` }, row.map(cell => m(Cell, {...cell, size: v.attrs.size}))))
	),
	trigger: details => {
		switch(details.task) {
			case 'redraw': updateShapeUpComponent(vnodes.shapes[details.i]); console.log('here', details.i, vnodes.shapes); break;
		}
	}
};

export const TargetShape = {
	oninit: v => {
		v.state = { ready: false };
		vnodes.targets[v.attrs.i] = v;
		processTargetShapeState(v.attrs.i);
	},
	view: v => {
		const { ready, min_x, min_y, color, coordinates, width, height } = v.state;
		return ready && m(
			'.relative.dib.mr2',
			{ style: { width, height, ...v.attrs.style } },
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

export const Score = {
	oninit: v => {
		v.state = { score: 0 };
		vnodes.scores[v.attrs.i] = v;
	},
	view: v => v.state.score > 0 && m('.dib.cambay.unclickable', {...v.attrs}, v.state.score)
};