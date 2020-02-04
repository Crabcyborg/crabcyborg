import m from 'mithril';
import { Head, Leg, Torso, Tail } from '$app/components/parts';

export var Monster = {
	view: function(v) {
		return m(
			'.dib.f7.monster',
			{ id: v.attrs.id },
			m(Head, {...v.attrs.configuration.head}),
			m('.midsection.h3', m(Torso, {...v.attrs.configuration.torso})),
			m('.lowersection.tc.relative', m(Tail, v.attrs.configuration.tail), v.attrs.configuration.legs.map(leg => m(Leg, leg)))
		);
	}
};