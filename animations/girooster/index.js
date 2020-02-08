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
		if(x > 210) {
			setTimeout(() => {
				x = -210;
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