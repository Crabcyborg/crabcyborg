import m from 'mithril';

export var Caption = {
	view: function(v) {
		return m('p.gray.f7.mt1.tc.center', {style: 'max-width: 320px;'}, v.children);
	}
};