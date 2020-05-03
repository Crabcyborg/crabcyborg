;(function() {
"use strict"
let traverse = {
	// Better 32-bit integer hash function: https://burtleburtle.net/bob/hash/integer.html
	hash: n=>(n=61^n^n>>>16,n+=n<<3,n=Math.imul(n,668265261),n^=n>>>15)>>>0,
	// Mulberry32, a fast high quality PRNG: https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
	mb32: s=>t=>(s=s+1831565813|0,t=Math.imul(s^s>>>15,1|s),t=t+Math.imul(t^t>>>7,61|t)^t,(t^t>>>14)>>>0)/2**32,
	// helpers
	details: details => {
		const { height, width, keyed } = details, size = width * height;
		let points = Array(size), indices = [];
		for(let y = 0; y < height; ++y)
			for(let x = 0; x < width; ++x)
				points[keyed[[x,y]]] = [x,y], indices.push(keyed[[x,y]]);

		let response = { ...details, points, indices };
		response.map = callback => t.map(response, callback);
		response.forEach = callback => t.forEach(response, callback);
		response.reduce = (callback, initial_value) => t.reduce(response, callback, initial_value);
		return response;
	},
	key: points => points.reduce((keyed, point, index) => { keyed[point] = index; return keyed; }, points, {}),
	pipe: (...ops) => ops.reduce((a, b) => (height, width) => b(a(height, width))),
	repeat: (method, iterations) => t.pipe(...Array(iterations || 1).fill(method)),
	rotate: method => (height, width) => t.pipe(method, t.swap)(width, height),
	shuffle: (array, seed) => {
		const random = i => t.mb32(t.hash(seed+i))(), index = i => Math.floor(random(i) * (i + 1));
		for(let i = array.length - 1, j = index(i); i > 0; i--, j = index(i)) [array[i], array[j]] = [array[j], array[i]];
		return array;
	},
	triangleSize: (length, type) => {
		let size = 0;
		switch(type) {
			case 'isosceles': while(length > 0) size += length, length -= 2; break;
			case 'right': while(length > 0) size += length--; break;
		}
		return size;
	},
	trim: details => {
		const { keyed, height, width, spike } = details, max_x = width+spike.width, max_y = height+spike.height;
		let indices = [], points = Array(width * height), x, y;

		for(y = spike.height; y < max_y; ++y)
			for(x = spike.width; x < max_x; ++x)
				indices.push(parseInt(keyed[[x,y]]));
		indices.sort((a,b) => a-b);
	
		for(y = spike.height; y < max_y; ++y)
			for(x = spike.width; x < max_x; ++x)
				points[indices.indexOf(keyed[[x,y]])] = [x - spike.width, y - spike.height];

		return k(details, points);
	},
	visualize: (details, options) => {
		let output = [];
		for(let y = 0, row = []; y < details.height; ++y, row = []) {
			for(let x = 0; x < details.width; ++x) row.push(`${details.keyed[[x,y]]}`.padStart(2, '0'));
			output.push(row.join(' '));
		}
		return output.join('\n');
	},
	// iterators
	map: (details, callback) => details.points.map((point, index) => callback({index: details.indices[index], point, x: point[0], y: point[1]}, index)),
	forEach: (details, callback) => details.points.forEach((point, index) => callback({index: details.indices[index], point, x: point[0], y: point[1]}, index)),
	reduce: (details, callback, initial_value) => details.points.reduce((accumulator, point, index) => callback(accumulator, {index: details.indices[index], point, x: point[0], y: point[1]}, index), initial_value),
	// mutations
	alternate: type => details => {
		let keyed = { ...details.keyed };
		switch(type) {
			case 'diagonal':
				const to = details.height + details.width - 1;
				for(let base_y = 1; base_y < to; base_y += 2) {
					for(let x = 0, y = base_y; x < details.width; ++x, y = base_y - x)
						if(x >= 0 && x < details.width && y >= 0 && y < details.height && y < details.width && x < details.height)
							keyed[[x,y]] = details.keyed[[y,x]];
				}
			break;
			case 'horizontal': default:
				for(let y = 1; y < details.height; y += 2)
					for(let x = 0; x < details.width; ++x)
						keyed[[x,y]] = details.keyed[[details.width - x - 1, y]];
			break;
		}		
		return d({ ...details, keyed });
	},
	bounce: details => {
		let size = details.height * details.width, to = Math.floor(size/2), points = [];
		for(let index = 0; index < to; ++index) points.push(details.points[index], details.points[size - index - 1]);
		to < size/2 && (points.push(details.points[to]));
		return k(details, points);
	},
	flip: type => details => {
		let { height, width } = details, keyed = {}, callback;
		switch(type) {
			case 'x': callback = ({x, y}, index) => keyed[[width-x-1, y]] = index; break;
			case 'y': callback = ({x, y}, index) => keyed[[x, height-y-1]] = index; break;
			case 'xy': callback = ({x, y}, index) => keyed[[width-x-1, height-y-1]] = index; break;			
		}
		details.forEach(callback);
		return d({ ...details, keyed });
	},
	fold: details => {
		let keyed = {}, index = 0;
		for(let y = 0; y < details.height; y += 2) {
			if(y < details.height-1)
				for(let x = 0; x < details.width; ++x) keyed[[x,y+1]] = details.indices[index++];
			for(let x = 0; x < details.width; ++x) keyed[[x,y]] = details.indices[index++];
		}
		return d({ ...details, keyed });
	},
	stripe: details => {
		let offsets = [0, Math.ceil(details.height/2) * details.width], keyed = {};
		for(let y = 0; y < details.height; ++y)
			for(let x = 0, offset = offsets[y % 2] + Math.floor(y/2) * details.width; x < details.width; ++x)
				keyed[[x,y]] = details.indices[offset + x];
		return d({ ...details, keyed });
	},
	mutate: method => details => {
		let pattern = method(details.height, details.width), keyed = [];
		t.forEach(details, ({ index, point }) => keyed[ details.points[index] ] = pattern.keyed[point]);
		return d({ ...details, keyed });
	},
	reflect: details => {
		let keyed = {};
		for(let y = 0, index = 0, to = Math.ceil(details.width / 2); y < details.height; ++y) {
			for(let x = to-1; x >= 0; --x) keyed[[x,y]] = details.indices[index++];
			for(let x = details.width - 1; x >= to; --x) keyed[[x,y]] = details.indices[index++];
		}
		return d({ ...details, keyed });
	},
	reposition: details => {
		let length = details.points.length, points = [];
		for(let index = 0; index < length; index += 2) points.push(details.points[index]);
		for(let index = 1; index < length; index += 2) points.push(details.points[index]);
		return k(details, points);
	},
	shift: amount => details => d({ ...details,
		keyed: details.reduce((keyed, { point }, index) => {
			keyed[point] = (index + amount) % details.points.length;
			return keyed;
		}, {})
	}),
	skew: details => {
		let keyed = {}, index = 0;
		for(let y = 0; y < details.height; ++y) {
			const base_x = y % details.width;
			for(let x = base_x; x < details.width; ++x) keyed[[x,y]] = details.indices[index++];
			for(let x = 0; x < base_x; ++x) keyed[[x,y]] = details.indices[index++];
		}
		return d({ ...details, keyed });
	},
	smooth: (type, repeat) => t.repeat(details => {
		const checks_by_type = {
			straight: [[0,-1], [1,0], [0,1], [-1,0]],
			default: [[-1,-1], [0,-1], [1,-1], [1,0], [1,1], [0,1], [-1,1], [-1,0]],
			vertical: [[0,-1], [0,1]],
			horizontal: [[-1,0], [1,0]]
		};
		let keyed = {}, index = 0, checks = checks_by_type[type || 'default'], smallest_gap;
		for(let point of details.points) {
			if(keyed[point] !== undefined) continue;
			keyed[point] = index++, smallest_gap = false;
			for(let check of checks) {
				const check_point = [point[0] + check[0], point[1] + check[1]];
				if(details.keyed[check_point] && !keyed[check_point]) {
					let gap = details.keyed[point] - details.keyed[check_point];
					if(gap === 1) {
						smallest_gap = { gap, check_point };
						break;
					} else if(smallest_gap === false || gap < smallest_gap.gap) smallest_gap = { gap, check_point };
				}
			}
			if(smallest_gap) keyed[smallest_gap.check_point] = index++;
		}
		return d({ ...details, keyed });
	}, repeat),
	split: details => {
		let points = [], to = Math.ceil(details.width / 2);
		for(let iteration of [{x: 0, to}, {x: to, to: details.width}])
			for(let y = 0; y < details.height; ++y)
				for(let x = iteration.x; x < iteration.to; ++x) points.push(details.points[details.keyed[[x,y]]]);
		return k(details, points);
	},
	step: amount => details => {
		let keyed = {}, size = details.height * details.width, remaining = size, used = {};
		for(let index = 0, j = 0; remaining > 0; ++j, --remaining, index = (index + amount) % size) {
			while(used[details.indices[index]]) ++index;
			keyed[details.points[j]] = details.indices[index];
			used[details.indices[index]] = true;
		}
		return d({ ...details, keyed });
	},
	swap: details => {
		let keyed = {};
		for(let [x,y] of details.points) keyed[[y,x]] = details.keyed[[x,y]];
		return d({ ...details, keyed, width: details.height, height: details.width });
	},	
	trade: details => {
        let points = [], to = details.points.length-1;
        for(let index = 0; index < to; index += 2) points.push(details.points[index+1], details.points[index]);
        to < details.points.length && points.push(details.points[to]);
        return k(details, points);
    },
	waterfall: details => {
		let keyed = {};
		for(let x = 0, to = Math.ceil(details.width / 2), index = 0; x <= to; ++x) {
			let right = details.width - x - 1;
			if(right < x) break;
			for(let y = 0; y < details.height; ++y) keyed[[x,y]] = details.indices[index++];
			if(right == x) break;
			for(let y = 0; y < details.height; ++y) keyed[[right,y]] = details.indices[index++];
		}
		return d({ ...details, keyed });
	},
	// methods
	corner: dir => (height, width) => {
		let remaining = height * width, keyed = {};
		switch(dir) {
			case 'in': {
				let x = 0, y = height-1, dir = 'n', index = 0, base_y = 0, base_x = 1;
				while(remaining) {
					switch(dir) {
						case 'n':
							if(y < 0 || keyed[[x,y]]) x = width-1, y = base_y++, dir = 'w';
							else keyed[[x,y]] = index++, --y, remaining--;
						break;
						case 'w':
							if(x < 0 || keyed[[x,y]]) y = height-1, x = base_x++, dir = 'n';
							else keyed[[x,y]] = index++, --x, remaining--;
						break;
					}
				}
			} break;

			case 'out': {
				let x = 0, y = 0, dir = 's', index = 0, base_y = 0, base_x = 1;
				while(remaining) {
					switch(dir) {
						case 's':
							if(y == height || keyed[[x,y]]) x = base_x, y = base_y++, dir = 'e';
							else keyed[[x,y]] = index++, ++y, remaining--;
						break;
						case 'e':
							if(x == width || keyed[[x,y]]) y = base_y, x = base_x++, dir = 's';
							else keyed[[x,y]] = index++, ++x, remaining--;
						break;
					}
				}
			} break;

			case 'crawl': {
				let x = 0, y = height-1, dir = 'n', index = 0, base_y = 0, base_x = 1;
				while(remaining) {
					switch(dir) {
						case 'n':
							if(y < 0 || keyed[[x,y]]) x = base_x, y = base_y++, dir = 'e';
							else keyed[[x,y]] = index++, --y, remaining--;
						break;
						case 'e':
							if(x == width || keyed[[x,y]]) y = height-1, x = base_x++, dir = 'n';
							else keyed[[x,y]] = index++, ++x, remaining--;
						break;
					}
				}
			} break;
		}
		return d({ keyed, height, width });
	},
	diagonal: (height, width) => {
		let keyed = {}, x = 0, y = height-1, remaining = width * height, index = 0;
		while(remaining--) {
			keyed[[x,y]] = index++, ++x, ++y;
			if(x == width || y == height) y -= x + 1, x = 0;
			while(y < 0) ++y, ++x;
		}
		return d({ keyed, height, width });
	},
	diamond: (height, width) => {
		const spike = {
			height: Math.ceil((width-2)/2),
			width: Math.ceil((height-2)/2)
		};
		const diamond = {
			height: height + spike.height*2,
			width: width + spike.width*2,
			size: height * width + t.triangleSize(height-2, 'isosceles') * 2 + t.triangleSize(width-2, 'isosceles') * 2
		};
		let base_x = 0, x = base_x, base_y = Math.floor((diamond.height-1)/2), y = base_y, index = 0, keyed = {}, dir = 'ne', miny = 0;
	
		keyed[[x,y]] = index++;
		while(index < diamond.size) {
			switch(dir) {
				case 'ne': {
					while(x + 1 < diamond.width && y - 1 >= miny && keyed[[x+1,y-1]] === undefined) {
						++x, --y, keyed[[x,y]] = index++;
						if(keyed[[x+1,y]] !== undefined) break;
					}
	
					dir = 'se';
					if(diamond.width % 2 === 0) --y;
				} break;	
				case 'se': {
					while(x + 1 < diamond.width && y + 1 < diamond.height && keyed[[x+1,y+1]] === undefined) {
						++x, ++y, keyed[[x,y]] = index++;
						if(keyed[[x,y+1]] !== undefined) break;
					}
	
					dir = 'sw';
					if(diamond.height % 2 === 0) ++x;
				} break;
				case 'sw': {
					while(x - 1 >= 0 && y + 1 < diamond.height && keyed[[x-1,y+1]] === undefined) {
						--x, ++y, keyed[[x,y]] = index++;
						if(keyed[[x-1,y]] !== undefined) break;
					}
					dir = 'nw';
					if(diamond.width % 2 === 0) ++y;
				} break;
				case 'nw': {
					while(x - 1 >= 0 && y - 1 >= 0 && keyed[[x-1,y-1]] === undefined) {
						--x, --y, keyed[[x,y]] = index++;
						if(keyed[[x,y-1]] !== undefined) break;
					}
	
					dir = 'ne', x = base_x++, y = base_y+1;
				} break;
			}
		}
	
		return t.trim({ keyed, height, width, spike, diamond: { ...diamond, keyed } });
	},
	horizontal: (height, width) => {
		let keyed = {};
		for(let y = 0, index = 0; y < height; ++y)
			for(let x = 0; x < width; ++x, ++index)
				keyed[[x,y]] = index;
		return d({ keyed, height, width });
	},
	pulse: type => (height, width) => {
		let size = height * width, keyed = {}, index = 0, base_x, base_y, base_size, x, y;
		switch(type) {
			case 'corner': {
				base_x = base_y = x = y = 0, base_size = 1, keyed[[x,y]] = index++, ++base_x, ++x, ++base_size;

				let dir = 's', target = base_size, remaining = size - 1, iteration = 0;
				while(remaining) {
					if(x >= 0 && x < width && y >= 0 && y < height) keyed[[x,y]] = index++, --remaining;
		
					if(++iteration === target) {
						switch(dir) {
							case 's': dir = 'w'; break;
							case 'w': x = ++base_x, y = -1, dir = 's', target = ++base_size; break;
						}
						iteration = 0;
					}
		
					switch(dir) {
						case 's': ++y; break;
						case 'w': --x; break;
					}
				}
			} break;
			case 'edge': default: {
				base_x = 2, x = 0, base_y = Math.floor(height/2), y = base_y, base_size = 2 - height % 2, keyed[[x,y]] = index++;
				if(base_size == 2) keyed[[x,y+1]] = index++;
				
				--base_y, --y, --base_size;
				let dir = 'e', remaining = size - index, iteration = 0, target = base_x;
				while(remaining) {
					if(x >= 0 && x < width && y >= 0 && y < height) keyed[[x,y]] = index++, --remaining;
		
					if(++iteration === target) {
						switch(dir) {
							case 'e': dir = 's', target = base_size += 2; break;
							case 's': dir = 'w', target = base_x; break;
							case 'w': x = -1, y = --base_y, dir = 'e', target = ++base_x; break;
						}
						iteration = 0;
					}
		
					switch(dir) {
						case 'e': ++x; break;
						case 's': ++y; break;
						case 'w': --x; break;
					}
				}
			} break;
		}
		return d({ keyed, height, width });
	},
	seed: seed => (height, width) => k({ height, width }, t.shuffle(t.horizontal(height, width).points, seed)),
	spiral: (height, width) => {
		let keyed = {}, x = 0, y = 0, dx = 1, dy = 0, remaining = height * width, maxx = width, maxy = height, minx = -1, miny = -1, index = 0;
		while(remaining--) {
			keyed[[x,y]] = index++, x += dx, y += dy;
			if(x == minx) x += 1, y -= 1, dx = 0, dy = -1, maxy--;
			else if(x == maxx) x -= 1, y += 1, dx = 0, dy = 1, miny++;
			else if(y == miny) x += 1, y += 1, dx = 1, dy = 0, minx++;
			else if(y == maxy) x -= 1, y -= 1, dx = -1, dy = 0, maxx--;
		}
		return d({ keyed, height, width });
	},
	stitch: (height, width) => {
		let dir = 'se', iteration = 0, x = 0, y = 0, keyed = {}, remaining = width * height, index = 0, base_x = 0;
		while(remaining) {
			if(x >= 0 && x < width && y >= 0 && y < height) keyed[[x,y]] = index++, --remaining;
	
			switch(dir) {
				case 'se': ++x; ++y, dir = 'sw'; break;
				case 'sw': --x, ++y, dir = 'se'; break;
			}

			if(y == height)
				if(++iteration % 2 == 0) y = 0, x = base_x += 2, dir = 'se';
				else y = 0, x = base_x + 1, dir = 'sw';
		}
		return d({ keyed, height, width });
	},
	tile: (tile, dir) => (height, width) => {
		let keyed = {}, x, y, base_x = 0, base_y = 0, remaining = height * width, index = 0;
		while(remaining) {
			for(let point of tile.points) {
				x = base_x + point[0], y = base_y + point[1];
				if(x >= 0 && x < width && y >= 0 && y < height) keyed[[x,y]] = index++, --remaining;
			}

			switch(dir) {
				case 'vertical':
					base_y += tile.height;
					if(base_y >= height) base_y = 0, base_x += tile.width;
				break;
				case 'horizontal': default:
					base_x += tile.width;
					if(base_x >= width) base_x = 0, base_y += tile.height;
				break;
			}
		}
		return d({ keyed, height, width });
	},
	triangle: (height, width) => {
		const spike = {
			height: Math.ceil((width-2)/2),
			width: height-1
		};
		const triangle = {
			height: height + spike.height,
			width: width + spike.width*2,
			size: height * width + t.triangleSize(height-1, 'right') * 2 + t.triangleSize(width-2, 'isosceles')
		};
		let base_x = 0, x = base_x, base_y = triangle.height-1, y = base_y, index = 0, keyed = {}, dir = 'ne', miny = 0;
	
		keyed[[x,y]] = index++;
		while(index < triangle.size) {
			switch(dir) {
				case 'ne': {
					while(x + 1 < triangle.width && y - 1 >= miny && keyed[[x+1,y-1]] === undefined) {
						++x, --y, keyed[[x,y]] = index++;
						if(keyed[[x+1,y]] !== undefined) break;
					}
	
					dir = 'se';
					if(triangle.width % 2 === 0) --y;
				} break;
	
				case 'se': {
					while(x + 1 < triangle.width && y + 1 < triangle.height && keyed[[x+1,y+1]] === undefined) {
						++x, ++y, keyed[[x,y]] = index++;
						if(keyed[[x,y+1]] !== undefined) break;
					}
	
					dir = 'ne', x = base_x++, y = triangle.height;
				} break;
			}
		}
	
		return t.trim({ keyed, height, width, spike, triangle: { ...triangle, keyed } });
	}
}, t = traverse, d = t.details, k = (details, points) => d({ ...details, keyed: t.key(points) });

// accessibility
t.vertical = t.rotate(t.horizontal);
t.double = t.tile(t.horizontal(2,2));
t.snake = t.tile({ points: [[0,0], [0,1], [1,1], [1,0]], height: 2, width: 2 });

if(typeof module !== 'undefined') module['exports'] = { traverse };
else window.traverse = traverse;
}());