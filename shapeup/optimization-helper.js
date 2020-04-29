import m from 'mithril';
import { min } from 'min-string';
import { traverse} from '$app/traverse-grid';
import { colors } from '$app/shapeup/colors';
const t = traverse;

const targets = [128,64,32,16,8,4,2,1];
const base82_symbols = min.base64_symbols + min.counter_symbols + min.additional_symbols + min.three_character_permutations_symbols + min.two_character_permutations_symbols;
const prefix_by_key = {
	compressed: '',
	horizontal: '-',
	vertical: '~',
	spiral: '`',
	diagonal: '>',
	diamond: ']',
	snake: '__',
	triangle: '--',
	triangle_flipped: '~~',
	triangle_rotated: '``',
	turn: '>>',
	turn_rotated: ']]',
	snake_rotated: '}}',
	skip: '...',
	bounce: '...'
};

let key_by_prefix = Object.assign({}, ...Object.entries(prefix_by_key).map(([a,b]) => ({ [b]: a })));
key_by_prefix['}'] = 'alternative';

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

export const repositionOnOff = input => {
	let output = [ input[0], input[1] ];
	for(let i = 2; i < input.length; i += 2) output.push(input[i]);
	for(let i = 3; i < input.length; i += 2) output.push(input[i]);
	return output;
};

export const repositionOffOn = input => {
	const half = Math.ceil((input.length - 2) / 2), to = half+2;
	let output = [ input[0], input[1] ];
	for(let i = 2; i < to; ++i) output.push(input[i], input[half+i]);
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

// convert on/off type data to raw
export const applyOffOn = (input, method, rotate) => {
	const [ height, width ] = input, values = spread(input);
	let details = rotate ? method(width, height) : method(height, width);

	if(rotate) details = t.swap(details);

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

export const mirror = (input, odd) => {
	odd === undefined && (odd = false);

	const flat = flatten(input);
	let [ height, original_width ] = input, width = original_width * 2;
	odd && --width;

	let mirrored = [];
	for(let y = 0; y < height; ++y) {
		for(let x = 0; x < original_width; ++x) mirrored.push(flat[y * original_width + x]);
		for(let x = original_width - (odd ? 2 : 1); x >= 0; --x) mirrored.push(flat[y * original_width + x]);
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
	const [ height, width ] = input, flat = flatten(input), to = Math.ceil(width / 2);
	let halved = [];
	for(let y = 0; y < height; ++y) {
		for(let x = 0; x < to; ++x) {
			halved.push(flat[y * width + x]);
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
	const [ height, width ] = input, flat = flatten(input), to = Math.floor(width / 2);
	for(let y = 0; y < height; ++y) {
		let row_index = y * width, right_index = row_index + width - 1;
		for(let x = 0; x < to; ++x) {
			if(flat[row_index + x] != flat[right_index - x]) return false;
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
export const toBase82 = input => input.slice(0, 2).join(',') + ',' + input.slice(2).map(index => base82_symbols[index]).join('');

export const unsubPatterns = (input, symbols) => {
	symbols === undefined && (symbols = min.three_character_permutations_symbols + min.counter_symbols);
	symbols = symbols.split('');
	symbols.reverse();
	for(let c of symbols) input = min.unsubPattern(input, c);
	return input;
};

export const alternativeDecompress = min.pipe(min.unsubTwoCharacterPermutations, unsubPatterns, min.unsubTwoMostCommonPatterns, min.toDecimal);
export const base49ToDecimal = input => input.split('').map(character => min.base64_symbols.indexOf(character));

export const base82ToDecimal = input => {
	const split = input.split(',');
	return [ split[0], split[1], ...split[2].split('').map(character => base82_symbols.indexOf(character)) ];
};

export const alternativeDecompressBase49 = min.pipe(min.unsubTwoCharacterPermutations, unsubPatterns, min.unsubTopTwoPatterns, base49ToDecimal);
export const unsubRepositionPatterns = input => unsubPatterns(input, min.three_character_permutations_symbols);
export const repositionDecompressBase49 = min.pipe(min.unsubTwoCharacterPermutations, unsubRepositionPatterns, min.decounter, base49ToDecimal, repositionOffOn);
export const repositionDecompressBase49Limit = min.pipe(min.unsubTwoCharacterPermutations, unsubRepositionPatterns, min.decounter, base49ToDecimal, offOnLimit, repositionOffOn);

export const bestMethod = (shape, mirrored) => {
	mirrored === undefined && (mirrored = false);

	let compressed = min.compress(shape);
	let horizontal = repositionBase49Limit(applyOnOff(shape, t.horizontal));
	let vertical = repositionBase49Limit(applyOnOff(shape, t.vertical));
	let spiral = repositionBase49Limit(applyOnOff(shape, t.spiral));
	let diagonal = repositionBase49Limit(applyOnOff(shape, t.diagonal));
	let diamond = repositionBase49Limit(applyOnOff(shape, t.diamond));
	let snake = repositionBase49Limit(applyOnOff(shape, t.snake));
	let triangle = repositionBase49Limit(applyOnOff(shape, t.triangle));
	let triangle_flipped = repositionBase49Limit(applyOnOff(shape, t.pipe(t.triangle, t.flipy)));
	let triangle_rotated = repositionBase49Limit(applyOnOff(shape, t.pipe(t.triangle, t.swap)));
	let turn = repositionBase49Limit(applyOnOff(shape, t.turn));
	let turn_rotated = repositionBase49Limit(applyOnOff(shape, traverse.rotate(traverse.turn)));
	let snake_rotated = repositionBase49Limit(applyOnOff(shape, traverse.rotate(traverse.snake)));
	let skip = repositionBase49Limit(applyOnOff(shape, t.skip));
	let bounce = repositionBase49Limit(applyOnOff(shape, traverse.pipe(traverse.horizontal, traverse.bounce)));
	let string_by_key = { compressed, horizontal, vertical, spiral, diagonal, diamond, snake, triangle, triangle_flipped, triangle_rotated, turn, turn_rotated, snake_rotated, skip, bounce };
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
		[triangle_rotated.length]: 'triangle_rotated',
		[turn.length]: 'turn',
		[turn_rotated.length]: 'turn_rotated',
		[snake_rotated.length]: 'snake_rotated',
		[skip.length]: 'skip',
		[bounce.length]: 'bounce'
	};
	let swapped = Object.assign({}, ...Object.entries(key_by_value).map(([a,b]) => ({ [b]: a })));
	let smallest = Math.min(compressed.length, horizontal.length, vertical.length, spiral.length, diagonal.length, diamond.length, snake.length, triangle.length, triangle_flipped.length, triangle_rotated.length, turn.length, turn_rotated.length, snake_rotated.length, skip.length, bounce.length);
	let method = smallest === compressed.length ? 'compressed' : key_by_value[smallest];
	let length = parseInt(swapped[key_by_value[smallest]]);
	let raw_length = shape.join(',').length;
	let ratio = Math.round(length / (mirrored || raw_length) * 10000) / 100;

	if(!mirrored && isSymmetrical(shape)) {
		const best_half = bestMethod(half(shape), raw_length);

		if(best_half.length < length) {
			best_half.string = (shape[1] % 2 === 1 ? '[' : ')') + best_half.string;
			return best_half;
		}
	}

	const string = prefix_by_key[method] + string_by_key[method];
	return { method, length, string, mirrored, swapped, ratio };
};

export const matchMethod = shape => {
	let prefixes = Object.keys(key_by_prefix);
	for(let prefix of prefixes) {
		if(shape[0] === prefix[0] && (prefix.length === 1 || shape[1] === prefix[1])) return {
			prefix,
			key: key_by_prefix[prefix]
		};
	}
	return false;
};

export const handleString = shape => {
	const match = matchMethod(shape);
	console.log('match', match);

	let mirror_even = shape[0] === ')';
	let mirror_odd = shape[0] === '[';
	let mirrored = mirror_even || mirror_odd;
	mirrored && (shape = shape.substr(1));
	
	const alternative = shape[0] === '}' && shape[0] !== '}';
	const alternative_base49 = shape[0] === '^';
	const alternative_base82 = shape[0] === '*';
	const horizontal = shape[0] === '-' && shape[1] !== '-';
	const vertical_unlimited = shape[0] === '_' && shape[1] !== '_';
	const vertical = shape[0] === '~' && shape[1] !== '~';
	const spiral = shape[0] === '`' && shape[1] !== '`';
	const diagonal = shape[0] === '>' && shape[1] !== '>';
	const diamond = shape[0] === ']' && shape[1] !== ']';
	const snake = shape[0] === '_' && shape[1] === '_';
	const triangle = shape[0] === '-' && shape[1] === '-';
	const triangle_flipped = shape[0] === '~' && shape[1] === '~';
	const triangle_rotated = shape[0] === '`' && shape[1] === '`';
	const turn = shape[0] === '>' && shape[1] === '>';
	const turn_rotated = shape[0] === ']' && shape[1] === ']'
	const snake_rotated = shape[0] === '}' && shape[1] === '}';

	const on_off = shape[0] === '|' || alternative || alternative_base49 || alternative_base82 || horizontal;
	(on_off || vertical_unlimited || vertical || spiral || diagonal || diamond || snake || triangle || triangle_flipped || triangle_rotated || turn || turn_rotated || snake_rotated) && (shape = shape.substr(1));
	(snake || triangle || triangle_flipped || triangle_rotated || turn || turn_rotated || snake_rotated) && (shape = shape.substr(1));
	
	let configuration;
	if(alternative) {
		configuration = alternativeDecompress(shape);
	} else if(alternative_base49) {
		configuration = alternativeDecompressBase49(shape);
	} else if(alternative_base82) {
		configuration = base82ToDecimal(shape);
	} else if(horizontal) {
		configuration = repositionDecompressBase49(shape);
	} else if(vertical_unlimited) {
		configuration = applyOffOn(repositionDecompressBase49(shape), t.vertical);
	} else if(vertical) {
		configuration = applyOffOn(repositionDecompressBase49Limit(shape), t.vertical);
	} else if(spiral) {
		configuration = applyOffOn(repositionDecompressBase49Limit(shape), t.spiral);
	} else if(diagonal) {
		configuration = applyOffOn(repositionDecompressBase49Limit(shape), t.diagonal);
	} else if(diamond) {
		configuration = applyOffOn(repositionDecompressBase49Limit(shape), t.diamond);
	} else if(snake) {
		configuration = applyOffOn(repositionDecompressBase49Limit(shape), t.snake);
	} else if(triangle) {
		configuration = applyOffOn(repositionDecompressBase49Limit(shape), t.triangle);
	} else if(triangle_flipped) {
		configuration = applyOffOn(repositionDecompressBase49Limit(shape), t.pipe(t.triangle, t.flipy))
	} else if(triangle_rotated) {
		configuration = applyOffOn(repositionDecompressBase49Limit(shape), t.triangle, true);
	} else if(turn) {
		configuration = applyOffOn(repositionDecompressBase49Limit(shape), t.turn);
	} else if(turn_rotated) {
		configuration = applyOffOn(repositionDecompressBase49Limit(shape), t.turn, true);
	} else if(snake_rotated) {
		configuration = applyOffOn(repositionDecompressBase49Limit(shape), t.snake, true);
	} else {
		configuration = shape.indexOf(',') > 0 ? shape.split(',') : min.decompress(shape);
	}
	
	if(on_off) configuration = applyOffOn(configuration, t.horizontal);
	if(mirrored) configuration = mirror(configuration, mirror_odd);
	
	return configuration;
};

export const Gradient = {
    oninit: v => {
        v.state.details = v.attrs.method(v.attrs.height, v.attrs.width);
    },
    view: v => {
        const { details } = v.state;

		const color = colors[Math.floor(Math.random() * colors.length)];

        let output = [];
		for(let y = 0, row = []; y < details.height; ++y, row = []) {
			for(let x = 0; x < details.width; ++x) {
				let index = details.keyed[[x,y]];
				
				let gray = Math.round(255 - (index*2.5));
				
				let [ r,g,b ] = color;
				let pad = 150;
				let adjustment = index * 4;

				r += pad - adjustment
				g += pad - adjustment;
				b += pad - adjustment;

				let a = (index+10) / 75;

                row.push(
                    m('.dib', { style: { padding: '4px', backgroundColor: `rgb(${r}, ${g}, ${b}, ${a})` } }, `${index}`.padStart(2, '0'))
                );
            }
			output.push(m('div', row));
		}
        return m('pre.mono', output);
    }
};