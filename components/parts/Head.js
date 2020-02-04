import m from 'mithril';
import { Antlers } from './Antlers';

export var Head = {
	view: function(v) {
		return m(
			'.relative',
			{style: {...v.attrs.style}},
			m('img', {src: v.attrs.image}),
			m(Antlers, {...v.attrs.antlers}),
		);
	}
};