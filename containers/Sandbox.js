import m from 'mithril';
import { shapes } from '$app/shapeup/shapes';
import { shapes as optimized } from '$app/shapeup/shapes-optimized';
import { optimize } from '$app/shapeup/optimization-helper';

const oninit = v => {
	/*
	// this generates optimized-optimized from current data in optimized
	const keys = Object.keys(optimized);

	let output = ['export const optimized = {'];

	for(let key of keys) {
		let shape = optimized[key];
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