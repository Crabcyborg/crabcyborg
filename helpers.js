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

export const range = length => {
	return Array.from({length}, (x,i) => i);
};