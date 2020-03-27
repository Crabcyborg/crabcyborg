import m from 'mithril';
import { ShapeUp } from '$app/components';
import { raw } from '$app/shapeup/optimization-helper';

export var Shape = {
	oninit: v => {
		const { shape } = v.attrs;

		if(shape.indexOf(',') === -1) {
			// compressed
			v.state.configuration = raw(shape);
		} else {
			v.state.configuration = shape.split(',');
		}
	},
	view: v => m(ShapeUp, {size: 10, configuration: v.state.configuration, behaviour: 'blink', blink_delay: 500})
};