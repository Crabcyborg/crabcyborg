import m from 'mithril';
import { min } from 'min-string';

const symbols = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ';

const stringToInts = input => {
	let values = [], total = 0, count = 0;
	for(let c of input) {
		const value = symbols.indexOf(c);
		total += value << ((3-count) * 6);

		if(++count > 3) {
			values.push(total);
			count = total = 0;
		}
	}

	if(total > 0) {
		while(count <= 3) {
			total += (symbols.length-1) << ((3-count) * 6);
			++count;
		}

		values.push(total);
	}

	return min.normalize(values);
};

const intsToString = input => {
	const max = 255 << 16, denormalized = min.denormalize(input, max);

	let values = [];
	for(let value of denormalized) {
		const first = value >> 18;
		const second = value - (first << 18) >> 12;
		const third = value - (first << 18) - (second << 12) >> 6;
		const fourth = value - (first << 18) - (second << 12) - (third << 6);
		values.push(first, second, third, fourth);
	}

	let output = '';
	for(let value of values) output += symbols[value];
	return output;
};

const string = 'I can map 4 base 64 characters to 3 of my chunks and as I encode back in base 64 there are no savings I have no punctuation and the size always rounds up to the next value divisible by 4 so the result is often longer for a lot of strings as the patterns are not very predictable either';
const compressed = min.compress(stringToInts(string));

const smallString = min.pipe(min.topTwoPatterns, min.threeCharacterPermutations, min.twoCharacterPermutations);
const smallest = smallString(string);

const oncreate = () => {

};

export var title = 'Using min-string with strings';

export var experiment = {
	oncreate,
	view: v => [
		[
			m('p.f7.mb0', 'decompressed'),
			m('p.mt0', intsToString(min.decompress(compressed))),
			m('p.f7.mb0', 'compressed'),
			m('p.mt0', { style: { wordWrap: 'break-word' } }, compressed),
			m('p.f7.mb0', 'better option is to just use a few functions if you just want to decrease size'),
			m('p.mt0', { style: { wordWrap: 'break-word' } }, smallest),
			m('p', 'Original Length: ', string.length),
			m('p', 'Compressed Length: ', compressed.length),
			m('p', 'Better Option Length: ', smallest.length)
		]
	]
};