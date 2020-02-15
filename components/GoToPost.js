import m from 'mithril';
import { Trigger } from '$app/components';
import { posts } from '$app/posts';

export var GoToPost = {
	view: v => m(
		Trigger,
		{
			onclick: () => m.route.set('/post/:slug/', {slug: v.attrs.key, key: Date.now()}),
			style: {
				display: 'block'
			}
		},
		v.attrs.prepend,
		posts[v.attrs.key].title
	)
};