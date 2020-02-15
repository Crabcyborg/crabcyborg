import m from 'mithril';
import { experiments } from '$app/experiments';

export var Experiment = {
	view: v => m(experiments[v.attrs.slug].experiment)
};