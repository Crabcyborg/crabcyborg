import m from 'mithril';
import { ShapeUp } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { refactorColors } from '$app/shapeup/colors';
import { toRects, toLargerRects, toSquarePolygons, toPolygons } from '$app/shapeup/svg-helper';
import { roughSizeInMemory } from '$app/helpers';

const stackoverflow = 'https://stackoverflow.com/questions/13746284/merging-multiple-adjacent-rectangles-into-one-polygon#answer-13851341';
const colors = refactorColors('#ffffff');
const size = 6;

let width, height, containers = [];

const labelHeight = 80;
const Container = {
	view: v => v.attrs.data && m(
		'.dib.mr2.relative',
		{ style: { width: width+'px', height: height+labelHeight+'px' } },
		m(
			'svg.mr3',
			{ width, height },
			v.attrs.data.map(item => m(v.attrs.type, {...item, stroke: 'white'}))
		),
		m(
			'p.tc.absolute.bottom0.width100',
			v.attrs.label,
			m('div', roughSizeInMemory(v.attrs.data))
		)
	)
};

export var title = 'Rendering Shape Up using SVG';

export var experiment = {
	view: v => [
		[
			m('p', 'There are a few ways to draw a Shape Up component with SVG. I used the ', m('a', { href: stackoverflow, target: '_blank' }, 'algorithm mentioned in this Stack Overflow post'), ' to simplify my points to a single polygon per color, which was a really fun challenge. Then I pieced together a few other algorithms (largest rectangle in a matrix, number of islands) to generate a component that reduces to the smallest number of rectangles possible, for an (not always) even smaller data payload than the polygon per color algorithm. I\'m comparing the rough size in memory of the data being used for each SVG. All SVGs include a white stroke to illustrate how they\'re being structured'),
			m('.dib', containers.map(container => m(Container, container))),
			m(ShapeUp, {configuration: shapes.DINO, size, behaviour: 'blink', blink_delay: 1000, onUpdate: shapeup => {
				width = shapeup.state.width*size;
				height = shapeup.state.height*size;

				const filtered = shapeup.state.grid.flat().filter(cell => !cell.empty);
				containers = [
					{ data: toSquarePolygons(filtered, size), type: 'polygon', label: 'polygon per pixel' },
					{ data: toRects(filtered, size), type: 'rect', label: 'rect per pixel' },
					{ data: toPolygons(filtered, size), type: 'polygon', label: 'polygon per color' },
					{ data: toLargerRects(filtered, size), type: 'rect', label: 'larger rects' }					
				];

				setTimeout(m.redraw, 0);
			}})
		]
	]
};