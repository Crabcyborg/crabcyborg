import * as assets from '$app/assets';

const head = {
	image: assets.giraffe_head,
	style: { top: '62px', left: '72px', zIndex: 3, maxWidth: '31px', transformOrigin: '40% 46%' }
};

const torso = {
	image: assets.porbeagle_shark_torso,
	style: { maxWidth: '90px', top: '6px', right: '30px', zIndex: 1 }
};

const legs = [
	{
		image: assets.rhino_leg_1,
		style: { bottom: '25px', right: '8px', zIndex: 1, maxWidth: '26px' },
		foot: {
			image: assets.tiger_foot_1,
			style: { bottom: '6px', left: '3px' }
		}
	},
	{
		image: assets.leopard_leg_2,
		style: { maxWidth: '40px', right: '10px', bottom: '25px' },
		foot: {
			image: assets.rooster_foot,
			style: { bottom: '5px', left: '10px', zIndex: -1, maxWidth: '40px' }
		}
	},
	{
		image: assets.lemur_leg_3,
		style: { bottom: '32px', right: '13px', maxWidth: '29px', zIndex: 3 },
		foot: {
			image: assets.leopard_foot_3,
			style: { bottom: '8px', maxWidth: '30px', right: '2px' }
		}
	},
	{
		image: assets.lemur_leg_4,
		style: { bottom: '46px', right: '20px', zIndex: 2, maxWidth: '34px' }
	}
];

const tail = {
	image: assets.porbeagle_shark_tail,
	style: { maxWidth: '62px', transform: 'translateX(-60px) translateY(-45px) rotate(10deg)', transformOrigin: '100% 60%' }
}

const wings = [
	{
		image: assets.red_snapper_back,
		style: { transform: 'translateY(-63px) scaleX(-1) rotate(-12deg)', maxWidth: '90px', zIndex: 2 }
	}
];

export var config = { style: { left: '40px' }, head, torso, legs, tail, wings };