import m from 'mithril';
import { Caption, Gist } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { colors } from '$app/shapeup/colors';

export const title = 'Recreating Shape Up with Mithril.js';

export const oninit = () => {

};

const size = 6;

const Cell = {
	view: v => m(
		'div',
		{
			style: { width: `${size}px`, height: `${size}px`, backgroundColor: v.attrs.color, float: 'left' }
		}
	)
};

const targets = [128,64,32,16,8,4,2,1];

const shuffle = a => {
	let j, x, i;
	for(i = a.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = a[i];
		a[i] = a[j];
		a[j] = x;
	}

	return a;
}

const rand = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const ShapeUp = {
	oninit: v => {
		const [ height, width ] = v.attrs.configuration;
		const data = v.attrs.configuration.slice(2);
		const use_colors = shuffle(colors);

		let x = 0, y = 0, data_index = 0, target_index = 0, color_index = 0, grid = [], unassigned = [];
		while(y++ < height) {
			let row = [];

			while(x++ < width) {
				let byte = data[data_index];

				if((byte & targets[target_index]) === 0) {
					// empty space
					row.push({ empty: true, unassigned: false, color: '#efefef' });
				} else {
					let use_color_index = false;
					
					if(grid.length && rand(1,3) === 1) {
						// try up
						let previous_row = grid[grid.length-1];
						let cell = previous_row[x-1];
						!cell.empty && !cell.unassigned && (use_color_index = cell.color_index);
					} else if(x > 1 && rand(1,2) === 1) {
						// try left
						let cell = row[x-2];
						!cell.empty && !cell.unassigned && (use_color_index = cell.color_index);
					}

					let skip = false;
					if(!use_color_index) {
						use_color_index = color_index++;

						if(color_index >= colors.length) {
							let obj = {
								empty: false,
								unassigned: true,
								x: x-1,
								y: y-1,
								color: 'red'
							};

							unassigned.push(obj);
							row.push(obj);
							skip = true;
						}
					}

					!skip && row.push({
						empty: false,
						unassigned: false,
						color_index: use_color_index,
						color: 'rgb('+use_colors[use_color_index]+')'
					});
				}

				if(target_index++ === 7) {
					++data_index;
					target_index = 0;
				}
			}

			grid.push(row);
			x = 0;
		}

		let tries = 0;
	
		do {
			let still_unassigned = [];

			for(let obj of unassigned) {
				if(obj.x > 1) {
					let cell = grid[obj.y][obj.x-1];
					if(!cell.empty && !cell.unassigned) {
						obj.color_index = cell.color_index;
						obj.color = 'rgb('+use_colors[obj.color_index]+')';
						obj.unassigned = false;
						continue;
					}
				}
				
				if(obj.y > 1) {
					let cell = grid[obj.y-1][obj.x];
					if(!cell.empty && !cell.unassigned) {
						obj.color_index = cell.color_index;
						obj.color = 'rgb('+use_colors[obj.color_index]+')';
						obj.unassigned = false;
						continue;
					}
				}

				if(obj.x+1 < width) {
					let cell = grid[obj.y][obj.x+1];
					if(!cell.empty && !cell.unassigned) {
						obj.color_index = cell.color_index;
						obj.color = 'rgb('+use_colors[obj.color_index]+')';
						obj.unassigned = false;
						continue;
					}
				}

				if(obj.y+1 < height) {
					let cell = grid[obj.y+1][obj.x];
					if(!cell.empty && !cell.unassigned) {
						obj.color_index = cell.color_index;
						obj.color = 'rgb('+use_colors[obj.color_index]+')';
						obj.unassigned = false;
						continue;
					}
				}

				still_unassigned.push(obj);
			}

			unassigned = still_unassigned;
		} while(++tries < 4 && unassigned.length);

		v.state = { width, height, grid };
	},
	view: v => m('div', v.state.grid.map(row => m('div', { style: `height: ${size}px;` }, row.map(cell => m(Cell, cell)))))
};

export const content = [
//	m(ShapeUp, { configuration: shapes.SPADE }),
//	m(ShapeUp, { configuration: shapes.HEEL }),
//	m(ShapeUp, { configuration: shapes.BUZZ }),
	m(ShapeUp, { configuration: shapes.TREE }),
	"It's fine, I don't expect you to know what Shape Up even is, but if you just look up at the Crab Cyborg logo you should have a good idea of what we're trying to build today. There are going to be a few steps:",
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
//	m(ShapeUp, { configuration: shapes.RUBY }),
	m('code', '[8,9, 62,63,191,255,247,241,240,112,16]'),
	"8, by 9, check. But 62? 62 is the sum of 32+16+8+4+2, which as a binary octet looks like 00111110. The first two spaces (128,64) are empty, then 5 (32,16,8,4,2) are filled in, and the last space (1) is empty.",
	m(Gist, {id: 'configuration-js', gistId: 'a5150d2d40cbc72f24d5b70814857537'}),
	"This handy code (yes, it uses a bitwise AND operator) takes that configuration data and creates an array (rows) of arrays (cells) containing, at this moment, a color.",
	m(Gist, {id: 'mithril-component-js', gistId: '0a04080738c84c6626c034fbde2af00e'}),
	"Mithril makes it really simple to turn that data into a ton of divs."
];