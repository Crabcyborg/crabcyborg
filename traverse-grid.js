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
	invert: details => {
		let last = details.points.length-1, keyed = {};
		details.forEach(({ point }, index) => keyed[point] = last - index);
		return d({ ...details, keyed })
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
	seed: seed => (height, width) => k({ height, width }, t.shuffle(t.horizontal(height, width).points, seed)),
	callback: (initialize, update, size) => (height, width) => {
		let keyed = {}, remaining = size || (width * height), index = 0, iteration = 0, [ direction, x, y, base_x, base_y, target ] = initialize({height, width});
		while(remaining--) {
			let previous = keyed[[x,y]] = index++;
			switch(direction) {
				case 'n': --y; break;
				case 's': ++y; break;
				case 'w': --x; break;
				case 'e': ++x; break;
				case 'ne': --y, ++x; break;
				case 'nw': --y, --x; break;
				case 'se': ++y, ++x; break;
				case 'sw': ++y, --x; break;
			}
			if(++iteration === target) [ direction, x, y, base_x, base_y, target ] = update({ direction, x, y, height, width, base_x, base_y, index: previous }), iteration = 0;
		}
		return d({ keyed, height, width });
	},
	tile: (tile, direction) => (height, width) => {
		let keyed = {}, x, y, base_x = 0, base_y = 0, remaining = height * width, index = 0;
		while(remaining) {
			for(let point of tile.points) {
				x = base_x + point[0], y = base_y + point[1];
				if(x >= 0 && x < width && y >= 0 && y < height) keyed[[x,y]] = index++, --remaining;
			}

			switch(direction) {
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
	}
}, t = traverse, d = t.details, c = t.callback, k = (details, points) => d({ ...details, keyed: t.key(points) });

// methods
t.horizontal = c(({width}) => ['e', 0, 0, 0, 0, width], ({ base_y, width }) => ['e', 0, ++base_y, 0, base_y, width]);
t.vertical = t.rotate(t.horizontal);
t.double = t.tile(t.horizontal(2,2));
t.snake = t.tile({ points: [[0,0], [0,1], [1,1], [1,0]], height: 2, width: 2 });
t.cascade = c(
	({height}) => ['s', 0, height-2, 0, height-2, 2],
	({direction, height, width, x, y, base_x, base_y}) => {
		let even_height = height % 2 === 0, new_x = y >= height ? (base_y <= 0 ? ++base_x : base_x) : x+1;
		return new_x === width ? ['s', ++base_x, 0, base_x, base_y, even_height ? 2 : 1] : ['s', new_x, y >= height ? Math.max(base_y -= 2, 0) : y, base_x, base_y, even_height ? 2 : (y >= height && base_y < 0 ? 1 : 2)];
	}
);
t.climb = c(({height}) => ['s', 0, height-1, -2, height-1, 1], ({direction, height, width, x, y, base_x, base_y}) => 
	y < height && x < width ? [direction === 's' ? 'e' : 's', x, y, base_x, base_y, 1]
	: [(base_y -= 2) < 0 ? 'e' : 's', base_y <= 0 ? base_x + 2 : 0, base_y > 0 ? base_y : 0, base_y <= 0 ? (base_x += (!base_y && !(base_x+2) ? 1 : 2)) : base_x, base_y, 1]
);
t.corner = type => {
	switch(type) {
		case 'crawl': return c(({height}) => ['n', 0, height-1, 0, 0, height], ({direction, height, width, base_x, base_y}) => {
			switch(direction) {
				case 'n': return ['e', ++base_x, base_y++, base_x, base_y, width-base_x];
				case 'e': return ['n', base_x, height-1, base_x, base_y, height-base_y];
			}
		});
		case 'in': return c(({height}) => ['n', 0, height-1, 0, 0, height], ({direction, height, width, base_x, base_y}) => {
			switch(direction) {
				case 'n': return ['w', width-1, base_y++, base_x, base_y, width-base_x-1];
				case 'w': return ['n', ++base_x, height-1, base_x, base_y, height-base_y];
			}
		});
		case 'out': return c(({height}) => ['s', 0, 0, 0, 0, height], ({direction, height, width, base_x, base_y}) => {
			switch(direction) {
				case 's': return ['e', ++base_x, base_y++, base_x, base_y, width-base_x];
				case 'e': return ['s', base_x, base_y, base_x, base_y, height-base_y];
			}
		});
	}
};
t.diagonal = c(({ height }) => ['se', 0, height-1, 0, height-1, 1], ({ height, width, base_x, base_y }) => [
	'se', base_y > 0 ? base_x : ++base_x, base_y > 0 ? --base_y : 0, base_x, Math.max(base_y, 0), Math.min(height-base_y, width-base_x)
]);
t.diamond = (height, width) => {
	const spike = { height: Math.ceil((width-2)/2), width: Math.ceil((height-2)/2) };
	const diamond = {
		height: height + spike.height*2, width: width + spike.width*2,
		size: height * width + t.triangleSize(height-2, 'isosceles') * 2 + t.triangleSize(width-2, 'isosceles') * 2
	};
	let even_height = diamond.height % 2 === 0, even_width = diamond.width % 2 === 0, base_y = Math.floor((diamond.height-1)/2), size = base_y;
	const result = c(() => ['ne', 0, base_y, 0, base_y, even_width ? size+1 : size], ({ direction, height, width, x, y, base_x, base_y, index }) => {
		switch(direction) {
			case 'ne': return ['se', x, even_width ? y+1 : y, base_x, base_y, even_height ? size+1 : size];
			case 'se': return ['sw', even_height ? x-1 : x, y, base_x, base_y, even_width ? size+1 : size];
			case 'sw': return ['nw', x, even_width ? y-1 : y, base_x, base_y, even_height ? size+1 : size];
			case 'nw': return !even_height || size > 1 ? ['ne', ++base_x, base_y, base_x, base_y, even_width ? size-- : --size] : ['s', ++base_x, base_y, 0, 0, height];
		}
	}, diamond.size)(diamond.height, diamond.width);
	const keyed = result.keyed;
	return t.trim({ keyed, height, width, spike, diamond: { ...diamond, keyed } });
};
t.pulse = type => {
	let size = 1;
	switch(type) {
		case 'corner': return c(
			() => ['w', 0, 0, 0, 0, 1],
			({ direction, x, y, base_x, height, width }) => {
				switch(direction) {
					case 'w': return base_x >= width-1 ? ['w', width-1, ++base_x, base_x, 0, width] : ['s', ++base_x, 0, base_x, 0, size++];
					case 's': return base_x >= height ? ['s', ++base_x, 0, base_x, 0, height] : ['w', x, y, base_x, 0, size];
				}
			}
		);
		case 'edge': default: return c(
			({ height }) => ['s', 0, Math.floor(height/2), 2, Math.floor(height/2), size],
			({ direction, height, x, y, base_x, base_y, index }) => {
				if(!index && !--size) return ['e', 0, --base_y, base_x, base_y, 1];
				switch(direction) {
					case 's': return y === height ? ['s', base_x++, 0, base_x, 0, height] : ['w', x, y, base_x, base_y, base_x];
					case 'e': return ['s', x, y, base_x, base_y, size += 2];
					case 'w': return base_y <= 0 ? ['s', base_x, 0, ++base_x, 0, height] : ['e', 0, --base_y, ++base_x, base_y, base_x-1];
				}
			}
		);
	}
};
t.spiral = c(({width}) => ['e', 0, 0, 0, 0, width], ({ direction, height, width, base_x, base_y }) => {
	switch(direction) {
		case 'e': return ['s', width-base_x-1, base_y+1, base_x, base_y, height-base_y*2-1];
		case 's': return ['w', width-base_x-2, height-base_y-1, base_x, base_y, width-base_x*2-1];
		case 'w': return ['n', base_x, height-base_y-2, base_x, base_y, height-base_y*2-2];
		case 'n': return ['e', base_x+1, base_y+1, ++base_x, ++base_y, width-base_x*2];
	}
});
t.stitch = (() => {
	let limit;
	return c(({width}) => { limit = width + (1-width%2) - 2; return ['se', 0, 0, 0, 0, 1]; }, ({ direction, height, width, x, y, base_x }) => 
		y === height ? (base_x === limit ? ['s', width-1, 0, base_x, 0, height] : [base_x % 2 === 0 ? 'sw' : 'se', ++base_x, 0, base_x, 0, 1])
		: [direction === 'se' ? 'sw' : 'se', x, y, base_x, 0, 1]
	);
})();
t.triangle = (height, width) => {
	const spike = { height: Math.ceil((width-2)/2), width: height-1 };
	const triangle = {
		height: height + spike.height,
		width: width + spike.width*2,
		size: height * width + t.triangleSize(height-1, 'right') * 2 + t.triangleSize(width-2, 'isosceles')
	};
	let even_width = triangle.width % 2 === 0, size = triangle.height;
	const result = c(() => ['ne', 0, triangle.height-1, 0, 0, even_width ? size : --size], ({ direction, height, width, x, y, base_x, base_y, index }) => {
		switch(direction) {
			case 'ne': return ['se', x, even_width ? y+1 : y, base_x, base_y, even_width ? size++ : ++size];
			case 'se': return ['ne', ++base_x, triangle.height-1, base_x, base_y, size -= 2];
		}
	}, triangle.size)(triangle.height, triangle.width);
	const keyed = result.keyed;
	return t.trim({ keyed, height, width, spike, triangle: { ...triangle, keyed } });
};

if(typeof module !== 'undefined') module['exports'] = { traverse };
else window.traverse = traverse;
}());