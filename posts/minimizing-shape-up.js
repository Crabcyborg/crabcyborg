import m from 'mithril';
import { Caption, Gist, ShapeUp, TargetShape, Score } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { shapes as optimized } from '$app/shapeup/shapes-optimized';
import { compress, decompress, counter, decounter, optimize } from '$app/shapeup/optimization-helper';

export const title = 'Minimizing a Shape Up Component';

const key = 'BUZZ';
const raw = shapes[key];
const compressed = compress(raw);
const minimized = counter(compressed);
const back_to_raw = decompress(decounter(minimized));
const raw_csv = raw.join(',');
const back_to_raw_csv = back_to_raw.join(',');

const example_url = `https://crabcyb.org/shapeup/${raw_csv}`;
const compressed_url = `https://crabcyb.org/shapeup/${compressed}`;
const counter_url = `https://crabcyb.org/shapeup/${minimized}`;

const small = [255,255,255];
const long = [255,255,255,255,255,255];

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
	"Sure, the url is still pretty big, but we're storing every piece of data required for our entire bumble bee!"

	/*
	"It's fine, I don't expect you to know what Shape Up even is, but if you just look up at the Crab Cyborg logo, or the other five crabs on screen, you should have a good idea of what we're trying to build today. There are going to be a few steps:",
	m(
		'ol',
		[
			'Loading configuration data to determine our main shape',
			'Rendering that shape with Mithrl.js',
			'Randomly determining how to fill in our shape with smaller shapes',
			'Randomly determining a smaller shape as a search target',
			'Rendering that search target, and detecting touch events'
		].map(item => m('li', item))
	),
	m('h3', "Awesome, so what does the configuration look like?"),
	"An array of integers with values from 0-255. The first two numbers represent width and height. The other numbers represent which blocks are filled and which are empty. One number can do this for 8 blocks.",
	"The bigger the object, the more data this is going to take, so to keep the first example simple we will take a look at the configuration for a ruby.",
	m(ShapeOnly, { configuration: shapes.RUBY }),
	m('code', '[8,9, 62,63,191,255,247,241,240,112,16]'),
	"8, by 9, check. But 62? 62 is the sum of 32+16+8+4+2, which as a binary octet looks like 00111110. The first two spaces (128,64) are empty, then 5 (32,16,8,4,2) are filled in, and the last space (1) is empty.",
	m(Gist, {title: 'Computing ShapeUp Configuration Data', id: 'configuration-js', gistId: 'a5150d2d40cbc72f24d5b70814857537'}),
	"This handy code (yes, it uses a bitwise AND operator) takes that configuration data and creates an array (rows) of arrays (cells) containing, at this moment, a color.",
	m(Gist, {title: 'Rendering a Basic ShapeUp Object with Mithril', id: 'mithril-component-js', gistId: '0a04080738c84c6626c034fbde2af00e'}),
	"Mithril makes it really simple to turn that data into a ton of divs, but it's sort of boring. Let's give it some life!",
	m(Gist, {title: 'Render a ShapeUp Object with nested Shapes', id: 'shapeup-js', gistId: '83512d1e66d38821726e60101b8eb996'}),
	"There are a lot of ways you could write this, and I encourage you to play with it yourself as well.",
	"In my example, I try to fill in colors during initial loop where I'm also determining is a space should be filled. This means that the squares to the left and the top will be set, but any future cells are not yet accessible. I randomly pick to check up or left first in order to make my shape more random. As fewer colors become available, I increase the frequency that a color is matched to an adjacent cell, to avoid running out of colors. If I have run out of colors, I collect the unfilled cells and loop through them again, this time looking in all directions for a match.",
	"Now we need to pick a target shape!",
	m(Gist, {title: 'Target Shape Component', id: 'target-shape-js', gistId: '3873b0b78ebbc0e7588b583843fea796'}),
	m('p', "processTargetShapeState() gets called when updateShapeUpComponent() is finished, the two components share a unique key (i), and the ShapeUp component is exposing details about one of its larger shape's colors that it has pre-determined for a Target Shape. This is a little incomplete as it also requires some additional updates to the ShapeUp component, so to get the full picture you might want to refer to ", m('i', '/components/ShapeUp.js'), " for the full implementation"),
	"And then we just need to check for a click!",
	m(Gist, {title: 'ShapeUp Component with Click Listener', id: 'click-listener-js', gistId: 'aefe56910f47c1fa5bdb064785ce2aeb'}),
	"And we have a thing! Go on, click it!",
	m(
		'.relative',
		m(ShapeUp, {i: 'jelly', size, configuration: shapes.JELLY, behaviour: 'click-target'}),
		m(
			'.absolute',
			{
				style: {
					top: 0,
					bottom: 0,
					left: (shapes.JELLY[1]*size + 20)+'px',
					width: (shapes.JELLY[1]*size)+'px',
					border: '1px solid #efefef'
				}
			},
			m(TargetShape, {i: 'jelly', size, style: { top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)' }})
		),
		m(Score, {i: 'jelly', style: { position: 'absolute', left: (shapes.JELLY[1]*size*2 + 40)+'px' }})
	),
	m('h3', "What's Next?"),
	m('p', "Check out ", m('i', '/shapeup/shapes'), " for other config files. There are over 100 shapes, and I'm definitely open to growing that number!")
	*/
];