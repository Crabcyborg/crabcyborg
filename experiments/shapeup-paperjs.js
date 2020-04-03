import m from 'mithril';
import { ShapeUp } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { refactorColors } from '$app/shapeup/colors';
import { injectScript } from '$app/helpers';
import { toPolygons } from '$app/shapeup/svg-helper';

const size = 6;

let colors = refactorColors('#ffffff');
let loaded_paper = false;

const oncreate = () => injectScript(
	'https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.2/paper-core.min.js',
	() => {
		paper.setup(document.getElementById('mycanvas'));
		loaded_paper = true;
	}
);

const onUpdate = shapeup => {
	if(!loaded_paper) {
		setTimeout(() => onUpdate(shapeup), 5);
		return;
	}

	paper.project.activeLayer.removeChildren();

	const { grid, width, height } = shapeup.state;

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
			path.fillColor = colors[color_index];
		}
	}

	const filtered = shapeup.state.grid.flat().filter(cell => !cell.empty);
	const polygons = toPolygons(filtered, size);
	let paths = [];
	for(let polygon of polygons) {
		const path = new paper.Path({
			segments: polygon.points[0],
			fillColor: polygon.fill,
			closed: true
		});
		path.position.y += 150;
		path.smooth();

		paths.push(path);
	}

	paper.view.onFrame = function(event) {
		for(let path of paths) {
			let i = 0;
			for(let segment of path.segments) {
				var sinus = Math.sin(event.time * 32 + i);
				segment.point.y += sinus;
				++i;
			}
		}
	};
};

export var title = 'Rendering Shape Up using Paper.js';

export var experiment = {
	oncreate,
	view: v => [
		[
			m('canvas#mycanvas.fl', { width: 220, height: 360 }),
			m(ShapeUp, {configuration: shapes.TRUNK, size, behaviour: 'blink', blink_delay: 1000, onUpdate})
		]
	]
};