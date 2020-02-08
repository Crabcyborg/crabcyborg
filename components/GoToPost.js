import m from 'mithril';
import { posts } from '$app/posts';

export var GoToPost = {
	view: v => m('div', m('a', { href: '/post/'+v.attrs.key }, v.attrs.prepend, posts[v.attrs.key].title))
};