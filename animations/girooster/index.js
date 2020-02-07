export const wave = (id) => {
	const target = document.getElementById(id);
	const lower_section = target.childNodes[2];
	const claw = lower_section.childNodes[4];
	const other_legs = [lower_section.childNodes[1], lower_section.childNodes[2], lower_section.childNodes[3]];

	const tail = lower_section.childNodes[0];

	const original_tail_transform = tail.style.transform;
	tail.style.transition = '1s ease-in-out';
	tail.style.transform = 'translateX(-60px) translateY(-60px) rotate(-10deg)';

	target.style.transition = '1s ease-in-out';
	target.style.left = '45px';

	claw.style.transition = 'transform .8s ease-in-out';
	claw.style['transform-origin'] = '10% 10%';
	claw.style.transform = 'rotate(-60deg)';

	for(let leg of other_legs) {
		leg.style.transition = '1s ease-in-out';
		leg.style['transform-origin'] = '50% 10%';
		leg.style.transform = 'rotate(5deg)';
	}

	setTimeout(() => {
		target.style.left = '40px';
		claw.style.transform = 'rotate(0deg)';
		tail.style.transform = original_tail_transform;

		for(let leg of other_legs) {
			leg.style.transform = 'rotate(0deg)';
		}
	}, 900);

	setTimeout(() => wave(id), 2000);
};