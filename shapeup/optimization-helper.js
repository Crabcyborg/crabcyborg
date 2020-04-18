const targets = [128,64,32,16,8,4,2,1];

export const onOff = input => {
	let output = [ input[0], input[1] ], previous = 0, count = 0;
	for(let index = 2; index < input.length; ++index) {
		let value = input[index];

		for(let target of targets) {
			let current = (value & target) != 0 ? 1 : 0;
		
			if(current == previous) {
				++count;
			} else {
				output.push(count);
				count = 1;
				previous = current;
			}
		}	
	}

	output.push(count);
	return output;
};

export const onOffVertical = input => {
	let flat = [];
	const length = input.length;
	for(let index = 2; index <= length; ++index) {
		for(let target of targets) flat.push((input[index] & target) != 0 ? 1 : 0);
	}

	const [ height, width ] = input;
	let output = [ height, width ], previous = 0, count = 0;
	for(let y = 0, x = 0; x < width; ++y) {
		if(y == height) {
			y = 0;
			++x;
		}

		let index = y*width + x, current = flat[index];
		if(current == previous) {
			++count;
		} else {
			output.push(count);
			count = 1;
			previous = current;
		}
	}

	output.push(count);
	return output;
};

export const offOn = input => {
	let values = [], previous = 0;
	for(let index = 2; index < input.length; ++index) {
		let value = input[index];
		for(let i = 0; i < value; ++i) values.push(previous);
		previous = 1-previous;
	}

	let target_index = 0, current = 0, output = [ input[0], input[1] ];
	for(let value of values) {
		if(value) current += targets[target_index];

		if(++target_index == 8) {
			output.push(current);
			target_index = current = 0;
		}
	}

	return output;
};

export const offOnVertical = input => {
	let values = [], previous = 0;
	for(let index = 2; index < input.length; ++index) {
		let value = input[index];
		for(let i = 0; i < value; ++i) values.push(previous);
		previous = 1-previous;
	}

	const [ height, width ] = input;

	let keyed = {};
	for(let index = 0, to = values.length; index < to; ++index) {
		let y = index % height, x = Math.floor(index / height);
		keyed[[x,y]] = values[index];
	}

	let rotated_values = [];
	for(let y = 0; y <= height; ++y) {
		for(let x = 0; x < width; ++x) rotated_values.push(keyed[[x,y]]);
	}
	values = rotated_values;

	let target_index = 0, current = 0, output = [ height, width ];
	for(let value of values) {
		if(value) current += targets[target_index];

		if(++target_index == 8) {
			output.push(current);
			target_index = current = 0;
		}
	}

	return output;
};

export const repositionOnOff = input => {
	let output = [ input[0], input[1] ];
	for(let i = 2; i < input.length; i += 2) output.push(input[i]);
	for(let i = 3; i < input.length; i += 2) output.push(input[i]);
	return output;
};

export const repositionOffOn = input => {
	let output = [ input[0], input[1] ];

	const half = Math.ceil((input.length - 2) / 2), to = half+2;
	for(let i = 2; i < to; ++i) {
		output.push(input[i]);
		output.push(input[half+i]);
	}

	return output;
};

export const onOffLimit = (input, limit) => {
	let output = [];
	for(let value of input) {
		if(value <= limit) {
			output.push(value);
		} else {
			while(value > limit) {
				output.push(limit, 0);
				value -= limit;
			}

			value > 0 && output.push(value);
		}
	}

	return output;
};

export const offOnLimit = input => {
	let output = [];
	for(let index = 0, to = input.length; index < to; ++index) {
		let current = 0;
		do current += input[index];
		while (input[index+1] == 0 && (index += 2) < to);
		output.push(current);
	}

	return output;
}