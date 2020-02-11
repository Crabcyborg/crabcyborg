import * as assets from '$app/assets';

const head = {
	image: assets.elephant_head,
	style: { top: '76px', left: '92px', zIndex: 3, maxWidth: '90px', transform: 'rotate(10deg)', transformOrigin: '25% 25%' },
	antlers: {
		image: assets.rocky_mountain_sheep_horns,
		style: { maxWidth: '50px', zIndex: 4, transform: 'translateX(-12px) translateY(-86px)' }
	}
};

const torso = {
	image: assets.rooster_torso,
	style: { maxWidth: '74px', zIndex: 1, transform: 'rotate(40deg)' }
};

const legs = [
	{
		image: assets.polar_bear_leg_1,
		style: {  maxWidth: '36px', bottom: '46px', left: '24px', transformOrigin: '60% 15%' },
		foot: {
			image: assets.chimpanzee_foot_1,
			style: { right: '16px', bottom: '14px', transform: 'scale(1.3)', transformOrigin: '87% 17%' }
		}
	},
	{
		image: assets.ostrich_leg_2,
		style: { maxWidth: '24px', bottom: '54px', left: '6px', zIndex: 3, transformOrigin: '80% 10%' },
		foot: {
			image: assets.ibis_foot_2,
			style: { bottom: '6px', left: '6px', transform: 'scale(1.9)', transformOrigin: '30% 5%' }
		}
	},
	{
		image: assets.frog_leg_2,
		style: { maxWidth: '26px', bottom: '70px', right: '6px', transform: 'rotate(15deg)', transformOrigin: '10% 20%', },
		foot: {
			image: assets.frog_foot_2,
			style: { bottom: '8px', left: '6px', transformOrigin: '12% 4%' }
		}
	},
	{
		image: assets.zebra_leg_4,
		style: { maxWidth: '40px', bottom: '44px', transform: 'rotate(-10deg)', right: '16px', zIndex: 4, transformOrigin: '50% 10%' },
		foot: {
			image: assets.zebra_foot_4,
			style: { bottom: '12px', left: '6px', transformOrigin: '20% 10%', maxWidth: '26px' }
		}
	}
];

const tail = {
	image: assets.lemur_tail,
	style: { maxWidth: '40px', bottom: '156px', left: '26px', zIndex: 5, transformOrigin: '22% 90%' }
};

export var config = { head, torso, legs, tail };