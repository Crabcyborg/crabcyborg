import m from 'mithril';

export var Caption = {
	view: v => m('p.gray.f7.mt1.tc.center', {style: 'max-width: 320px;'}, v.children)
};