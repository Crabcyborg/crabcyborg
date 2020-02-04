import m from 'mithril';
import { Foot } from '$app/components/parts';

export var Leg = {
	view: function(v) {
		return m(
			'.dib.relative',
			{style: v.attrs.style},
			m(
				'div',
				m('img', {src: v.attrs.image}),
				m(Foot, v.attrs.foot)
			)
		);
	}
};