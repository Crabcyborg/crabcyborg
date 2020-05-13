import m from 'mithril';
import { min } from 'min-string';
import { shapes } from '$app/shapeup/shapes';
import { refactorColors } from '$app/shapeup/colors';
import { traverse as t } from 'traverse-grid';
import { flatten, applyOnOff, applyOffOn, methods } from '$app/shapeup/optimization-helper';

const Draw = {
	oninit: v => {
		let { method, getMethod, shape, size } = v.attrs;

		const colors = refactorColors('#ffffff');
		const [ height, width ] = shape;
		const limit = height*width;

		let flat, points, index, color;

		v.state.rects = [];
		v.state.height = height;
		v.state.width = width;

		const draw = () => v.state.interval = setInterval(() => {
			const [x, y] = points[index];
			if(flat[index]) {
				v.state.rects.push({x: x*size, y: y*size, width: size, height: size, fill: color});
				v.attrs.redraw && m.redraw();
				++index === limit && reset();
			} else {
				while(!flat[++index]) {
					if(index === limit) {
						reset();
						break;
					}
				}
			}
		}, v.attrs.delay);

		const reset = () => {
			if(getMethod) {
				const payload = getMethod();
				v.state.id = payload.id;
				method = payload.method;
			}

			clearInterval(v.state.interval);
			index = 0;
			points = method(height, width).points;
			flat = flatten(applyOffOn(applyOnOff(shape, method), t.horizontal));

			setTimeout(() => {
				color = colors[Math.floor(Math.random() * colors.length)];
				v.state.rects = [];
				draw();
			}, 1000);
		};

		reset();
	},
	onremove: v => clearInterval(v.state.interval),
	view: v => m('.dib.mr3.tc',
		m('svg', { height: v.state.height*v.attrs.size, width: v.state.width*v.attrs.size }, v.state.rects.map(rect => m('rect', rect))),
		m('p.mb0.mt0.tc.break.f7', { style: { width: '140px', height: '100px', margin: '0 auto' } }, v.state.id)
	)
};

const randomMethod = () => {
	const selection = [
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
//		{ id: 'cascade', method: t.cascade },
		{ id: 'fan', method: t.fan },
		{ id: 'stitch', method: t.stitch },
		{ id: 'diagonal', method: t.diagonal },
		{ id: 'corner-in', method: t.corner('in') },
		{ id: 'corner-out', method: t.corner('out') },
		{ id: 'corner-crawl', method: t.corner('crawl') },
//		{ id: 'pulse-edge', method: t.pulse('edge') },
//		{ id: 'pulse-corner', method: t.pulse('corner') },
		{ id: 'seed-48374873847394234', method: t.seed(48374873847394234) },
		{ id: 'smooth-straight', method: t.pipe(t.horizontal, t.smooth('straight')) },
		{ id: 'watertile-1', method: methods.watertile },
		{ id: 'watertile-2', method: methods.watertile2 },
		{ id: 'watertile-3', method: methods.watertile3 },
		{ id: 'smooth-straight-10', method: t.pipe(t.horizontal, t.smooth('straight', 10)) },
		{ id: 'stitch-alternate', method: (height, width) => t.tile(t.stitch(height,2).concatenate(t.pipe(t.stitch, t.flip('y'))(height,2), 'horizontal'))(height, width) },
		{ id: 'snake-3', method: t.tile({ points: [[0,0], [0,1], [0,2], [1,2], [1,1], [1,0]], height: 3, width: 2 }) },
		{ id: 'triple', method: t.tile(t.horizontal(3,3)) },
		{ id: 'alternate-2', method: (height, width) => t.tile(t.horizontal(2,width).concatenate(t.pipe(t.horizontal, t.flip('x'))(2,width), 'vertical'))(height, width) },
//		{ id: 'bounce-2', method: methods.bounce2 },
//		{ id: 'bounce-3', method: methods.bounce3 },
		{ id: 'cascade-3', method: methods.cascade3 },
		{ id: 'cascade-4', method: methods.cascade4 },
		{ id: 'skew-2', method: methods.skew2 },
		{ id: 'skew-3', method: methods.skew3 },
		{ id: 'reposition-2', method: methods.reposition2 },
		{ id: 'reposition-3', method: methods.reposition3 },
		{ id: 'leap', method: methods.leap },
		{ id: 'donut', method: methods.donut },
		{ id: 'swirl', method: methods.swirl },
		{ id: 'clover', method: methods.clover },
		{ id: 'bacon', method: methods.bacon },
		{ id: 'watertile-alternate-reposition', method: t.pipe(methods.watertile, t.alternate(), t.reposition) },
//		{ id: 'cascade-alternate', method: t.pipe(t.cascade, t.swap, t.alternate(), t.swap) },
		{ id: 'bow', method: t.pipe(t.diamond, t.reflect) },
		{ id: 'bounce-reflect-reposition', method: t.pipe(methods.bounce, t.reflect, t.reposition) },
		{ id: 'snake-alternate', method: methods.snake_alternate },
		{ id: 'slide', method: methods.slide },
		{ id: 'waterfall-spiral', method: t.pipe(t.horizontal, t.waterfall, t.mutate(t.spiral)) },
		{ id: 'cinnamon-roll', method: methods.cinnamon_roll }
	];
	return selection[Math.floor(Math.random() * selection.length)];
};

const delay = 20, size = 4;
export var title = 'Drawing a Shape Up Component with traverse-grid';

export var experiment = {
	oninit: v => v.state.interval = setInterval(m.redraw, delay),
	onremove: v => clearInterval(v.state.interval),
	view: v => [
		m(Draw, { shape: shapes.NY, getMethod: randomMethod, delay, size, redraw: false }),
		m(Draw, { shape: shapes.TRUNK, getMethod: randomMethod, delay, size, redraw: false }),
		m(Draw, { shape: shapes.BUZZ, getMethod: randomMethod, delay, size, redraw: false }),
		m(Draw, { shape: shapes.BRAIN, getMethod: randomMethod, delay, size, redraw: false }),
		m(Draw, { shape: shapes.NECK, getMethod: randomMethod, delay, size, redraw: false }),
		m(Draw, { shape: shapes.DEER, getMethod: randomMethod, delay, size, redraw: false }),
	]
};