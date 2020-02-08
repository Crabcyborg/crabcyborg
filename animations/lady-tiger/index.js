export const typetypetype = (id) => {
	const target = document.getElementById(id);
	const lower_section = target.childNodes[2];
	const tail = lower_section.childNodes[0];
	const back_legs = [lower_section.childNodes[1], lower_section.childNodes[2]];
	const front_legs = [lower_section.childNodes[3], lower_section.childNodes[4]];

	target.style.top = '3px';

	setInterval(() => {
		target.style.transition = '.8s ease-in-out';
		target.style.transform = 'rotate(-52deg)';
		setTimeout(() => target.style.transform = 'rotate(-55deg)', 1000);
	}, 2000);
	target.style.transform = 'rotate(-55deg)';

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

export const wave = (id) => {
	const target = document.getElementById(id);
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

	setTimeout(() => wave(id), 2000);
};

export const walk = (id) => {
	const target = document.getElementById(id);
	const legs = Array.from(target.childNodes[2].childNodes).slice(1);

	let scaleX = 1;

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
		if((x > 300 && scaleX === 1) || (x < -250 && scaleX === -1)) {
			scaleX *= -1;
		}

		target.style.transform = 'translateX('+(x += 50*scaleX)+'px) scaleX('+scaleX+')';

		step(legs[0], 20);
		step(legs[2], 20);
		step(legs[1], -30);
		step(legs[3], -30);
	}, 2000);
};

export const fan = (id) => {
	const target = document.getElementById(id);
	const head = target.childNodes[0];
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

	head.style.transition = '1s ease-in-out';
	head.style['transform-origin'] = '10% 50%';
	head.style.transform = 'rotate(30deg)';

	setTimeout(() => {
		target.style.right = '10px';
		tail.style.transform = original_tail_transform;

		for(let leg of back_legs.concat(front_legs)) {
			leg.style.transform = 'rotate(0deg)';
		}

		head.style.transform = 'rotate(0deg)';
	}, 1100);

	setTimeout(() => fan(id), 2300);
};

export const happybaby = (id) => {
	const target = document.getElementById(id);
	const lower_section = target.childNodes[2];
	const tail = lower_section.childNodes[0];
	const back_legs = [lower_section.childNodes[1], lower_section.childNodes[2]];
	const front_legs = [lower_section.childNodes[3], lower_section.childNodes[4]];

	target.style.bottom = '50px';

	setInterval(() => {
		target.style.transition = '.8s ease-in-out';
		target.style.transform = 'rotate(-182deg)';
		setTimeout(() => target.style.transform = 'rotate(-184deg)', 1000);
	}, 2000);
	target.style.transform = 'rotate(-184deg)';

	tail.style.transform = 'translateX(-54px) translateY(-32px) rotate(70deg)';

	for(let leg of back_legs.concat(front_legs)) {
		leg.style['transform-origin'] = '50% 10%';
	}

	setTimeout(() => {
		for(let leg of back_legs.concat(front_legs)) {
			leg.style.transition = '.8s ease-in-out';
		}
	}, 100);

	const claw = front_legs[1].childNodes[1]
	claw.style.transform = 'rotate(-216deg)';
	claw.style.top = '60px';
	claw.style.left = '27px';

	const setLegsIntoInitialPosition = () => {
		back_legs[0].style.transform = 'rotate(-50deg)';
		back_legs[1].style.transform = 'rotate(-20deg)';
		front_legs[0].style.transform = 'rotate(40deg)';
		front_legs[1].style.transform = 'rotate(50deg)';
	};

	setInterval(() => {
		back_legs[0].style.transform = 'rotate(-52deg)';
		back_legs[1].style.transform = 'rotate(-24deg)';
		front_legs[0].style.transform = 'rotate(50deg)';
		front_legs[1].style.transform = 'rotate(55deg)';
		setTimeout(setLegsIntoInitialPosition, 950);
	}, 2000);

	setLegsIntoInitialPosition();
};