import anime from 'animejs/lib/anime.es.js';

export const wave = id => anime.timeline({
		direction: 'alternate',
		duration: 1400,
		loop: true,
		easing: 'easeInOutSine'
	}).add({
		targets: '#'+id,
		translateX: [65, 70]
	}, 0).add({
		targets: '#'+id+' > *:nth-child(3) > *:last-child',
		rotate: [-70, -30, -75],
		transformOrigin: '10% 10%',
		delay: 100
	}, 0).add({
		targets: '#'+id+' > *:nth-child(3) > *:not(:last-child)',
		rotate: [0, 5],
		transformOrigin: '50% 10%'
	}, 0);