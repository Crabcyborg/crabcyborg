import m from 'mithril';

export var Tail = {
	view: function(v) {
		return m(
			'.absolute',
			{ style: v.attrs.style },
			m('div', m('img', { src: v.attrs.image }))
		);
	}
};