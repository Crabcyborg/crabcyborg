import m from 'mithril';
import { Logo, Posts } from '$app/components';

export var Home = {
	view: function(v) {
		return [
			m(Logo),
			m(Posts)
		];
	}
};