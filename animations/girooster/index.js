export const wave = (id) => {
	const target = document.getElementById(id);
	const head = target.childNodes[0];
	const lower_section = target.childNodes[2];
	const paw = lower_section.childNodes[4];
	const other_legs = [lower_section.childNodes[1], lower_section.childNodes[2], lower_section.childNodes[3]];
	const tail = lower_section.childNodes[0];
	const original_tail_transform = tail.style.transform;
	
	tail.style.transition = head.style.transition = target.style.transition = '1s ease-in-out';

	tail.style.transform = 'translateX(-60px) translateY(-60px) rotate(-10deg)';

	target.style.left = '45px';

	head.style.top = '64px';	
	head.style.left = '76px';
	head.style.transform = 'rotate(4deg)';

	paw.style.transition = 'transform .8s ease-in-out';
	paw.style['transform-origin'] = '10% 10%';
	paw.style.transform = 'rotate(-60deg)';

	for(let leg of other_legs) {
		leg.style.transition = '1s ease-in-out';
		leg.style['transform-origin'] = '50% 10%';
		leg.style.transform = 'rotate(5deg)';
	}

	setTimeout(() => {
		target.style.left = '40px';
		paw.style.transform = 'rotate(0deg)';
		tail.style.transform = original_tail_transform;

		head.style.top = '62px';	
		head.style.left = '72px';
		head.style.transform = 'rotate(0deg)';

		for(let leg of other_legs) {
			leg.style.transform = 'rotate(0deg)';
		}
	}, 900);

	setTimeout(() => wave(id), 2000);
};

export const headbang = (id) => {
	const target = document.getElementById(id);
	const head = target.childNodes[0];
	const lower_section = target.childNodes[2];
	const legs = [lower_section.childNodes[1], lower_section.childNodes[2], lower_section.childNodes[3], lower_section.childNodes[4]];

	head.style.transition = target.style.transition = '1s ease-in-out';

	target.style.left = '45px';

	head.style.top = '68px';	
	head.style.left = '84px';
	head.style.transform = 'rotate(16deg)';

	for(let leg of legs) {
		leg.style.transition = '1s ease-in-out';
		leg.style['transform-origin'] = '50% 10%';
		leg.style.transform = 'rotate(10deg)';
	}

	setTimeout(() => {
		target.style.left = '30px';

		head.style.top = '62px';	
		head.style.left = '72px';
		head.style.transform = 'rotate(0deg)';

		for(let leg of legs) {
			leg.style.transform = 'rotate(0deg)';
		}
	}, 900);

	setTimeout(() => headbang(id), 2000);
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

	let x = -210;
	target.style.transition = 'transform 1s ease-in-out';
	target.style.transform = 'translateX('+x+'px)';

	setInterval(() => {
		if((x > 210 && scaleX === 1) || (x < -210 && scaleX === -1)) {
			scaleX *= -1;
		}

		target.style.transform = 'translateX('+(x += 50*scaleX)+'px) scaleX('+scaleX+')';

		step(legs[0], 20);
		step(legs[2], 20);
		step(legs[1], -30);
		step(legs[3], -30);
	}, 2000);
};

export const attack = (id) => {
	const target = document.getElementById(id);
	target.style.transition = 'transform .8s ease-in-out';
	target.style['transform-origin'] = '20% 60%';
	target.style.transform = 'rotate(-30deg)';

	const lower_section = target.childNodes[2];
	const legs = [lower_section.childNodes[1], lower_section.childNodes[2]];
	const paws = [lower_section.childNodes[3], lower_section.childNodes[4]];

	for(let leg of legs) {
		leg.style['transform-origin'] = '10% 0%';
		leg.style.transform = 'rotate(20deg)';
		leg.style.transition = 'transform .8s ease-in-out';
	}

	paws[0].style['transform-origin'] = '10% 0%';
	paws[1].style['transform-origin'] = '10% 10%';

	let deg = -30;
	for(let paw of paws) {
		paw.style.transition = 'transform .8s ease-in-out';
		paw.style.transform = 'rotate('+deg+'deg)';
		deg -= 10;
	}

	setTimeout(() => target.style.transform = 'rotate(-32deg)', 0);
	setInterval(() => {
		target.style.transform = 'rotate(-30deg)';
		
		for(let leg of legs) {
			leg.style.transform = 'rotate(26deg)';
		}

		setTimeout(() => {
			target.style.transform = 'rotate(-32deg)';

			for(let leg of legs) {
				leg.style.transform = 'rotate(25deg)';
			}
		}, 1000);
	}, 2000);

	let t0 = 0;
	let from0 = -50;
	let to0 = -80;
	setInterval(() => {
		t0 = 1 - t0;
		paws[0].style.transform = 'rotate('+to0+'deg)';
		[from0, to0] = [to0, from0]; // swap
	}, 1000);

	let t1 = 0;
	let from1 = -20;
	let to1 = -60;
	setTimeout(() => {
		setInterval(() => {
			t1 = 1 - t1;
			paws[1].style.transform = 'rotate('+to1+'deg)';
			[from1, to1] = [to1, from1]; // swap
		}, 1000);
	}, 1000);
};