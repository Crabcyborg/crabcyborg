import { min } from 'min-string';

const targets = [128,64,32,16,8,4,2,1];

export const flatten = input => {
	let flat = [];
	const length = input.length;
	for(let index = 2; index <= length; ++index) {
		for(let target of targets) flat.push((input[index] & target) != 0 ? 1 : 0);
	}
	return flat;
}

export const spread = input => {
	let values = [], previous = 0;
	for(let index = 2; index < input.length; ++index) {
		let value = input[index];
		for(let i = 0; i < value; ++i) values.push(previous);
		previous = 1-previous;
	}
	return values;
};

export const onOff = input => {
	let output = [ input[0], input[1] ], previous = 0, count = 0;
	for(let index = 2; index < input.length; ++index) {
		let value = input[index];

		for(let target of targets) {
			let current = (value & target) != 0 ? 1 : 0;
		
			if(current == previous) {
				++count;
			} else {
				output.push(count);
				count = 1;
				previous = current;
			}
		}
	}

	output.push(count);
	return output;
};

export const onOffVertical = input => {
	const [ height, width ] = input;
	const flat = flatten(input);

	let output = [ height, width ], previous = 0, count = 0;
	for(let y = 0, x = 0; x < width; ++y) {
		if(y == height) {
			y = 0;
			++x;
		}

		let index = y*width + x, current = flat[index];
		if(current == previous) {
			++count;
		} else {
			output.push(count);
			count = 1;
			previous = current;
		}
	}

	output.push(count);
	return output;
};

export const offOn = input => {
	const values = spread(input);

	let target_index = 0, current = 0, output = [ input[0], input[1] ];
	for(let value of values) {
		if(value) current += targets[target_index];

		if(++target_index == 8) {
			output.push(current);
			target_index = current = 0;
		}
	}

	return output;
};

export const offOnVertical = input => {
	let values = spread(input);

	const [ height, width ] = input;

	let keyed = {};
	for(let index = 0, to = values.length; index < to; ++index) {
		let y = index % height, x = Math.floor(index / height);
		keyed[[x,y]] = values[index];
	}

	let rotated_values = [];
	for(let y = 0; y <= height; ++y) {
		for(let x = 0; x < width; ++x) rotated_values.push(keyed[[x,y]]);
	}
	values = rotated_values;

	let target_index = 0, current = 0, output = [ height, width ];
	for(let value of values) {
		if(value) current += targets[target_index];

		if(++target_index == 8) {
			output.push(current);
			target_index = current = 0;
		}
	}

	return output;
};

export const repositionOnOff = input => {
	let output = [ input[0], input[1] ];
	for(let i = 2; i < input.length; i += 2) output.push(input[i]);
	for(let i = 3; i < input.length; i += 2) output.push(input[i]);
	return output;
};

export const repositionOffOn = input => {
	let output = [ input[0], input[1] ];

	const half = Math.ceil((input.length - 2) / 2), to = half+2;
	for(let i = 2; i < to; ++i) {
		output.push(input[i]);
		output.push(input[half+i]);
	}

	return output;
};

export const onOffLimit = (input, limit) => {
	let output = [];
	for(let value of input) {
		if(value <= limit) {
			output.push(value);
		} else {
			while(value > limit) {
				output.push(limit, 0);
				value -= limit;
			}

			value > 0 && output.push(value);
		}
	}

	return output;
};

export const offOnLimit = input => {
	let output = [];
	for(let index = 0, to = input.length; index < to; ++index) {
		let current = 0;
		do current += input[index];
		while (input[index+1] == 0 && (index += 2) < to);
		output.push(current);
	}

	return output;
}

export const onOffSpiral = input => {
	const [ height, width ] = input;
	const flat = flatten(input);

	let output = [ height, width ], previous = 0, count = 0;

	let x = 0, y = 0, dx = 1, dy = 0, remaining = flat.length, maxx = width, maxy = height, minx = -1, miny = -1;
	while(remaining--) {
		let index = y*width + x, current = flat[index];
	
		if(current == previous) {
			++count;
		} else {
			output.push(count);
			count = 1;
			previous = current;
		}

		x += dx;
		y += dy;

		if(x == minx) {
			x += 1;
			y -= 1;
			dx = 0;
			dy = -1;
			maxy--;
		}

		if(x == maxx) {
			x -= 1;
			y += 1;
			dx = 0;
			dy = 1;
			miny++;
		}

		if(y == miny) {
			x += 1;
			y += 1;
			dx = 1;
			dy = 0;
			minx++;
		}

		if(y == maxy) {
			x -= 1;
			y -= 1;
			dx = -1;
			dy = 0;
			maxx--;
		}
	}

	output.push(count);
	return output;
};

export const offOnSpiral = input => {
	let values = spread(input);

	const [ height, width ] = input;

	let keyed = {}, points = [], x = 0, y = 0, dx = 1, dy = 0, remaining = values.length, maxx = width, maxy = height, minx = -1, miny = -1;
	while(remaining--) {
		points.push([x,y]);

		x += dx;
		y += dy;

		if(x == minx) {
			x += 1;
			y -= 1;
			dx = 0;
			dy = -1;
			maxy--;
		}

		if(x == maxx) {
			x -= 1;
			y += 1;
			dx = 0;
			dy = 1;
			miny++;
		}

		if(y == miny) {
			x += 1;
			y += 1;
			dx = 1;
			dy = 0;
			minx++;
		}

		if(y == maxy) {
			x -= 1;
			y -= 1;
			dx = -1;
			dy = 0;
			maxx--;
		}
	}
	
	let index = 0;
	for(let point of points) {
		let [x,y] = point;
		keyed[point] = values[index++];
	}

	let rotated_values = [];
	for(let y = 0; y <= height; ++y) {
		for(let x = 0; x < width; ++x) rotated_values.push(keyed[[x,y]]);
	}
	values = rotated_values;

	let target_index = 0, current = 0, output = [ height, width ];
	for(let value of values) {
		if(value) current += targets[target_index];

		if(++target_index == 8) {
			output.push(current);
			target_index = current = 0;
		}
	}

	return output;
};

export const onOffDiagonal = input => {
	const [ height, width ] = input;
	const flat = flatten(input);

	let output = [ height, width ], previous = 0, count = 0;
	let x = 0, y = height-1, remaining = flat.length;
	while(remaining) {
		let index = y*width + x, current = flat[index];
	
		if(current == previous) {
			++count;
		} else {
			output.push(count);
			count = 1;
			previous = current;
		}

		x += 1;
		y += 1;

		if(x == width || y == height) {
			y -= x + 1;
			x = 0;
		}

		while(y < 0) {
			++y;
			++x;
		}

		--remaining;
	}

	output.push(count);
	return output;
};

export const offOnDiagonal = input => {
	let values = spread(input);

	const [ height, width ] = input;

	let keyed = {}, points = [], x = 0, y = height-1, remaining = values.length;
	while(remaining--) {
		points.push([x,y]);

		x += 1;
		y += 1;

		if(x == width || y == height) {
			y -= x + 1;
			x = 0;
		}

		while(y < 0) {
			++y;
			++x;
		}
	}
	
	let index = 0;
	for(let point of points) {
		let [x,y] = point;
		keyed[point] = values[index++];
	}

	let rotated_values = [];
	for(let y = 0; y <= height; ++y) {
		for(let x = 0; x < width; ++x) rotated_values.push(keyed[[x,y]]);
	}
	values = rotated_values;

	let target_index = 0, current = 0, output = [ height, width ];
	for(let value of values) {
		if(value) current += targets[target_index];

		if(++target_index == 8) {
			output.push(current);
			target_index = current = 0;
		}
	}

	return output;
};

export const onOffDiamond = (height, width) => {
	let spike_height = Math.ceil((width-2)/2);
	let spike_width = Math.ceil((height-2)/2);
	let diamond_height = height + spike_height*2;
	let diamond_width = width + spike_width*2;
	let base_x = 0, x = base_x, base_y = Math.floor((diamond_height-1)/2), y = base_y;
	let index = 0;
	let keyed = {};
	let dir = 'ne';
	let miny = 0;

	const triangleSize = length => {
		let size = 0;
		while(length > 0) {
			size += length;
			length -= 2;
		}
		return size;
	};
	const diamond_size = height * width + triangleSize(height-2) * 2 + triangleSize(width-2) * 2;

	keyed[[x,y]] = index++;
	while(index < diamond_size) {
		switch(dir) {
			case 'ne': {
				while(x + 1 < diamond_width && y - 1 >= miny && keyed[[x+1,y-1]] === undefined) {
					++x;
					--y;
					keyed[[x,y]] = index++;
					if(keyed[[x+1,y]] !== undefined) break;
				}

				dir = 'se';
				if(diamond_width % 2 === 0) --y;
			} break;

			case 'se': {
				while(x + 1 < diamond_width && y + 1 < diamond_height && keyed[[x+1,y+1]] === undefined) {
					++x;
					++y;
					keyed[[x,y]] = index++;
					if(keyed[[x,y+1]] !== undefined) break;
				}

				dir = 'sw';
				if(diamond_height % 2 === 0) ++x;
			} break;

			case 'sw': {
				while(x - 1 >= 0 && y + 1 < diamond_height && keyed[[x-1,y+1]] === undefined) {
					--x;
					++y;
					keyed[[x,y]] = index++;
					if(keyed[[x-1,y]] !== undefined) break;
				}

				dir = 'nw';
				if(diamond_width % 2 === 0) ++y;
			} break;

			case 'nw': {
				while(x - 1 >= 0 && y - 1 >= 0 && keyed[[x-1,y-1]] === undefined) {
					--x;
					--y;
					keyed[[x,y]] = index++;
					if(keyed[[x,y-1]] !== undefined) break;
				}

				dir = 'ne';
				x = base_x++;
				y = base_y+1;
			} break;
		}
	}

	// trim the edges
	let indices = [];
	for(let y = spike_height; y < height+spike_height; ++y) {
		for(let x = spike_width; x < width+spike_width; ++x) {
			indices.push(parseInt(keyed[[x,y]]));
		}
	}

	indices.sort((a,b) => a-b);

	let reduced = [], points = Array(width * height);
	for(let y = spike_height; y < height+spike_height; ++y) {
		for(let x = spike_width; x < width+spike_width; ++x) {
			let index = indices.indexOf(keyed[[x,y]]);
			reduced.push(index);
			points[index] = [x - spike_width, y - spike_height];
		}
	}

	return { points, keyed, indices, reduced, keyed, diamond_height, diamond_width, diamond_size, spike_height, spike_width, height, width };
};

export const onOffSnake = (height, width) => {
	let dir = 's';
	let remaining = height * width;
	let x = 0, y = 0, keyed = {}, points = Array(width * height), index = 0, reduced = [];
	while(remaining) {
		if(x >= 0 && x < width && y >= 0 && y < height) {
			--remaining;
			reduced.push(index);
			keyed[[x,y]] = index;
			points[y * width + x] = [x,y];
			++index;
		}

		switch(dir) {
			case 's':
				++y;
				dir = 'e1';
			break;

			case 'e1':
				++x;
				dir = 'n';
			break;

			case 'n':
				--y;
				dir = 'e2';
			break;

			case 'e2':
				++x;
				dir = 's';

				if(x >= width) {
					x = 0;
					y += 2;
				}
			break;
		}
	}

	return { points, keyed, reduced, height, width };
};

export const onOffTriangle = (height, width) => {
	let spike_height = Math.ceil((width-2)/2);
	let spike_width = height-1;
	let triangle_height = height + spike_height;
	let triangle_width = width + spike_width*2;
	let base_x = 0, x = base_x, base_y = triangle_height-1, y = base_y;
	let index = 0;
	let keyed = {};
	let dir = 'ne';
	let miny = 0;

	// for this style of triangle only:
	//   X
	// X X X
	const triangleSize = length => {
		let size = 0;
		while(length > 0) size += length, length -= 2;
		return size;
	};

	// for thie style of triangle only:
	// X
	// X X
	// X X X
	const rightAngleTriangleSize = length => {
		let size = 0;
		while(length > 0) size += length--;
		return size;
	};

	const triangle_size = height * width + rightAngleTriangleSize(height-1) * 2 + triangleSize(width-2);

	keyed[[x,y]] = index++;
	while(index < triangle_size) {
		switch(dir) {
			case 'ne': {
				while(x + 1 < triangle_width && y - 1 >= miny && keyed[[x+1,y-1]] === undefined) {
					++x;
					--y;
					keyed[[x,y]] = index++;
					if(keyed[[x+1,y]] !== undefined) break;
				}

				dir = 'se';
				if(triangle_width % 2 === 0) --y;
			} break;

			case 'se': {
				while(x + 1 < triangle_width && y + 1 < triangle_height && keyed[[x+1,y+1]] === undefined) {
					++x;
					++y;
					keyed[[x,y]] = index++;
					if(keyed[[x,y+1]] !== undefined) break;
				}

				dir = 'ne';
				x = base_x++;
				y = triangle_height;
			} break;
		}
	}

	// trim the edges
	let indices = [];
	for(let y = spike_height; y < height+spike_height; ++y) {
		for(let x = spike_width; x < width+spike_width; ++x) {
			indices.push(parseInt(keyed[[x,y]]));
		}
	}

	indices.sort((a,b) => a-b);

	let reduced = [], points = Array(width * height);
	for(let y = spike_height; y < height+spike_height; ++y) {
		for(let x = spike_width; x < width+spike_width; ++x) {
			let index = indices.indexOf(keyed[[x,y]]);
			reduced.push(index);
			points[index] = [x - spike_width, y - spike_height];
		}
	}

	return { points, keyed, indices, reduced, triangle_height, triangle_width, triangle_size, spike_height, spike_width, height, width };
};

export const applyOnOff = (input, fn) => {
	const [ height, width ] = input;
	const flat = flatten(input);
	const details = fn(height, width);

	let output = [ height, width ], previous = 0, count = 0;
	for(let point of details.points) {
		let [x,y] = point, index = y * width + x, current = flat[index];

		if(current == previous) {
			++count;
		} else {
			output.push(count);
			count = 1;
			previous = current;
		}
	}

	output.push(count);
	return output;
};

export const flipOnOff = details => {
	let point_index = 0, keyed = {};
	for(let index of details.reduced) {
		let point = details.points[index];
		let [x,y] = point;
		keyed[[x, details.height-y-1]] = index;
	}

	let reduced = [], points = Array(details.width * details.height);
	for(let y = 0; y < details.height; ++y) {
		for(let x = 0; x < details.width; ++x) {
			let index = keyed[[x,y]];
			reduced.push(index);
			points[index] = [x, y];
		}
	}

	return { points, keyed, reduced };
};

export const flippedOnOffTriangle = (height, width) => flipOnOff(onOffTriangle(height, width));

export const applyOnOffDiamond = input => applyOnOff(input, onOffDiamond);
export const applyOnOffSnake = input => applyOnOff(input, onOffSnake);
export const applyOnOffTriangle = (input, flip) => applyOnOff(input, flip ? flippedOnOffTriangle : onOffTriangle);

export const applyOffOn = (input, fn, flip) => {
	const [ height, width ] = input, values = spread(input);
	let details = fn(height, width);

	if(flip) details = flipOnOff(details);

	let target_index = 0, current = 0, output = [ height, width ];
	for(let index of details.reduced) {
		if(values[index]) current += targets[target_index];

		if(++target_index == 8) {
			output.push(current);
			target_index = current = 0;
		}
	}

	output.push(current);
	return output;

};

export const offOnDiamond = input => applyOffOn(input, onOffDiamond);
export const offOnSnake = input => applyOffOn(input, onOffSnake);
export const offOnTriangle = input => applyOffOn(input, onOffTriangle);

export const flippedOffOnTriangle = input => applyOffOn(input, onOffTriangle, true);

export const mirror = (input, odd) => {
	odd === undefined && (odd = false);

	let [ height, original_width ] = input;	
	const flat = flatten(input);

	let width = original_width * 2;
	odd && --width;

	let mirrored = [];
	for(let y = 0; y < height; ++y) {
		for(let x = 0; x < original_width; ++x) {
			let index = y * original_width + x;
			mirrored.push(flat[index]);
		}

		for(let x = original_width - (odd ? 2 : 1); x >= 0; --x) {
			let index = y * original_width + x;
			mirrored.push(flat[index]);
		}
	}

	let target_index = 0, current = 0, output = [ height, width ];
	for(let value of mirrored) {
		if(value) current += targets[target_index];

		if(++target_index == 8) {
			output.push(current);
			target_index = current = 0;
		}
	}

	output.push(current);
	return output;
};

export const half = input => {
	const [ height, width ] = input;
	const flat = flatten(input);

	let to = Math.ceil(width / 2);
	let halved = [];
	for(let y = 0; y < height; ++y) {
		for(let x = 0; x < to; ++x) {
			let index = y * width + x;
			halved.push(flat[index]);
		}
	}

	let target_index = 0, current = 0, output = [ height, to ];
	for(let value of halved) {
		if(value) current += targets[target_index];

		if(++target_index == 8) {
			output.push(current);
			target_index = current = 0;
		}
	}

	output.push(current);
	return output;
};

export const isSymmetrical = input => {
	const [ height, width ] = input;
	const flat = flatten(input);

	let to = Math.floor(width / 2);
	for(let y = 0; y < height; ++y) {
		let row_index = y * width, right_index = row_index + width - 1;
		for(let x = 0; x < to; ++x) {
			if(flat[row_index + x] != flat[right_index - x]) {
				return false;
			}
		}
	}

	return true;
};

export const topPatterns = (input, symbols) => {
	symbols === undefined && (symbols = min.three_character_permutations_symbols + min.counter_symbols);
	for(let c of symbols) input = min.subTopPattern(input, c);
	return input;
};

export const repositionTopPatterns = input => topPatterns(input, min.three_character_permutations_symbols);

export const toBase49 = input => input.map(index => min.base64_symbols[index]).join('');

export const repositionBase49 = min.pipe(repositionOnOff, toBase49, min.counter, repositionTopPatterns, min.twoCharacterPermutations);

export const repositionBase49Limit = min.pipe(repositionOnOff, input => onOffLimit(input, 63), toBase49, min.counter, repositionTopPatterns, min.twoCharacterPermutations);

let prefix_by_key = {
	compressed: '',
	horizontal: '-',
	vertical: '~',
	spiral: '`',
	diagonal: '>',
	diamond: ']',
	snake: '__',
	triangle: '--',
	triangle_flipped: '~~'
};

export const bestMethod = (shape, mirrored) => {
	mirrored === undefined && (mirrored = false);

	let compressed = min.compress(shape);
	let horizontal = repositionBase49Limit(onOff(shape));
	let vertical = repositionBase49Limit(onOffVertical(shape));
	let spiral = repositionBase49Limit(onOffSpiral(shape));
	let diagonal = repositionBase49Limit(onOffDiagonal(shape));
	let diamond = repositionBase49Limit(applyOnOffDiamond(shape));
	let snake = repositionBase49Limit(applyOnOffSnake(shape));
	let triangle = repositionBase49Limit(applyOnOffTriangle(shape));
	let triangle_flipped = repositionBase49Limit(applyOnOffTriangle(shape, true));
	let string_by_key = { compressed, horizontal, vertical, spiral, diagonal, diamond, snake, triangle, triangle_flipped };
	let key_by_value = {
		[compressed.length]: 'compressed',
		[horizontal.length]: 'horizontal',
		[vertical.length]: 'vertical',
		[spiral.length]: 'spiral',
		[diagonal.length]: 'diagonal',
		[diamond.length]: 'diamond',
		[snake.length]: 'snake',
		[triangle.length]: 'triangle',
		[triangle_flipped.length]: 'triangle_flipped'
	};
	let swapped = Object.assign({}, ...Object.entries(key_by_value).map(([a,b]) => ({ [b]: a })));
	let smallest = Math.min(compressed.length, horizontal.length, vertical.length, spiral.length, diagonal.length, diamond.length, snake.length, triangle.length, triangle_flipped.length);
	let method = smallest === compressed.length ? 'compressed' : key_by_value[smallest];
	let length = parseInt(swapped[key_by_value[smallest]]);
	let ratio = Math.round(length / shape.join(',').length * 10000) / 100;

	if(!mirrored && isSymmetrical(shape)) {
		const best_half = bestMethod(half(shape), true);

		if(best_half.length < length) {
			best_half.string = (shape[1] % 2 === 1 ? '[' : ')') + best_half.string;
			return best_half;
		}
	}

	const string = prefix_by_key[method] + string_by_key[method];
	return { method, length, string, mirrored, swapped, ratio };
};

const base82_symbols = min.base64_symbols + min.counter_symbols + min.additional_symbols + min.three_character_permutations_symbols + min.two_character_permutations_symbols;

export const toBase82 = input => input.slice(0, 2).join(',') + ',' + input.slice(2).map(index => base82_symbols[index]).join('');