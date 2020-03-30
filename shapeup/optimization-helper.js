const counterTable = '^*-_~`'; // x3-8
const table = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!$';
const base = table.length;

export const toBase = number => {
	var r = number % base;
    var res = table.charAt(r);
	var q = Math.floor(number / base);
	
    while(q) {
    	r = q % base;
    	q = Math.floor(q / base);
    	res = table.charAt(r) + res;
	}
	
    return res.padStart(4, '0');
};

export const toDecimal = number => {
    var limit = number.length;
    var result = 0;
    for(var i = 0; i < limit; i ++) {
    	result = base * result + table.indexOf(number.charAt(i));
	}
	
    return result;
};

export const compress = uncompressed => {
	let compressed = [];
	for(let i = 0; i < uncompressed.length; i += 3) {
		const set = uncompressed.slice(i, i+3);
	
		while(set.length < 3) {
			set.push(0);
		}

		const merged = set[0] + (set[1] << 8) + (set[2] << 16);
		compressed.push(toBase(merged));
	}

	return compressed.join('');
};

export const counter = compressed => {
	let previous = false;
	let count = 0;
	let output = '';

	const addPreviousCharacterToOutput = () => {
		if(previous === false) {
			return;
		}
		
		output += previous;

		if(count == 2) {
			output += previous;
		} else if(count > 1) {
			let char_index = count-3;
			output += counterTable.charAt(char_index);
		}
	};

	for(let c of compressed) {
		if(c === previous) {
			++count;

			if(count-3 == counterTable.length) {
				output += previous;
				output += counterTable.charAt(counterTable.length-1);
				count = 1;
			}
		} else {
			addPreviousCharacterToOutput();
			count = 1;
			previous = c;
		}
	}

	addPreviousCharacterToOutput();
	return output;
};

export const decounter = counted => {
	let output = '';
	let previous;
	for(let c of counted) {
		let index = counterTable.indexOf(c);
		
		if(index >= 0) {
			index += 1;
			for(let i = 0; i <= index; ++i) {
				output += previous;
			}
		} else {
			output += c;
		}

		previous = c;
	}

	return output;
};

export const decompress = compressed => {
	let decompressed = [];
	for(let i = 0; i <= compressed.length; i += 4) {
		let chunk = compressed.substr(i, 4).trimLeft('0');
		let number = toDecimal(chunk);

		let set = [];
		set.push(number >> 16);
		set.push((number - (set[0] << 16)) >> 8);
		set.push((number - (set[0] << 16) - (set[1] << 8)));
		set.reverse();

		decompressed = decompressed.concat(set);
	}

	// any trailing 0s are useless
	while(decompressed[decompressed.length-1] == 0) {
		decompressed.pop();
	}

	return decompressed;
};

export const substitute = optimized => optimized.replace(/00/g, '@').replace(/\$\$/g, '=');
export const unsub = subbed => subbed.replace(/\@/g, '00').replace(/\=/g, '$$$');

export const optimize = raw => counter(compress(raw));
export const raw = optimized => decompress(decounter(unsub(optimized)));