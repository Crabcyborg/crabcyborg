import m from 'mithril';
import { config as lady_tiger } from '$app/monsters/lady-tiger';
import { Caption, Gist } from '$app/components';

const claw = () => {
	const target = document.getElementById('claw-target');
	const claw = target.childNodes[2].childNodes[4];

	claw.style.transition = 'transform .8s ease-in-out';
	claw.style['transform-origin'] = '50% 10%';
	claw.style.transform = 'rotate(-60deg)';

	setTimeout(() => {
		claw.style.transform = 'rotate(0deg)';
	}, 900);
};

const walk = () => {
	const target = document.getElementById('walk-target');
	const legs = Array.from(target.childNodes[2].childNodes).slice(1);

	const step = (leg, degree) => {
		leg.style.transform = 'rotate('+degree+'deg)';

		setTimeout(() => {
			leg.style.transform = 'rotate(0deg)';
		}, 1000);
	};

	for(let leg of legs) {
		leg.style['transform-origin'] = '50% 10%';
		leg.style.transition = 'transform .8s ease-out';
	}

	var x = -250;
	target.style.transition = 'transform 1s ease-in-out';
	target.style.transform = 'translateX('+x+'px)';

	setInterval(() => {
		if(x > 300) {
			setTimeout(() => {
				x = -250;
				target.style.transform = 'translateX('+x+'px)';
			}, 10);
			return;
		}

		target.style.transform = 'translateX('+(x += 50)+'px)';

		step(legs[0], 20);
		step(legs[2], 20);
		step(legs[1], -30);
		step(legs[3], -30);
	}, 2000);
};

const fan = () => {
	const target = document.getElementById('fan-target');
	const tail = target.childNodes[2].childNodes[0];
	const original_transform = tail.style.transform;

	tail.style.transition = '1s ease-in-out';
	tail.style.transform = 'translateX(-54px) translateY(-32px) rotate(90deg)';

	setTimeout(() => {
		tail.style.transform = original_transform;
	}, 1100);
};

export const oninit = () => {
	setTimeout(claw, 0);
	setInterval(claw, 2000);
	setTimeout(walk, 0);
	setTimeout(fan, 0);
	setInterval(fan, 2300);
};

export const title = 'Animating your Amalgamation of Animal Appendages';

export const content = [
	{...lady_tiger, id: 'claw-target'},
	m(Caption, "Giving a wave"),
	{...lady_tiger, id: 'walk-target'},
	m(Caption, "Strutting her stuff"),
	{...lady_tiger, id: 'fan-target'},
	m(Caption, "Until programming this animation I hadn't considered that peacocks are male")
];

export const previous = 'putting-together-animal-body-parts-with-mithril-js';