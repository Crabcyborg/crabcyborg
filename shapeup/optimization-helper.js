import m from 'mithril';
import { ShapeUp } from '$app/components';
import { min } from 'min-string';
import { traverse as t } from 'traverse-grid';
import { shapes } from '$app/shapeup/shapes';
import { colors } from '$app/shapeup/colors';

const targets = [128,64,32,16,8,4,2,1];
const base82_symbols = min.base64_symbols + min.counter_symbols + min.additional_symbols + min.three_character_permutations_symbols + min.two_character_permutations_symbols;

const prefix_by_key = {
	compressed: '',
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
	rotated_alternate: ']]O',
	skew: ']]P',
	alternate_diagonal: ']]Q',
	straight_smooth_x5: ']]R',
	double: ']]S',
	step2: ']]T',
	step3: ']]U',
	step4: ']]V',
	cinnamon_roll: ']]W',
	watertile: ']]X',
	watertile2: ']]Y',
	watertile3: ']]Z',
	rotated_watertile: ']]_',
	rotated_waterfall: ']]@'
};

let key_by_prefix = Object.assign({}, ...Object.entries(prefix_by_key).map(([a,b]) => ({ [b]: a })));

export const flatten = input => {
	let flat = [];
	const length = input.length;
	for(let index = 2; index <= length; ++index) {
		for(let target of targets) flat.push((input[index] & target) != 0 ? 1 : 0);
	}
	return flat;
};

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

export const isSymmetricalHorizontally = input => {
	const [ height, width ] = input, flat = flatten(input), to = Math.floor(width / 2);
	for(let y = 0; y < height; ++y) {
		let row_index = y * width, right_index = row_index + width - 1;
		for(let x = 0; x < to; ++x)
			if(flat[row_index + x] != flat[right_index - x])
				return false;
	}
	return true;
};

export const isSymmetricalVertically = input => {
	const [ height, width ] = input, flat = flatten(input), to = Math.floor(height / 2);
	for(let y = 0; y < to; ++y) {
		let row_index = y * width, mirror_index = (height - y - 1) * width;
		for(let x = 0; x < width; ++x)
			if(flat[row_index + x] != flat[mirror_index + x])
				return false;
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

/*
triangle, triangle_rotated, snake_rotated, donut, clover, bacon, shift, stripe, smooth,
skew, step3, step4, corner_in, corner_out, corner_crawl, pulse_corner, climb, cascade, fan
*/

export const bestMethod = (shape, mirrored) => {
	let m = { compressed: min.compress(shape) };
	for(let method of ['horizontal', 'vertical', 'spiral', 'diagonal', 'diamond', 'snake', 'stitch', 'double'])
		m[method] = t[method];
	for(let method of ['triangle_flipped', 'alternate', 'rotated_alternate', 'reposition', 'bounce', 'leap', 'split', 'reflect', 'waterfall', 'straight_smooth', 'smooth_x2', 'straight_smooth_x2', 'alternate_diagonal', 'straight_smooth_x5', 'step2', 'watertile', 'watertile2', 'watertile3', 'cinnamon_roll', 'rotated_watertile', 'rotated_waterfall'])
		m[method] = methods[method];

	const keys = Object.keys(m);

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

	let log = [], best = false;
	for(let key of keys) {
		let string = typeof m[key] === 'function' ? repositionCompress(m[key]) : m[key], length = string.length;
		log.push({key, string, length});
		if(best && best.length < length) continue;
		if(!best || length < best.length) best = { length, methods: [key], strings: [string] };
		else best.methods.push(key), best.strings.push(string);
	}

	const raw_length = shape.join(',').length;

	if(!mirrored && isSymmetricalHorizontally(shape)) {
		const best_half = bestMethod(half(shape), raw_length);
		if(best_half.best.length < best.length) return best_half;
	}

	let strings = [], index = 0;
	for(let string of best.strings) {
		let key = best.methods[index], on_by_default = on_by_default_by_result[string];
		string = prefix_by_key[key] + string;
		if(on_by_default) string = '_' + string;
		if(mirrored) string = (shape[1] % 2 === 1 ? '[' : ')') + string;
		strings.push(string);
		++index;
	}
 
	best.strings = strings;

	return { best, log, ratio: Math.round(best.length / (mirrored || raw_length) * 10000) / 100 };
};

export const matchMethod = shape => {
	const mirror_even = shape[0] === ')', mirror_odd = shape[0] === '[', mirrored = mirror_even || mirror_odd;
	mirrored && (shape = shape.substr(1));

	const on_by_default = shape[0] === '_';
	on_by_default && (shape = shape.substr(1));

	let prefixes = Object.keys(key_by_prefix);
	prefixes.reverse();

	for(let prefix of prefixes)
		if(shape[0] === prefix[0] && (prefix.length < 2 || shape[1] === prefix[1]) && (prefix.length < 3 || shape[2] === prefix[2]))
			return { prefix, key: key_by_prefix[prefix], string: shape.substr(prefix.length), mirrored, mirror_even, mirror_odd, on_by_default };

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
	waterfall: 'CHAIR',
	stitch: 'NOTE',
	straight_smooth_x2: 'SPACE',
	straight_smooth: 'BUZZ',
	watertile: 'RAIN'
};

export const Example = {
    oninit: v => {
        const { method } = v.attrs, shape = shapes[examples[method]], { best, ratio } = bestMethod(shape);
        v.state = { shape, best, methods: best.methods.join(', '), ratio, url: `/shapeup/${best.strings[0]}` };
    },
    view: v => m(
        'div',
        m(ShapeUp, { configuration: v.state.shape, size: 5 }),
        m(
            '.mono',
            {},
            v.state.methods, ' ',
            v.state.ratio, '% ',
            v.state.best.length, ' characters ',
            m('a.break', { href: v.state.url, target: '_blank' }, v.state.url)
        )
    )
};

export const watertile = size => (height, width) => t.tile(t.pipe(t.horizontal, t.waterfall)(size || 1, width), 'vertical')(height, width);

export const methods = {
	split: t.pipe(t.horizontal, t.split),	
	bounce: t.pipe(t.horizontal, t.bounce),
	swirl: t.pipe(t.spiral, t.bounce, t.reposition, t.bounce),
	donut: t.pipe(t.diamond, t.bounce),
	leap: t.pipe(t.horizontal, t.alternate(), t.mutate(t.diagonal), t.bounce),
	clover: t.pipe(t.horizontal, t.reposition, t.mutate(t.spiral)),
	bacon: t.pipe(t.diagonal, t.reposition),
	reflect: t.pipe(t.horizontal, t.reflect),
	shift: t.pipe(t.horizontal, t.shift(Math.round(7*7/2))),
	stripe: t.pipe(t.horizontal, t.stripe),
	alternate: t.pipe(t.horizontal, t.alternate()),
	reposition: t.pipe(t.horizontal, t.reposition),
	waterfall: t.pipe(t.horizontal, t.waterfall),
	triangle_flipped: t.pipe(t.triangle, t.flip('y')),
	triangle_rotated: t.rotate(t.triangle),
	smooth: t.pipe(t.horizontal, t.smooth()),
	straight_smooth: t.pipe(t.horizontal, t.smooth('straight')),
	smooth_x2: t.pipe(t.horizontal, t.repeat(t.smooth(), 2)),
	straight_smooth_x2: t.pipe(t.horizontal, t.repeat(t.smooth('straight'), 2)),
	rotated_alternate: t.rotate(t.pipe(t.horizontal, t.alternate())),
	skew: t.pipe(t.horizontal, t.skew),
	alternate_diagonal: t.pipe(t.horizontal, t.alternate('diagonal')),
	straight_smooth_x5: t.pipe(t.horizontal, t.smooth('straight', 5)),
	step2: t.pipe(t.horizontal, t.step(2)),
	step3: t.pipe(t.horizontal, t.step(3)),
	step4: t.pipe(t.horizontal, t.step(4)),
	corner_in: t.corner('in'),
	corner_out: t.corner('out'),
	corner_crawl: t.corner('crawl'),
	pulse_edge: t.pulse('edge'),
	pulse_corner: t.pulse('corner'),
	fold: t.pipe(t.horizontal, t.fold),
	watertile: watertile(),
	watertile2: watertile(2),
	watertile3: watertile(3),
	cinnamon_roll: t.tile(t.spiral(3,3), 'horizontal'),
	rotated_watertile: (height, width) => t.tile(t.pipe(t.horizontal, t.waterfall, t.swap)(1, height), 'vertical')(height, width),
	rotated_waterfall: t.rotate(t.pipe(t.horizontal, t.waterfall))
};

export const bestSeed = (shape, from, to) => {
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

	!from && (from = 0);
	!to && (to = 100);

	let best = false;
	for(let i = from; i < to; ++i) {
		let result = repositionCompress(t.seed(i));
		if(best === false || best.length > result.length) best = { string: result, length: result.length, seed: i };
	}

	return { ...best, length: best.length };
};