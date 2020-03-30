import m from 'mithril';
import { Caption, Gist, ShapeUp, TargetShape, Score } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { shapes as optimized } from '$app/shapeup/shapes-optimized';
import { compress, decompress, counter, decounter, optimize, substitute, unsub } from '$app/shapeup/optimization-helper';

export const title = 'Minimizing a Shape Up Component';

const key = 'BUZZ';
const raw = shapes[key];
const compressed = compress(raw);
const minimized = counter(compressed);
const back_to_raw = decompress(decounter(minimized));
const raw_csv = raw.join(',');
const back_to_raw_csv = back_to_raw.join(',');

const example_url = `/shapeup/${raw_csv}`;
const compressed_url = `/shapeup/${compressed}`;
const counter_url = `/shapeup/${minimized}`;

const small = [255,255,255];
const long = [255,255,255,255,255,255];

const count_by_pattern = {};
let max = false;
let max_pattern;
const keys = Object.keys(optimized);
for(let key of keys) {
	const shape = optimized[key];

	for(let i = 0; i < shape.length-1; ++i) {
		const pattern = shape[i] + shape[i+1];
		count_by_pattern[pattern] = count_by_pattern[pattern] !== undefined ? count_by_pattern[pattern] + 1 : 1;

		if(!max || count_by_pattern[pattern] > max) {
			max = count_by_pattern[pattern];
			max_pattern = pattern;
		}
	}
}

const sorted_patterns = Object.keys(count_by_pattern).sort(function(a, b) {
	return count_by_pattern[b] - count_by_pattern[a];
});

const show = 10;

let top = {};
for(let i = 0; i < show; ++i) {
	top[[sorted_patterns[i]]] = count_by_pattern[sorted_patterns[i]];
}

const pretty = obj => {
	const keys = Object.keys(obj);

	let output = [];

	for(let key of keys) {
		let value = obj[key];
		output.push(`${key}: ${value}`);
	}

	return output.join('\n');
};

const sub = substitute(minimized);
const sub_url = `/shapeup/${sub}`;

export const content = () => [
	m(ShapeUp, {configuration: raw, size: 4}),
	m(ShapeUp, {configuration: back_to_raw, size: 4}),
	m('p', "I've implemented a simple Shape Up Editor on my ", m('a', {href: 'https://flutter.crabcyb.org/#/', target: '_blank'}, 'Flutter page'), ', that passes data back to my site without any backend, passing all of the data for a Shape Up component. But the size of my component can be pretty wordy.'),
	"For example, the url to load this bumble bee is:",
	m('a', { style: { wordWrap: 'break-word' }, href: example_url, target: '_blank' }, example_url),
	m('p', "That's ", example_url.length, " characters long and not exactly a pretty url."),
	m('p', "So how do we make it smaller? ", m('strong', 'Introduce a larger variety of characters!'), " Right now I'm only taking advantage of 0-9 and the comma."),
	"Since I'm trying to use this data in a url param, I've picked a very standard set of common url friendly characters to add to my arsenal (a-z A-Z ! $) introducing 54 additional characters to our 0-9, bringing the count up to 64.",
	m('h3', "Why 64?"),
	m('p', "I chose 64 because ", m('i', "Math.pow(64,4) == 256<<16"), ". This translates to \"I can have a base64 value with 4 characters that can hold the data for 3 blocks of values within 1 and 255.\" 255,255,255 becomes ", compress(small), "."),
	m('p', "I can skip on the comma by guaranteeing that all 4 characters are always present instead of truncating any 0s on the left hand side so 255,255,255,255,255,255 is still only ", compress(long), ", 23 characters become 8."),
	"Our bumble bee's url becomes:",
	m('a', { style: { wordWrap: 'break-word' }, href: compressed_url, target: '_blank' }, compressed_url),
	m('p', compressed_url.length, ' characters long! ', Math.round(example_url.length / compressed_url.length * 100)/100, 'x smaller than the larger url.'),
	m('p', compress(long), " can be optimized further. To reduce repeating sets of values, I am going to introduce an additional 6 characters (^*-_~`) to represent counts. ", compress(long), " becomes ", optimize(long), "."),
	"Since there wouldn't be any savings for counting occurences less than 3, it only requires 6 characters to support x3-8.",
	m('p', '$$ ', counter('$$')),
	m('p', '$$$ ', counter('$$$')),	
	m('p', '$$$$ ', counter('$$$$')),
	m('p', '$$$$$ ', counter('$$$$$')),
	m('p', '$$$$$$ ', counter('$$$$$$')),
	m('p', '$$$$$$$ ', counter('$$$$$$$')),
	m('p', '$$$$$$$$ ', counter('$$$$$$$$')),
	"Our url becomes:",
	m('a', { style: { wordWrap: 'break-word' }, href: counter_url, target: '_blank' }, counter_url),
	m('p', "The result is ", counter_url.length, " characters long, ", Math.round(compressed_url.length / counter_url.length * 100)/100, "x smaller than the version without counts and ", Math.round(example_url.length / counter_url.length * 100)/100, "x smaller than the original url."),
	"The next thing I did was optimize every level I have, and look for common pairs that I can also replace with special characters.",
	m('pre', { style: { wordWrap: 'break-word' } }, pretty(top)),
	"There are two clear winners, 00 and $$. I will replace both of these with two new characters, @ and =, bringing the total to 72.",
	m('p', sub_url.length, ' characters long! ', Math.round(counter_url.length / sub_url.length * 100)/100, 'x smaller than the previous url, ', Math.round(example_url.length / sub_url.length * 100)/100, "x smaller than the original url."),
	m('a', { style: { wordWrap: 'break-word' }, href: sub_url, target: '_blank' }, sub_url),
	"Sure, the url is still pretty big, but we're storing every piece of data required for our entire bumble bee!"
];