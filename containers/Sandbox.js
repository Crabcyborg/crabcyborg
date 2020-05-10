import m from 'mithril';
import { min } from 'min-string';
import { traverse as t } from 'traverse-grid';

const oninit = v => {

};

export var Sandbox = {
	oninit,
	view: v => [
		[
			m('p', 'Hello World')
		]
	]
};