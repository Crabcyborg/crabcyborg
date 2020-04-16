import m from 'mithril';
import { ShapeUp } from '$app/components';
import { offOn } from '$app/shapeup/optimization-helper';
import { min } from 'min-string';

const unsubPatterns = input => {
	let symbols = (min.three_character_permutations_symbols + min.counter_symbols).split('');
	symbols.reverse();
	for(let c of symbols) input = min.unsubPattern(input, c);
	return input;
};

const alternativeDecompress = min.pipe(min.unsubTwoCharacterPermutations, unsubPatterns, min.unsubTwoMostCommonPatterns, min.toDecimal);

const base49ToDecimal = input => input.split('').map(character => min.base64_symbols.indexOf(character));

const base82_symbols = min.base64_symbols + min.counter_symbols + min.additional_symbols + min.three_character_permutations_symbols + min.two_character_permutations_symbols;
const base82ToDecimal = input => {
	const split = input.split(',');
	return [
		split[0],
		split[1],
		...split[2].split('').map(character => base82_symbols.indexOf(character))
	];
} ;

const alternativeDecompressBase49 = min.pipe(min.unsubTwoCharacterPermutations, unsubPatterns, min.unsubTopTwoPatterns, min.unsubTwoMostCommonPatterns, base49ToDecimal);

export var Shape = {
	oninit: v => {
		let { shape } = v.attrs;

		const alternative = shape[0] === '}';
		const alternative_base49 = shape[0] === '^';
		const alternative_base82 = shape[0] === '*';
		const on_off = shape[0] === '|' || alternative || alternative_base49 || alternative_base82;
		on_off && (shape = shape.substr(1));

		let configuration;
		if(alternative) {
			configuration = alternativeDecompress(shape);
		} else if(alternative_base49) {
			configuration = alternativeDecompressBase49(shape);
		} else if(alternative_base82) {
			configuration = base82ToDecimal(shape);
		} else {
			configuration = shape.indexOf(',') > 0 ? shape.split(',') : min.decompress(shape);
		}
		
		v.state.configuration = on_off ? offOn(configuration) : configuration;
	},
	view: v => m(
		ShapeUp,
		{
			size: Math.min(8, Math.floor(320 / v.state.configuration[1])),
			configuration: v.state.configuration,
			behaviour: 'blink',
			blink_delay: 500
		}
	)
};