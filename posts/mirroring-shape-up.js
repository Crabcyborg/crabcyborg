import m from 'mithril';
import { Gist, ShapeUp } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { shapes as optimized } from '$app/shapeup/shapes-optimized';
import { onOffVertical, repositionOnOff, onOffLimit, mirror, half } from '$app/shapeup/optimization-helper';
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

let butterfly;

export const title = 'Mirroring Shape Up Components';

export const oninit = () => {
	butterfly = {
		full: repositionBase49Limit(onOffVertical(shapes.FLY)),
		half: half(shapes.FLY)
	};

	butterfly.half_optimized = repositionBase49Limit(onOffVertical(butterfly.half));
	butterfly.half_url = `/shapeup/_${butterfly.half_optimized}`;
	butterfly.mirror_url = `/shapeup/)_${butterfly.half_optimized}`;
	butterfly.odd_mirror_url = `/shapeup/[_${butterfly.half_optimized}`;
};

export const content = () => [
	"Quite a few of my shapes are fully symmetrical. With symmetrical data, it doesn't really benefit us to store every value twice, so let's start chopping some data in half.",
	m(ShapeUp, {configuration: shapes.FLY, size: 5}),
	m('p', "Our butterfly benefits a lot from this strategy. Using the best on/off strategy (vertical) for our full butterfly, the payload is ", butterfly.full.length, " characters long."),
	"So let's cut her in half.",
	m(ShapeUp, {configuration: butterfly.half, size: 5}),
	"Ouch.",
	m('p', "Our half butterfly can be represented by ", butterfly.half_optimized.length, " characters, also using the vertical strategy."),
	m('div.mt2', m('a.break', { href: butterfly.half_url, target: '_blank' }, butterfly.half_url)),
	"I'm using a special character at the beginning of my url to identify that I am going to mirror this shape.",
	m('div.mt2', m('a.break', { href: butterfly.mirror_url, target: '_blank' }, butterfly.mirror_url)),
	"Our butterfly looks fatter in the middle than she did before. We mirrored her center pixels as well. My mirror function has a parameter for adjusting for symmetry with an odd number of columns as well, so I am using another special character to work with this type.",
	m('div.mt2', m('a.break', { href: butterfly.odd_mirror_url, target: '_blank' }, butterfly.odd_mirror_url)),
	"We can also use halving and mirroring to easily create some pretty entertaining new shapes.",
	m(ShapeUp, {configuration: mirror(half(shapes.PINK)), size: 5}),
	m(ShapeUp, {configuration: mirror(half(shapes.BUZZ)), size: 5}),
	m(ShapeUp, {style: { marginLeft: '10px' }, configuration: mirror(half(shapes.HORSE)), size: 5})
];