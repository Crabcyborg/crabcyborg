import m from 'mithril';
import { refactorColors } from '$app/shapeup/colors';
import { injectClassDefinition, injectClassDefinitions } from '$app/helpers';
import anime from 'animejs/lib/anime.es.js';
import { shapeup } from '$app/lib/shapeup';

const colors = refactorColors('255,255,255');
const class_prefix = 'su';
const color_class_prefix = 'c';

let index = 0;
let initialized = false;

let vnodes = {
	shapes: {},
	targets: {},
	scores: {}
};

const processTargetShapeState = i => {
	if(!vnodes.shapes[i] || !vnodes.targets[i]) {
		return;
	}

	const shape = vnodes.shapes[i];
	const target = vnodes.targets[i];
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
	target.state.color_index = shape.state.highest_color_index;
	target.state.width = ((max_x-min_x)*target.attrs.size)+'px';
	target.state.height = ((max_y-min_y)*target.attrs.size)+'px';
};

const updateShapeUpComponent = v => {
	const configuration = typeof v.attrs.configuration === 'function' ? v.attrs.configuration() : v.attrs.configuration;
	const generated = shapeup.generate( configuration, colors.length );

	v.state.width = generated.width;
	v.state.height = generated.height;
	v.state.grid = generated.grid;
	v.state.highest_color_index = generated.highest_color_index;
	v.state.highest_color_coordinates = generated.highest_color_coordinates;

	switch(v.attrs.behaviour) {
		case 'click-target': {
			processTargetShapeState(v.attrs.i);
		} break;

		case 'blink': {
			v.state.blink_timeout = setTimeout(
				() => {
					updateShapeUpComponent(v);
					m.redraw();
				},
				v.attrs.blink_delay ? (typeof v.attrs.blink_delay === 'function' ? v.attrs.blink_delay() : v.attrs.blink_delay) : 100
			);
		} break;

		case 'scatter': {
			const color_keys = Object.keys( generated.count_by_color_index );
			const step = 150;
			const duration = step*(color_keys.length+4)*2;
			let delay = -step;
			for(let color_index of color_keys) {
				setTimeout(() => anime({
					targets: `.${class_prefix}${v.state.index} .${class_prefix}${color_class_prefix}${color_index}`,
					translateX: [75, 0, 75],
					direction: 'alternate',
					loop: true,
					duration,
					easing: 'easeInOutExpo'
				}), delay += step);
			}
		} break;
	}

	v.attrs.onUpdate && v.attrs.onUpdate(v)
};

export const ShapeUp = {
	oninit: v => {
		if(!initialized) {
			let definitions = [];
			let color_index = 0;
			for(let color of colors) {
				definitions.push({
					selector: `.${class_prefix}${color_class_prefix}`+(color_index++),
					style: `background-color: rgb(${color})`
				});
			}
			injectClassDefinitions(definitions);
			initialized = true;
		}

		v.state = { index: index++ };
		v.attrs.i && (vnodes.shapes[v.attrs.i] = v);
		injectClassDefinition(`.${class_prefix}${v.state.index} > div > div`, `float: left; width: ${v.attrs.size}px; height: ${v.attrs.size}px;`);
		updateShapeUpComponent(v);
	},
	view: v => m(
		`.dib.${class_prefix}${v.state.index}`,
		{
			id: v.attrs.id,
			style: v.attrs.style,
			onclick: v.attrs.behaviour === 'click-target' ? e => {
				if(e.target.classList.contains(`${class_prefix}${color_class_prefix}${v.state.highest_color_index}`)) {
					vnodes.scores[v.attrs.i] && vnodes.scores[v.attrs.i].state.score++;
					updateShapeUpComponent(v);
				}
			} : false
		},
		v.state.grid.map(row => m('div', row.map(
			cell => m(`div`+(cell.color_index !== undefined ? `.${class_prefix}${color_class_prefix}${cell.color_index}` : ''))
		)))
	),
	trigger: details => {
		switch(details.task) {
			case 'redraw': updateShapeUpComponent(vnodes.shapes[details.i]); break;
		}
	},
	onremove: v => {
		v.attrs.behaviour === 'blink' && clearTimeout(v.state.blink_timeout);
	}
};

export const TargetShape = {
	oninit: v => {
		v.state = { ready: false, index: index++ };
		vnodes.targets[v.attrs.i] = v;
		processTargetShapeState(v.attrs.i);
		injectClassDefinition(`.${class_prefix}${v.state.index} > div`, `float: left; width: ${v.attrs.size}px; height: ${v.attrs.size}px;`);
	},
	view: v => {
		const { ready, min_x, min_y, color_index, coordinates, width, height } = v.state;
		return ready && m(
			`.relative.dib.mr2.${class_prefix}${v.state.index}`,
			{ style: { width, height, ...v.attrs.style } },
			coordinates.map(coordinate => m(
				`.absolute.${class_prefix}${color_class_prefix}${color_index}`,
				{
					style: {
						left: ((coordinate.x-min_x)*v.attrs.size)+'px',
						top: ((coordinate.y-min_y)*v.attrs.size)+'px'
					}
				}
			))
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