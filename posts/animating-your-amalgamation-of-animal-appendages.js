import m from 'mithril';
import { config as lady_tiger } from '$app/monsters/lady-tiger';
import { Caption, Gist } from '$app/components';
import { fan, happybaby, typetypetype, walk, wave } from '$app/animations/lady-tiger';

export const oninit = () => {
	setTimeout(() => wave('wave-target'), 0);
	setTimeout(() => walk('walk-target'), 0);
	setTimeout(() => fan('fan-target'), 0);
	setTimeout(() => typetypetype('type-target'), 0);
	setTimeout(() => happybaby('happy-baby-target'), 0);
};

export const title = 'Animating your Amalgamation of Animal Appendages';

export const content = [
	{...lady_tiger, id: 'wave-target'},
	m(Caption, "Giving a wave"),
	{...lady_tiger, id: 'walk-target'},
	m(Caption, "Strutting her stuff"),
	{...lady_tiger, id: 'type-target'},
	m(Caption, "Typing, or dancing... type dancing?"),
	{...lady_tiger, id: 'happy-baby-target'},
	m(Caption, "Happy baby"),
	{...lady_tiger, id: 'fan-target'},
	m(Caption, "Shake ya tailfeather"),
	"Lady Tiger is is ready for her work out tape sponsorship."
];

export const previous = 'putting-together-animal-body-parts-with-mithril-js';
export const next = 'flappy-tiger';