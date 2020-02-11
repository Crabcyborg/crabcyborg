import anime from 'animejs/lib/anime.es.js';

export const bounce = id => {
	const monster = '#'+id;
	const child = ' > *:nth-child';
	const lowersection = `${monster}${child}(3)`;
	const leg = `${lowersection}${child}`;
	const foot = `${child}(2)`;

	anime({targets: monster, translateY: '50px'})
	anime({targets: `${leg}(2)`, rotate: [-10, 60]});
	anime({targets: `${leg}(3)`, rotate: [-10, 80]});
	anime({targets: `${leg}(4)`, rotate: [10, -60]});
	anime({targets: `${leg}(5)`, rotate: [10, -60]});
	anime({targets: `${leg}(2)${foot}`, rotate: -160});
	anime({targets: `${leg}(3)${foot}`, rotate: -120});
	anime({targets: `${leg}(4)${foot}`, rotate: 180});
	anime({targets: `${leg}(5)${foot}`, rotate: 160, complete: () => {
		anime({targets: monster, translateY: '0px'});
		anime({
			targets: [
				`${leg}(2)`,
				`${leg}(3)`,
				`${leg}(4)`,
				`${leg}(5)`,
				`${leg}(2)${foot}`,
				`${leg}(3)${foot}`,
				`${leg}(4)${foot}`,
				`${leg}(5)${foot}`
			],
			rotate: 0,
			complete: () => bounce(id)
		});
	}});
};