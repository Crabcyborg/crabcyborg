import m from 'mithril';
import { Caption, Gist } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { colors } from '$app/shapeup/colors';

import anime from 'animejs/lib/anime.es.js';

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
    view: v => m('.dib.mr2', v.state.grid.map(row => m('div', { style: `height: ${size}px;` }, row.map(cell => m(Cell, cell)))))
};

const ShapeUp = {
	oninit: v => {
		const [ height, width ] = v.attrs.configuration;
		const use_colors = shuffle(colors);
		let x = -1, y = -1, data_index = 2, target_index = 0, color_index = 0, grid = [], unassigned = [];
		let random_target = 0.3;
		let count_by_color = {}, coordinates_by_color = {};

		const getColor = index => `rgb(${use_colors[index]})`;

		const assign = (target, adjacent) => {
			if(adjacent.empty || adjacent.unassigned) {
				return false;
			}

			target.color_index = adjacent.color_index;
			target.color = getColor(target.color_index);
			count_by_color[target.color]++;
			coordinates_by_color[target.color].push({x: target.x, y: target.y});
			target.unassigned = false;
			return true;
		};

		while(++y < height) {
			let row = [];

			while(++x < width) {
				let obj = {x,y};
				let byte = v.attrs.configuration[data_index];
				obj.empty = (byte & targets[target_index]) === 0;

				if(obj.empty) {
					obj.color = '#fff';
					row.push(obj);
				} else {
					obj.unassigned = true;

					let checks = [];
					grid.length && checks.push('up');
					x > 0 && checks.push('left');
					checks.length > 1 && Math.random() < .5 && (checks = [checks[1], checks[0]]);

					for(let check of checks) {
						if(Math.random() > random_target) {
							continue;
						}

						let cell;
						switch(check) {
							case 'up': cell = grid[grid.length-1][x]; break;
							case 'left': cell = row[x-1]; break;
						}

						if(assign(obj, cell)) {
							break;
						}
					}

					if(obj.unassigned) {
						obj.color_index = color_index++;
						obj.color_index % 5 === 0 && (random_target = Math.max(random_target + .5, .9));

						if(obj.color_index >= colors.length) {
							delete obj.color_index;
							obj.color = '#000';
							unassigned.push(obj);
						} else {
							obj.color = getColor(obj.color_index);
							count_by_color[obj.color] = 1;
							coordinates_by_color[obj.color] = [{x: obj.x, y: obj.y}];
							obj.unassigned = false;
						}
					}

					row.push(obj);
				}

				if(target_index++ === 7) {
					++data_index;
					target_index = 0;
				}
			}

			grid.push(row);
			x = -1;
		}

		let tries = 0;
		while(unassigned.length && tries++ < 10) {
			unassigned = unassigned.filter(obj => {
				let checks = [];
				obj.x > 1 && checks.push(grid[obj.y][obj.x-1]);
				obj.y > 1 && checks.push(grid[obj.y-1][obj.x]);
				obj.x+1 < width && checks.push(grid[obj.y][obj.x+1]);
				obj.y+1 < height && checks.push(grid[obj.y+1][obj.x]);

				while(checks.length) {
					let random_index = Math.floor(Math.random()*checks.length);
					let check = checks.splice(random_index, 1);

					if(assign(obj, check)) {
						return true;
					}
				}

				return false;
			});
		}

		var color_keys = Object.keys(count_by_color);
		var highest = 0;
		var highest_color;
		for(let color of color_keys) {
			if(count_by_color[color] > highest) {
				highest_color = color;
				highest = count_by_color[color];

				// randomly quit early to avoid only picking the largest object
				if(highest > 10 && Math.random() < .25) {
					break;
				}
			}
		}

		console.log(highest_color);
		console.log(coordinates_by_color[highest_color]);

		v.state = { width, height, grid, highest_color };

		setTimeout(() => {

			/*
			anime({
				targets: '#crab1 > div > div',
				scale: [
				  {value: .1, easing: 'easeOutSine', duration: 500},
				  {value: 1, easing: 'easeInOutQuad', duration: 1200}
				],
				delay: anime.stagger(200, {grid: [13, 13], from: 'center'})
			});
			*/

			/*
			anime({
				targets: '#crab1 > div > div',
				translateX: anime.stagger(10, {grid: [13, 13], from: 'center', axis: 'x'}),
				translateY: anime.stagger(10, {grid: [13, 13], from: 'center', axis: 'y'}),
				rotateZ: anime.stagger([0, 90], {grid: [13, 13], from: 'center', axis: 'x'}),
				delay: anime.stagger(200, {grid: [13, 13], from: 'center'}),
				easing: 'easeInOutQuad'
			});
			*/

		}, 0);
	},
	view: v => m('.dib', { id: v.attrs.id, style: v.attrs.style }, v.state.grid.map(row => m('div', { style: `height: ${size}px;` }, row.map(cell => m(Cell, cell)))))
};

const borderRight = {style: { borderRight: '5px solid #fff' }};

export const content = [
	[{...borderRight, id: 'crab1'}, borderRight, borderRight, borderRight, {}].map(attrs => m(ShapeUp, { ...attrs, configuration: shapes.CRAB })),
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
	m(Gist, {id: 'configuration-js', gistId: 'a5150d2d40cbc72f24d5b70814857537'}),
	"This handy code (yes, it uses a bitwise AND operator) takes that configuration data and creates an array (rows) of arrays (cells) containing, at this moment, a color.",
	m(Gist, {id: 'mithril-component-js', gistId: '0a04080738c84c6626c034fbde2af00e'}),
	"Mithril makes it really simple to turn that data into a ton of divs, but it's sort of boring. Let's give it some life!",
	m(Gist, {id: 'shapeup-js', gistId: '979191a7e0cf14a3a44277a3f00c5538'}),
	"There are a lot of ways you could write this, and I encourage you to play with it yourself as well.",
	"In my example, I try to fill in colors during initial loop where I'm also determining is a space should be filled. This means that the squares to the left and the top will be set, but any future cells are not yet accessible. I randomly pick to check up or left first in order to make my shape more random. As fewer colors become available, I increase the frequency that a color is matched to an adjacent cell, to avoid running out of colors. If I have run out of colors, I collect the unfilled cells and loop through them again, this time looking in all directions for a match.",
	"Now we need to pick a target shape!"
];