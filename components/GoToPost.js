import m from 'mithril';

export var GoToPost = {
	oninit: function(v) {
		const { title } = require('$app/posts/'+v.attrs.key);
		v.state = {
			title
		}
	},
	view: function(v) {
		return m('div', m('a', {href: '/post/'+v.attrs.key}, v.attrs.prepend, v.state.title));
	}
};