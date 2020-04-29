import m from 'mithril';
import { ShapeUp } from '$app/components';
import { handleString } from '$app/shapeup/optimization-helper';

export var Shape = {
	oninit: v => {
		const configuration = handleString(v.attrs.shape), size = Math.min(8, Math.floor(320 / configuration[1]));
		v.state = { configuration, size };
	},
	view: v => m(
		ShapeUp,
		{
			size: v.state.size,
			configuration: v.state.configuration,
			behaviour: 'blink',
			blink_delay: 500
		}
	)
};