import m from 'mithril';
import { ShapeUp } from '$app/components';
import { min } from 'min-string';

export var Shape = {
	oninit: v => {
		const { shape } = v.attrs;

		if(shape.indexOf(',') === -1) {
			// compressed
			v.state.configuration = min.decompress(shape);
		} else {
			v.state.configuration = shape.split(',');
		}
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