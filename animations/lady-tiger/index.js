import anime from 'animejs/lib/anime.es.js';

export const jump = id => {
	const monster = `#${id}`;
	const child = ' > *:nth-child';
	const leg = (index) => `${monster}${child}(3)${child}(${index+1})`;
	const foot = (int) => leg()+`${child}(2)`;
	const center = '45% 40%';

	const once = () => {
		anime({
			targets: [leg(1), leg(2), leg(3), leg(4)],
			direction: 'alternate',
			translateY: [5, 0],
			delay: 20,
			duration: 800
		});

		anime({
			targets: monster,
			transformOrigin: [center, center],
			translateY: [-25, -30, 0],
			rotate: [-20, 20, 0],
			easing: 'linear',
			delay: 10,
			duration: 1980,
			complete: () => setTimeout(once, 100)
		});
	};

	once();
};

export const wave = (id) => {
	const target = document.getElementById(id);
	const lower_section = target.childNodes[2];
	const claw = lower_section.childNodes[4];
	const other_legs = Array.from(lower_section.childNodes).slice(1, 4);

	target.style.transition = '1s ease-in-out';
	target.style.right = '-5px';
	claw.style.transition = 'transform .8s ease-in-out';
	claw.style.transformOrigin = '50% 10%';
	claw.style.transform = 'rotate(-60deg)';

	for(let leg of other_legs) {
		leg.style.transition = '1s ease-in-out';
		leg.style.transformOrigin = '50% 10%';
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