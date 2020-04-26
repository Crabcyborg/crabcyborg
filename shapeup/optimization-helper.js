import { min } from 'min-string';
import { traverse} from '$app/traverse-grid';
const t = traverse;

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

// convert raw to on/off
export const applyOnOff = (input, method) => {
	const [ height, width ] = input, flat = flatten(input);
	let output = [ height, width ], previous = 0, count = 0;
	t.forEach(method(height, width), ({ point }) => {
		let index = point[1] * width + point[0];
		if(flat[index] == previous) {
			++count;
		} else {
			output.push(count);
			count = 1;
			previous = flat[index];
		}
	});
	output.push(count);
	return output;
};

export const applyOnOffDiamond = input => applyOnOff(input, t.diamond);
export const applyOnOffSnake = input => applyOnOff(input, t.snake);
export const applyOnOffTriangle = (input, flip, rotate) => applyOnOff(input, flip ? t.pipe(t.triangle, t.flipy) : (rotate ? t.pipe(t.triangle, t.rotate) : t.triangle));

// convert on/off type data to raw
export const applyOffOn = (input, method, flip, rotate) => {
	const [ height, width ] = input, values = spread(input);
	let details = rotate ? method(width, height) : method(height, width);

	if(flip) details = t.flip(details, 'y');
	if(rotate) details = t.rotate(details);

	let target_index = 0, current = 0, output = [ height, width ];
	for(let index of details.indices) {
		if(values[index]) current += targets[target_index];

		if(++target_index == 8) {
			output.push(current);
			target_index = current = 0;
		}
	}

	output.push(current);
	return output;
};

export const offOnDiamond = input => applyOffOn(input, t.diamond);
export const offOnSnake = input => applyOffOn(input, t.snake);
export const offOnTriangle = input => applyOffOn(input, t.triangle);
export const flippedOffOnTriangle = input => applyOffOn(input, t.pipe(t.triangle), true);
export const rotatedOffOnTriangle = input => applyOffOn(input, t.pipe(t.triangle), false, true);

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
	triangle_flipped: '~~',
	triangle_rotated: '``'
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
	let triangle_rotated = repositionBase49Limit(applyOnOffTriangle(shape, false, true));
	let string_by_key = { compressed, horizontal, vertical, spiral, diagonal, diamond, snake, triangle, triangle_flipped, triangle_rotated };
	let key_by_value = {
		[compressed.length]: 'compressed',
		[horizontal.length]: 'horizontal',
		[vertical.length]: 'vertical',
		[spiral.length]: 'spiral',
		[diagonal.length]: 'diagonal',
		[diamond.length]: 'diamond',
		[snake.length]: 'snake',
		[triangle.length]: 'triangle',
		[triangle_flipped.length]: 'triangle_flipped',
		[triangle_rotated.length]: 'triangle_rotated'
	};
	let swapped = Object.assign({}, ...Object.entries(key_by_value).map(([a,b]) => ({ [b]: a })));
	let smallest = Math.min(compressed.length, horizontal.length, vertical.length, spiral.length, diagonal.length, diamond.length, snake.length, triangle.length, triangle_flipped.length, triangle_rotated.length);
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