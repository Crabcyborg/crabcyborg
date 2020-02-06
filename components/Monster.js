import m from 'mithril';
import { Head, Leg, Torso, Tail, Wing } from './parts';

export var Monster = {
	view: function(v) {
		return m(
			'.dib.f7.monster',
			{ id: v.attrs.id, style: v.attrs.configuration.style },
			m(Head, {...v.attrs.configuration.head}),
			m('.midsection.h3', m(Torso, {...v.attrs.configuration.torso}),  v.attrs.configuration.wings ? v.attrs.configuration.wings.map(wing => m(Wing, wing)) : false),
			m('.lowersection.tc.relative', m(Tail, v.attrs.configuration.tail), v.attrs.configuration.legs.map(leg => m(Leg, leg)))
		);
	}
};