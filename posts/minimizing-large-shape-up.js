import m from 'mithril';
import { Caption, Gist, ShapeUp, TargetShape, Score } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { shapes as optimized } from '$app/shapeup/shapes-optimized';
import { onOff, offOn } from '$app/shapeup/optimization-helper';
import { min } from 'min-string';
const compress = min.compress, decompress = min.decompress;

export const title = 'Minimizing a Large Shape Up Component';

let data, url, first, second, third, alternative_url;

const meta = key => {
	const raw = shapes[key];
	const compressed = compress(raw);
	const compressed_length = compressed.length;	
	const raw_length = raw.length;
	const raw_csv = raw.join(',');
	const raw_csv_length = raw_csv.length;
	const on_off = onOff(raw);
	const on_off_length = on_off.length;
	const on_off_csv = on_off.join(',');
	const on_off_csv_length = on_off_csv.length;	
	const on_off_compressed = compress(on_off);
	const on_off_compressed_length = on_off_compressed.length;
	return {raw, compressed, compressed_length, raw_length, raw_csv, raw_csv_length, on_off, on_off_length, on_off_csv, on_off_csv_length, on_off_compressed, on_off_compressed_length};
};

const examples = ['DOG', 'NY', 'BUZZ'];

const moreTopPatterns = input => {
	for(let c of '^*-_~`') input = min.subTopPattern(input, c);
	return input;
};

const alternative = min.pipe(min.toBase64, min.twoMostCommonPatterns, min.topTwoPatterns, moreTopPatterns, min.twoCharacterPermutations);

export const oninit = () => {
	data = {};
	for(let key of examples) data[key] = meta(key);
	first = data[examples[0]];
	second = data[examples[1]];
	third = data[examples[2]];
	first.alternative = alternative(first.on_off);
	third.alternative = alternative(third.on_off);
	url = `/shapeup/|${first.on_off_compressed}`;
	alternative_url = `/shapeup/}${first.alternative}`;
};

export const content = () => [
	m(ShapeUp, {configuration: first.raw, size: 2}),
	m(ShapeUp, {configuration: offOn(first.on_off), size: 2}),
	m('p', "It turns out that once our data becomes larger like our adorable 94x89 vizsla, it can be much more efficient at times to just count how many cells in a row are on, then how many are off."),
	m('p.mb0', 'Raw Array Length: ', first.raw_length),
	m('p.mt0.mb0', 'Raw CSV Length: ', first.raw_csv_length),
	m('p.mt0.mb0', 'On/Off Array Length: ', first.on_off_length),
	m('p.mt0', 'On/Off CSV Length: ', first.on_off_csv_length),
	m('p', "The initial set of raw values is already ", Math.round(first.raw_csv_length / first.on_off_csv_length * 10) / 10, "x smaller but it is also less predictable."),
	m('p.mb0', 'Compressed Length: ', first.compressed_length),
	m('p.mt0', 'Compressed On/Off Length: ', first.on_off_compressed_length),
	m('p', "Our On/Off version is ", Math.round(first.compressed_length / first.on_off_compressed_length * 10) / 10, "x smaller than the previous optimized size and ", Math.round(first.raw_csv_length / first.on_off_compressed_length * 10) / 10, "x smaller than the original raw data."),
	m('div.mt2', m('a', { style: { wordWrap: 'break-word' }, href: url, target: '_blank' }, url)),
	"This is not a holy grail solution as it relies heavily on the consistency of the on and off patterns. Let's explore how it works on a few other shapes:",
	m(ShapeUp, {configuration: second.raw, size: 4}),
	m(
		'.dib',
		{
			style: { verticalAlign: 'top', marginLeft: '10px' }
		},
		m('p.mt0.mb0', 'Raw Array Length: ', second.raw_length),
		m('p.mt0.mb0', 'On/Off Array Length: ', second.on_off_length),
		m('p.mb0', 'Compressed Length: ', second.compressed_length),
		m('p.mt0', 'Compressed On/Off Length: ', second.on_off_compressed_length)
	),
	'Our empire state building switches on and off too often.',
	m(ShapeUp, {configuration: third.raw, size: 4}),
	m(
		'.dib',
		{
			style: { verticalAlign: 'top', marginLeft: '10px' }
		},
		m('p.mt0.mb0', 'Raw Array Length: ', third.raw_length),
		m('p.mt0.mb0', 'On/Off Array Length: ', third.on_off_length),
		m('p.mb0', 'Compressed Length: ', third.compressed_length),
		m('p.mt0', 'Compressed On/Off Length: ', third.on_off_compressed_length)
	),
	'Our bumble bee might have a fighting chance. The On/Off Array is smaller before it is compressed and larger after. The compressions are better configured for the original set of data so maybe we can tweak our min-string configuration and get a smaller payload here as well.',
	m('p.mt0', 'Alternative Compressed On/Off Length: ', third.alternative.length),
	m('p', "A ton of functions do nothing in this situation so I've removed several and used the characters for counters to replace more top patterns instead, getting my payload down by ", third.on_off_compressed_length - third.alternative.length, " characters."),
	m('p', "The original method is still better, but this new function can be used to bring vizsla down to ", first.alternative.length, " characters, ", first.on_off_compressed_length - first.alternative.length, " fewer than before."),
	m('div.mt2', m('a', { style: { wordWrap: 'break-word' }, href: alternative_url, target: '_blank' }, alternative_url)),
];