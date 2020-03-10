import m from 'mithril';
import { ShapeUp } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { refactorColors } from '$app/shapeup/colors';
import { injectScript } from '$app/helpers';

let canvas, context, colors;

const oncreate = v => {
	colors = refactorColors('#ffffff');
	canvas = document.getElementById('mycanvas');
	context = canvas.getContext('2d');
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
			context.fillStyle = colors[color_index];
			context.fillRect(x*size, y*size, size, size);
		}
	}
};

export var title = 'Rendering Shape Up using fillRect';

export var experiment = {
	oncreate,
	view: v => [
		[
			m('canvas#mycanvas'),
			m(ShapeUp, {configuration: shapes.SHELL, size: 6, behaviour: 'blink', blink_delay: 1000, onUpdate})
		]
	]
};