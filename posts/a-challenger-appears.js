import m from 'mithril';
import { config as girooster } from '$app/monsters/girooster';
import { headbang, wave, walk } from '$app/animations/girooster';
import { Caption, Gist, Monster } from '$app/components';
import * as assets from '$app/assets';

export const title = 'A Challenger Appears';

export const oninit = () => {
	wave('wave-target');
	headbang('headbang-target');
	walk('walk-target');
};

girooster.style.bottom = '55px';

let headbanger = {...girooster};
headbanger.style.left = '30px';

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
		m(Monster, {configuration: {...girooster}, id: 'wave-target'})
	),
	m(Caption, 'Wild Girooster appeared!'),
	m(
		'.tc.center.overflow-hidden',
		{
			style: {
				'max-width': '280px',
				height: '180px',
				border: '1px solid #ddd'
			}
		},
		m(Monster, {configuration: headbanger, id: 'headbang-target'})
	),
	m(Caption, 'He loves heavy metal'),
	m(
		'.tc.center.overflow-hidden.relative',
		{
			style: {
				'max-width': '280px',
				height: '180px',
				border: '1px solid #ddd'
			}
		},
		m(
			'img.absolute',
			{
				style: {
					top: 0,
					left: 0,
					right: 0,
					bottom: 0
				},
				src: assets.beach
			}
		),
		m(Monster, {configuration: {...girooster}, id: 'walk-target'})
	),
	m(Caption, 'And walks on the beach!'),
];

export const previous = 'flappy-tiger';