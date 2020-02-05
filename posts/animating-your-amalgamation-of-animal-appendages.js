import m from 'mithril';
import { config as lady_tiger } from '$app/monsters/lady-tiger';
import { Caption, Gist } from '$app/components';

const typetypetype = () => {
	const target = document.getElementById('type-target');
	const lower_section = target.childNodes[2];
	const tail = lower_section.childNodes[0];
	const back_legs = [lower_section.childNodes[1], lower_section.childNodes[2]];
	const front_legs = [lower_section.childNodes[3], lower_section.childNodes[4]];

	target.style.top = '3px';
	target.style.transition = '.8s ease-in-out';

	setInterval(() => {
		target.style.transform = 'rotate(-52deg)';
		setTimeout(() => target.style.transform = 'rotate(-55deg)', 1000);
	}, 2000);
	target.style.transform = 'rotate(-55deg)';

	tail.style.transition = '.8s ease-in-out';
	tail.style.transform = 'translateX(-54px) translateY(-32px) rotate(110deg)';

	for(let leg of back_legs.concat(front_legs)) {
		leg.style['transform-origin'] = '50% 10%';
	}

	back_legs[0].style.transform = 'rotate(-25deg)';
	back_legs[1].style.transform = 'rotate(-10deg)';

	for(let leg of front_legs) {
		leg.style.transition = '.25s ease-out';
	}

	const full_length = 1000;
	const half_length = full_length/2;

	const typeLeg = (leg, from, to) => {
		leg.style.transform = 'rotate('+from+'deg)';
		setTimeout(() => leg.style.transform = 'rotate('+to+'deg)', half_length-100);
	};
	const typeLeft = () => typeLeg(front_legs[0], -15, -35);
	const typeRight = () => typeLeg(front_legs[1], -20, 10);

	setInterval(typeLeft, full_length);
	typeLeft();

	setTimeout(() => {
		setInterval(typeRight, full_length);
		typeRight();
	}, half_length);
};

const wave = () => {
	const target = document.getElementById('wave-target');
	const lower_section = target.childNodes[2];
	const claw = lower_section.childNodes[4];
	const other_legs = [lower_section.childNodes[1], lower_section.childNodes[2], lower_section.childNodes[3]];

	target.style.transition = '1s ease-in-out';
	target.style.right = '-5px';

	claw.style.transition = 'transform .8s ease-in-out';
	claw.style['transform-origin'] = '50% 10%';
	claw.style.transform = 'rotate(-60deg)';

	for(let leg of other_legs) {
		leg.style.transition = '1s ease-in-out';
		leg.style['transform-origin'] = '50% 10%';
		leg.style.transform = 'rotate(5deg)';
	}

	setTimeout(() => {
		target.style.right = '5px';
		claw.style.transform = 'rotate(0deg)';

		for(let leg of other_legs) {
			leg.style.transform = 'rotate(0deg)';
		}
	}, 900);

	setTimeout(wave, 2000);
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

	let x = -250;
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
	const lower_section = target.childNodes[2];
	const back_legs = [lower_section.childNodes[1], lower_section.childNodes[2]];
	const front_legs = [lower_section.childNodes[3], lower_section.childNodes[4]];
	const tail = lower_section.childNodes[0];
	const original_tail_transform = tail.style.transform;

	target.style.transition = '1s ease-in-out';
	target.style.right = '-10px';

	tail.style.transition = '1s ease-in-out';
	tail.style.transform = 'translateX(-54px) translateY(-32px) rotate(90deg)';

	for(let leg of back_legs.concat(front_legs)) {
		leg.style.transition = '1s ease-in-out';
		leg.style['transform-origin'] = '50% 10%';
	}

	for(let leg of back_legs) {
		leg.style.transform = 'rotate(10deg)';
	}

	for(let leg of front_legs) {
		leg.style.transform = 'rotate(-10deg)';
	}

	setTimeout(() => {
		target.style.right = '10px';
		tail.style.transform = original_tail_transform;

		for(let leg of back_legs.concat(front_legs)) {
			leg.style.transform = 'rotate(0deg)';
		}
	}, 1100);

	setTimeout(fan, 2300);
};

export const oninit = () => {
	setTimeout(wave, 0);
	setTimeout(walk, 0);
	setTimeout(fan, 0);
	setTimeout(typetypetype, 0);
};

export const title = 'Animating your Amalgamation of Animal Appendages';

export const content = [
	{...lady_tiger, id: 'wave-target'},
	m(Caption, "Giving a wave"),
	{...lady_tiger, id: 'walk-target'},
	m(Caption, "Strutting her stuff"),
	{...lady_tiger, id: 'type-target'},
	m(Caption, "Typing"),
	{...lady_tiger, id: 'fan-target'},
	m(Caption, "Until programming this animation I hadn't considered that peacocks are male")
];

export const previous = 'putting-together-animal-body-parts-with-mithril-js';