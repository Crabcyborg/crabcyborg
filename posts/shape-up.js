import m from 'mithril';
import { Caption, Gist, ShapeUp, TargetShape, Cell, Score } from '$app/components';
import { shapes } from '$app/shapeup/shapes';

export const title = 'Recreating Shape Up with Mithril.js';

const targets = [128,64,32,16,8,4,2,1];
const size = 6;

const ShapeOnly = {
	oninit: v => {
		const [ height, width ] = v.attrs.configuration;

		let x = -1, y = -1, data_index = 2, target_index = 0, grid = [];
		while(++y < height) {
			let row = [];

			while(++x < width) {
				let byte = v.attrs.configuration[data_index];

				row.push({ color: (byte & targets[target_index]) === 0 ? '#fff' : '#333' });

				if(target_index++ === 7) {
					++data_index;
					target_index = 0;
				}
			}

			grid.push(row);
			x = -1;
		}

		v.state = { grid };
	},
    view: v => m('.dib.mr2', v.state.grid.map(row => m('div', { style: `height: ${size}px;` }, row.map(cell => m(Cell, {...cell, size})))))
};

export const content = () => [
	[0,1,2,3,4].map(
		i => m(ShapeUp, {i, size, configuration: shapes.CRAB, style: { borderRight: '5px solid #fff' }})
	),
	"It's fine, I don't expect you to know what Shape Up even is, but if you just look up at the Crab Cyborg logo, or the other five crabs on screen, you should have a good idea of what we're trying to build today. There are going to be a few steps:",
	m(
		'ol',
		[
			'Loading configuration data to determine our main shape',
			'Rendering that shape with Mithrl.js',
			'Randomly determining how to fill in our shape with smaller shapes',
			'Randomly determining a smaller shape as a search target',
			'Rendering that search target, and detecting touch events'
		].map(item => m('li', item))
	),
	m('h3', "Awesome, so what does the configuration look like?"),
	"An array of integers with values from 0-255. The first two numbers represent width and height. The other numbers represent which blocks are filled and which are empty. One number can do this for 8 blocks.",
	"The bigger the object, the more data this is going to take, so to keep the first example simple we will take a look at the configuration for a ruby.",
	m(ShapeOnly, { configuration: shapes.RUBY }),
	m('code', '[8,9, 62,63,191,255,247,241,240,112,16]'),
	"8, by 9, check. But 62? 62 is the sum of 32+16+8+4+2, which as a binary octet looks like 00111110. The first two spaces (128,64) are empty, then 5 (32,16,8,4,2) are filled in, and the last space (1) is empty.",
	m(Gist, {title: 'Computing ShapeUp Configuration Data', id: 'configuration-js', gistId: 'a5150d2d40cbc72f24d5b70814857537'}),
	"This handy code (yes, it uses a bitwise AND operator) takes that configuration data and creates an array (rows) of arrays (cells) containing, at this moment, a color.",
	m(Gist, {title: 'Rendering a Basic ShapeUp Object with Mithril.js', id: 'mithril-component-js', gistId: '0a04080738c84c6626c034fbde2af00e'}),
	"Mithril makes it really simple to turn that data into a ton of divs, but it's sort of boring. Let's give it some life!",
	m(Gist, {title: 'Render a ShapeUp Object with nested Shapes', id: 'shapeup-js', gistId: '979191a7e0cf14a3a44277a3f00c5538'}),
	"There are a lot of ways you could write this, and I encourage you to play with it yourself as well.",
	"In my example, I try to fill in colors during initial loop where I'm also determining is a space should be filled. This means that the squares to the left and the top will be set, but any future cells are not yet accessible. I randomly pick to check up or left first in order to make my shape more random. As fewer colors become available, I increase the frequency that a color is matched to an adjacent cell, to avoid running out of colors. If I have run out of colors, I collect the unfilled cells and loop through them again, this time looking in all directions for a match.",
	"Now we need to pick a target shape!",
	m(Gist, {title: 'Target Shape Component', id: 'target-shape-js', gistId: '3873b0b78ebbc0e7588b583843fea796'}),
	m('p', "processTargetShapeState() gets called when updateShapeUpComponent() is finished, the two components share a unique key (i), and the ShapeUp component is exposing details about one of its larger shape's colors that it has pre-determined for a Target Shape. This is a little incomplete as it also requires some additional updates to the ShapeUp component, so to get the full picture you might want to refer to ", m('i', '/components/ShapeUp.js'), " for the full implementation"),
	"And then we just need to check for a click!",
	m(Gist, {title: 'ShapeUp Component with Click Listener', id: 'click-listener-js', gistId: 'aefe56910f47c1fa5bdb064785ce2aeb'}),
	"And we have a thing! Go on, click it!",
	m(
		'.relative',
		m(ShapeUp, {i: 'jelly', size, configuration: shapes.JELLY, behaviour: 'click-target'}),
		m(
			'.absolute',
			{
				style: {
					top: 0,
					bottom: 0,
					left: (shapes.JELLY[1]*size + 20)+'px',
					width: (shapes.JELLY[1]*size)+'px',
					border: '1px solid #efefef'
				}
			},
			m(TargetShape, {i: 'jelly', size, style: { top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)' }})
		),
		m(Score, {i: 'jelly', style: { position: 'absolute', left: (shapes.JELLY[1]*size*2 + 40)+'px' }})
	),
	m('h3', "What's Next?"),
	m('p', "Check out ", m('i', '/shapeup/shapes'), " for other config files. There are over 100 shapes, and I'm definitely open to growing that number!")
];

export const next = 'shape-up-anime';