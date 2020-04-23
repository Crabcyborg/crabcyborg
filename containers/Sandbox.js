import m from 'mithril';
import { ShapeUp } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { bestMethod, onOffSpiral, repositionBase49Limit, onOffDiamond } from '$app/shapeup/optimization-helper';
import { min } from 'min-string';

const oninit = v => {

	let keys = Object.keys(shapes);
	for(let key_index = 0; key_index < keys.length; ++key_index) {
		let key = keys[key_index];
		let shape = shapes[key];
		console.log({key, ...bestMethod(shape)});
	};

	let raw = min.decompress('20A9zMYe!fLL23zU');
	console.log('A Diamond', bestMethod(raw));

	const on_off_spiral = onOffSpiral(shapes.DONUT);

	const spiral = repositionBase49Limit(on_off_spiral);

	/*
	onOffDiamond(2, 2);
	onOffDiamond(3, 3);
	onOffDiamond(4, 4);
	onOffDiamond(5, 5);
	onOffDiamond(6, 6);
	onOffDiamond(7, 7);
	onOffDiamond(2, 3);
	onOffDiamond(2, 4);
	onOffDiamond(3, 2);
	onOffDiamond(4, 2);
	*/
};

export var Sandbox = {
	oninit,
	view: v => [
		[
			m('p', 'Hello World'),
			m('div', m(ShapeUp, {configuration: min.decompress('20A9zMYe!fLL23zU'), size: 14}))
		]
	]
};