import m from 'mithril';

const RelativePart = {
	view: v => m('.relative', { style: v.attrs.style }, m('img', { src: v.attrs.image }), v.children)
};

const AbsolutePart = {
	view: v => m('.absolute', { style: v.attrs.style }, m('img', { src: v.attrs.image }))
};

const Torso = {
	view: v => m(RelativePart, { style: {...v.attrs.style, display: 'inline-block'}, image: v.attrs.image })
};

const Antlers = AbsolutePart;
const Head = {
	view: v => m(RelativePart, { style: v.attrs.style, image: v.attrs.image }, m(Antlers, v.attrs.antlers))
};

const Leg = {
	view: v => m(
		RelativePart,
		{ style: {...v.attrs.style, display: 'inline-block'}, image: v.attrs.image },
		v.attrs.foot && m('img.relative', { style: v.attrs.foot.style, src: v.attrs.foot.image })
	)
};

const Tail = AbsolutePart;
const Wing = AbsolutePart;

export var Monster = {
	view: v => m(
		'.dib.f7.monster',
		{ id: v.attrs.id, style: v.attrs.configuration.style },
		m(Head, v.attrs.configuration.head),
		m('.midsection.h3', m(Torso, {...v.attrs.configuration.torso}), v.attrs.configuration.wings && v.attrs.configuration.wings.map(wing => m(Wing, wing))),
		m('.lowersection.tc.relative', m(Tail, v.attrs.configuration.tail), v.attrs.configuration.legs.map(leg => m(Leg, leg)))
	)
};