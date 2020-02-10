import m from 'mithril';
import { Monster } from '$app/components';
import { config as girooster } from '$app/monsters/girooster';
import { config as lady_tiger } from '$app/monsters/lady-tiger';
import { config as zebrelephant } from '$app/monsters/zebrelephant';
import anime from 'animejs/lib/anime.es.js';

const ononit = () => {
	anime.timeline({
			loop: true,
			direction: 'alternate',
			easing: 'easeInOutSine',
		}).add({
			targets: '#zebrelephant > *:nth-child(3) > *:nth-child(4)',
			duration: 2400,
			rotate: [35, 15, 35]
		}, 0).add({
			targets: '#zebrelephant > *:nth-child(3) > *:first-child',
			duration: 2400,
			rotate: [-35, 10],
			delay: 5
		}, 0).add({
			targets: '#zebrelephant > *:nth-child(1)',
			rotate: 20,
			duration: 2400,
			delay: 0
		}, 0).add({
			targets: '#zebrelephant > *:nth-child(3) > *:nth-child(2)',
			rotate: 40,
			duration: 2400,
			delay: 0
		}, 0).add({
			targets: '#zebrelephant > *:nth-child(3) > *:nth-child(2) > *:nth-child(2)',
			rotate: [20, -60],
			duration: 2500,
			delay: 0
		}, 0)
};

export var Sandbox = {
	oninit: v => {
		setTimeout(ononit, 0);
	},
	view: v => {
		return [
			m('.tc.center', { style: { height: '220px' } }, m(Monster, {configuration: zebrelephant, id: 'zebrelephant'})),
			m('.tc.center', { style: { height: '180px' } }, m(Monster, {configuration: girooster})),
			m('.tc.center', { style: { height: '200px' } }, m(Monster, {configuration: lady_tiger}))
		];
	}
};