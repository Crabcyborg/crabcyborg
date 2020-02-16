import m from 'mithril';
import { config as girooster } from '$app/monsters/girooster';
import { config as zebrelephant } from '$app/monsters/zebrelephant';
import { Caption, Gist, Monster } from '$app/components';
import { wave } from '$app/animations/girooster';
import { bounce } from '$app/animations/zebrelephant';
import * as assets from '$app/assets';

export const title = 'Using Anime.js';

export const oninit = () => {
	wave('wave-target');
	bounce('bounce-target');
};

export const content = () => [
	"Before we get into any epic crab battles, let's explore an alternative method of handling our animations - using an animation library.",
	"Animation libraries handle all of the complicated details - looping, alternating, delaying, easing. They're a must have.",
	m(
		'.tc.center.overflow-hidden',
		{
			style: { maxWidth: '300px', height: '180px', border: '1px solid #ddd' }
		},
		m(
			Monster,
			{
				id: 'wave-target',
				configuration: {...girooster, style: {...girooster.style, transform: 'scaleX(-1) translateX(76px)'} }
			}
		)
	),
	m(Caption, "Wax on, wax off"),
	m(Gist, {id: 'wave-js', gistId: '4b61f0c00d7558649fac415ff38bb2c0'}),
	m('.tc.center', { style: { height: '260px' } }, m(Monster, {configuration: {...zebrelephant, style: {...zebrelephant.style, left: '', right: '25px'}}, id: 'bounce-target'})),
	m(Gist, {id: 'bounce-js', gistId: '14e8e66ce553fe1a8c116cd51e2db864'}),
	"So much better. Let's never talk about the other way again moving forward.",
];

export const previous = 'a-challenger-appears';