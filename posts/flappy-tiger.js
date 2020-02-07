import m from 'mithril';
import { config as lady_tiger } from '$app/monsters/lady-tiger';
import { Caption, Gist, Monster } from '$app/components';
import * as assets from '$app/assets';

export const title = 'Flappy Tiger';

const yMax = 174;
let ySpeed = 0;

const flap = (id) => {
	const target = document.getElementById(id);
	const midsection = target.childNodes[1];
	const wings = [midsection.childNodes[1], midsection.childNodes[2]];
	const backup_wing_transforms = [wings[0].style.transform, wings[1].style.transform];

	ySpeed = Math.max(ySpeed - 80, -120);
	wings[0].style.transform = 'scaleY(-1) rotate(40deg)';
	wings[1].style.transform = 'rotate(80deg)';
	target.style.transform = 'rotate(-10deg)';

	setTimeout(() => {
		wings[0].style.transform = backup_wing_transforms[0];
		wings[1].style.transform = backup_wing_transforms[1];
		target.style.transform = 'rotate(0deg)';
	}, 900);
};

const gravity = (id) => {
	const target = document.getElementById(id);

	setInterval(() => {
		ySpeed += 1;
		let top = parseFloat(target.style.top) + ySpeed;

		if(top >= yMax) {
			top = yMax;
			ySpeed = 0;
		}

		target.style.top = top+'px';
	}, 10);
};

export const oninit = () => {
	gravity('flap-target');

	let last_flap = false;
	document.getElementById('flappy-bird').addEventListener('click', (event) => {
		let now = new Date().getTime();
		if(!last_flap || last_flap < now - 2100) {
			flap('flap-target');
			last_flap = now;
		}
	});
};

const lady_tiger_with_wings = {
	...lady_tiger,
	style: 'top: '+yMax+'px; transition: 1s ease-in-out;',
	wings: [
		{
			image: assets.bat_wing_1,
			style: {
				bottom: '120px',
				'z-index': -1,
				'width': '43px',
				'transform-origin': '62% 79%',
				transform: 'rotate(40deg)',
				left: '20px',
				transition: '.5s ease-in-out'
			}
		},
		{
			image: assets.bat_wing_2,
			style: {
				bottom: '87px',
				transform: 'scaleX(-1) rotate(-40deg)',
				'transform-origin': '3% 36%',
				'z-index': 5,
				'width': '64px',
				left: '57px',
				transition: '.5s ease-in-out'
			}
		}
	]
};

export const content = [
	"In this tutorial, we're going to give Lady Tiger some wings and teach her how to fly!",
	m(
		'#flappy-bird.tc.center.overflow-hidden',
		{
			style: {
				'max-width': '600px',
				height: '300px',
				border: '1px solid #ddd'
			}
		},
		m(Monster, {id: 'flap-target', configuration: lady_tiger_with_wings})
	),
	m(Caption, 'Touch the box to flap!')
];

export const previous = 'animating-your-amalgamation-of-animal-appendages';
export const next = 'a-challenger-appears';