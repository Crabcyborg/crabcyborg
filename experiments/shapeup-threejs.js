import m from 'mithril';
import { ShapeUp } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { colors } from '$app/shapeup/colors';
import { injectScript } from '$app/helpers';

let scene;
let camera;
let renderer;
let geometry;
let materials;
let cubes;
let cubes_by_key;
let loaded_threejs;
let requestedAnimationFrame = false;

const animate = () => {
	requestAnimationFrame(animate);

	for(let cube of cubes) {
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
	}

	renderer.render(scene, camera);
};

const onLoadedThreeJs = () => {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
	camera.position.z = 10;

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xffffff);
	renderer.setSize(320, 320);

	geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

	document.getElementById('target').appendChild(renderer.domElement);

	let light = new THREE.PointLight(0x404040, 2, 0);
	light.position.set(50, 50, 50);
	scene.add(light);

	light = new THREE.AmbientLight(0x404040, 4);
	scene.add(light);

	materials = [];
	for(let rgb of colors) {
		materials.push(new THREE.MeshStandardMaterial({
			color: parseInt('0x'.concat(rgb.split(',').map(value => parseInt(value).toString(16).padStart(2,'0')).join('')))
		}));
	}

	animate();
	loaded_threejs = true;
};

const oncreate = v => {
	cubes = [];
	cubes_by_key = {};
	loaded_threejs = false;

	injectScript(
		'https://cdnjs.cloudflare.com/ajax/libs/three.js/110/three.min.js',
		onLoadedThreeJs
	);
};

const onUpdate = shapeup => {
	if(!loaded_threejs) {
		setTimeout(() => onUpdate(shapeup), 5);
		return;
	}

	const { grid, width, height } = shapeup.state;
	let cube;
	
	for(let y_index = 0; y_index < height; y_index++) {
		for(let x_index = 0; x_index < width; x_index++) {
			if(grid[y_index][x_index].empty) {
				continue;
			}

			const { color_index, x, y } = grid[y_index][x_index];
			const key = `${x},${y}`;

			if(cubes_by_key[key] === undefined) {
				cube = new THREE.Mesh(geometry, materials[color_index]);
				cube.position.set(x-5, 5-y, 0);
				scene.add(cube);
				cubes_by_key[key] = cube;
				cubes.push(cube);
			} else {
				cube = cubes_by_key[key];
				cube.material = materials[color_index];
			}
		}
	}
};

export var title = 'Rendering Shape Up using three.js';

export var experiment = {
	oncreate,
	view: v => [
		m('#target'),
		m(ShapeUp, {configuration: shapes.APPLE, size: 6, behaviour: 'blink', blink_delay: 1000, onUpdate})
	]
};