import m from 'mithril';
import { config as challenger } from '$app/monsters/challenger';
import { wave } from '$app/animations/challenger';
import { Caption, Gist, Monster } from '$app/components';
import * as assets from '$app/assets';

export const title = 'A Challenger Appears';

export const oninit = () => {
	wave('challenger');
};

export const content = [
	m(
		'.tc.center.overflow-hidden',
		{
			style: {
				'max-width': '600px',
				height: '300px',
				border: '1px solid #ddd'
			}
		},
		m(Monster, {configuration: {...challenger}, id: 'challenger'})
	),
];

export const previous = 'flappy-tiger';