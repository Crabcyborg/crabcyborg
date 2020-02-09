import m from 'mithril';
import { GoToPost } from './GoToPost';
import { posts } from '$app/posts';

export var Posts = {
	oninit: v => {
		v.state = {
			postSlugs: Object.keys(posts)
		};
	},
	view: v => v.state.postSlugs.map(slug => m(GoToPost, {key: slug}))
};