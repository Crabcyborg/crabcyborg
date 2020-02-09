import * as assets from '$app/assets';

const head = {
	image: assets.bowhead_whale_head,
	style: { top: '42px', left: '84px', zIndex: 5, maxWidth: '54px' },
	antlers: {
		image: assets.koodoo_antlers,
		style: { maxWidth: '50px', zIndex: 4, transform: 'translateX(-20px) translateY(-60px)' }
	}
};

const torso = {
	image: assets.tiger_torso,
	style: { maxWidth: '90px', zIndex: 1 }
};

const legs = [
	{
		image: assets.water_buffalo_leg_1,
		style: { maxWidth: '22px', right: '10px', bottom: '40px', zIndex: 1 },
		foot: {
			image: assets.baboon_foot_1,
			style: { bottom: '8px', maxWidth: '20px', right: '8px' }
		}
	},
	{
		image: assets.water_buffalo_leg_2,
		style: { maxWidth: '30px', right: '10px', bottom: '50px' },
		foot: {
			image: assets.baboon_foot_2,
			style: { bottom: '10px', maxWidth: '20px', left: '5px' }
		}
	},
	{
		image: assets.water_buffalo_leg_3,
		style: { maxWidth: '22px', left: '8px', bottom: '52px' },
		foot: {
			image: assets.baboon_foot_3,
			style: { bottom: '8px', maxWidth: '12px', left: '0px' }
		}
	},
	{
		image: assets.water_buffalo_leg_4,
		style: { maxWidth: '22px', bottom: '65px', zIndex: 4, position: 'relative' },
		foot: {
			image: assets.lady_crab_claw,
			style: { position: 'absolute', top: '35px', left: '33px', zIndex: 1, maxWidth: '24px', transformOrigin: 'top left', transform: 'rotate(90deg)' }
		}
	}
];

const tail = {
	image: assets.peacock_tail,
	style: { maxWidth: '66px', transform: 'translateX(-48px) translateY(-36px) rotate(16deg)', zIndex: 2, transformOrigin: 'top right' }
};

export var config = { head, torso, legs, tail };