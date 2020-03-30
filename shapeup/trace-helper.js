import { xThenY } from '$app/shapeup/svg-helper';

const white_threshold = 225;
const targets = [128,64,32,16,8,4,2,1];

export const determineSize = (points, canvas_width) => {
	const minimum = Math.max(canvas_width / 100, 2);

	// determine the size of each pixel by iterating a part of the data and finding the most frequent length
	const to = points.length/10;
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

	let count = [], max = 0, max_number;
	for(let number of diffs) {
		count[number] = (count[number] || 0) + 1;
		
		if(count[number] > max) {
			max = count[number];
			max_number = number;
		}
	}

	let half;
	while((half = Math.floor(max_number/2)) && half > minimum && count[half] !== undefined && count[half] > count[max_number]/2.1) {
		max_number = half;
	}

	return max_number;
};

export const trace = d => {
	const { width, height, data } = d, l = data.length;

	let cells = [];
	for(let i = 0, j = 0; i < l; i += 4, j++) {
		if(0.2126 * d.data[i] + 0.7153 * d.data[i + 1] + 0.0721 * d.data[i + 2] < 128) {
			let y = Math.floor(j / width);
			let x = j % width;
			cells.push({ x, y });
		}
	}

	let points = {};
	for(let cell of cells) {
		const { x, y } = cell;
		const x1 = x, y1 = y, x2 = x1+1, y2 = y1+1;
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

	const size = determineSize(points, width);
	points = points.map(point => [ Math.round(point[0]/size),  Math.round(point[1]/size) ]);

	let minx = width/size, miny = height/size, maxx = 0, maxy = 0;
	for(let point of points) {
		let[ x, y ] = point;
		x < minx && (minx = x);
		y < miny && (miny = y);
		x > maxx && (maxx = x);
		y > maxy && (maxy = y);
	}

	const dimensions = { width: maxx-minx, height: maxy-miny };

	cells = [];
	let target_index = 0, value = 0, configuration = [dimensions.height, dimensions.width];
	for(let y = miny * size; y < maxy * size; y += size) {
		for(let x = minx * size; x < maxx * size; x += size) {
			let index = y * width + x, data_index = index * 4;

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