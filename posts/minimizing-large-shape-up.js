import m from 'mithril';
import { Caption, Gist, ShapeUp, TargetShape, Score } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { shapes as optimized } from '$app/shapeup/shapes-optimized';
import { onOff, offOn, repositionOnOff } from '$app/shapeup/optimization-helper';
import { min } from 'min-string';
const compress = min.compress, decompress = min.decompress;

export const title = 'Minimizing a Large Shape Up Component';

let data, url, first, second, third, alternative_url, alternative_base49_url, base82, alternative_base82_url, ruby;

const topPatterns = (input, symbols) => {
	symbols === undefined && (symbols = min.three_character_permutations_symbols + min.counter_symbols);
	for(let c of symbols) input = min.subTopPattern(input, c);
	return input;
};

const repositionTopPatterns = input => topPatterns(input, min.three_character_permutations_symbols);

const alternative = min.pipe(min.toBase64, min.twoMostCommonPatterns, topPatterns, min.twoCharacterPermutations);

const toBase49 = input => input.map(index => min.base64_symbols[index]).join('');
const alternativeBase49 = min.pipe(toBase49, min.twoMostCommonPatterns, topPatterns, min.twoCharacterPermutations);
const repositionBase49 = min.pipe(repositionOnOff, toBase49, min.counter, min.twoMostCommonPatterns, repositionTopPatterns, min.twoCharacterPermutations);

const base82_symbols = min.base64_symbols + min.counter_symbols + min.additional_symbols + min.three_character_permutations_symbols + min.two_character_permutations_symbols;
const toBase82 = input => input.slice(0, 2).join(',') + ',' + input.slice(2).map(index => base82_symbols[index]).join('');

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
	const on_off_max = Math.max(...on_off);
	return {raw, compressed, compressed_length, raw_length, raw_csv, raw_csv_length, on_off, on_off_length, on_off_csv, on_off_csv_length, on_off_compressed, on_off_compressed_length, on_off_max};
};

const examples = ['DOG', 'CLEF', 'BUZZ'];

export const oninit = () => {
	data = {};
	for(let key of examples) data[key] = meta(key);
	first = data[examples[0]];
	second = data[examples[1]];
	third = data[examples[2]];
	first.off_on = offOn(first.on_off);
	first.alternative = alternative(first.on_off);
	third.alternative = alternative(third.on_off);
	third.on_off_base49 = alternativeBase49(third.on_off);

	second.repositioned_base49 = repositionBase49(second.on_off);
	second.repositioned_url = `/shapeup/-${second.repositioned_base49}`;

	third.repositioned_on_off = repositionOnOff(third.on_off);
	third.repositioned_base49 = repositionBase49(third.on_off);
	third.repositioned_url = `/shapeup/-${third.repositioned_base49}`;

	ruby = {raw: shapes.RUBY};
	ruby.compressed = min.compress(ruby.raw);
	ruby.repositioned = repositionBase49(onOff(ruby.raw));
	
	url = `/shapeup/|${first.on_off_compressed}`;
	alternative_url = `/shapeup/}${first.alternative}`;
	alternative_base49_url = `/shapeup/^${third.on_off_base49}`;
	base82 = toBase82(first.on_off);
	alternative_base82_url = `/shapeup/*${base82}`;
};

export const content = () => [
	m(ShapeUp, {configuration: first.raw, size: 2}),
	m(ShapeUp, {configuration: first.off_on, size: 2}),
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
	'Our treble clef switches on and off too often.',
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
	m('p', "A ton of functions do nothing in this situation so I've removed several and used the characters for counters and three character permutations to replace more top patterns instead, getting my payload down by ", third.on_off_compressed_length - third.alternative.length, " characters."),
	m('p', "The original method is still better, but this new function can be used to bring vizsla down to ", first.alternative.length, " characters, ", first.on_off_compressed_length - first.alternative.length, " fewer than before."),
	m('div.mt2', m('a', { style: { wordWrap: 'break-word' }, href: alternative_url, target: '_blank' }, alternative_url)),
	m('p', "To find a pattern, it always helps to see the data you're working with:"),
	m('p', { style: { wordWrap: 'break-word' } }, third.on_off_csv),
	m('p', 'No values ever exceed ', third.on_off_max, ', so I can get this a lot smaller if I drop support for values up to 255.'),
	'If I treat each value as an index in my array of base 64 characters, I can support any gap up to 63 with just a single character, immediately reducing the size of our base 64 string by 25%.',
	m('p', 'Our bumble bee is down to only ', third.on_off_base49.length, ' characters long, now ', Math.round(third.raw_csv_length / third.on_off_base49.length * 100)/100, 'x smaller than the original.'),
	m('div.mt2', m('a', { style: { wordWrap: 'break-word' }, href: alternative_base49_url, target: '_blank' }, alternative_base49_url)),
	m('p', "It's also easier to find patterns if we put our on values beside other on values and off values beside other off values:"),
	m('p', { style: { wordWrap: 'break-word' } }, third.repositioned_on_off.join(',')),
	m('p', "When I compress this repositioned set of data I get my payload down to ", third.repositioned_base49.length, "."),
	m('div.mt2', m('a', { style: { wordWrap: 'break-word' }, href: third.repositioned_url, target: '_blank' }, third.repositioned_url)),
	m('p', "At the time of writing this, 42 shapes were smaller using this method and 66 shapes were larger. 6 had identical lengths with both methods. Our treble clef, at ", second.repositioned_base49.length, " characters, is an example of a shape that still works better with the previous method."),
	m('div.mt2', m('a', { style: { wordWrap: 'break-word' }, href: second.repositioned_url, target: '_blank' }, second.repositioned_url)),
	m('p', "Can we apply this to vizsla as well? For her, the gap is ", first.on_off_max, ", a pretty large set of characters to establish a 1:1 relation with. If I used every symbol in the defined set of min-string characters I still would only support up to 85."),
	m('p', { style: { wordWrap: 'break-word' } }, first.on_off_csv),
	m('p', first.raw[0], ' is actually just our height and it turns out the next highest values after our height and our width is only ', Math.max(...first.on_off.slice(2)), '. I can add the width and height as raw data and then index the rest.'),
	m('div.mt2', m('a', { style: { wordWrap: 'break-word' }, href: alternative_base82_url, target: '_blank' }, alternative_base82_url)),
	m('p', "Our lean little pup is down to only ", base82.length, " characters long, now ", Math.round(first.raw_csv_length / base82.length * 100)/100, "x smaller than the original. I see a ton of repetition but I've used up most of my characters. This is good for now.")
];