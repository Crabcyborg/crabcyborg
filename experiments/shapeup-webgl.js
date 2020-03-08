import m from 'mithril';
import { ShapeUp } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { colors } from '$app/shapeup/colors';

let canvas = null;
let refactored_colors;
let program;
let gl;
let aspect;
let itemSize;
let size;
let step;

const injectVertexScript = () => {
	let script = document.createElement('script');
	script.id = 'vertex';
	script.type = 'x-shader';
	script.innerHTML = `
		attribute vec2 aVertexPosition;

		void main() {
			gl_Position = vec4(aVertexPosition, 0.0, 1.0);
		}
	`;
	document.body.appendChild(script);
};

const injectFragmentScript = () => {
	const script = document.createElement('script');
	script.id = 'fragment';
	script.type = 'x-shader';
	script.innerHTML = `
		#ifdef GL_ES
		precision highp float;
		#endif
		
		uniform vec4 uColor;
		
		void main() {
			gl_FragColor = uColor;
		}
	`;
	document.body.appendChild(script);
};

const oncreate = () => {
	injectVertexScript();
	injectFragmentScript();

	refactored_colors = [];
	for(let rgb of colors) {
		const [ r,g,b ] = rgb.split(',');
		refactored_colors.push([r/255, g/255, b/255, 1]);
	}

	canvas = document.getElementById('mycanvas');
	gl = canvas.getContext('experimental-webgl');
	program = gl.createProgram();

	itemSize = 2;
	size = 0.075;
	step = size*2;
	aspect = canvas.width / canvas.height;

	const vs = gl.createShader(gl.VERTEX_SHADER);
	const fs = gl.createShader(gl.FRAGMENT_SHADER);

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1, 1, 1, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.shaderSource(vs, document.getElementById('vertex').firstChild.nodeValue);
	gl.compileShader(vs);
	gl.shaderSource(fs, document.getElementById('fragment').firstChild.nodeValue);
	gl.compileShader(fs);
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);
	gl.useProgram(program);
	gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
	gl.enableVertexAttribArray(program.aVertexPosition);

	program.uColor = gl.getUniformLocation(program, "uColor");
	program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
}

const onUpdate = shapeup => {
	if(canvas == null) {
		setTimeout(() => onUpdate(shapeup), 5);
		return;
	}

	const { grid, width, height } = shapeup.state;

	let y_index = 0;
	for(let y = height*step/2; y_index < height; y -= step, y_index++) {
		let x_index = 0;
		for(let x = -width*step/2; x_index < width; x += step, x_index++) {
			let cell = grid[y_index][x_index];

			if(!cell.empty) {
				const vertices = new Float32Array([
					-size+x, size*aspect+y, size+x, size*aspect+y, size+x,-size*aspect+y, // Triangle 1
					-size+x, size*aspect+y, size+x,-size*aspect+y, -size+x,-size*aspect+y // Triangle 2
				]);

				gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
				gl.uniform4fv(program.uColor, refactored_colors[cell.color_index]);
				gl.vertexAttribPointer(program.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0);
				gl.drawArrays(gl.TRIANGLES, 0, vertices.length / itemSize);
			}
		}
	}
};

export var title = 'Rendering Shape Up with WebGL';

export var experiment = {
	oncreate,
	view: v => [
		m('canvas', { id: 'mycanvas', width: 400, height: 400 }),
		m(ShapeUp, {configuration: shapes.SKULL, size: 6, behaviour: 'blink', blink_delay: 1000, onUpdate}),
		m('p.f7.mt3', { style: { maxWidth: '600px', width: '100%' } }, 'The bigger shape is a mirror drawing made with WebGL, based off of the grid details sent on update from the Shape Up component')
	]
};