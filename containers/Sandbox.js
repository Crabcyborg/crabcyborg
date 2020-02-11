import m from 'mithril';
import { Monster } from '$app/components';
import { config as girooster } from '$app/monsters/girooster';
import { config as lady_tiger } from '$app/monsters/lady-tiger';
import { config as zebrelephant } from '$app/monsters/zebrelephant';
import { bounce } from '$app/animations/zebrelephant';
import { wave } from '$app/animations/girooster';
import { jump } from '$app/animations/lady-tiger';
import anime from 'animejs/lib/anime.es.js';

const ononit = () => {
	bounce('zebrelephant');
	wave('girooster');
	jump('lady-tiger');
};

export var Sandbox = {
	oninit: v => setTimeout(ononit, 0),
	view: v => [
		m('.tc.center', { style: { height: '220px' } }, m(Monster, {configuration: {...zebrelephant, style: {...zebrelephant.style, left: '', right: '25px'}}, id: 'zebrelephant'})),
		m('.tc.center', { style: { height: '180px' } }, m(Monster, {configuration: {...girooster, style: {...girooster.style, left: '', right: '45px'}}, id: 'girooster'})),
		m('.tc.center', { style: { height: '200px' } }, m(Monster, {configuration: lady_tiger, id: 'lady-tiger'}))
	]
};