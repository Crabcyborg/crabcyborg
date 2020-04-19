import m from 'mithril';
import { ShapeUp } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { injectScript } from '$app/helpers';
import { onOff, onOffVertical, onOffDiagonal, onOffDiagonal2, repositionOnOff, onOffLimit, onOffSpiral, offOnDiagonal, mirror, half } from '$app/shapeup/optimization-helper';
import { min } from 'min-string';

const topPatterns = (input, symbols) => {
	symbols === undefined && (symbols = min.three_character_permutations_symbols + min.counter_symbols);
	for(let c of symbols) input = min.subTopPattern(input, c);
	return input;
};

const repositionTopPatterns = input => topPatterns(input, min.three_character_permutations_symbols);
const toBase49 = input => input.map(index => min.base64_symbols[index]).join('');
const repositionBase49 = min.pipe(repositionOnOff, toBase49, min.counter, repositionTopPatterns, min.twoCharacterPermutations);
const repositionBase49Limit = min.pipe(repositionOnOff, input => onOffLimit(input, 63), toBase49, min.counter, repositionTopPatterns, min.twoCharacterPermutations);

let mirror_key = 'PINK';

const oninit = v => {
	let count_by_winner = {};

	shapes.HALF = half(shapes[mirror_key]);

	for(let key in shapes) {
		let shape = shapes[key];
		let compressed = min.compress(shape);
		let horizontal = repositionBase49Limit(onOff(shape));
		let vertical = repositionBase49Limit(onOffVertical(shape));
		let spiral = repositionBase49Limit(onOffSpiral(shape));
		let diagonal = repositionBase49Limit(onOffDiagonal(shape));

		let prefix_by_key = {
			compressed: '',
			horizontal: '-',
			vertical: '~',
			spiral: '`',
			diagonal: '>'
		};

		let string_by_key = { compressed, horizontal, vertical, spiral, diagonal };

		let key_by_value = {
			[compressed.length]: 'compressed',
			[horizontal.length]: 'horizontal',
			[vertical.length]: 'vertical',
			[spiral.length]: 'spiral',
			[diagonal.length]: 'diagonal'
		};

		let smallest = Math.min(compressed.length, horizontal.length, vertical.length, spiral.length, diagonal.length);
		let winner = smallest === compressed.length ? 'compressed' : key_by_value[smallest];

		count_by_winner[winner] = (count_by_winner[winner] || 0) + 1;

		[mirror_key, 'HALF'].indexOf(key) >= 0 && console.log(key, winner, compressed.length, horizontal.length, vertical.length, spiral.length, diagonal.length, prefix_by_key[winner] + string_by_key[winner]);
	}

	console.log(count_by_winner);
};

export var Sandbox = {
	oninit,
	view: v => [
		[
			m('p', 'Hello World'),
			m('div', m(ShapeUp, {configuration: shapes.NECK, size: 5})),
			m('div', m(ShapeUp, {configuration: mirror(shapes.NECK), size: 5})),
			m('div', m(ShapeUp, {configuration: half(shapes[mirror_key]), size: 5})),
			m('div', m(ShapeUp, {configuration: mirror(half(shapes[mirror_key]), true), size: 5})),
			m('p', half(shapes[mirror_key]).join(','))
		]
	]
};