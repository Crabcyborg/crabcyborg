import m from 'mithril';
import { Trigger } from '$app/components';
import { experiments } from '$app/experiments';

export var GoToExperiment = {
	view: v => m(
		Trigger,
		{
			onclick: () => m.route.set('/experiment/:slug/', {slug: v.attrs.key, key: Date.now()})
		},
		v.attrs.prepend,
		experiments[v.attrs.key].title
	)
};