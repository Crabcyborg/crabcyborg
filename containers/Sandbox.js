import m from 'mithril';
import { ShapeUp } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import {  } from '$app/shapeup/optimization-helper';
import { min } from 'min-string';

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