import m from 'mithril';
import { Gist, ShapeUp, GoToPost } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { shapes as optimized } from '$app/shapeup/shapes-optimized';
import { bestMethod, methods, applyOnOff, repositionOnOff, onOffLimit, half, topPatterns, toBase49, repositionBase49, repositionBase49Limit, toBase82 } from '$app/shapeup/optimization-helper';
import { min } from 'min-string';
const compress = min.compress, decompress = min.decompress;
import { traverse as t } from 'traverse-grid';

export const title = 'Minimizing a Large Shape Up Component';

let data, url, first, second, third, alternative_url, alternative_base49_url, base82, alternative_base82_url;
const alternative = min.pipe(min.toBase64, min.twoMostCommonPatterns, topPatterns, min.twoCharacterPermutations);
const alternativeBase49 = min.pipe(toBase49, min.twoMostCommonPatterns, topPatterns, min.twoCharacterPermutations);

const meta = key => {
	const raw = shapes[key];
	const compressed = compress(raw);
	const compressed_length = compressed.length;	
	const raw_length = raw.length;
	const raw_csv = raw.join(',');
	const raw_csv_length = raw_csv.length;
	const on_off = applyOnOff(raw, t.horizontal);
	const on_off_length = on_off.length;
	const on_off_csv = on_off.join(',');
	const on_off_csv_length = on_off_csv.length;	
	const on_off_compressed = compress(on_off);
	const on_off_compressed_length = on_off_compressed.length;
	const on_off_max = Math.max(...on_off);
	return {raw, compressed, compressed_length, raw_length, raw_csv, raw_csv_length, on_off, on_off_length, on_off_csv, on_off_csv_length, on_off_compressed, on_off_compressed_length, on_off_max};
};

const examples = ['DOG', 'PARIS', 'BUZZ'];

export const oninit = () => {
	data = {};
	for(let key of examples) data[key] = meta(key);
	first = data[examples[0]];
	second = data[examples[1]];
	third = data[examples[2]];
	first.alternative = alternative(first.on_off);
	third.alternative = alternative(third.on_off);
	third.on_off_base49 = alternativeBase49(third.on_off);
	first.on_off_vertical = applyOnOff(first.raw, t.vertical);
	first.limited = onOffLimit(first.on_off_vertical, 63);
	first.vertical = repositionBase49Limit(first.on_off_vertical);
	first.vertical_url = `/shapeup/~${first.vertical}`;
	first.best = repositionBase49Limit(applyOnOff(first.raw, methods.rotated_alternate));
	first.best_url = `/shapeup/]]O${first.best}`;
	second.repositioned_base49 = repositionBase49(second.on_off);
	second.repositioned_url = `/shapeup/-${second.repositioned_base49}`;
	second.vertical = repositionBase49(applyOnOff(second.raw, t.vertical));
	second.vertical_url = `/shapeup/~${second.vertical}`;
	third.repositioned_on_off = repositionOnOff(third.on_off);
	third.repositioned_base49 = repositionBase49(third.on_off);
	third.repositioned_url = `/shapeup/-${third.repositioned_base49}`;
	third.best = bestMethod(third.raw).best;
	third.best_url = `/shapeup/${third.best.strings[0]}`;
	url = `/shapeup/|${first.on_off_compressed}`;
	alternative_url = `/shapeup/}${first.alternative}`;
	alternative_base49_url = `/shapeup/^${third.on_off_base49}`;
	base82 = toBase82(first.on_off);
	alternative_base82_url = `/shapeup/*${base82}`;
	second.half = bestMethod(second.raw).best.strings[0];
	second.half_url = `/shapeup/${second.half}`;
};

export const content = () => [
	m(ShapeUp, {configuration: first.raw, size: 2}),
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
		m('p.mt0.mb0', 'Raw CSV Length: ', second.raw_csv_length),
		m('p.mt0.mb0', 'On/Off Array Length: ', second.on_off_length),
		m('p.mb0', 'Compressed Length: ', second.compressed_length),
		m('p.mt0', 'Compressed On/Off Length: ', second.on_off_compressed_length)
	),
	'Our eiffel tower switches on and off too often.',
	m(ShapeUp, {configuration: third.raw, size: 4}),
	m(
		'.dib',
		{
			style: { verticalAlign: 'top', marginLeft: '10px' }
		},
		m('p.mt0.mb0', 'Raw Array Length: ', third.raw_length),
		m('p.mt0.mb0', 'Raw CSV Length: ', third.raw_csv_length),
		m('p.mt0.mb0', 'On/Off Array Length: ', third.on_off_length),
		m('p.mb0', 'Compressed Length: ', third.compressed_length),
		m('p.mt0', 'Compressed On/Off Length: ', third.on_off_compressed_length)
	),
	'Our bumble bee might have a fighting chance. The On/Off Array is smaller before it is compressed and larger after. The compressions are better configured for the original set of data so maybe we can tweak our min-string configuration and get a smaller payload here as well.',
	m('p.mt0', 'Alternative Compressed On/Off Length: ', third.alternative.length),
	m('p', "A ton of functions do nothing in this situation so I've removed several and used the characters for counters and three character permutations to replace more top patterns instead, getting my payload down by ", third.on_off_compressed_length - third.alternative.length, " characters."),
	m('p', "The original method is still better, but this new function can be used to bring vizsla down to ", first.alternative.length, " characters, ", first.on_off_compressed_length - first.alternative.length, " fewer than before."),
	m('div.mt2', m('a.break', { href: alternative_url, target: '_blank' }, alternative_url)),	
	m('p', "To find a pattern, it always helps to see the data you're working with:"),
	m('p.break', third.on_off_csv),
	m('p', 'No values ever exceed ', third.on_off_max, ', so I can get this a lot smaller if I drop support for values up to 255.'),
	'If I treat each value as an index in my array of base 64 characters, I can support any gap up to 63 with just a single character, immediately reducing the size of our base 64 string by 25%.',
	m('p', 'Our bumble bee is down to only ', third.on_off_base49.length, ' characters long, now ', Math.round(third.raw_csv_length / third.on_off_base49.length * 100)/100, 'x smaller than the original.'),
	m('div.mt2', m('a.break', { href: alternative_base49_url, target: '_blank' }, alternative_base49_url)),
	m('p', "It's also easier to find patterns if we put our on values beside other on values and off values beside other off values:"),
	m('p.break', third.repositioned_on_off.join(',')),
	m('p', "When I compress this repositioned set of data I get my payload down to ", third.repositioned_base49.length, "."),
	m('div.mt2', m('a.break', { href: third.repositioned_url, target: '_blank' }, third.repositioned_url)),
	m('p.f7', 'Using the ', third.best.methods[0], ' method described in ', m(GoToPost, {style: { fontSize: '.75rem' }, key: 'traversing-shape-up'}), ' I can get our bee down to ', third.best.length, ' characters! ', m('a.f7.break', { href: third.best_url, target: '_blank' }, third.best_url)),
	m('p', "Our eiffel tower, at ", second.repositioned_base49.length, " characters, is an example of a shape that still works better with the previous method."),
	m('div.mt2', m('a.break', { href: second.repositioned_url, target: '_blank' }, second.repositioned_url)),
	m('p', "But wait! The eiffel tower shape also switches between on and off states more frequently if you scan it horizontally than if you do it vertically, so I wrote a function that does that too."),
	m('div.mt2', m('a.break', { href: second.vertical_url, target: '_blank' }, second.vertical_url)),
	m('p', 'Our eiffel tower is down to ', second.vertical.length, ' characters!'),
	m('p.f7', 'Oh by the way, the eiffel tower is symmetrical and I found a better method so I can drop half of the data and take our payload down to ', second.half.length, ' characters ', m('a.break.f7', { href: second.half_url, target: '_blank' }, second.half_url)),
	m('p', "Can we apply this to vizsla as well? For her, the gap is ", first.on_off_max, ", a pretty large set of characters to establish a 1:1 relation with. If I used every symbol in the defined set of min-string characters I still would only support up to 85."),
	m('p.break', first.on_off_csv),
	m('p', first.raw[0], ' is actually just our height and it turns out the next highest values after our height and our width is only ', Math.max(...first.on_off.slice(2)), '. I can add the width and height as raw data and then index the rest.'),
	m('div.mt2', m('a.break', { href: alternative_base82_url, target: '_blank' }, alternative_base82_url)),
	m('p', "Our lean little pup is down to only ", base82.length, " characters long, now ", Math.round(first.raw_csv_length / base82.length * 100)/100, "x smaller than the original. I see a ton of repetition but I've used up most of my characters."),
	"What does vizsla look like with a vertical scan?",
	m('p.break', first.on_off_vertical.join(',')),
	m('p', "This is quite a bit smaller, but the max goes all the way up to ", Math.max(...first.on_off_vertical), ". It's actually really easy to enforce a limit of 63 with the on/off strategy, converting 100 for example to ", onOffLimit([100], 63).join(','), '.'),
	m('p', 'Our limited array now has ', first.limited.length, ' values, more than the previous ', first.on_off_vertical.length, ' but it is still lower than the horizontally scanned set of data at ', first.on_off.length, ', and the limit is now only 63 which means we have the additional characters available to identify patterns again.'),
	m('p', 'Our new compressed string is down to ', first.vertical.length, ' characters, ', Math.round(first.raw_csv_length / first.vertical.length * 100)/100, 'x smaller than the original.'),
	m('div.mt2', m('a.break', { href: first.vertical_url, target: '_blank' }, first.vertical_url)),
	m('p.f7', 'Or with an alternated vertical method we can get her down to ', first.best.length, ' characters ', m('a.break.f7', { href: first.best_url, target: '_blank' }, first.best_url)),
];