let injectedScripts = [];
export const injectScript = (src, callback) => {
	if(injectedScripts.indexOf(src) >= 0) {
		callback !== undefined && callback();
		return;
	}

	var script = document.createElement('script');
	script.src = src;
	injectedScripts.push(src);
	callback !== undefined && script.addEventListener('load', callback);
	document.body.appendChild(script);
}

export const injectClassDefinitions = definitions => {
	var element = document.createElement('style');
	for(let definition of definitions) {
		element.innerHTML += `${definition.selector} { ${definition.style} }`;
	}

	document.body.appendChild(element);
};

export const injectClassDefinition = (selector, style) => {
	injectClassDefinitions([{ selector, style }]);
};

export const shuffle = a => {
	let j, x, i;
	for(i = a.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = a[i];
		a[i] = a[j];
		a[j] = x;
	}

	return a;
};

export const range = length => Array.from({length}, (x,i) => i);
export const between = (value, a, b) => value >= Math.min(a,b) && value <= Math.max(a,b);
export const sum = values => values.reduce((total, value) => total + value);
export const average = values => sum(values) / values.length;

export const roughSizeInMemory = obj => {
	let bytes = 0;

	const sizeOf = obj => {
		if(obj !== null && obj !== undefined) {
			switch(typeof obj) {
				case 'number':
					bytes += 8;
				break;
				case 'string':
					bytes += obj.length * 2;
				break;
				case 'boolean':
					bytes += 4;
				break;
				case 'object':
					const objClass = Object.prototype.toString.call(obj).slice(8, -1);
					if(objClass === 'Object' || objClass === 'Array') {
						for(let key in obj) {
							if(!obj.hasOwnProperty(key)) {
								continue;
							}

							sizeOf(obj[key]);
						}
					} else {
						bytes += obj.toString().length * 2;
					}
				break;
			}
		}

		return bytes;
	};

	const formatByteSize = bytes => {
		if(bytes < 1024) return bytes + " bytes";
		if(bytes < 1048576) return (bytes / 1024).toFixed(3) + " KiB";
		if(bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MiB";
		return (bytes / 1073741824).toFixed(3) + " GiB";
	};

	return formatByteSize(sizeOf(obj));
};

function Rect(x,y,w,h) {
	if(typeof x === 'object') {
		y = x.y;
		w = x.w || x.width;
		h = x.h || x.height;
		x = x.x; // do x last
	}

	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}

Rect.prototype = {
	scale: function(scale) {
		return new Rect(this.x * scale, this.y * scale, this.w * scale, this.h * scale);
	},
	up: function(y) {
		return new Rect(this.x, this.y - y, this.w, this.h);
	},
	down: function(y) {
		return new Rect(this.x, this.y + y, this.w, this.h);
	},
	left: function(x) {
		return new Rect(this.x - x, this.y, this.w, this.h);
	},
	right: function(x) {
		return new Rect(this.x + x, this.y, this.w, this.h);
	},
	contains: function(x, y) {
		return x >= this.x && x <= this.x+this.w && y >= this.y && y <= this.y+this.h;
	},
	flat: function(obj = {}) { 
		return { x: this.x, y: this.y, width: this.w, height: this.h, ...obj };
	}
};

function V2(x,y) {
	if(Array.isArray(x)) {
		y = x[1];
		x = x[0];
	} else {
		switch(typeof x) {
			case 'object': 
				y = x.y;
				x = x.x;
			break;

			case 'string':
				const split = x.split(',');
				x = parseInt(split[0]);
				y = parseInt(split[1]);
			break;
		}
	}

	this.x = x;
	this.y = y;
}

V2.prototype = {
	scale: function(scale) {
		return new V2(this.x * scale, this.y * scale);
	},
	compare: function(v) {
		return this.x == v.x && this.y == v.y;
	},
	svgPoints: function(scale = 1) {
		const x1 = this.x*scale, x2 = x1+scale;
		const y1 = this.y*scale, y2 = y1+scale;
		return `${x1},${y1},${x2},${y1},${x2},${y2},${x1},${y2}`;
	},
	toArray: function() {
		return [this.x, this.y];
	}
};

export { Rect, V2 };