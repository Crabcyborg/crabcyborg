import m from 'mithril';
import { GoToExperiment } from './GoToExperiment';
import { experiments } from '$app/experiments';

export var Experiments = {
	oninit: v => v.state = { slugs: Object.keys(experiments) },
	view: v => v.state.slugs.map(slug => m('div', m(GoToExperiment, {key: slug})))
};