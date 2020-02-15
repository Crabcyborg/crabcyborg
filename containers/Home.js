import m from 'mithril';
import { Logo, Posts, Experiments, Trigger } from '$app/components';

const github = 'https://github.com/Crabcyborg/crabcyborg';

export var Home = {
	view: v => [
		m(Logo),
		m('h3', "Welcome to Crab Cyborg!"),
		m('p', 'This entire website is open source (', m('a', { href: github, target: '_blank' }, github), ') and built on ', m('a', { href: 'https://mithril.js.org/' }, 'mithril.js.')),
		m('p', "This is an experimental blog/tutorial series, where we start by putting together our very own public domain Frankenstein."),
		m('h4.mb0', 'Here are the posts:'),
		m(Posts),
		m('h4.mb0', 'Here are the experiments:'),
		m(Experiments),
		m(
			Trigger,
			{
				style: { marginTop: '25px' },
				onclick: () => m.route.set('/sandbox')
			},
			'Or go to the Sandbox'
		)
	]
};