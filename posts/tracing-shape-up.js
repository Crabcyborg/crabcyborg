import m from 'mithril';
import { vizsla } from '$app/assets';
import { toLargerRects, trace } from '$app/shapeup/svg-helper';
import { min } from 'min-string';

export const title = 'Tracing a Shape Up Component';

let img;
let canvas_dimensions = false;
let svg_dimensions = {};
let rects = [];
let try_me = '';

const Canvas = {
	oncreate: v => {
		const context = document.getElementById('target').getContext('2d');
		context.drawImage(img, 0, 0);
		const d = context.getImageData(0, 0, canvas_dimensions.width, canvas_dimensions.height);

		let { cells, configuration, dimensions } = trace(d);

		const raw = configuration;

		configuration = min.compress(configuration);

		try_me = `/shapeup/${configuration}`;

		const normalized_size = d.width / Math.max(dimensions.width, dimensions.height);

		svg_dimensions.width = dimensions.width * normalized_size;
		svg_dimensions.height = dimensions.height * normalized_size;

		rects = toLargerRects(cells, normalized_size);

		m.redraw();
	},
	view: v => m('canvas#target', canvas_dimensions)
};

export const oninit = () => {
	img = new Image();
	img.crossOrigin = 'anonymous';
	img.onload = function() {
		canvas_dimensions = { width: this.width, height: this.height };
		m.redraw();
	};
	img.src = vizsla;
};

export const content = () => [
	"Actually drawing all of these levels can be pretty time consuming, so I decided to programmatically trace images for level data instead.",
	canvas_dimensions && [
		m(Canvas),
		m(
			'svg.mr3',
			{ style: { verticalAlign: 'top' }, ...svg_dimensions },
			rects.map(rect => m('rect', {...rect, stroke: rect.fill}))
		)
	],
	m('p', "This was surprisingly not that difficult. I looked briefly at some code for ", m('a', {href: 'https://github.com/kilobtye/potrace', target: '_blank'}, 'potrace'), ', borrowed a couple of lines of code, and then I just started doing my own thing.'),
	m('p', "There are a few steps:"),
	m(
		'ol',
		[
			'Load the image data',
			'Look at every pixel and determine if that space seems to be "filled"',
			'Take all of those "filled" cells and turn them into a set of unique points, deleting any duplicates to flatten the vertices',
			'Sort the points',
			'Iterate over a subset of the data, measure the distances between points, then determine the mode. Then check if half of that is common as well since there is no guarantee that the most frequent length is actually the smallest',
			'Modify the points to adjust for scale because 1 is nicer to work with',
			'Loop through the points to determine minimum and maximum x and y positions',
			'Loop again at the original image data inside of our determined "safe area", check if the pixel is likely filled again, this time with a slightly different definition of what being filled means'
		].map(item => m('li', item))
	),
	try_me && m('div', m('a', { href: try_me, target: '_blank', style: { fontSize: '.75rem', wordWrap: 'break-word' } }, try_me))
];