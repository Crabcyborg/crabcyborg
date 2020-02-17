import m from 'mithril';
import { Blocky } from '$app/components';

export var title = 'Blocky';

export var experiment = {
	view: v => [
		m('div', m(Blocky, {level_index: 0})),
		m('div', m(Blocky, {level_index: 1, display_level_picker: true}))
	]
};