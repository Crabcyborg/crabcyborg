import m from 'mithril';
import { ShapeUp } from '$app/components';
import { offOn, offOnVertical, offOnSpiral, offOnDiagonal, offOnDiamond, offOnSnake, offOnLimit, repositionOnOff, repositionOffOn, mirror } from '$app/shapeup/optimization-helper';
import { min } from 'min-string';

const unsubPatterns = (input, symbols) => {
	symbols === undefined && (symbols = min.three_character_permutations_symbols + min.counter_symbols);
	symbols = symbols.split('');
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
};

const alternativeDecompressBase49 = min.pipe(min.unsubTwoCharacterPermutations, unsubPatterns, min.unsubTopTwoPatterns, base49ToDecimal);
const unsubRepositionPatterns = input => unsubPatterns(input, min.three_character_permutations_symbols);
const repositionDecompressBase49 = min.pipe(min.unsubTwoCharacterPermutations, unsubRepositionPatterns, min.decounter, base49ToDecimal, repositionOffOn);
const repositionDecompressBase49Limit = min.pipe(min.unsubTwoCharacterPermutations, unsubRepositionPatterns, min.decounter, base49ToDecimal, offOnLimit, repositionOffOn);

export var Shape = {
	oninit: v => {
		let { shape } = v.attrs;

		let mirror_even = shape[0] === ')';
		let mirror_odd = shape[0] === '[';
		let mirrored = mirror_even || mirror_odd;
		mirrored && (shape = shape.substr(1));

		const alternative = shape[0] === '}';
		const alternative_base49 = shape[0] === '^';
		const alternative_base82 = shape[0] === '*';
		const reposition_base49 = shape[0] === '-';
		let vertical_base49 = shape[0] === '_';
		const limited_base49 = shape[0] === '~';
		const spiral = shape[0] === '`';
		const diagonal = shape[0] === '>';
		const diamond = shape[0] === ']';
		const test = shape[0] === '_' && shape[1] === '_';
		const on_off = shape[0] === '|' || alternative || alternative_base49 || alternative_base82 || reposition_base49;
		(on_off || vertical_base49 || limited_base49 || spiral || diagonal || diamond || test) && (shape = shape.substr(1));

		test && (shape = shape.substr(1));

		if(test) {
			vertical_base49 = false;
			console.log('here', shape);
		}

		let configuration;
		if(alternative) {
			configuration = alternativeDecompress(shape);
		} else if(alternative_base49) {
			configuration = alternativeDecompressBase49(shape);
		} else if(alternative_base82) {
			configuration = base82ToDecimal(shape);
		} else if(reposition_base49) {
			configuration = repositionDecompressBase49(shape);
		} else if(vertical_base49) {
			configuration = offOnVertical(repositionDecompressBase49(shape));
		} else if(limited_base49) {
			configuration = offOnVertical(repositionDecompressBase49Limit(shape));
		} else if(spiral) {
			configuration = offOnSpiral(repositionDecompressBase49Limit(shape));
		} else if(diagonal) {
			configuration = offOnDiagonal(repositionDecompressBase49Limit(shape));
		} else if(diamond) {
			configuration = offOnDiamond(repositionDecompressBase49Limit(shape));
		} else if(test) {
			configuration = offOnSnake(repositionDecompressBase49Limit(shape));
		} else {
			configuration = shape.indexOf(',') > 0 ? shape.split(',') : min.decompress(shape);
		}
		
		if(on_off) configuration = offOn(configuration);
		if(mirrored) configuration = mirror(configuration, mirror_odd);

		v.state.configuration = configuration;
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