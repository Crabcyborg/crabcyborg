import m from 'mithril';
import { injectScript } from '$app/helpers';
import { traverse as t } from 'traverse-grid';
import { methods } from '$app/shapeup/optimization-helper';

const size = 30, width = 180, height = 180;
let loaded_paper = false;

const oncreate = v => injectScript('https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.2/paper-core.min.js', () => {
	loaded_paper = true;
	m.redraw();
});

export var title = 'Visualizing traverse-grid with Paper.js';

const Visualization = {
	oncreate: v => {
		paper.setup(document.getElementById(v.attrs.id));
		let path = new paper.Path();
		path.strokeColor = 'black', path.strokeWidth = 5;
		v.attrs.method(5,5).forEach(({x,y}) => path.add(new paper.Point(x*size+size, y*size+size)));
		path.smooth();
	},
	view: v => m('.fl', m(`canvas#${v.attrs.id}`, { width, height }), m('p.mb0.mt0.tc', v.attrs.id.replace(/-/g, ' ')))
};

export var experiment = {
	oninit: v => {
		v.state.visualizations = [
			{ id: 'horizontal', method: t.horizontal },
			{ id: 'vertical', method: t.vertical },
			{ id: 'alternate', method: t.pipe(t.horizontal, t.alternate()) },
			{ id: 'alternate-diagonal', method: t.pipe(t.horizontal, t.alternate('diagonal')) },
			{ id: 'snake', method: t.snake },
			{ id: 'double', method: t.double },
			{ id: 'waterfall', method: t.pipe(t.horizontal, t.waterfall) },
			{ id: 'spiral', method: t.spiral },
			{ id: 'diamond', method: t.diamond },
			{ id: 'triangle', method: t.triangle },
			{ id: 'reposition', method: t.pipe(t.horizontal, t.reposition) },
			{ id: 'bounce', method: t.pipe(t.horizontal, t.bounce) },
			{ id: 'reflect', method: t.pipe(t.horizontal, t.reflect) },
			{ id: 'fold', method: t.pipe(t.horizontal, t.fold) },
			{ id: 'stripe', method: t.pipe(t.horizontal, t.stripe) },
			{ id: 'trade', method: t.pipe(t.horizontal, t.trade) },
			{ id: 'skew', method: t.pipe(t.horizontal, t.skew) },
			{ id: 'step-2', method: t.pipe(t.horizontal, t.step(2)) },
			{ id: 'step-3', method: t.pipe(t.horizontal, t.step(3)) },
			{ id: 'step-4', method: t.pipe(t.horizontal, t.step(4)) },
			{ id: 'shift-10', method: t.pipe(t.horizontal, t.shift(10)) },
			{ id: 'smooth', method: t.pipe(t.horizontal, t.smooth()) },
			{ id: 'split', method: t.pipe(t.horizontal, t.split) },
			{ id: 'climb', method: t.climb },
			{ id: 'cascade', method: t.cascade },
			{ id: 'fan', method: t.fan },
			{ id: 'stitch', method: t.stitch },
			{ id: 'diagonal', method: t.diagonal },
			{ id: 'corner-in', method: t.corner('in') },
			{ id: 'corner-out', method: t.corner('out') },
			{ id: 'corner-crawl', method: t.corner('crawl') },
			{ id: 'pulse-edge', method: t.pulse('edge') },
			{ id: 'pulse-corner', method: t.pulse('corner') },
			{ id: 'seed-48374873847394234', method: t.seed(48374873847394234) },
			{ id: 'smooth-straight', method: t.pipe(t.horizontal, t.smooth('straight')) },
			{ id: 'watertile-1', method: methods.watertile },
			{ id: 'watertile-2', method: methods.watertile2 },
			{ id: 'watertile-3', method: methods.watertile3 },
			{ id: 'smooth-straight-10', method: t.pipe(t.horizontal, t.smooth('straight', 10)) }
		 ];
	},
	oncreate,
	view: v => loaded_paper && v.state.visualizations.map(attrs => m(Visualization, attrs))
};