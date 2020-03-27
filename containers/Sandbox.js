import m from 'mithril';
import { shapes } from '$app/shapeup/shapes';
import { compress, decompress, counter, decounter, optimize } from '$app/shapeup/optimization-helper';

const oninit = v => {
	/*
	// this generates shapes-optimized from current data in shapes
	const keys = Object.keys(shapes);

	let output = ['export const shapes = {'];

	for(let key of keys) {
		let shape = shapes[key];
		let optimized = optimize(shape);
		output.push(`\t${key}: "${optimized}",`);
	}

	output.push('};');
	console.log(output.join('\n'));
	*/
};

export var Sandbox = {
	oninit,
	view: v => [
		[
			m('p', 'Hello World')
		]
	]
};