import m from 'mithril';
import { Home, Sandbox, Post, Experiment } from '$app/containers';

m.route.prefix('');
m.route(
	document.getElementById('container'),
	'/',
	{
		'/': Home,
		'/sandbox': Sandbox,
		'/post/:slug': Post,
		'/experiment/:slug': Experiment
	}
);