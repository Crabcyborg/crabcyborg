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

const shape = shapes.BUZZ;
const compressed = compress(shape);
const decompressed = decompress(compressed);
const shape_csv = shape.join(',');
const decompressed_csv = decompressed.join(',');
const counter_optimized = counter(compressed);
const counter_decompressed = decounter(counter_optimized);

export var Sandbox = {
	oninit,
	view: v => [
		[
			m('p', 'Hello World'),
			m('p', { style: { wordWrap: 'break-word' } }, 'raw ', shape_csv),
			m('p', { style: { wordWrap: 'break-word' } }, 'compressed ', compressed),
//			m('p', { style: { wordWrap: 'break-word' } }, 'decompressed ', decompressed_csv),
			m('p', { style: { wordWrap: 'break-word' } }, 'counter ', counter_optimized),
//			m('p', { style: { wordWrap: 'break-word' } }, 'counter decompressed ', counter_decompressed),
			m('p', 'match ', shape_csv === decompressed_csv ? 't':'f'),
			m('p', 'counter match ', compressed === counter_decompressed ? 't':'f'),
			m('p', 'savings ', Math.round(shape_csv.length / compressed.length * 100)/100, 'x smaller'),
			m('p', 'counter savings ', Math.round(compressed.length / counter_optimized.length * 100)/100, 'x smaller'),
			m('p', 'overall savings ', Math.round(shape_csv.length / counter_optimized.length * 100)/100, 'x smaller')
		]
	]
};