import m from 'mithril';
import { posts } from '$app/posts';
import { GoToPost, Logo, Monster } from '$app/components';

export var Post = {
	oninit: v => {
		const postId = m.route.get().replace('/post/', '');
		const post = posts[postId];
		const { title, content } = post;		

		v.state = {
			title,
			content,
			previous: post.previous || false,
			next: post.next || false
		};
	
		post.oninit && setTimeout(post.oninit, 0);
	},
	view: v => [
		m(Logo),
		m(
			'div',
			v.state.previous && m(GoToPost, {prepend: 'Previous: ', key: v.state.previous}),
			m('h2', v.state.title),
			v.state.content.map(item => {
				if(typeof item === 'string') {
					return m('p', item);
				}

				if(typeof item.tag !== 'undefined' || Array.isArray(item)) {
					// return as a regular mithril component
					return item;
				}

				// if item isn't a string, monster config is assumed and wrapped in a box
				return m('.tc.demo.center.overflow-hidden', m(Monster, {id: item.id, configuration: item}));
			}),
			v.state.next && m(GoToPost, {prepend: 'Next: ', key: v.state.next})
		)
	]
};