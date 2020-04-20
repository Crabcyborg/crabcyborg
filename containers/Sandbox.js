import m from 'mithril';
import { ShapeUp } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { mirror, half, bestMethod } from '$app/shapeup/optimization-helper';
import { min } from 'min-string';

let mirror_key = 'PINK';

const oninit = v => {	
	let keys = Object.keys(shapes);
	for(let key_index = 0; key_index < keys.length; ++key_index) {
		let key = keys[key_index];
		let shape = shapes[key];
		console.log({key, ...bestMethod(shape)});
	};
};

export var Sandbox = {
	oninit,
	view: v => [
		[
			m('p', 'Hello World'),
			m('div', m(ShapeUp, {configuration: shapes.NECK, size: 5})),
			m('div', m(ShapeUp, {configuration: mirror(shapes.NECK), size: 5})),
			m('div', m(ShapeUp, {configuration: half(shapes[mirror_key]), size: 5})),
			m('div', m(ShapeUp, {configuration: mirror(half(shapes[mirror_key]), true), size: 5})),
			m('p', half(shapes[mirror_key]).join(','))
		]
	]
};