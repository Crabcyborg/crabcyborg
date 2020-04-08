const table = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!$';
const counterTable = '^*-_~`'; // x3-8
const base = table.length;
const fullTable = table + counterTable + '@=\'"';

String.prototype.replaceAt = function(index, replacement, remove) {
    return this.substr(0, index) + replacement + this.substr(index + (remove === undefined ? replacement.length : remove));
};

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

export const sub2 = optimized => optimized.replace(/0\^/g, '\'');
export const unsub2 = optimized => optimized.replace(/'/g, '0^');

const patterns = [
	'3\\$0', 'Y0\\$', 'M0\\*', '!f\\$', '@20', '080', '0Y0', '0f0', '\\$`\\$',
	'3w0', 'fYf', '0fU', '"23', 'c01', 'Y07', '0fY', '!3\\$', '020', '3M3',
	'Y@f', '0fM', '\\$"3', '\\$\\^Y', '640', '030', '1Y0', '1M0', 'Yf=', '@3w',
	'0c0', '"22', '0M0', '\\$3\\$', '!\\$\\^', '3\\$v', '0g0', 'o\'o', 'M3"',
	'"1M', 'f\\$\\^', 'M3M', '0s0', '0v0', '@80', '\\$\\*"', '03"'
];

export const sub3 = optimized => {
	let output = optimized;
	for(let index = 0; index < patterns.length; ++index) {
		output = output.replace(new RegExp(patterns[index], 'g'), '"'+table.charAt(index));
	}

	return output;
};

const other_patterns = [
	'$ $ $', '"  "  "', '$M  $', '01  0', '= $  $', '01  \'', 'M f  0',
	'0 "  0', '0 "  "', '0  "  0', 'M " M', '3 0 "', 'M  0  "', 'm  q  G',
	'$  $  f', 'Y $ Y', '"  f  "', '1w0', '0  " "', '$^ $', '1 "V',
	'1" Y', '" " M', '$M   $', '0  "  "', '" fw'
];

export const sub4 = optimized => {
	for(let index = 0; index < other_patterns.length; ++index) {
		let pattern = other_patterns[index];

		for(let i = 0; i < optimized.length-pattern.length+1; ++i) {
			let match = true;
			for(let j = 0; j < pattern.length; ++j) {
				if(pattern[j] !== ' ' && optimized[i+j] !== pattern[j]) {
					match = false;
					break;
				}
			}

			if(match) {
				let character_index = patterns.length + index;
				let character = fullTable.charAt(character_index);
				let subbed = '"' + character;
				
				for(let char_index = 0; char_index < pattern.length; ++char_index) {
					if(pattern[char_index] === ' ') {
						subbed = subbed.concat(optimized[i+char_index]);
					}
				}
				
				optimized = optimized.replaceAt(i, subbed, pattern.length);
			}
		}
	}

	return optimized;
};

export const unsub4 = optimized => {
	for(let index = other_patterns.length-1; index >= 0; --index) {
		let character_index = patterns.length + index;
		let character = fullTable.charAt(character_index);
		let search = '"'+character;

		if(optimized.indexOf(search) >= 0) {
			let unsubbed_string = '';
			for(let string_index = 0; string_index < optimized.length; ++string_index) {
				if(string_index+1 < optimized.length && optimized[string_index] === '"' && optimized[string_index+1] === character) {
					let pattern = other_patterns[index];

					let i = 2;
					for(let j = 0; j < pattern.length; ++j) {
						if(pattern[j] !== ' ') {
							unsubbed_string += pattern[j];
						} else {
							unsubbed_string += optimized[string_index+i];
							++i;
						}
					}

					string_index += pattern.length-2;
				} else {
					unsubbed_string += optimized[string_index];
				}
			}

			optimized = unsubbed_string;
		}
	}

	return optimized;
};

export const unsub3 = optimized => {
	let output = optimized;
	for(let index = patterns.length-1; index >= 0; --index) {
		output = output.replace(new RegExp('"'+table.charAt(index), 'g'), patterns[index].replace(/\\/g, ''));
	}

	return output;
};

export const optimize = raw => counter(compress(raw));
export const raw = optimized => decompress(decounter(unsub(unsub2(unsub3(unsub4(optimized))))));

export const minimize = raw => sub4(sub3(sub2(substitute(optimize(raw)))));