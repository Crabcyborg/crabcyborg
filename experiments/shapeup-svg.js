import m from 'mithril';
import { ShapeUp } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { refactorColors } from '$app/shapeup/colors';

const colors = refactorColors('#ffffff');
const size = 6;
let width, height, cells;

export var title = 'Rendering Shape Up using SVG';

export var experiment = {
	view: v => [
		[
			cells !== undefined && m(
				'svg.mr3',
				{ width: size*width, height: size*height },
				cells.map(cell => m(
					'rect',
					{
						x: cell.x*size,
						y: cell.y*size,
						width: size,
						height: size,
						fill: colors[cell.color_index]
					}
				))
			),
			m(ShapeUp, {configuration: shapes.TREE, size: 6, behaviour: 'blink', blink_delay: 1000, onUpdate: shapeup => {
				width = shapeup.state.width;
				height = shapeup.state.height;
				cells = shapeup.state.grid.flat().filter(cell => !cell.empty);
			}})
		]
	]
};