import m from 'mithril';
import { config as lady_tiger } from '$app/monsters/lady-tiger';
import { config as girooster } from '$app/monsters/girooster';

//import { fan, happybaby, typetypetype, walk, wave } from '$app/animations/lady-tiger';
//import { attack, headbang, wave, walk } from '$app/animations/girooster';

import { fan } from '$app/animations/lady-tiger';
import { wave2 } from '$app/animations/girooster';

import { Caption, Gist, Monster } from '$app/components';
import * as assets from '$app/assets';

export const title = 'Crab vs. Giraffe';

export const oninit = () => {
	fan('left');
//	wave2('right');
};

let left = {...lady_tiger};
left.style = {};
left.style.transform = 'translateX(44px)';
left.style.top = '110px';

let right = {...girooster};
//right.style.transform = 'scaleX(-1) translateX(76px)';

export const content = [
	m(
		'.tc.center.overflow-hidden',
		{
			style: {
				maxWidth: '300px',
				height: '320px',
				border: '1px solid #ddd'
			}
		},
		m(Monster, {configuration: left, id: 'left'}),
		m(Monster, {configuration: right, id: 'right'})
	)
];