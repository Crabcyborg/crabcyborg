import m from 'mithril';
import { Monster, ShapeUp, TargetShape, Score, Trigger, Blocky } from '$app/components';
import { config as girooster } from '$app/monsters/girooster';
import { config as lady_tiger } from '$app/monsters/lady-tiger';
import { config as zebrelephant } from '$app/monsters/zebrelephant';
import { bounce } from '$app/animations/zebrelephant';
import { wave } from '$app/animations/girooster';
import { jump } from '$app/animations/lady-tiger';
import { shapes } from '$app/shapeup/shapes';
import { levels } from '$app/blocky/levels';
import { range } from '$app/helpers';
import anime from 'animejs/lib/anime.es.js';

/*
[0].map(
    i => m(ShapeUp, {i, size, configuration: shapes.EARTH, style: { borderRight: '5px solid #fff' }})
),
m(
    'div',
    {
        style: {
            border: '1px solid #eee',
            padding: '20px',
            display: 'inline-block'
        }
    },
    [0].map(i => m(TargetShape, {i, size})),
    m(Caption, "(Hint, you want to click this shape)"),
),
*/

const oncreate = v => {


//	bounce('zebrelephant');
//	wave('girooster');
//	jump('lady-tiger');

	/*
	const grid = [11,63];

	anime({
		targets: '#ben1 > div > div',
		scale: [
			{value: 2, easing: 'easeOutSine', duration: 1500},
			{value: 1, easing: 'easeInOutQuad', duration: 800},
			{value: 3, easing: 'easeInOutQuad', duration: 1200},
			{value: 1, easing: 'easeInOutQuad', duration: 900},
		],
		delay: anime.stagger(100, {grid, from: 'center'}),
		loop: true
	});

	anime({
		targets: '#ben2 > div > div',
		translateX: anime.stagger(1, {grid, from: 'center', axis: 'x'}),
		translateY: anime.stagger(1, {grid, from: 'center', axis: 'y'}),
		rotateZ: anime.stagger([0, 40], {grid, from: 'center', axis: 'x'}),
		delay: anime.stagger(60, {grid, from: 'center'}),
		easing: 'easeInOutQuad',
		direction: 'alternate',
		loop: true
	});
	*/

	/*
	const grid = [ 29, 18 ];
	const randomAxis = () => ['x','y','z'][Math.round(Math.random()*2)];
	const randomStagger = () => Math.random() * 20 - 10;
	const shoot = () => {
		anime({
			targets: '#horse > div > div',
			translateX: anime.stagger(randomStagger(), {grid, from: 'center', axis: randomAxis()}),
			translateY: anime.stagger(randomStagger(), {grid, from: 'center', axis: randomAxis()}),
			complete: shoot
		})
	};
	shoot();
	*/
};

export var Sandbox = {
	oncreate,
	view: v => [
//		m('div', m(Blocky, {level_index: 0})),
//		m('div', m(Blocky, {level_index: 1, display_level_picker: true}))
//		m(ShapeUp, {configuration: shapes.HORSE, size: 6, id: 'horse', style: { margin: '100px 0 0 100px' }}),
//		m(ShapeUp, {id: 'ben2', style: { position: 'absolute', right: '10px' }, configuration: shapes.BEN, size: 6, behaviour: 'blink', blink_delay: 1000}),
//		m('.tc.center.absolute', { style: { top: '250px', left: '80px', height: '200px' } }, m(Monster, {configuration: lady_tiger, id: 'lady-tiger'}))
//		Array.from({length: 6}, (x,i) => i).map(i => m(ShapeUp, {configuration: shapes.HEART, size: 6, behaviour: 'blink', blink_delay: () => Math.random()*1000, style: { marginRight: '5px' }}))
//		m('.tc.center', { style: { height: '220px' } }, m(Monster, {configuration: {...zebrelephant, style: {...zebrelephant.style, left: '', right: '25px'}}, id: 'zebrelephant'})),
//		m('.tc.center', { style: { height: '180px' } }, m(Monster, {configuration: {...girooster, style: {...girooster.style, left: '', right: '45px'}}, id: 'girooster'})),
//		m('.tc.center', { style: { height: '200px' } }, m(Monster, {configuration: lady_tiger, id: 'lady-tiger'}))
	]
};