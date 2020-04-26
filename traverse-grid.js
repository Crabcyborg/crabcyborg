;(function() {
"use strict"
let traverse = {
	pipe: (...ops) => ops.reduce((a, b) => (height, width) => b(a(height, width))),
	map: (details, callback) => details.points.map((point, index) => callback({index: details.indices[index], point})),
	forEach: (details, callback) => details.points.forEach((point, index) => callback({index: details.indices[index], point})),
	reduce: (details, callback, initial_value) => details.points.reduce((accumulator, point, index) => callback(accumulator, {index: details.indices[index], point}, initial_value)),
	key: points => {
		let keyed = {}, index = 0;
		for(let point of points)
			keyed[point] = index++;
		return keyed;
	},
	details: details => {
		const { height, width, keyed } = details, size = width * height;
		let points = Array(size), indices = [];
		for(let y = 0; y < height; ++y)
			for(let x = 0; x < width; ++x) {
				points[keyed[[x,y]]] = [x,y];
				indices.push(keyed[[x,y]]);
			}
		return { ...details, points, indices };
	},
	flip: (details, type) => {
		let keyed = {};
		for(let index in details.points) {
			const [x,y] = details.points[index];
			switch(type) {
				case 'x': keyed[[details.width-x-1, y]] = index; break;
				case 'y': keyed[[x, details.height-y-1]] = index; break;
				case 'xy': keyed[[details.width-x-1, details.height-y-1]] = index; break;
			}
		}
		return traverse.details({ ...details, keyed });
	},
	rotate: details => {
		let keyed = {};
		for(let index in details.points) {
			const point = details.points[index], [x,y] = point;
			keyed[[y,x]] = details.keyed[point];
		}
		return traverse.details({ ...details, keyed, height: details.width, width: details.height });
	},
	visualize: details => {
		let output = [];
		const length = details.indices.length;
		for(let index = 0, row = []; index < length;) {
			row.push(`${details.indices[index]}`.padStart(2,'0'));

			if(++index % details.width === 0) {
				output.push(row.join(' '));
				row = [];
			}
		}
		return output.join('\n');

		/*
		let output = [];
		for(let y = 0; y < details.height; ++y) {
			let row = [];
			for(let x = 0; x < details.width; ++x) {
				let index = details.keyed[[x,y]];
				row.push(`${index}`.padStart(2, '0'));
			}
			output.push(row.join(' '));
		}
		return output.join('\n');
		*/
	},
	triangleSize: (length, type) => {
		let size = 0;
		switch(type) {
			case 'isosceles': while(length > 0) size += length, length -= 2; break;
			case 'right': while(length > 0) size += length--; break;
		}
		return size;
	},
	horizontal: (height, width) => {
		let keyed = {}, index = 0;
		for(let y = 0; y < height; ++y)
			for(let x = 0; x < width; ++x, ++index)
				keyed[[x,y]] = index;
		return traverse.details({ keyed, height, width });
	},
	vertical: (height, width) => {
		let keyed = {}, index = 0;
		for(let x = 0; x < width; ++x)
			for(let y = 0; y < height; ++y, ++index)
				keyed[[x,y]] = index;
		return traverse.details({ keyed, height, width });
	},
	diagonal: (height, width) => {
		let keyed = {}, x = 0, y = height-1, remaining = width * height, index = 0;
		while(remaining--) {
			keyed[[x,y]] = index++;
			++x, ++y;
			if(x == width || y == height) y -= x + 1, x = 0;
			while(y < 0) ++y, ++x;
		}
		return traverse.details({ keyed, height, width });
	},
	spiral: (height, width) => {
		let keyed = {}, x = 0, y = 0, dx = 1, dy = 0, remaining = height * width, maxx = width, maxy = height, minx = -1, miny = -1, index = 0;
		while(remaining--) {
			keyed[[x,y]] = index++;
			x += dx, y += dy;
			if(x == minx) x += 1, y -= 1, dx = 0, dy = -1, maxy--;
			else if(x == maxx) x -= 1, y += 1, dx = 0, dy = 1, miny++;
			else if(y == miny) x += 1, y += 1, dx = 1, dy = 0, minx++;
			else if(y == maxy) x -= 1, y -= 1, dx = -1, dy = 0, maxx--;
		}
		return traverse.details({ keyed, height, width });
	},
	diamond: (height, width) => {
		const spike = {
			height: Math.ceil((width-2)/2),
			width: Math.ceil((height-2)/2)
		};
		const diamond = {
			height: height + spike.height*2,
			width: width + spike.width*2,
			size: height * width + traverse.triangleSize(height-2, 'isosceles') * 2 + traverse.triangleSize(width-2, 'isosceles') * 2
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
	
		// trim the edges
		let indices = [];
		for(let y = spike.height; y < height+spike.height; ++y)
			for(let x = spike.width; x < width+spike.width; ++x)
				indices.push(parseInt(keyed[[x,y]]));
		indices.sort((a,b) => a-b);

		let size = width * height, points = Array(size);
		index = 0;
		for(let y = spike.height; y < height+spike.height; ++y)
			for(let x = spike.width; x < width+spike.width; ++x)
				points[indices.indexOf(keyed[[x,y]])] = [x - spike.width, y - spike.height];
	
		return traverse.details({ keyed: traverse.key(points), height, width, diamond: { ...diamond, keyed }, spike });
	},
	snake: (height, width) => {
		let dir = 's', x = 0, y = 0, keyed = {}, remaining = width * height, index = 0;
		while(remaining) {
			if(x >= 0 && x < width && y >= 0 && y < height) {
				keyed[[x,y]] = index++, --remaining;
			}
	
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
		return traverse.details({ keyed, height, width });
	},
	triangle: (height, width) => {
		const spike = {
			height: Math.ceil((width-2)/2),
			width: height-1
		};
		const triangle = {
			height: height + spike.height,
			width: width + spike.width*2,
			size: height * width + traverse.triangleSize(height-1, 'right') * 2 + traverse.triangleSize(width-2, 'isosceles')
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
	
		// trim the edges
		let indices = [];
		for(let y = spike.height; y < height+spike.height; ++y)
			for(let x = spike.width; x < width+spike.width; ++x)
				indices.push(parseInt(keyed[[x,y]]));
	
		indices.sort((a,b) => a-b);
	
		let points = Array(width * height);
		for(let y = spike.height; y < height+spike.height; ++y)
			for(let x = spike.width; x < width+spike.width; ++x)
				points[indices.indexOf(keyed[[x,y]])] = [x - spike.width, y - spike.height];
	
		return traverse.details({ keyed: traverse.key(points), height, width, triangle: { ...triangle, keyed }, spike });
	}
};

traverse.flipx = details => traverse.flip(details, 'x');
traverse.flipy = details => traverse.flip(details, 'y');
traverse.flipxy = details => traverse.flip(details, 'xy');

if(typeof module !== 'undefined') module['exports'] = { traverse };
else window.traverse = traverse;
}());