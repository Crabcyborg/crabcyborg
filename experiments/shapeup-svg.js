import m from 'mithril';
import { ShapeUp } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { refactorColors } from '$app/shapeup/colors';
import { roughSizeInMemory } from '$app/helpers';

const stackoverflow = 'https://stackoverflow.com/questions/13746284/merging-multiple-adjacent-rectangles-into-one-polygon#answer-13851341';
const colors = refactorColors('#ffffff');
const size = 10;
let width, height, ready = false, rects, square_polygons, polygons;

const toRects = cells => cells.map(cell => ({
	x: cell.x*size,
	y: cell.y*size,
	width: size,
	height: size,
	fill: colors[cell.color_index]
}));

const toSquarePolygons = cells => cells.map(cell => ({
	points: [
		`${cell.x*size},${cell.y*size}`,
		`${cell.x*size+size},${cell.y*size}`,
		`${cell.x*size+size},${cell.y*size+size}`,
		`${cell.x*size},${cell.y*size+size}`
	].join(' '),
	fill: colors[cell.color_index]
}));

const yThenX = (a,b) => a[1]<b[1] || (a[1]==b[1] && a[0]<b[0]) ? -1 : (a == b ? 0 : 1);
const toPolygons = cells => {
	let points_by_color_index = {}, output = [];

	for(let cell of cells) {
		const { x, y, color_index } = cell;
		const x1 = x*size, y1 = y*size, x2 = x1+size, y2 = y1+size;
		points_by_color_index[color_index] === undefined && (points_by_color_index[color_index] = {});
		for(let point of [[x1,y1], [x2,y1], [x2,y2], [x1,y2]]) {
			if(points_by_color_index[color_index][point] !== undefined) {
				delete points_by_color_index[color_index][point];
			} else {
				points_by_color_index[color_index][point] = point;
			}
		}
	}

	const color_indices = Object.keys(points_by_color_index);
	for(let color_index of color_indices) {
		const points = Object.values(points_by_color_index[color_index]);
		const length = points.length;
		let edges_v = {}, edges_h = {}, i;

		points.sort();
		i = 0;
		while(i < length) {
			const curr_x = points[i][0];
			do {
				edges_v[points[i]] = points[i+1];
				edges_v[points[i+1]] = points[i];
				i += 2
			} while(i < length && points[i][0] == curr_x);
		}

		points.sort(yThenX);
		i = 0;
		while(i < length) {
			const curr_y = points[i][1];
			do {
				edges_h[points[i]] = points[i+1];
				edges_h[points[i+1]] = points[i];
				i += 2;
			} while(i < length && points[i][1] == curr_y);
		}
		
		let p = [], keys;
		while((keys = Object.keys(edges_h)).length) {
			const key = keys[0];
			delete edges_h[key];
			let last_polygon = [key.split(',').map(v => parseInt(v)), 0];
			let polygon = [last_polygon];

			while(1) {
				const [curr, e] = last_polygon;
				const edges = [edges_v, edges_h][e];

				if(edges[curr] === undefined) {
					break;
				}

				const next_vertex = edges[curr];
				const this_polygon = [next_vertex, 1-e];
				delete edges[curr];
				polygon.push(this_polygon);
				last_polygon = this_polygon;
			}

			let poly = [];
			for(let v of polygon) {
				const [pt] = v;
				const [x, y] = pt;
				poly.push([x,y]);
				delete edges_v[pt];
				delete edges_h[pt];
			}

			p.push(poly);
		}

		output.push({points: p, fill: colors[color_index]});
	}

	return output;
};

const labelHeight = 80;
const Container = {
	view: v => m(
		'.dib.mr2.relative',
		{ style: { width: width+'px', height: height+labelHeight+'px' } },
		m('svg.mr3', { width, height }, v.children),
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
			m('p', 'There are a few ways to draw a Shape Up component with SVG. I used the ', m('a', { href: stackoverflow, target: '_blank' }, 'algorithm mentioned in this Stack Overflow post'), ' to simplify my points to a single polygon per color, which was a really fun challenge. I\'m comparing the rough size in memory of the data being used for each SVG.'),
			ready && m(
				'.dib',
				m(
					Container,
					{ data: rects, label: 'rect per pixel' },
					rects.map(cell => m('rect', cell))
				),
				m(
					Container,
					{ data: square_polygons, label: 'polygon per pixel' },
					square_polygons.map(cell => m('polygon', cell))
				),
				m(
					Container,
					{ data: polygons, label: 'polygon per color' },
					polygons.map(polygon => m('polygon', polygon))
				)
			),
			m(ShapeUp, {configuration: shapes.ROUND, size, behaviour: 'blink', blink_delay: 1000, onUpdate: shapeup => {
				width = shapeup.state.width*size;
				height = shapeup.state.height*size;
				const filtered = shapeup.state.grid.flat().filter(cell => !cell.empty);
				rects = toRects(filtered);
				square_polygons = toSquarePolygons(filtered);
				polygons = toPolygons(filtered);
				ready = true;
				setTimeout(m.redraw, 0);
			}})
		]
	]
};