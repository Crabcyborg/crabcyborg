import m from 'mithril';

export var Trigger = {
	view: v => m(
		'.cambay.dib',
		{
			style: {
				cursor: 'pointer',
				color: '#3424c9',
				fontSize: '.9rem',
				...v.attrs.style
			},
			onclick: v.attrs.onclick
		},
		v.children
	)
};