import m from 'mithril';
import { ShapeUp } from '$app/components';
import { min } from 'min-string';
import { traverse as t } from '$app/traverse-grid';
import { shapes } from '$app/shapeup/shapes';
import { colors } from '$app/shapeup/colors';

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
	alternate: '>>',
//	turn_rotated: '...',
//	snake_rotated: '...',
	skip: ']]A',
	bounce: ']]B',
//	swirl: '...',
//	donut: '...',
	leap: ']]C',
//	clover: '...',
//	bacon: '...',
	split: ']]D',
	reflect: ']]E',
	shift: ']]F',
	stripe: ']]G',
	waterfall: ']]H',
	stitch: ']]I'
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
	const repositionCompress = method => repositionBase49Limit(applyOnOff(shape, method));

	mirrored === undefined && (mirrored = false);

	let compressed = min.compress(shape);
	let horizontal = repositionCompress(t.horizontal);
	let vertical = repositionCompress(t.vertical);
	let spiral = repositionCompress(t.spiral);
	let diagonal = repositionCompress(t.diagonal);
	let diamond = repositionCompress(t.diamond);
	let snake = repositionCompress(t.snake);
	let triangle = repositionCompress(t.triangle);
	let triangle_flipped = repositionCompress(t.pipe(t.triangle, t.flip('y')));
//	let triangle_rotated = repositionCompress(t.pipe(t.triangle, t.swap));
	let alternate = repositionCompress(methods.alternate);
//	let turn_rotated = repositionCompress(t.rotate(methods.alternate));
//	let snake_rotated = repositionCompress(t.rotate(t.snake));
	let skip = repositionCompress(methods.skip);
	let bounce = repositionCompress(methods.bounce);
//	let swirl = repositionCompress(methods.swirl);
//	let donut = repositionCompress(methods.donut);
	let leap = repositionCompress(methods.leap);
//	let clover = repositionCompress(methods.clover);
//	let bacon = repositionCompress(methods.bacon);
	let split = repositionCompress(methods.split);
	let reflect = repositionCompress(methods.reflect);
	let shift = repositionCompress(methods.shift);
	let stripe = repositionCompress(methods.stripe);
	let waterfall = repositionCompress(t.pipe(t.horizontal, t.waterfall));
	let stitch = repositionCompress(t.pipe(t.stitch));

	let string_by_key = { compressed, horizontal, vertical, spiral, diagonal, diamond, snake, triangle, triangle_flipped, /*triangle_rotated,*/ alternate, /*turn_rotated, snake_rotated,*/ skip, bounce, /*swirl, donut,*/ leap, /*clover, bacon,*/ split, reflect, shift, stripe, waterfall, stitch };
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
//		[triangle_rotated.length]: 'triangle_rotated',
		[alternate.length]: 'alternate',
//		[turn_rotated.length]: 'turn_rotated',
//		[snake_rotated.length]: 'snake_rotated',
		[skip.length]: 'skip',
		[bounce.length]: 'bounce',
//		[swirl.length]: 'swirl',
//		[donut.length]: 'donut',
		[leap.length]: 'leap',
//		[clover.length]: 'clover',
//		[bacon.length]: 'bacon',
		[split.length]: 'split',
		[reflect.length]: 'reflect',
		[shift.length]: 'shift',
		[stripe.length]: 'stripe',
		[waterfall.length]: 'waterfall',
		[stitch.length]: 'stitch'
	};
	let swapped = Object.assign({}, ...Object.entries(key_by_value).map(([a,b]) => ({ [b]: a })));
	let smallest = Math.min(
		compressed.length, horizontal.length, vertical.length, spiral.length, diagonal.length, diamond.length, snake.length, triangle.length, triangle_flipped.length, /*triangle_rotated.length,*/ alternate.length, /*turn_rotated.length, snake_rotated.length,*/ skip.length, bounce.length, 
		/*swirl.length, donut.length,*/ leap.length, /*clover.length, bacon.length,*/ split.length, reflect.length, shift.length, stripe.length, waterfall.length, stitch.length
	);
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
//	console.log('match', match);

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
	const alternate = shape[0] === '>' && shape[1] === '>';

	let skip = false, bounce = false, leap = false, split = false, reflect = false, shift = false, stripe = false, waterfall = false, stitch = false;
	if(shape[0] === ']' && shape[1] === ']' && ['A','B','C','D','E','F','G','H','I'].indexOf(shape[2]) >= 0) {
		skip = shape[2] === 'A';
		bounce = shape[2] === 'B';
		leap = shape[2] === 'C';
		split = shape[2] === 'D';
		reflect = shape[2] === 'E';
		shift = shape[2] === 'F';
		stripe = shape[2] === 'G';
		waterfall = shape[2] === 'H';
		stitch = shape[2] === 'I';
		shape = shape.substr(3);
	}

	const on_off = shape[0] === '|' || alternative || alternative_base49 || alternative_base82 || horizontal;
	(on_off || vertical_unlimited || vertical || spiral || diagonal || diamond || snake || triangle || triangle_flipped || triangle_rotated || alternate) && (shape = shape.substr(1));
	(snake || triangle || triangle_flipped || triangle_rotated || alternate) && (shape = shape.substr(1));
	
	const offOnDecompress = method => applyOffOn(repositionDecompressBase49Limit(shape), method);

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
		configuration = offOnDecompress(t.vertical);
	} else if(vertical) {
		configuration = offOnDecompress(t.vertical);
	} else if(spiral) {
		configuration = offOnDecompress(t.spiral);
	} else if(diagonal) {
		configuration = offOnDecompress(t.diagonal);
	} else if(diamond) {
		configuration = offOnDecompress(t.diamond);
	} else if(snake) {
		configuration = offOnDecompress(t.snake);
	} else if(triangle) {
		configuration = offOnDecompress(t.triangle);
	} else if(triangle_flipped) {
		configuration = offOnDecompress(t.pipe(t.triangle, t.flip('y')))
	} else if(triangle_rotated) {
		configuration = offOnDecompress(t.triangle, true);
	} else if(alternate) {
		configuration = offOnDecompress(methods.alternate);
	} else if(skip) {
		configuration = offOnDecompress(methods.skip);
	} else if(bounce) {
		configuration = offOnDecompress(methods.bounce);
	} else if(leap) {
		configuration = offOnDecompress(methods.leap);
	} else if(split) {
		configuration = offOnDecompress(methods.split);
	} else if(reflect) {
		configuration = offOnDecompress(methods.reflect);
	} else if(shift) {
		configuration = offOnDecompress(methods.shift);
	} else if(stripe) {
		configuration = offOnDecompress(methods.stripe);
	} else if(waterfall) {
		configuration = offOnDecompress(t.pipe(t.horizontal, t.waterfall));
	} else if(stitch) {
		configuration = offOnDecompress(t.pipe(t.stitch));
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

const examples = {
	diamond: 'LUNAR',
    spiral: 'YIN',
    vertical: 'PRIZE',
    skip: 'EGGO',
    diagonal: 'KNIFE',
    snake: 'FLIP',
    triangle: 'CHECK',
    triangle_rotated: 'LIP',
    alternate: 'PAC',
    bounce: 'CASH',
	leap: 'PLANE',
	split: 'PLUS',
	reflect: 'GIN',
	shift: 'PINK',
	waterfall: 'TRUNK',
	stitch: 'NOTE'
};

export const Example = {
    oninit: v => {
        const { method } = v.attrs, shape = shapes[examples[method]], best = bestMethod(shape);
        v.state = { shape, best };
    },
    view: v => m(
        'div',
        m(ShapeUp, { configuration: v.state.shape, size: 5 }),
        m(
            '.mono',
            {},
            v.state.best.method, ' ',
            v.state.best.ratio, '% ',
            v.state.best.length, ' characters ',
            m('a.break', { href: `/shapeup/${v.state.best.string}`, target: '_blank' }, `/shapeup/${v.state.best.string}`) 
        )
    )
};

export const methods = {
	split: t.pipe(t.horizontal, t.split),	
	bounce: t.pipe(t.horizontal, t.bounce),
	swirl: t.pipe(t.spiral, t.bounce, t.reposition, t.bounce),
	donut: t.pipe(t.diamond, t.bounce),
	leap: t.pipe(t.horizontal, t.alternate, t.mutate(t.diagonal), t.bounce),
	clover: t.pipe(t.horizontal, t.reposition, t.mutate(t.spiral)),
	bacon: t.pipe(t.diagonal, t.reposition),
	reflect: t.pipe(t.horizontal, t.reflect),
	shift: t.pipe(t.horizontal, t.shift(Math.round(7*7/2))),
	stripe: t.pipe(t.horizontal, t.stripe),
	alternate: t.pipe(t.horizontal, t.alternate),
	skip: t.pipe(t.horizontal, t.reposition)
};