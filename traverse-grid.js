;(function() {
"use strict"
let traverse = {
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
	triangleSize: (length, type) => {
		let size = 0;
		switch(type) {
			case 'isosceles': while(length > 0) size += length, length -= 2; break;
			case 'right': while(length > 0) size += length--; break;
		}
		return size;
	},
	trim: details => {
		const { keyed, height, width, spike } = details;

		let indices = [];
		for(let y = spike.height; y < height+spike.height; ++y)
			for(let x = spike.width; x < width+spike.width; ++x)
				indices.push(parseInt(keyed[[x,y]]));
		indices.sort((a,b) => a-b);
	
		let points = Array(width * height);
		for(let y = spike.height; y < height+spike.height; ++y)
			for(let x = spike.width; x < width+spike.width; ++x)
				points[indices.indexOf(keyed[[x,y]])] = [x - spike.width, y - spike.height];

		return d({ ...details, keyed: t.key(points) });
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
	map: (details, callback) => details.points.map((point, index) => callback({index: details.indices[index], point})),
	forEach: (details, callback) => details.points.forEach((point, index) => callback({index: details.indices[index], point})),
	reduce: (details, callback, initial_value) => details.points.reduce((accumulator, point, index) => callback(accumulator, {index: details.indices[index], point}, initial_value)),
	// mutations
	alternate: type => details => {
		let keyed = { ...details.keyed };
		switch(type) {
			case 'diagonal':
				const to = details.height + details.width - 1;
				for(let base_y = 1; base_y < to; base_y += 2) {
					for(let x = 0; x < details.width; ++x) {
						let y = base_y - x;
						if(x >= 0 && x < details.width && y >= 0 && y < details.height && y < details.width && x < details.height) keyed[[x,y]] = details.keyed[[y,x]];
					}
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
		const size = details.height * details.width, to = Math.floor(size/2);
		let points = [];
		for(let index = 0; index < to; ++index) points.push(details.points[index], details.points[size - index - 1]);
		to < size/2 && (points.push(details.points[to]));
		return d({ ...details, keyed: t.key(points) });
	},
	flip: type => details => {
		let keyed = {};
		for(let index in details.points) {
			const [x,y] = details.points[index];
			switch(type) {
				case 'x': keyed[[details.width-x-1, y]] = index; break;
				case 'y': keyed[[x, details.height-y-1]] = index; break;
				case 'xy': keyed[[details.width-x-1, details.height-y-1]] = index; break;
			}
		}
		return d({ ...details, keyed });
	},
	stripe: details => {
		let keyed = {}, offset = 0;
		for(let base_y = 0; base_y <= 1; ++base_y, offset -= details.height * details.width)
			for(let y = base_y; y < details.height; y += 2, offset += details.width)
				for(let x = 0; x < details.width; ++x) keyed[[x,y]] = details.keyed[[x,y]] - offset;
		return d({ ...details, keyed });
	},
	mutate: method => details => {
		const pattern = method(details.height, details.width);
		let keyed = [];
		t.forEach(details, ({ index, point }) => keyed[ details.points[index] ] = pattern.keyed[point]);
		return d({ ...details, keyed });
	},
	reflect: details => {
		let keyed = {}, to = Math.ceil(details.width / 2), index = 0;
		for(let y = 0; y < details.height; ++y) {
			for(let x = to-1; x >= 0; --x) keyed[[x,y]] = details.indices[index++];
			for(let x = details.width - 1; x >= to; --x) keyed[[x,y]] = details.indices[index++];
		}
		return d({ ...details, keyed });
	},
	reposition: details => {
		const length = details.points.length;
		let points = [];
		for(let index = 0; index < length; index += 2) points.push(details.points[index]);
		for(let index = 1; index < length; index += 2) points.push(details.points[index]);
		return d({ ...details, keyed: t.key(points) });
	},
	reverse: details => {
		let points = [];
		const length = details.points.length;
		for(let index in details.points) points[length - index - 1] = details.points[index];
		return d({ ...details, keyed: t.key(points) });
	},
	shift: amount => details => {
		let keyed = {}, length = details.points.length;
		for(let point of details.points) keyed[point] = (details.keyed[point] + amount) % length;
		return d({ ...details, keyed });
	},
	skew: details => {
		let keyed = {}, index = 0;
		for(let y = 0; y < details.height; ++y) {
			let base_x = y % details.width;
			for(let x = base_x; x < details.width; ++x) keyed[[x,y]] = details.indices[index++];
			for(let x = 0; x < base_x; ++x) keyed[[x,y]] = details.indices[index++];
		}
		return d({ ...details, keyed });
	},
	smooth: (type, repeat) => t.repeat(details => {
		let keyed = {}, index = 0, checks = type === 'straight' ? [[0,-1], [1,0], [0,1], [-1,0]] : [[-1,-1], [0,-1], [1,-1], [1,0], [1,1], [0,1], [-1,1], [-1,0]], smallest_gap;
		for(let point of details.points) {
			if(keyed[point] !== undefined) continue;
			keyed[point] = index++, smallest_gap = false;
			for(let check of checks) {
				let check_point = [point[0] + check[0], point[1] + check[1]];
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
		for(let y = 0; y < details.height; ++y)
			for(let x = 0; x < to; ++x)
				points.push(details.points[details.keyed[[x,y]]]);
		for(let y = 0; y < details.height; ++y)
			for(let x = to; x < details.width; ++x)
				points.push(details.points[details.keyed[[x,y]]]);
		return d({ ...details, keyed: t.key(points) });
	},
	swap: details => {
		let keyed = {};
		for(let [x,y] of details.points) keyed[[y,x]] = details.keyed[[x,y]];
		return d({ ...details, keyed, width: details.height, height: details.width });
	},
	waterfall: details => {
		let keyed = {}, to = Math.ceil(details.width / 2), index = 0;
		for(let x = 0; x <= to; ++x) {
			let right = details.width - 1 - x;
			if(right < x) break;
			for(let y = 0; y < details.height; ++y) keyed[[x,y]] = details.indices[index++];
			if(right == x) break;
			for(let y = 0; y < details.height; ++y) keyed[[right,y]] = details.indices[index++];
		}
		return d({ ...details, keyed });
	},
	// methods
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
		let keyed = {}, index = 0;
		for(let y = 0; y < height; ++y)
			for(let x = 0; x < width; ++x, ++index)
				keyed[[x,y]] = index;
		return d({ keyed, height, width });
	},
	snake: (height, width) => {
		let dir = 's', x = 0, y = 0, keyed = {}, remaining = width * height, index = 0;
		while(remaining) {
			if(x >= 0 && x < width && y >= 0 && y < height) keyed[[x,y]] = index++, --remaining;
	
			switch(dir) {
				case 's': ++y, dir = 'e1'; break;
				case 'e1': ++x, dir = 'n'; break;
				case 'n': --y, dir = 'e2'; break;
				case 'e2':
					++x, dir = 's';
					if(x >= width) x = 0, y += 2;
				break;
			}
		}
		return d({ keyed, height, width });
	},
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

			if(y == height) {
				if(++iteration % 2 == 0) y = 0, x = base_x += 2, dir = 'se';
				else y = 0, x = base_x + 1, dir = 'sw';
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
}, t = traverse, d = t.details;

// accessibility
t.vertical = t.rotate(t.horizontal);

if(typeof module !== 'undefined') module['exports'] = { traverse };
else window.traverse = traverse;
}());