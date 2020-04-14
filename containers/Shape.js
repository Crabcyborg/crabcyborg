import m from 'mithril';
import { ShapeUp } from '$app/components';
import { offOn } from '$app/shapeup/optimization-helper';
import { min } from 'min-string';

export var Shape = {
	oninit: v => {
		let { shape } = v.attrs;
		const on_off = shape[0] === '|';
		on_off && (shape = shape.substr(1));
		let configuration = shape.indexOf(',') === -1 ? min.decompress(shape) : shape.split(',');
		v.state.configuration = on_off ? offOn(configuration) : configuration;
	},
	view: v => m(
		ShapeUp,
		{
			size: Math.min(8, Math.floor(320 / v.state.configuration[1])),
			configuration: v.state.configuration,
			behaviour: 'blink',
			blink_delay: 500
		}
	)
};