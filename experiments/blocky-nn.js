import m from 'mithril';
import { Blocky } from '$app/components';
import { injectScript } from '$app/helpers';

const size = 24;
let perceptron;
let rate = 0.5;

const oninit = v => {
	v.state = { vars: {}, ghosty: { x: 0, y: 0, style: {} } };

	injectScript('https://cdnjs.cloudflare.com/ajax/libs/synaptic/1.1.4/synaptic.js', () => {
		perceptron = new synaptic.Architect.Perceptron(2,2,2);
	});
};

const Ghosty = {
	view: v => m('.absolute.unclickable', { style: {...v.attrs.style, color: '#6600cc', opacity: 0.65} }, 'boo')
};

const updateGhosty = v => {
	if(perceptron === undefined) {
		return;
	}

	let { ghosty, vars } = v.state;
	const { width, height } = vars;	
	const input = [ghosty.x/width, ghosty.y/height];
	const output = perceptron.activate(input);
	ghosty.x = output[0]*width;
	ghosty.y = output[1]*height;
	ghosty.style.left = ghosty.x*size+'px';
	ghosty.style.top = ghosty.y*size+'px';
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
					onMovedBlocky: vars => {
						const {old_x, old_y, new_x, new_y, width, height} = vars;
						const input = [old_x/width, old_y/height];
						const output = [new_x/width, new_y/height];
						v.state.vars = { ...vars, input, output };
						perceptron.activate(input);
						perceptron.propagate(rate, output);
						updateGhosty(v);
					}
				}
			),
			m(Ghosty, {style: v.state.ghosty.style}),
			m('div',
				m('input[type=range]', {min: 0.01, max: 1, step: 0.01, value: rate, oninput: e => rate = e.target.value}),
				m('span.cambay.ml3', rate)
			),
			m('p.f7.mt3', { style: { maxWidth: '600px', width: '100%' } }, "I've been learning about Data Science and wanted to try using an Artificial Neural Network with one of my current experiments. Thanks to ", m('a.f7', {href: 'https://caza.la/synaptic', target:'_blank'}, 'synaptic.js'), " it is pretty easy to get a simple perceptron working. When Blocky moves, he sends his new position to the perceptron. Ghosty then sends an input to the same perceptron and determines her new position from the output. They use the same perceptron and they do not communicate to one another but Ghosty still follows Blocky around. I've added a learning rate slider that changes the speed that Ghosty follows at.")
		)
	]
};