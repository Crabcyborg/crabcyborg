import m from 'mithril';
import { ShapeUp } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { injectScript } from '$app/helpers';
import { toLargerRects } from '$app/shapeup/svg-helper';

let matter_loaded = false;
let engine;
let rects;

const circleSize = 10;
const options = {width: 800, height: 400, wireframes: false, background: '#fff'};
const particleOptions = {friction: 0.05, frictionStatic: 0.1, render: { visible: true }};
const constraintOptions = {render: { visible: false }};
const wallOptions = {isStatic: true, render: { fillStyle: '#fff' }};

const oncreate = () => injectScript(
	'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.14.2/matter.min.js',
	() => {
		// create engine
		engine = Matter.Engine.create();

		// create renderer
		const render = Matter.Render.create({element: document.getElementById('target'), engine, options});

		Matter.Engine.run(engine);
		Matter.Render.run(render);
		matter_loaded = true;
	}
);

const draw = () => {
	Matter.World.clear(engine.world);

	Matter.World.add(engine.world, [
		Matter.Bodies.rectangle(400, 0, 810, 30, wallOptions),
		Matter.Bodies.rectangle(400, 400, 810, 30, wallOptions),
		Matter.Bodies.rectangle(800, 200, 30, 420, wallOptions),
		Matter.Bodies.rectangle(0, 200, 30, 420, wallOptions)
	]);

	for(let rect of rects) {
		particleOptions.render.fillStyle = rect.fill;
		Matter.World.add(
			engine.world,
			Matter.Composites.softBody((rect.x+2)*circleSize, (rect.y+2)*circleSize, rect.width, rect.height, 0, 0, true, circleSize/2, particleOptions, constraintOptions)
		);
	}
};

export var title = 'Rendering Shape Up using matter.js';

export var experiment = {
	oncreate,
	view: v => [
		[
			m('#target'),
			m(ShapeUp, {configuration: shapes.EARTH, size: 6, behaviour: 'blink', blink_delay: 2000, onUpdate: shapeup => {
				const filtered = shapeup.state.grid.flat().filter(cell => !cell.empty);
				rects = toLargerRects(filtered, 1);
				matter_loaded && draw();
			}})
		]
	]
};