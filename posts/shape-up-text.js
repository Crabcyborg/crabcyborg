import m from 'mithril';
import { ShapeUp } from '$app/components';

export const title = 'Using a Shape Up Component as a Font';

const size = 6;
const spacing = size*4;

const wordToConfiguration = word => {
	let
	l = word.length,
	cols = l*4-1,
	cx2 = cols*2,
	cx3 = cols*3,
	cx4 = cols*4,
	ix4,
	remove = [],
	i;

	for(i = 0; i < l; ++i) {
		ix4 = i*4;

		i > 0 && remove.push(--ix4, ix4+cols, ix4+cx2, ix4+cx3, ix4+++cx4);

		switch(word[i]) {
			case 'A': remove.push(++ix4+cols, ix4+cx2, ix4+cx4, ++ix4); break;
			case 'B': remove.push(++ix4+cols, ix4+cx3, ++ix4+cx2); break;
			case 'C': remove.push(++ix4+cols, ix4+cx2, ix4+cx3, ++ix4+cols, ix4+cx2, ix4+cx3); break;
			case 'D': remove.push(++ix4+cols, ix4+cx2, ix4+cx3, ++ix4, ix4+cx4); break;
			case 'E': remove.push(++ix4+cols, ix4+cx3, ++ix4+cols, ix4+cx2, ix4+cx3); break;
			case 'F': remove.push(++ix4+cols, ix4+cx3, ix4+cx4, ++ix4+cols, ix4+cx2, ix4+cx3, ix4+cx4); break;
			case 'G': remove.push(++ix4+cols, ix4+cx2, ix4+cx3, ++ix4+cols, ix4+cx2); break;
			case 'H': remove.push(++ix4, ix4+cols, ix4+cx3, ix4+cx4); break;
			case 'I': remove.push(ix4+cols, ix4+cx2, ix4+cx3, (ix4 += 2)+cols, ix4+cx2, ix4+cx3); break;
			case 'J': remove.push(ix4, ix4+cols, ix4+cx2, ix4+cx3, ++ix4+cols, ix4+cx2, ix4+cx3); break;
			case 'K': remove.push(++ix4, ix4+cols, ix4+cx3, ix4+cx4, ++ix4+cx2); break;
			case 'L': remove.push(++ix4, ix4+cols, ix4+cx2, ix4+cx3, ++ix4, ix4+cols, ix4+cx2, ix4+cx3); break;
			case 'N': remove.push(++ix4+cols, ix4+cx2, ix4+cx3, ix4+cx4); break;
			case 'O': remove.push(ix4, ++ix4+cols, ix4+cx2, ix4+cx3, ++ix4+cx4); break;
			case 'P': remove.push(++ix4+cols, ix4+cx2, ix4+cx4, ++ix4, ix4+cx4); break;
			case 'R': remove.push(++ix4+cols, ix4+cx2, ix4+cx4, ++ix4, ix4+cx3); break;
			case 'S': remove.push(ix4, ix4+cx3, ++ix4+cols, ix4+cx3, ++ix4+cols, ix4+cx4); break;
			case 'T': remove.push(ix4+cols, ix4+cx2, ix4+cx3, ix4+cx4, (ix4 += 2)+cols, ix4+cx2, ix4+cx3, ix4+cx4); break;
			case 'U': remove.push(++ix4, ix4+cols, ix4+cx2, ix4+cx3); break;
			case 'V': remove.push(ix4+cx4, ++ix4, ix4+cols, ix4+cx2, ix4+cx3, ++ix4+cx4); break;
			case 'X': remove.push(ix4+cx2, ++ix4, ix4+cols, ix4+cx3, ix4+cx4, ++ix4+cx2); break;
			case 'Y': remove.push(ix4+cx3, ++ix4, ix4+cols, ix4+cx3, ++ix4); break;
			case 'Z': remove.push(ix4+cols, ix4+cx2, ++ix4+cols, ix4+cx3, ++ix4+cx2, ix4+cx3); break;
			case 'a': remove.push(ix4, ix4+cols, ix4+cx3, ix4+cx4, ++ix4, ix4+cx2, ix4+cx4, ++ix4, ix4+cx4); break;
			case 'b': remove.push(ix4+cx4, ++ix4, ix4+cx2, ix4+cx4, ++ix4, ix4+cols, ix4+cx4); break;
			case 'c': remove.push(ix4, ix4+cols, ix4+cx4, ++ix4, ix4+cx2, ix4+cx4, ++ix4, ix4+cx2, ix4+cx4); break;
			case 'd': remove.push(ix4, ix4+cx4, ++ix4, ix4+cx2, ix4+cx4, ++ix4+cx4); break;
			case 'f': remove.push(ix4, ix4+cx4, ++ix4+cols, ix4+cx3, ix4+cx4, ++ix4+cols, ix4+cx2, ix4+cx3, ix4+cx4); break;
			case 'h': remove.push(ix4+cx4, ++ix4, ix4+cols, ix4+cx3, ix4+cx4, ++ix4, ix4+cols, ix4+cx2, ix4+cx4); break;
			case 'i': remove.push(ix4, ix4+cols, ix4+cx2, ix4+cx3, ix4+cx4, ++ix4+cols, ix4+cx4, ++ix4, ix4+cols, ix4+cx2, ix4+cx3, ix4+cx4); break;
			case 'j': remove.push(ix4, ix4+cols, ix4+cx2, ix4+cx4, ++ix4, ix4+cols, ix4+cx2, ix4+cx3, ++ix4+cols, ix4+cx4); break;
			case 'k': remove.push(ix4+cx4, ++ix4, ix4+cols, ix4+cx3, ix4+cx4, ++ix4, ix4+cx2, ix4+cx4); break;
			case 'l': remove.push(ix4, ix4+cols, ix4+cx2, ix4+cx3, ix4+cx4, ++ix4+cx4, ++ix4, ix4+cols, ix4+cx2, ix4+cx3, ix4+cx4); break;
			case 'n': remove.push(ix4, ix4+cx4, ++ix4, ix4+cx2, ix4+cx3, ix4+cx4, ++ix4, ix4+cols, ix4+cx4); break;
			case 'o': remove.push(ix4, ix4+cols, ix4+cx3, ix4+cx4, ++ix4, ix4+cx2, ix4+cx4, ++ix4, ix4+cols, ix4+cx3, ix4+cx4); break;
			case 'p': remove.push(ix4, ++ix4, ix4+cx2, ix4+cx4, ++ix4, ix4+cols, ix4+cx3, ix4+cx4); break;
			case 'q': remove.push(ix4, ix4+cols, ix4+cx3, ix4+cx4, ++ix4, ix4+cx2, ix4+cx4, ++ix4, ix4+cols); break;
			case 'r': remove.push(ix4, ix4+cols, ix4+cx4, ++ix4, ix4+cx2, ix4+cx3, ix4+cx4, ++ix4, ix4+cols, ix4+cx3, ix4+cx4); break;
			case 't': remove.push(ix4, ix4+cx2, ix4+cx3, ix4+cx4, ++ix4+cx4, ++ix4, ix4+cx2, ix4+cx3, ix4+cx4); break;
			case 'u': remove.push(ix4, ix4+cx4, ++ix4, ix4+cols, ix4+cx2, ix4+cx4, ++ix4, ix4+cx4); break;
			case 'v': remove.push(ix4, ix4+cx3, ix4+cx4, ++ix4, ix4+cols, ix4+cx2, ix4+cx4, ++ix4, ix4+cx3, ix4+cx4); break;
			case 'x': remove.push(ix4, ix4+cx2, ix4+cx4, ++ix4, ix4+cols, ix4+cx3, ix4+cx4, ++ix4, ix4+cx2, ix4+cx4); break;
			case 'y': remove.push(ix4, ix4+cx2, ix4+cx3, ix4+cx4, ++ix4, ix4+cols, ix4+cx3, ++ix4, ix4+cx4); break;
			case ' ': break;
			case '0': remove.push(++ix4+cols, ix4+cx2, ix4+cx3); break;
			case '1': remove.push(ix4+cols, ix4+cx2, ix4+cx3, ix4 += 2, ix4+cols, ix4+cx2, ix4+cx3); break;
			case '2': remove.push(ix4+cols, ++ix4+cols, ix4+cx3, ++ix4+cx3); break;
			case '3': remove.push(ix4+cols, ix4+cx2, ix4+cx3, ++ix4+cols, ix4+cx3); break;
			case '4': remove.push(ix4+cx3, ix4+cx4, ++ix4, ix4+cols, ix4+cx3, ix4+cx4); break;
			case '5': remove.push(ix4+cx3, ++ix4+cols, ix4+cx3, ++ix4+cols); break;
			case '6': remove.push(++ix4+cols, ix4+cx3, ++ix4+cols); break;
			case '7': remove.push(ix4+cols, ix4+cx2, ix4+cx3, ix4+cx4, ++ix4+cols, ix4+cx2, ix4+cx3, ix4+cx4); break;
			case '8': remove.push(++ix4+cols, ix4+cx3); break;
			case '9': remove.push(ix4+cx3, ++ix4+cols, ix4+cx3); break;
			case '>': remove.push(++ix4, ix4+cx4, ++ix4, ix4+cols, ix4+cx3, ix4+cx4); break;
			case '<': remove.push(ix4, ix4+cols, ix4+cx3, ix4+cx4, ++ix4, ix4+cx4); break;
			case '-': remove.push(ix4, ix4+cols, ix4+cx3, ix4+cx4, ++ix4, ix4+cols, ix4+cx3, ix4+cx4, ++ix4, ix4+cols, ix4+cx3, ix4+cx4); break;
			case '!': remove.push(ix4, ix4+cols, ix4+cx2, ix4+cx3, ix4+cx4, ++ix4+cx3, ++ix4, ix4+cols, ix4+cx2, ix4+cx3, ix4+cx4); break;
			case '+': remove.push(ix4, ix4+cols, ix4+cx3, ix4+cx4, ++ix4, ix4+cx4, ++ix4, ix4+cols, ix4+cx3, ix4+cx4); break;
			case '.': remove.push(ix4, ix4+cols, ix4+cx2, ix4+cx3, ix4+cx4, ++ix4, ix4+cols, ix4+cx2, ix4+cx3, ++ix4, ix4+cols, ix4+cx2, ix4+cx3, ix4+cx4); break;
			case '?': remove.push(ix4+cols, ix4+cx2, ix4+cx3, ix4+cx4, ++ix4+cols, ix4+cx3, ++ix4+cx3, ix4+cx4); break;
		}
	}

	const targets = [128,64,32,16,8,4,2,1], rows = 5, length = cols*rows;
	const on = Array(length).fill(true);

	for(let index of remove) {
		on[index] = false;
	}

	let target_index = 0, value = 0, configuration = [ rows, cols ];

	for(i = 0; i < length; ++i) {
		on[i] && (value += targets[target_index]);

		if(++target_index == 8) {
			configuration.push(value);
			value = target_index = 0;
		}
	}

	value > 0 && configuration.push(value);
	return configuration;
};

const oncreate = v => {
	const { message } = v.attrs;
	const words = message.split(' ');

	let shapes = [];
	for(let word of words) {
		shapes.push(wordToConfiguration(word));
	}

	v.state.shapes = shapes;
}

const ShapeUpText = {
	oncreate,
	view: v => v.state.shapes.map(configuration => m(ShapeUp, {configuration, size, style: v.attrs.style, behaviour: 'blink', blink_delay: 500}))
};

export const content = () => [
	m(ShapeUpText, {message: 'Hi Earth.', style: { marginRight: `${spacing}px`, marginBottom: '2rem' }}),
	m('div', m(ShapeUpText, {message: 'DuE to SPacE not all lEttErS havE SuPPort.', style: { marginRight: `${spacing}px`, marginBottom: '1rem' }})),
	m('.mt3', m(ShapeUpText, {message: 'ABCD EFGH JIKL NOPR ST UVX YZ012 3456 7890 >< -! ?+.a bcdf hijk lnop qrtu vxy', style: { marginRight: `${size}px` }})),
	m('p', 'Unsupported characters include: M W Q e g m s w z'),
	"When I originally made Shape Up I started with a subtractive strategy. Since a lot of shapes were mostly full, I would just maintain an array of the indices to subtract from a full block. While this method wasn't ideal for large objects, it works very well for rendering text on the fly."
];