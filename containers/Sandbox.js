import m from 'mithril';
import { Monster } from '$app/components';
import { config as lady_tiger } from '$app/monsters/lady-tiger';

//const h = (tag, attrs, ...kids) => '<'+tag+Object.keys(attrs || {}).reduce( (s,i) => `${s} ${h.esc(i)}="${h.esc(attrs[i]+'')}"`,'')+'>'+[].concat(...kids).join('')+'</'+tag+'>';
//	m.trust(h('div', {}, 'test').replace(/</g, '&lt;').replace(/>/g, '&gt;'))

/*
const lerp = (v0, v1, t) => {
    return v0*(1-t)+v1*t;
};
*/

export var Sandbox = {
	view: v => {
		return m('.tc.demo.center', m(Monster, {configuration: lady_tiger}));
	}
};