import m from 'mithril';
import { ShapeUp } from '$app/components';
import { offOn } from '$app/shapeup/optimization-helper';
import { min } from 'min-string';

const unsubPatterns = input => {
	for(let c of '`~_-*^') input = min.unsubPattern(input, c);
	return input;
};

const alternativeDecompress = min.pipe(min.unsubTwoCharacterPermutations, unsubPatterns, min.unsubTopTwoPatterns, min.unsubTwoMostCommonPatterns, min.toDecimal);

export var Shape = {
	oninit: v => {
		let { shape } = v.attrs;

		const alternative = shape[0] === '}', on_off = shape[0] === '|' || alternative;
		on_off && (shape = shape.substr(1));

		let configuration;
		if(alternative) {
			configuration = alternativeDecompress(shape);
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