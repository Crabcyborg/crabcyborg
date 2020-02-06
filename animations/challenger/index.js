export const wave = (id) => {
	const target = document.getElementById(id);
	const lower_section = target.childNodes[2];
	const claw = lower_section.childNodes[4];
	const other_legs = [lower_section.childNodes[1], lower_section.childNodes[2], lower_section.childNodes[3]];

	target.style.transition = '1s ease-in-out';
	target.style.left = '60px';

	claw.style.transition = 'transform .8s ease-in-out';
	claw.style['transform-origin'] = '10% 10%';
	claw.style.transform = 'rotate(-60deg)';

	for(let leg of other_legs) {
		leg.style.transition = '1s ease-in-out';
		leg.style['transform-origin'] = '50% 10%';
		leg.style.transform = 'rotate(5deg)';
	}

	setTimeout(() => {
		target.style.left = '55px';
		claw.style.transform = 'rotate(0deg)';

		for(let leg of other_legs) {
			leg.style.transform = 'rotate(0deg)';
		}
	}, 900);

	setTimeout(() => wave(id), 2000);
};