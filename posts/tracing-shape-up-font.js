import m from 'mithril';
import { toLargerRects, trace } from '$app/shapeup/svg-helper';
import { optimize, substitute } from '$app/shapeup/optimization-helper';

export const title = 'Tracing a Font as a Shape Up Component';

let canvas_dimensions = { width: 525, height: 95 };
let svg_dimensions = false;
let rects = [];
let try_me = '';

const flatten = (image, background) => {
	for(let i = 0; i < image.data.length; i += 4) {
		let alpha = image.data[i + 3];
		let inverse_alpha = 255 - alpha;
		image.data[i] = (alpha * image.data[i] + inverse_alpha * background[0]) / 255;
		image.data[i + 1] = (alpha * image.data[i + 1] + inverse_alpha * background[1]) / 255;
		image.data[i + 2] = (alpha * image.data[i + 2] + inverse_alpha * background[2]) / 255;
		image.data[i + 3] = 0xff;
	}

	return image;
}

const Canvas = {
	oncreate: v => {
		const context = document.getElementById('target').getContext('2d');		
		context.font = '100px Arial';
		context.fillText('Hello World', 5, 85);
		
		let d = context.getImageData(0, 0, canvas_dimensions.width, canvas_dimensions.height);
		d = flatten(d, [ 0xff, 0xff, 0xff ]);

		let { cells, configuration, dimensions } = trace(d);

		configuration = substitute(optimize(configuration));
		try_me = `/shapeup/${configuration}`;

		const normalized_size = d.width / Math.max(dimensions.width, dimensions.height);

		svg_dimensions = {
			width: dimensions.width * normalized_size,
			height: dimensions.height * normalized_size
		};

		rects = toLargerRects(cells, normalized_size);

		setTimeout(m.redraw, 0);
	},
	view: v => m('canvas#target', canvas_dimensions)
};

export const content = () => [
	m(Canvas),
	svg_dimensions && m(
		'svg.mr3',
		{ style: { verticalAlign: 'top' }, ...svg_dimensions },
		rects.map(rect => m('rect', {...rect, stroke: rect.fill}))
	),
	try_me && m('.mt2', m('a', { href: try_me, target: '_blank', style: { fontSize: '.75rem', wordWrap: 'break-word' } }, try_me))
];