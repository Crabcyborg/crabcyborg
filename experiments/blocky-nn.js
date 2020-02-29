import m from 'mithril';
import { Blocky } from '$app/components';
import { injectScript } from '$app/helpers';

const size = 24;
let perceptron;

const oninit = v => {
	v.state = { vars: {}, ghosty: { style: {} } };

	injectScript('https://cdnjs.cloudflare.com/ajax/libs/synaptic/1.1.4/synaptic.js', () => {
		perceptron = new synaptic.Architect.Perceptron(2,2,2);
	});
};

const Ghosty = {
	view: v => m('.absolute.unclickable', { style: v.attrs.style }, 'boo')
};

const updateGhosty = v => {
	const { width, height } = v.state.vars;	
	const input = [(v.state.ghosty.x || 0)/width, (v.state.ghosty.y || 0)/height];
	const output = perceptron.activate(input);
	v.state.ghosty.x = output[0]*width;
	v.state.ghosty.y = output[1]*height;
	v.state.ghosty.style.left = v.state.ghosty.x*size+'px';
	v.state.ghosty.style.top = v.state.ghosty.y*size+'px';
};

export var title = 'Blocky with an Artificial Neural Network';

export var experiment = {
	oninit,
	view: v => [
		m(
			'.relative',
			m(
				Blocky,
				{
					level_index: 0,
					size,
					onInitialize: blocky => {
						v.state.ghosty.x = v.state.ghosty.y = 0;
					},
					onMovedBlocky: vars => {
						const {old_x, old_y, new_x, new_y, width, height} = vars;
						const input = [old_x/width, old_y/height];
						const output = [new_x/width, new_y/height];
						v.state.vars = { ...vars, input, output };
						perceptron.propagate(0.5, output);
						updateGhosty(v);
					}
				}
			),
			m(Ghosty, {style: v.state.ghosty.style}),
			m('p.f7.mt3', { style: { maxWidth: '600px', width: '100%' } }, "I've been learning about Data Science and wanted to try using an Artificial Neural Network with one of my current experiments. Thanks to synaptic JS it is pretty easy to get a simple Proceptron working. Ghosty learns where to move by setting the points before and after Blocky moves, then using its own points determines where to move. Blocky sends input to the Proceptron and Ghosty uses the Proceptron to determine its outputs but the two components don't know of one another's existence. It's not much, but it was fun.")
		)
	]
};