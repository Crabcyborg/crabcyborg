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
				var objClass = Object.prototype.toString.call(obj).slice(8, -1);
				if(objClass === 'Object' || objClass === 'Array') {
					for(var key in obj) {
						if(!obj.hasOwnProperty(key)) continue;
						sizeOf(obj[key]);
					}
				} else bytes += obj.toString().length * 2;
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