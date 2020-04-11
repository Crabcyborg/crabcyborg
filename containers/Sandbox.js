import m from 'mithril';
import { shapes } from '$app/shapeup/shapes';
import { injectScript } from '$app/helpers';

const oninit = v => {

};

export var Sandbox = {
	oninit,
	view: v => [
		[
			m('p', 'Hello World')
		]
	]
};