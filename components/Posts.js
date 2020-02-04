import m from 'mithril';
import { GoToPost } from './GoToPost';
import { posts } from '$app/posts';

export var Posts = {
	oninit: function(v) {
		v.state = {
			postSlugs: Object.keys(posts)
		};
	},
	view: function(v) {
		return m(
			'.mt3',
			v.state.postSlugs.map(slug => {
				return m(GoToPost, {key: slug});
			})
		);
	}
};