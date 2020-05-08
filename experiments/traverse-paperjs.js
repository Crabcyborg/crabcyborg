import m from 'mithril';
import { ShapeUp } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { refactorColors } from '$app/shapeup/colors';
import { injectScript } from '$app/helpers';
import { toPolygons } from '$app/shapeup/svg-helper';
import { traverse as t } from 'traverse-grid';
import { methods } from '$app/shapeup/optimization-helper';

const size = 30;

let colors = refactorColors('#ffffff');
let loaded_paper = false;
let points;

const oncreate = () => {	
	injectScript(
		'https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.2/paper-core.min.js',
		() => {
			loaded_paper = true;
			m.redraw();
		}
	);
};

export var title = 'Visualizing traverse-grid with Paper.js';

const Visualization = {
	oncreate: v => {
		paper.setup(v.dom);
		let path = new paper.Path();
		path.strokeColor = 'black';
		path.strokeWidth = 5;
		v.attrs.method(5,5).forEach(({x,y}) => path.add(new paper.Point(x*size+size, y*size+size)));
		path.smooth();
	},
	view: v => m(`canvas#${v.attrs.id}`, { width: 200, height: 200 })
};

export var experiment = {
	oncreate,
	view: v => loaded_paper && [
		m(Visualization, { id: 'horizontal', method: t.horizontal }),
		m(Visualization, { id: 'vertical', method: t.vertical }),
		m(Visualization, { id: 'alternate', method: t.pipe(t.horizontal, t.alternate()) }),
		m(Visualization, { id: 'alternate-diagonal', method: t.pipe(t.horizontal, t.alternate('diagonal')) }),
		m(Visualization, { id: 'snake', method: t.snake }),
		m(Visualization, { id: 'double', method: t.double }),
		m(Visualization, { id: 'waterfall', method: t.pipe(t.horizontal, t.waterfall) }),
		m(Visualization, { id: 'spiral', method: t.spiral }),
		m(Visualization, { id: 'diamond', method: t.diamond }),
		m(Visualization, { id: 'triangle', method: t.triangle }),
		m(Visualization, { id: 'reposition', method: t.pipe(t.horizontal, t.reposition) }),
		m(Visualization, { id: 'bounce', method: t.pipe(t.horizontal, t.bounce) }),
		m(Visualization, { id: 'reflect', method: t.pipe(t.horizontal, t.reflect) }),
		m(Visualization, { id: 'fold', method: t.pipe(t.horizontal, t.fold) }),
		m(Visualization, { id: 'stripe', method: t.pipe(t.horizontal, t.stripe) }),
		m(Visualization, { id: 'trade', method: t.pipe(t.horizontal, t.trade) }),
		m(Visualization, { id: 'skew', method: t.pipe(t.horizontal, t.skew) }),
		m(Visualization, { id: 'step-2', method: t.pipe(t.horizontal, t.step(2)) }),
		m(Visualization, { id: 'step-3', method: t.pipe(t.horizontal, t.step(3)) }),
		m(Visualization, { id: 'step-4', method: t.pipe(t.horizontal, t.step(4)) }),
		m(Visualization, { id: 'shift-10', method: t.pipe(t.horizontal, t.shift(10)) }),
		m(Visualization, { id: 'smooth', method: t.pipe(t.horizontal, t.smooth()) }),
		m(Visualization, { id: 'split', method: t.pipe(t.horizontal, t.split) }),
		m(Visualization, { id: 'climb', method: t.climb }),
		m(Visualization, { id: 'cascade', method: t.cascade }),
		m(Visualization, { id: 'fan', method: t.fan }),
		m(Visualization, { id: 'stitch', method: t.stitch }),
		m(Visualization, { id: 'diagonal', method: t.diagonal }),
		m(Visualization, { id: 'corner-in', method: t.corner('in') }),
		m(Visualization, { id: 'corner-out', method: t.corner('out') }),
		m(Visualization, { id: 'corner-crawl', method: t.corner('crawl') }),
		m(Visualization, { id: 'pulse-edge', method: t.pulse('edge') }),
		m(Visualization, { id: 'pulse-corner', method: t.pulse('corner') }),
		m(Visualization, { id: 'seed-48374873847394234', method: t.seed(48374873847394234) }),
		m(Visualization, { id: 'smooth-straight', method: t.pipe(t.horizontal, t.smooth('straight')) }),
		m(Visualization, { id: 'watertile-1', method: methods.watertile }),
		m(Visualization, { id: 'watertile-2', method: methods.watertile2 }),
		m(Visualization, { id: 'watertile-3', method: methods.watertile3 }),
		m(Visualization, { id: 'smooth-straight-10', method: t.pipe(t.horizontal, t.smooth('straight', 10)) })
	]
};