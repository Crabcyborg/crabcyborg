import m from 'mithril';
import { ShapeUp } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { colors } from '$app/shapeup/colors';
import { injectScript } from '$app/helpers';

let canvas;
let refactored_colors;

const oncreate = v => {
	refactored_colors = [];
	for(let rgb of colors) {
		refactored_colors.push('#'.concat(rgb.split(',').map(value => parseInt(value).toString(16).padStart(2,'0')).join('')));
	}

	injectScript('https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.2/paper-core.min.js', () => {
		canvas = document.getElementById('mycanvas');
		paper.setup(canvas);
	});
};

const onUpdate = shapeup => {
	if(canvas === undefined) {
		setTimeout(() => onUpdate(shapeup), 5);
		return;
	}

	const { grid, width, height } = shapeup.state;
	const size = 10;

	for(let y_index = 0; y_index < height; y_index++) {
		for(let x_index = 0; x_index < width; x_index++) {
			if(grid[y_index][x_index].empty) {
				continue;
			}

			const { color_index, x, y } = grid[y_index][x_index];
			const rectangle = new paper.Rectangle(
				new paper.Point(x*size, y*size),
				new paper.Point(x*size+size, y*size+size)
			);
			const path = new paper.Path.Rectangle(rectangle);
			path.fillColor = refactored_colors[color_index];
		}
	}
};

export var title = 'Rendering Shape Up using Paper.js';

export var experiment = {
	oncreate,
	view: v => [
		[
			m('canvas#mycanvas'),
			m(ShapeUp, {configuration: shapes.PURR, size: 6, behaviour: 'blink', blink_delay: 1000, onUpdate})
		]
	]
};