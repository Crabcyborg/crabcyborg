import m from 'mithril';
import { config as challenger } from '$app/monsters/girooster';
import { wave } from '$app/animations/girooster';
import { Caption, Gist, Monster } from '$app/components';
import * as assets from '$app/assets';

export const title = 'A Challenger Appears';

export const oninit = () => {
	wave('challenger');
};

challenger.style.bottom = '55px';

export const content = [
	m(
		'.tc.center.overflow-hidden',
		{
			style: {
				'max-width': '280px',
				height: '180px',
				border: '1px solid #ddd'
			}
		},
		m(Monster, {configuration: {...challenger}, id: 'challenger'})
	),
	m(Caption, 'Wild Girooster appeared!')
];

export const previous = 'flappy-tiger';