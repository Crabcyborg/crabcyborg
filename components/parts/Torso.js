import m from 'mithril';

export var Torso = {
	view: function(v) {
		return m(
			'.relative.dib',
			{ style: v.attrs.style },
			m('img', { src: v.attrs.image })
		);
	}
};