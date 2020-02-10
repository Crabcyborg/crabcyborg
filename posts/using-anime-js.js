import m from 'mithril';
import { config as girooster } from '$app/monsters/girooster';
import { Caption, Gist, Monster } from '$app/components';
import anime from 'animejs/lib/anime.es.js';
import * as assets from '$app/assets';

export const title = 'Using Anime.js';

const wave = id => anime.timeline({
		direction: 'alternate',
		duration: 1400,
		loop: true,
		easing: 'easeInOutSine'
	}).add({
		targets: '#'+id,
		translateX: [65, 70]
	}).add({
		targets: '#'+id+' > *:nth-child(3) > *:last-child',
		duration: 2200,
		rotate: [-60, -40, -65, -45, -70, 5, 0, 5],
		transformOrigin: '10% 10%'
	}, 0).add({
		targets: '#'+id+' > *:nth-child(3) > *:not(:last-child)',
		rotate: [0, 5],
		transformOrigin: '50% 10%'
	}, 0);

export const oninit = () => {
	wave('wave-target');
};

export const content = [
	"Before we get into any epic crab battles, let's explore an alternative method of handling our animations - using an animation library.",
	"Animation libraries handle all of the complicated details - looping, alternating, delaying, easing. They're a must have.",
	m(
		'.tc.center.overflow-hidden',
		{
			style: {
				maxWidth: '300px',
				height: '180px',
				border: '1px solid #ddd'
			}
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
	"So much better. Let's never talk about the other way again moving forward."
];

export const previous = 'a-challenger-appears';