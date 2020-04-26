import m from 'mithril';
import { ShapeUp } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import {  } from '$app/shapeup/optimization-helper';
import { min } from 'min-string';
import { traverse as t } from '$app/traverse-grid';

const oninit = v => {

};

export var Sandbox = {
	oninit,
	view: v => [
		[
			m('p', 'Hello World'),
			'horizontal',
			m('pre.mono', t.pipe(t.horizontal, t.visualize)(5,5)),
			'vertical',
			m('pre.mono', t.pipe(t.vertical, t.visualize)(5,5)),
			'diagonal',
			m('pre.mono', t.pipe(t.diagonal, t.visualize)(5,5)),
			'spiral',
			m('pre.mono', t.pipe(t.spiral, t.visualize)(5,5)),
			'diamond',
			m('pre.mono', t.pipe(t.diamond, t.visualize)(5,5)),
			'snake',
			m('pre.mono', t.pipe(t.snake, t.visualize)(5,5)),
			'triangle',
			m('pre.mono', t.pipe(t.triangle, t.visualize)(5,5)),
			m('pre.mono', t.map(t.pipe(t.spiral, t.flipxy)(5,5), ({ index, point }) => point.join(',')).join('\n'))
		]
	]
};