const targets = [128,64,32,16,8,4,2,1];

export const onOff = input => {
	let target_index = 0, output = [ input[0], input[1] ], previous = 0, count = 0;
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

export const offOn = input => {
	let values = [], previous = 0;
	for(let index = 2; index < input.length; ++index) {
		let value = input[index];

		for(let i = 0; i < value; ++i) {
			values.push(previous);
		}

		previous = 1-previous;
	}

	let target_index = 0;
	let current = 0;
	let output = [ input[0], input[1] ];
	for(let value of values) {
		if(value) {
			current += targets[target_index];
		}

		if(++target_index == 8) {
			output.push(current);
			target_index = 0;
			current = 0;
		}
	}

	return output;
};