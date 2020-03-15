import m from 'mithril';
import { ShapeUp } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { refactorColors } from '$app/shapeup/colors';
import { Rect, roughSizeInMemory } from '$app/helpers';

const stackoverflow = 'https://stackoverflow.com/questions/13746284/merging-multiple-adjacent-rectangles-into-one-polygon#answer-13851341';
const colors = refactorColors('#ffffff');
const size = 10;

let width, height, containers = [], active_color;

const cellsToIslands = (cells, meta) => {
	let visited = {}, indexed = {}, islands = [];

	for(let cell of cells) {
		const point = [cell.x, cell.y];
		indexed[point] = cell;
		visited[point] = false;
	}

	// depth-first search (DFS) is an algorithm for searching a graph or tree data structure
	const dfs = (x,y,i) => {
		visited[[x,y]] = true;
		islands[i].push(indexed[[x,y]]);
		visited[[x-1,y]] === false && dfs(x-1,y,i);
		visited[[x,y-1]] === false && dfs(x,y-1,i);
		visited[[x,y+1]] === false && dfs(x,y+1,i);
		visited[[x+1,y]] === false && dfs(x+1,y,i);
	};

	for(let x = meta.min.x; x <= meta.max.x; ++x) {
		for(let y = meta.min.y; y <= meta.max.y; ++y) {
			if(visited[[x,y]] === false) {
				islands.push([]);
				dfs(x,y,islands.length-1);
			}
		}
	}

	return islands;
};

const groupPointsByColorIndex = (cells) => {
	let points_by_color_index = {};
	for(let cell of cells) {
		const { x, y, color_index } = cell;
		const x1 = x, y1 = y, x2 = x1+1, y2 = y1+1;
		points_by_color_index[color_index] === undefined && (points_by_color_index[color_index] = {});
		for(let point of [[x1,y1], [x2,y1], [x2,y2], [x1,y2]]) {
			if(points_by_color_index[color_index][point] !== undefined) {
				delete points_by_color_index[color_index][point];
			} else {
				points_by_color_index[color_index][point] = point;
			}
		}
	}

	return points_by_color_index;
}

const toRects = cells => cells.map(cell => ({
	x: cell.x*size,
	y: cell.y*size,
	width: size,
	height: size,
	fill: colors[cell.color_index]
}));

const metaFromPoints = (points, padding = 0) => {
	let x = Array(points.length), y = Array(points.length), indexed = {};
	for(let index in points) {
		indexed[points[index]] = index;
		[ x[index], y[index] ] = points[index];
	}

	const min = { x: Math.min(...x), y: Math.min(...y) };
	const max = { x: Math.max(...x), y: Math.max(...y) };
	const size = { x: max.x-min.x+padding, y: max.y-min.y+padding };

	return {
		x, y, min, max, size, indexed,
		empty: (x,y) => indexed[[x,y]] === undefined
	};
};

const maximumRectangle = cells => {
	const meta = metaFromPoints(cells.map(cell => [cell.x, cell.y]), 1);

	let heights = {
		[meta.min.y-1]: Array(meta.size.x).fill(0).reduce((t,c,i) => {
			t[meta.min.x+i] = 0;
			return t;
		}, {})
	};
	
	for(let y = meta.min.y; y <= meta.max.y; ++y) {
		let h = {};
		for(let x = meta.min.x; x <= meta.max.x; ++x) {
			if(meta.empty(x,y)) {
				h[x] = 0;
			} else if(meta.empty(x,y-1)) {
				h[x] = 1;
			} else {
				h[x] = heights[y-1][x] + 1;
			}
		}

		heights[y] = h;
	}

	delete heights[meta.min.y-1];

	let max_area = 0, rect;
	for(let y = meta.min.y; y <= meta.max.y; ++y) {
		const { area, details } = maximumAreaInHistogram(Object.values(heights[y]));

		if(area > max_area) {
			max_area = area;
			details.y = y - details.height - meta.min.y + 1;
			rect = details;
		}
	}

	return { area: max_area, heights, meta, rect };
};

const maximumAreaInHistogram = heights => {
	let array = [], i = 0, max = 0, details = {};
	const pop = () => {
		const height = heights[array.pop()];
		const width = array.length ? (i - (array[array.length-1] || 0) - 1) : i;
		const area = height * width;
		
		if(area > max) {
			max = area;
			details.x = i - width;
			details.height = height;
			details.width = width;
		}
	};

	while(i < heights.length) {
		if(!array.length || heights[array[array.length-1]] <= heights[i]) {
			array.push(i++);
		} else {
			pop();
		}
	}

	while(array.length) pop();
	return { area: max, details };
}

const toLargerRects = cells => {
	let data_by_color_index = {};
	for(let cell of cells) {
		const { x, y, color_index } = cell;

		if(data_by_color_index[color_index] === undefined) {
			data_by_color_index[color_index] = {
				cells: [],
				points: {}
			};
		}

		data_by_color_index[color_index].cells.push(cell);
		
		const x1 = x, y1 = y, x2 = x1+1, y2 = y1+1;
		for(let point of [[x1,y1], [x2,y1], [x2,y2], [x1,y2]]) {
			if(data_by_color_index[color_index].points[point] !== undefined) {
				delete data_by_color_index[color_index].points[point];
			} else {
				data_by_color_index[color_index].points[point] = point;
			}
		}
	}

	let output = [];	
	const color_indices = Object.keys(data_by_color_index);

	for(let color_index of color_indices) {
		const color = colors[color_index];
		const data = data_by_color_index[color_index];
		const points = Object.values(data.points);

		if(points.length === 4) {
			const meta = metaFromPoints(points);
			output.push(new Rect(meta.min.x, meta.min.y, meta.size.x, meta.size.y).scale(size).flat({fill: color}));
		//	console.log('%c ■■■■', `color: ${color}`, new Rect(meta.min.x, meta.min.y, meta.size.x, meta.size.y), 'perfect rectangle');
			continue;
		}

		const m = maximumRectangle(data.cells);
		const meta = m.meta;
		const rect = new Rect(m.rect).right(meta.min.x).down(meta.min.y);
		
		output.push(rect.scale(size).flat({fill: color}));
	//	console.log('%c ■■■■', `color: ${color}`, new Rect(m.rect).right(meta.min.x).down(meta.min.y), `${points.length} points`, `${cells.length} cells`);

		rect.w--; rect.h--;
		const remaining = data.cells.filter(cell => !rect.contains(cell.x, cell.y));
		for(let island of cellsToIslands(remaining, meta)) {
			output = output.concat(toLargerRects(island));
		}
	}

	return output;
};

const toSquarePolygons = cells => cells.map(cell => ({
	points: [
		`${cell.x*size},${cell.y*size}`,
		`${cell.x*size+size},${cell.y*size}`,
		`${cell.x*size+size},${cell.y*size+size}`,
		`${cell.x*size},${cell.y*size+size}`
	].join(' '),
	fill: colors[cell.color_index]
}));

const compare = (a,b) => a[0]==b[0] && a[1]==b[1];
const xThenY = (a,b) => a[0]<b[0] || (a[0]==b[0] && a[1]<b[1]) ? -1 : 1;
const yThenX = (a,b) => a[1]<b[1] || (a[1]==b[1] && a[0]<b[0]) ? -1 : 1;

const toPolygons = cells => {
	const points_by_color_index = groupPointsByColorIndex(cells);
	const color_indices = Object.keys(points_by_color_index);

	let output = [];
	for(let color_index of color_indices) {
		const points = Object.values(points_by_color_index[color_index]);

		let edges_v = {}, edges_h = {};
		const setEdges = (edges, cmp, e) => {
			points.sort(cmp);
			let i = 0;
			const length = points.length;
			while(i < length) {
				const curr = points[i][e];
				do {
					edges[points[i]] = points[i+1];
					edges[points[i+1]] = points[i];
					i += 2
				} while(i < length && points[i][e] == curr);
			}
		};
		setEdges(edges_v, xThenY, 0);
		setEdges(edges_h, yThenX, 1);
		
		let p = [], keys;
		while((keys = Object.keys(edges_h)).length) {
			const key = keys[0];
			delete edges_h[key];
			
			const first_vertex = key.split(',').map(v => parseInt(v));
			let last_polygon = [first_vertex, 0];
			let polygon = [last_polygon];

			while(1) {
				const [curr, e] = last_polygon;
				const edges = [edges_v, edges_h][e];
				const next_vertex = edges[curr];
				const next_polygon = [next_vertex, 1-e];

				delete edges[curr];
				polygon.push(next_polygon);

				if(compare(first_vertex, next_vertex)) {
					polygon.pop();
					break;
				}

				last_polygon = next_polygon;
			}

			let poly = [];
			for(let v of polygon) {
				const [pt] = v;
				const [x, y] = pt;
				poly.push([x*size, y*size]);
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
	view: v => v.attrs.data && m(
		'.dib.mr2.relative',
		{ style: { width: width+'px', height: height+labelHeight+'px' } },
		m(
			'svg.mr3',
			{ width, height },
			v.attrs.data.map(
				item => (active_color === undefined || active_color === item.fill)
					&& m(
						v.attrs.type, {
							...item,
							stroke: 'white',
							onclick: () => {
								if(active_color === undefined || active_color !== item.fill) {
									active_color = item.fill;
								} else {
									active_color = undefined;
								}
							}
						}
					)
			)
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
			m('p', 'There are a few ways to draw a Shape Up component with SVG. I used the ', m('a', { href: stackoverflow, target: '_blank' }, 'algorithm mentioned in this Stack Overflow post'), ' to simplify my points to a single polygon per color, which was a really fun challenge. Then I pieced together a few other algorithms (largest rectangle in a matrix, number of islands) to generate a component with simplified rectangles that can fill more than just a 1x1 space, for an even small data payload than the polygon per color algorithm. I\'m comparing the rough size in memory of the data being used for each SVG. All SVGs include a white stroke to illustrate how they\'re being structured'),
			m('.dib', containers.map(container => m(Container, container))),
			m(ShapeUp, {configuration: shapes.ROUND, size, /*behaviour: 'blink', blink_delay: 1000,*/ onUpdate: shapeup => {
				width = shapeup.state.width*size;
				height = shapeup.state.height*size;

				const filtered = shapeup.state.grid.flat().filter(cell => !cell.empty);
				containers = [
					{ data: toSquarePolygons(filtered), type: 'polygon', label: 'polygon per pixel' },
					{ data: toRects(filtered), type: 'rect', label: 'rect per pixel' },
					{ data: toPolygons(filtered), type: 'polygon', label: 'polygon per color' },
					{ data: toLargerRects(filtered), type: 'rect', label: 'larger rects' }					
				];

				setTimeout(m.redraw, 0);
			}})
		]
	]
};