import m from 'mithril';

export var Caption = {
	view: v => m('p.gray.f7.mt1.tc.center', {style: { maxWidth: '320px'}}, v.children)
};