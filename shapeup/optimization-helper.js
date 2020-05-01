import m from 'mithril';
import { ShapeUp } from '$app/components';
import { min } from 'min-string';
import { traverse as t } from '$app/traverse-grid';
import { shapes } from '$app/shapeup/shapes';
import { colors } from '$app/shapeup/colors';

const targets = [128,64,32,16,8,4,2,1];
const base82_symbols = min.base64_symbols + min.counter_symbols + min.additional_symbols + min.three_character_permutations_symbols + min.two_character_permutations_symbols;

const prefix_by_key = {
	on_off: '|',
	alternative: '}',
	alternative_base49: '^',
	alternative_base82: '*',
	horizontal: '-',
	vertical: '~',
	spiral: '`',
	diagonal: '>',
	diamond: ']',
	triangle: '--',
	triangle_flipped: '~~',
	triangle_rotated: '``',
	alternate: '>>',
	reposition: ']]A',
	bounce: ']]B',
	leap: ']]C',
	split: ']]D',
	reflect: ']]E',
	shift: ']]F',
	stripe: ']]G',
	waterfall: ']]H',
	stitch: ']]I',
	snake: ']]J',
	smooth: ']]K',
	straight_smooth: ']]L',
	smooth_x2: ']]M',
	straight_smooth_x2: ']]N',
	turn_rotated: ']]O',
	skew: ']]P'
};

let key_by_prefix = Object.assign({}, ...Object.entries(prefix_by_key).map(([a,b]) => ({ [b]: a })));

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
export const applyOffOn = (input, method, rotate, on_by_default) => {
	const [ height, width ] = input, values = spread(input);
	let details = rotate ? method(width, height) : method(height, width);

	if(rotate) details = t.swap(details);

	let def = on_by_default ? 1 : 0, target_index = 0, current = 0/*1 - def*/, output = [ height, width ];
	for(let index of details.indices) {
		if(values[index] != def) current += targets[target_index];

		if(++target_index == 8) {
			output.push(current);
			target_index = current = 0;
		}
	}

	output.push(current);
	return output;
};

export const mirror = (input, odd, on_by_default) => {
	odd === undefined && (odd = false);

	const flat = flatten(input);
	let [ height, original_width ] = input, width = original_width * 2;
	odd && --width;

	let mirrored = [];
	for(let y = 0; y < height; ++y) {
		for(let x = 0; x < original_width; ++x) mirrored.push(flat[y * original_width + x]);
		for(let x = original_width - (odd ? 2 : 1); x >= 0; --x) mirrored.push(flat[y * original_width + x]);
	}

	let target_index = 0, def = 0/*on_by_default ? 1 : 0*/, current = 0/*1 - def*/, output = [ height, width ];
	for(let value of mirrored) {
		if(value != def) current += targets[target_index];

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
	for(let y = 0; y < height; ++y)
		for(let x = 0; x < to; ++x)
			halved.push(flat[y * width + x]);

	let target_index = 0, current = 0, output = [ height, to ];
	for(let value of halved) {
		if(value) current += targets[target_index];

		if(++target_index == 8) {
			output.push(current);
			target_index = current = 0;
		}
	}

//	current && output.push(current);
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
	let on_by_default_by_result = {};
	const repositionCompress = method => {
		let on_by_default = false;
		const applied = applyOnOff(shape, method);
		if(applied[2] == 0) {
			on_by_default = true;
			applied.splice(2,1);
		}

		let result = repositionBase49Limit(applied);
		on_by_default_by_result[result] = on_by_default;
		return result;
	};

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
	let turn_rotated = repositionCompress(methods.turn_rotated);
//	let snake_rotated = repositionCompress(t.rotate(t.snake));
	let reposition = repositionCompress(methods.reposition);
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
	let waterfall = repositionCompress(methods.waterfall);
	let stitch = repositionCompress(t.stitch);
	let smooth = repositionCompress(methods.smooth);
	let straight_smooth = repositionCompress(methods.straight_smooth);
	let smooth_x2 = repositionCompress(methods.smooth_x2);
	let straight_smooth_x2 = repositionCompress(methods.straight_smooth_x2);
	let skew = repositionCompress(methods.skew);

	let string_by_key = { compressed, horizontal, vertical, spiral, diagonal, diamond, snake, triangle, triangle_flipped, /*triangle_rotated,*/ alternate, turn_rotated, /*snake_rotated,*/ reposition, bounce, /*swirl, donut,*/ leap, /*clover, bacon,*/ split, reflect, shift, stripe, waterfall, stitch, smooth, straight_smooth, smooth_x2, straight_smooth_x2, skew };
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
		[turn_rotated.length]: 'turn_rotated',
//		[snake_rotated.length]: 'snake_rotated',
		[reposition.length]: 'reposition',
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
		[stitch.length]: 'stitch',
		[smooth.length]: 'smooth',
		[straight_smooth.length]: 'straight_smooth',
		[smooth_x2.length]: 'smooth_x2',
		[straight_smooth_x2.length]: 'straight_smooth_x2',
		[skew.length]: 'skew'
	};
	let swapped = Object.assign({}, ...Object.entries(key_by_value).map(([a,b]) => ({ [b]: a })));
	let smallest = Math.min(
		compressed.length, horizontal.length, vertical.length, spiral.length, diagonal.length, diamond.length, snake.length, triangle.length, triangle_flipped.length, /*triangle_rotated.length,*/ alternate.length, turn_rotated.length, /*snake_rotated.length,*/ reposition.length, bounce.length, 
		/*swirl.length, donut.length,*/ leap.length, /*clover.length, bacon.length,*/ split.length, reflect.length, shift.length, stripe.length, waterfall.length, stitch.length, smooth.length, straight_smooth.length, smooth_x2.length, straight_smooth_x2.length, skew.length
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

	const string = (on_by_default_by_result[string_by_key[method]] ? '_' : '') + prefix_by_key[method] + string_by_key[method];
	return { method, length, string, mirrored, swapped, ratio };
};

export const matchMethod = shape => {
	const mirror_even = shape[0] === ')', mirror_odd = shape[0] === '[', mirrored = mirror_even || mirror_odd;
	mirrored && (shape = shape.substr(1));

	const on_by_default = shape[0] === '_';
	on_by_default && (shape = shape.substr(1));

	let prefixes = Object.keys(key_by_prefix);
	prefixes.reverse();

	for(let prefix of prefixes) {
		if(shape[0] === prefix[0] && (prefix.length < 2 || shape[1] === prefix[1]) && (prefix.length < 3 || shape[2] === prefix[2])) {
			return { prefix, key: key_by_prefix[prefix], string: shape.substr(prefix.length), mirrored, mirror_even, mirror_odd, on_by_default };
		}
	}

	return { prefix: '', key: shape.indexOf(',') > 0 ? 'raw' : 'compressed', string: shape, mirrored, mirror_even, mirror_odd, on_by_default };
};

export const handleString = shape => {
	const match = matchMethod(shape);
	console.log('match', match);

	shape = match.string;
	const postProcess = shape => match.mirrored ? mirror(shape, match.mirror_odd, match.on_by_default) : shape;
	const offOnDecompress = method => applyOffOn(repositionDecompressBase49Limit(shape), method, false, match.on_by_default);
	const offOn = shape => applyOffOn(shape, t.horizontal);
	const handleKey = key => {
		switch(key) {
			case 'raw': return shape.split(',');
			case 'compressed': return min.decompress(shape);
			case 'on_off': return offOn(min.decompress(shape));
			case 'alternative': return offOn(alternativeDecompress(shape));
			case 'alternative_base49': return offOn(alternativeDecompressBase49(shape));
			case 'alternative_base82': return offOn(base82ToDecimal(shape));
		}
		if(methods[key] !== undefined) return offOnDecompress(methods[key]);
		if(t[key] !== undefined) return offOnDecompress(t[key]);
	};

	const result = postProcess(handleKey(match.key));
	console.log('result', result);
	return result;
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
				let [ r,g,b ] = color;
				let pad = 150;
				let adjustment = index * 4;
				let a = (index+10) / 75;
				r += pad - adjustment
				g += pad - adjustment;
				b += pad - adjustment;
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
    vertical: 'PEACE',
    reposition: 'EGGO',
    diagonal: 'KNIFE',
    snake: 'FLIP',
    triangle: 'CHECK',
//  triangle_rotated: 'LIP',
    alternate: 'PAC',
    bounce: 'CASH',
	leap: 'PLANE',
	reflect: 'GIN',
	waterfall: 'TRUNK',
	stitch: 'NOTE',
	straight_smooth_x2: 'SPACE',
	straight_smooth: 'BUZZ'
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
	reposition: t.pipe(t.horizontal, t.reposition),
	waterfall: t.pipe(t.horizontal, t.waterfall),
	triangle_flipped: t.pipe(t.triangle, t.flip('y')),
	triangle_rotated: t.rotate(t.triangle),
	smooth: t.pipe(t.horizontal, t.smooth()),
	straight_smooth: t.pipe(t.horizontal, t.smooth('straight')),
	smooth_x2: t.pipe(t.horizontal, t.repeat(t.smooth(), 2)),
	straight_smooth_x2: t.pipe(t.horizontal, t.repeat(t.smooth('straight'), 2)),
	turn_rotated: t.rotate(t.pipe(t.horizontal, t.alternate)),
	skew: t.pipe(t.horizontal, t.skew)
};