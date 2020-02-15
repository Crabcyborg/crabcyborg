import m from 'mithril';
import { config as lady_tiger } from '$app/monsters/lady-tiger';
import { Caption, Gist, Monster } from '$app/components';
import * as assets from '$app/assets';

export const title = 'Flappy Tiger';

const yMax = 164;
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
				bottom: '110px',
				width: '43px',
				transformOrigin: '62% 79%',
				transform: 'rotate(40deg)',
				left: '20px',
				transition: '.5s ease-in-out'
			}
		},
		{
			image: assets.bat_wing_2,
			style: {
				bottom: '77px',
				transform: 'scaleX(-1) rotate(-40deg)',
				transformOrigin: '3% 36%',
				zIndex: 5,
				width: '64px',
				left: '57px',
				transition: '.5s ease-in-out'
			}
		}
	]
};

export const content = () => [
	"The Monster component already includes support for a Wing component, but Lady Tiger wasn't taking any advantage!",
	"Since Lady Tiger doesn't want to have wings every day, we can just copy her configuration and use our new winged version instead!",
	m(Gist, {id: 'config-js', gistId: 'ccca084d3f53d5f591421bd62b10acbc'}),
	"And what are wings without flying.",
	m(
		'#flappy-bird.tc.center.overflow-hidden.relative',
		{
			style: {
				maxWidth: '600px',
				height: '300px',
				border: '1px solid #ddd'
			}
		},
		m(
			'.absolute.overflow-hidden',
			{style: {width: '600px', height: '300px', right: 0}},
			m('img', {src: assets.cliff})
		),
		m(Monster, {id: 'flap-target', configuration: lady_tiger_with_wings})
	),
	m(Caption, 'Touch the box to flap!'),
	"This wonderful, totally feature complete game consists of two simple functions, two commonly shared variables (yMax and ySpeed), and some pretty simple initialization code.",
	m(Gist, {title: "Flap Function", id: 'flap-js', gistId: 'c28a2862adb7e1f5bc039ac8d92e3eaa'}),
	m(Gist, {title: "Gravity Function", id: 'gravity-js', gistId: '24cddd9fab979f5265f2d09823c2265c'}),
	m(Gist, {title: "Initialization Script", id: 'init-js', gistId: '28e3064a9bfbd299eed6de8b9186398e'}),
	m('h3', "What's next?"),
	"We probably want to add obstacles and scoring. Give it a shot and make a pull request!"
];

export const previous = 'animating-your-amalgamation-of-animal-appendages';
export const next = 'a-challenger-appears';