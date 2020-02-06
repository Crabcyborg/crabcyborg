import m from 'mithril';

export var Wing = {
	view: function(v) {
		return m(
			'.absolute',
			{ style: v.attrs.style },
			m('div', m('img', { src: v.attrs.image }))
		);
	}
};