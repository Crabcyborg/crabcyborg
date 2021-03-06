import m from 'mithril';
import { Gist, ShapeUp, GoToPost } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { shapes as optimized } from '$app/shapeup/shapes-optimized';
import { min } from 'min-string';

const min_string_url = 'https://github.com/Crabcyborg/min-string';

export const title = 'Minimizing a Shape Up Component';

const key = 'BUZZ';
const raw = shapes[key];
const compressed = min.toBase64(raw);
const minimized = min.counter(compressed);
const back_to_raw = min.toDecimal(min.decounter(minimized));
const raw_csv = raw.join(',');
const back_to_raw_csv = back_to_raw.join(',');

const example_url = `/shapeup/${raw_csv}`;
const compressed_url = `/shapeup/${compressed}`;
const counter_url = `/shapeup/${minimized}`;

const small = [255,255,255];
const long = [255,255,255,255,255,255];

let count_by_pattern = {};
let count_by_pattern_subbed = {};
let count_pattern_sub2 = {};
const keys = Object.keys(optimized);
for(let key of keys) {
	const shape = optimized[key];
	for(let i = 0; i < shape.length-1; ++i) {
		const pattern = shape[i] + shape[i+1];
		count_by_pattern[pattern] = (count_by_pattern[pattern] || 0) + 1;
	}

	const subbed = min.twoMostCommonPatterns(shape);
	for(let i = 0; i < subbed.length-1; ++i) {
		const pattern = subbed[i] + subbed[i+1];
		count_by_pattern_subbed[pattern] = (count_by_pattern_subbed[pattern] || 0) + 1;
	}
}

let sub4d = min.commonSpecialPatterns(min.commonThreeCharacterPatterns(min.thirdMostCommonPattern(min.twoMostCommonPatterns(minimized))));
for(let i = 0; i < sub4d.length-1; ++i) {
	const pattern = sub4d[i] + sub4d[i+1];
	count_pattern_sub2[pattern] = (count_pattern_sub2[pattern] || 0) + 1;
}

const sortPatterns = counts => Object.keys(counts).sort(function(a, b) {
	return counts[b] - counts[a];
});

const getTop = (sorted, counts, show = 10) => {
	let top = {};

	for(let i = 0; i < show; ++i) {
		top[[sorted[i]]] = counts[sorted[i]];
	}

	return top;
};

const sorted_patterns = sortPatterns(count_by_pattern);
const sorted_patterns_subbed = sortPatterns(count_by_pattern_subbed);
const sorted_sub2 = sortPatterns(count_pattern_sub2);

let top = getTop(sorted_patterns, count_by_pattern);
let top_subbed = getTop(sorted_patterns_subbed, count_by_pattern_subbed);
let top_sub2 = sorted_sub2[0];

const sub = min.twoMostCommonPatterns(minimized);
const sub_url = `/shapeup/${sub}`;

const sub2d = min.thirdMostCommonPattern(sub);
const sub2_url = `/shapeup/${sub2d}`;

const sub3d = min.commonThreeCharacterPatterns(sub2d);
const sub3_url = `/shapeup/${sub3d}`;

sub4d = min.commonSpecialPatterns(sub3d);
const sub4_url = `/shapeup/${sub4d}`;

const sub5d = min.topTwoPatterns(sub4d);
const sub5_url = `/shapeup/${sub5d}`;

const sub6d = min.threeCharacterPermutations(sub5d);
const sub6_url = `/shapeup/${sub6d}`;

const sub7d = min.twoCharacterPermutations(sub6d);
const sub7_url = `/shapeup/${sub7d}`;

const sub5example = '0130101401';

const pretty = obj => {
	const keys = Object.keys(obj);

	let output = [];

	for(let key of keys) {
		let value = obj[key];
		output.push(`${key}: ${value}`);
	}

	return output.join('\n');
};

export const content = () => [
	m(ShapeUp, {configuration: raw, size: 4}),
	m(ShapeUp, {configuration: back_to_raw, size: 4}),
	m('p', "I've implemented a simple Shape Up Editor on my ", m('a', {href: 'https://flutter.crabcyb.org/#/', target: '_blank'}, 'Flutter page'), ', that passes data back to my site without any backend, passing all of the data for a Shape Up component. But the size of my component can be pretty wordy.'),
	"For example, the url to load this bumble bee is:",
	m('a', { style: { wordWrap: 'break-word' }, href: example_url, target: '_blank' }, example_url),
	m('p', "The data payload is ", raw_csv.length, " characters long. Surely this can be made smaller!"),
	m('p', "So how do we make it smaller? ", m('strong', 'Introduce a larger variety of characters!'), " Right now I'm only taking advantage of 0-9 and the comma."),
	"Since I'm trying to use this data in a url param, I've picked a very standard set of common url friendly characters to add to my arsenal (a-z A-Z ! $) introducing 54 additional characters to our 0-9, bringing the count up to 64.",
	m('h3', "Why 64?"),
	m('p', "I chose 64 because ", m('i', "Math.pow(64,4) == 256<<16"), ". This translates to \"I can have a base64 value with 4 characters that can hold the data for 3 blocks of values within 1 and 255.\" 255,255,255 becomes ", min.toBase64(small), "."),
	m('p', "I can skip on the comma by guaranteeing that all 4 characters are always present instead of truncating any 0s on the left hand side so 255,255,255,255,255,255 is still only ", min.toBase64(long), ", 23 characters become 8."),
	"Our bumble bee's url becomes:",
	m('a', { style: { wordWrap: 'break-word' }, href: compressed_url, target: '_blank' }, compressed_url),
	m('p', 'Our payload is down to ', compressed.length, ' characters, now ', Math.round(raw_csv.length / compressed.length * 100)/100, 'x smaller than the original. That\'s great!'),
	m('p', 'But ', min.toBase64(long), " can be optimized further. To reduce repeating sets of values, I am going to introduce an additional 6 characters (^*-_~`) to represent counts. ", min.toBase64(long), " becomes ", min.counter(min.toBase64(long)), "."),
	"Since there wouldn't be any savings for counting occurences less than 3, it only requires 6 characters to support x3-8.",
	m('p', '$$ ', min.counter('$$')),
	m('p', '$$$ ', min.counter('$$$')),	
	m('p', '$$$$ ', min.counter('$$$$')),
	m('p', '$$$$$ ', min.counter('$$$$$')),
	m('p', '$$$$$$ ', min.counter('$$$$$$')),
	m('p', '$$$$$$$ ', min.counter('$$$$$$$')),
	m('p', '$$$$$$$$ ', min.counter('$$$$$$$$')),
	"Our url becomes:",
	m('a', { style: { wordWrap: 'break-word' }, href: counter_url, target: '_blank' }, counter_url),
	m('p', "The result is ", minimized.length, " characters long, ", Math.round(compressed.length / minimized.length * 100)/100, "x smaller than the version without counts and ", Math.round(raw_csv.length / counter_url.length * 100)/100, "x smaller than the original."),
	"The next thing I did was optimize every level I have, and look for common pairs that I can also replace with special characters.",
	m('pre', { style: { wordWrap: 'break-word' } }, pretty(top)),
	"There are two clear winners, 00 and $$. I will replace both of these with two new characters, @ and =, bringing the total to 72.",
	m('p', sub.length, ' characters long! ', Math.round(minimized.length / sub.length * 100)/100, 'x smaller and ', Math.round(raw_csv.length / sub.length * 100)/100, "x smaller than the original."),
	m('a', { style: { wordWrap: 'break-word' }, href: sub_url, target: '_blank' }, sub_url),
	"If we check for common occurences again, a lot of the runners up were knocked off of the list because they shared a 0 or a $. The new winner, is 0^. So I'm introducing a 73rd character, ', to replace this pattern.",
	m('pre', { style: { wordWrap: 'break-word' } }, pretty(top_subbed)),
	m('p', sub2d.length, ' characters long. ', Math.round(sub.length / sub2d.length * 100)/100, 'x smaller and ', Math.round(raw_csv.length / sub2d.length * 100)/100, "x smaller than the original."),
	m('a', { style: { wordWrap: 'break-word' }, href: sub2_url, target: '_blank' }, sub2_url),
	"Why stop there though? I'm introducting a 74th character, \", that always has a trailing character to represent a common pattern's index. I've identified 46 patterns with a length of 3 that occur more than 5 times across my library of puzzles.",
	m('p', min.patterns.join(', ').replace(/\\/g, '')),
	m('p', sub3d.length, ' characters long. ', Math.round(sub2d.length / sub3d.length * 100)/100, 'x smaller and ', Math.round(raw_csv.length / sub3d.length * 100)/100, "x smaller than the original."),
	m('a', { style: { wordWrap: 'break-word' }, href: sub3_url, target: '_blank' }, sub3_url),
	m('p', "46 patterns doesn't totally cover every possible index, so I decided to look for new types of patterns, not just *** but patterns like * * *, ** *, * **, and so on. After adding 26 additional patterns, my string is ", sub4d.length, ' characters long. ', Math.round(sub3d.length / sub4d.length * 100)/100, 'x smaller and ', Math.round(raw_csv.length / sub4d.length * 100)/100, "x smaller than the original."),
	m('p', min.other_patterns.join(', ').replace(/\\/g, '')),
	m('a', { style: { wordWrap: 'break-word' }, href: sub4_url, target: '_blank' }, sub4_url),
	m('p', "Not a huge gain, but every little bit counts. We're still down ", sub3d.length - sub4d.length, " characters and we didn't have to introduce any new characters."),
	m('p', "I'm not out of ideas yet. I want to implement another new character to introduce another new technique that isn't about identifying common patterns across all puzzles, but one that specifically looks for common patterns in our current puzzle. If I put our new character, ;, before the first occurence of this 2 character pattern, I can replace all future occurences with our new character. As an example, ", sub5example, " would become ", min.topTwoPatterns(sub5example)),
	m('p', "For our bumble bee the pattern ", top_sub2, " appears ", count_pattern_sub2[top_sub2], " times. If we can designate one character to replace these ", count_pattern_sub2[top_sub2], " patterns, we'll cut off ", count_pattern_sub2[top_sub2]-2, " characters. And if we target another common pattern, 'f with another new character, :, we can cut off ", count_pattern_sub2["'f"]-2, " more. If no pattern appears more than twice, we can avoid this technique altogether as it doesn't help us at all."),
	m('p', sub5d.length, ' characters long. ', Math.round(sub4d.length / sub5d.length * 100)/100, 'x smaller and ', Math.round(raw_csv.length / sub5d.length * 100)/100, "x smaller than the original."),
	m('a', { style: { wordWrap: 'break-word' }, href: sub5_url, target: '_blank' }, sub5_url),
	"Next I can't help but notice that my bumble bee still has the pattern 403 repeating twice. I also see 043, which is so close as well. I'm introducting 6 new characters, <>()[], to handle all of the permutations of a 3 character pattern.",
	m('p', "A 3 character pattern, at most, has 6 permutations, hence the 6 new characters. The permutations for 403 are: ", min.permutations('403').join(' '), "."),
	m('p', sub6d.length, ' characters long. ', Math.round(sub5d.length / sub6d.length * 100)/100, 'x smaller and ', Math.round(raw_csv.length / sub6d.length * 100)/100, "x smaller than the original."),	
	m('a', { style: { wordWrap: 'break-word' }, href: sub6_url, target: '_blank' }, sub6_url),
	m('p', "We may as well add in {} to replace the most active 2 character patterns and their one other permutation (the only thing you can do with the 2 characters is flip them). But just matching for one other permutation doesn't cast a really big net, so I'm introducing 2 more characters, + and |, to replace instances where this pattern appears with another character in between the two. For instance, in this puzzle, 0-8, 80, 068, and 08 all appear. Minimized, 0-8 80 068 08 becomes ", min.twoCharacterPermutations('0-8 80 068 08'), ", down 2 characters."),
	m('p', sub7d.length, " characters long. Our final result is ", Math.round(sub6d.length / sub7d.length * 100)/100, 'x smaller and ', Math.round(raw_csv.length / sub7d.length * 100)/100, "x smaller than the original."),
	m('a', { style: { wordWrap: 'break-word' }, href: sub7_url, target: '_blank' }, sub7_url),
	m('p', "Sure, the url is still pretty big, but we're storing every piece of data required for our entire bumble bee! I've reached my target goal: get the payload to 150(", sub7d.length,") characters, achieve a compression ratio of under 30(", Math.round(sub7d.length / raw_csv.length * 10000)/100,")%."),
	m('p', "By the way, I've made this minimization technique into a standalone package available ", m('a', {href: min_string_url, target: '_blank'}, 'on github'), '. I also found a better way to describe this data in ', m(GoToPost, {key: 'minimizing-large-shape-up'}), ' where I get the size down to 111 characters (', Math.round(111 / raw_csv.length * 10000)/100,'%).')
];