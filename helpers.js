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