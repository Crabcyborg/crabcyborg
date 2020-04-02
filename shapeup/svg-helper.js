import { Rect, V2 } from '$app/helpers';
import { refactorColors } from '$app/shapeup/colors';
const colors = refactorColors('#ffffff');

const onlyUnique = (value, index, self) => {
	let item_index = 0;
	for(let item of self) {
		if(item[0] === value[0] && item[1] === value[1]) {
			return index === item_index;;
		}

		++item_index;
	}
};

export const cellsToIslands = (cells, meta) => {
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

export const toRects = (cells, size) => cells.map(cell => ({
	x: cell.x*size,
	y: cell.y*size,
	width: size,
	height: size,
	fill: colors[cell.color_index]
}));

export const metaFromPoints = (points, padding = 0) => {
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

export const maximumRectangle = cells => {
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

export const maximumAreaInHistogram = heights => {
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

export const toLargerRects = (cells, size) => {
	let data_by_color_index = {};
	for(let cell of cells) {
		const { x, y, color_index } = cell;

		if(data_by_color_index[color_index] === undefined) {
			data_by_color_index[color_index] = {cells: [], points: {}};
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
			continue;
		}

		const m = maximumRectangle(data.cells);
		const meta = m.meta;
		const rect = new Rect(m.rect).right(meta.min.x).down(meta.min.y);
		
		output.push(rect.scale(size).flat({fill: color}));

		rect.w--; rect.h--;
		const remaining = data.cells.filter(cell => !rect.contains(cell.x, cell.y));
		for(let island of cellsToIslands(remaining, meta)) {
			output = output.concat(toLargerRects(island, size));
		}
	}

	return output;
};

export const toSquarePolygons = (cells, size) => cells.map(cell => ({
	points: new V2(cell).svgPoints(size),
	fill: colors[cell.color_index]
}));

export const xThenY = (a,b) => a[0]<b[0] || (a[0]==b[0] && a[1]<b[1]) ? -1 : 1;
export const yThenX = (a,b) => a[1]<b[1] || (a[1]==b[1] && a[0]<b[0]) ? -1 : 1;

export const pointsToPolygons = (points, size) => {
	let edges_v = {}, edges_h = {};
	const setEdges = (edges, cmp, e) => {
		points.sort(cmp);
		let edge_index = 0;
		const length = points.length;
		while(edge_index < length) {
			const curr = points[edge_index][e];
			do {
				edges[points[edge_index]] = points[edge_index+1];
				edges[points[edge_index+1]] = points[edge_index];
				edge_index += 2
			} while(edge_index < length && points[edge_index][e] == curr);
		}
	};
	setEdges(edges_v, xThenY, 0);
	setEdges(edges_h, yThenX, 1);
	
	let polygon = [], keys;
	while((keys = Object.keys(edges_h)).length) {
		const [ key ] = keys;
		delete edges_h[key];
		
		const first_vertex = new V2(key);
		let previous = [first_vertex.toArray(), 0];
		let vertices = [first_vertex];

		while(1) {
			const [edge_index, edge] = previous;
			const edges = [edges_v, edges_h][edge];
			const next_vertex = new V2(edges[edge_index]);
			const next = [next_vertex.toArray(), 1-edge];
			delete edges[edge_index];

			if(first_vertex.compare(next_vertex)) {
				break;
			}

			vertices.push(next_vertex);
			previous = next;
		}

		let scaled_vertices = [];
		for(let vertex of vertices) {
			scaled_vertices.push(vertex.scale(size).toArray());

			const edge_index = vertex.toArray();
			delete edges_v[edge_index];
			delete edges_h[edge_index];
		}

		polygon.push(scaled_vertices);
	}

	return polygon;
};

export const toPolygons = (cells, size) => {
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

	const color_indices = Object.keys(points_by_color_index);

	let output = [];
	for(let color_index of color_indices) {
		const points = Object.values(points_by_color_index[color_index]);
		const polygon = pointsToPolygons(points, size);		
		output.push({points: polygon, fill: colors[color_index]});
	}

	return output;
};

export const trace = d => {
	const white_threshold = 225;
	const targets = [ 128,64,32,16,8,4,2,1 ];
	const { width, height, data } = d, l = data.length;

	let cells = [];
	for(let i = 0, j = 0; i < l; i += 4, j++) {
		if(0.2126 * d.data[i] + 0.7153 * d.data[i + 1] + 0.0721 * d.data[i + 2] < 128) {
			let y = Math.floor(j / width), x = j % width;
			cells.push({ x, y });
		}
	}

	let points = {};
	for(let cell of cells) {
		const { x, y } = cell, x1 = x, y1 = y, x2 = x1+1, y2 = y1+1;
		for(let point of [[x1,y1], [x2,y1], [x2,y2], [x1,y2]]) {
			if(points[point] !== undefined) {
				delete points[point];
			} else {
				points[point] = point;
			}
		}
	}
	points = Object.values(points);
	points.sort(xThenY);

	// determine the size of each pixel by iterating a part of the data and finding the most frequent length
	const minimum = Math.max(width / 100, 2), to = points.length/10;
	let previous = points[0], diffs = [];
	for(let point_index = 1; point_index < to; ++point_index) {
		let [x, y] = points[point_index];
		let [px, py] = previous;
		let diffx = Math.abs(x-px);
		let diffy = Math.abs(y-py);
		diffx > minimum && diffs.push(diffx);
		diffy > minimum && diffs.push(diffy);
		previous = points[point_index];
	}

	let count = [], max = 0, size;
	for(let number of diffs) {
		count[number] = (count[number] || 0) + 1;
		
		if(count[number] > max) {
			max = count[number];
			size = number;
		}
	}

	let half;
	while((half = Math.floor(size/2)) && half > minimum && count[half] !== undefined && count[half] > count[size]/2.1) {
		size = half;
	}

	max = Math.round(Math.min(width/10, height/10));
	size > max && (size = max);

	const round = point => [ Math.round(point[0]/size), Math.round(point[1]/size) ];
	points = points.map(round).filter(onlyUnique);

	let minx = width/size, miny = height/size, maxx = 0, maxy = 0;
	for(let point of points) {
		let[ x, y ] = point;
		x < minx && (minx = x);
		y < miny && (miny = y);
		x > maxx && (maxx = x);
		y > maxy && (maxy = y);
	}

	const dimensions = { width: maxx-minx, height: maxy-miny };

	console.log(size, points, dimensions, maxy, miny);

	cells = [];
	let target_index = 0, value = 0, configuration = [dimensions.height, dimensions.width];
	half = size/2 * 4;
	for(let y = miny * size; y < maxy * size; y += size) {
		for(let x = minx * size; x < maxx * size; x += size) {
			let index = y * width + x, data_index = index * 4 + half;

			if(d.data[data_index] < white_threshold || d.data[data_index+1] < white_threshold || d.data[data_index+2] < white_threshold) {
				cells.push({
					x: (x/size) - minx,
					y: (y/size) - miny,
					color_index: 2
				});
				value += targets[target_index];
			}

			if(++target_index == 8) {
				configuration.push(value);
				value = target_index = 0;
			}
		}
	}

	value > 0 && configuration.push(value);

	return { cells, configuration, dimensions };
};