import m from 'mithril';
import { Caption, Gist, ShapeUp } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import anime from 'animejs/lib/anime.es.js';

export const previous = 'shape-up';

export const title = 'Animating Shape Up with Anime';

export const oninit = () => {
	const grid = [11,63];

	anime({
		targets: '#ben > div > div',
		translateX: anime.stagger(.5, {grid, from: 'center', axis: 'x'}),
		translateY: anime.stagger(.5, {grid, from: 'center', axis: 'y'}),
		rotateZ: anime.stagger([0, 40], {grid, from: 'center', axis: 'x'}),
		delay: anime.stagger(60, {grid, from: 'center'}),
		easing: 'easeInOutQuad',
		direction: 'alternate',
		loop: true
	});
};

export const content = () => [
	"The anime documentation has an example that staggers a grid. Since a Shape Up object is just a grid, this seems too easy to animate.",
	m(
		'div',
		m(ShapeUp, {id: 'ben', configuration: shapes.BEN, size: 6, behaviour: 'blink', blink_delay: 1000}),
		m(
			'.fr',
			{
				style: {
					width: 'calc(100% - '+(shapes.BEN[1]*6 + 10)+'px)',
					marginLeft: '10px'
				}
			},
			m(Gist, {title: 'Animating Ben', id: 'ben-js', gistId: 'f2ce1ce2721dd5c8e84a57788cb9e62c'})
		),
		m(ShapeUp, {configuration: shapes.EARTH, size: 6, behaviour: 'scatter', style: { marginTop: '25px' }}),
		m(Gist, {id: 'scatter-js', gistId: 'cf7089adccf9d42f9917bd968af73c5b'})
	)
];