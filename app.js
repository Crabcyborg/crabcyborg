import m from 'mithril';
import { Home, Sandbox, Post } from '$app/containers';

m.route(
	document.getElementById('container'),
	'/',
	{
		'/': Home,
		'/sandbox': Sandbox,
		'/post/:slug': Post
	}
);