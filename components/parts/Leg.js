import m from 'mithril';
import { Foot } from './Foot';

export var Leg = {
	view: function(v) {
		return m(
			'.dib.relative',
			{style: v.attrs.style},
			m('img', {src: v.attrs.image}),
			m(Foot, v.attrs.foot)
		);
	}
};