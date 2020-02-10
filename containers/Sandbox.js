import m from 'mithril';
import { Monster } from '$app/components';
import { config as girooster } from '$app/monsters/girooster';
import { config as lady_tiger } from '$app/monsters/lady-tiger';



import * as assets from '$app/assets';

const head = {
	image: assets.elephant_head,
	style: { top: '80px', left: '92px', zIndex: 3, maxWidth: '90px', transform: 'rotate(10deg)' },
/*	antlers: {
		image: assets.koodoo_antlers,
		style: { maxWidth: '50px', zIndex: 4, transform: 'translateX(-20px) translateY(-60px)' }
	}*/
};

const torso = {
	image: assets.rooster_torso,
	style: { maxWidth: '74px', zIndex: 1, transform: 'rotate(40deg)' }
};

const legs = [
	{
		image: assets.polar_bear_leg_1,
		style: { 
			maxWidth: '36px',
			bottom: '46px',
			left: '24px'
		},
		foot: {
			image: assets.chimpanzee_foot_1,
			style: {
				right: '16px',
				bottom: '6px',
				transform: 'rotate(90deg) scale(1.3)'
			}
		}
	},
	{
		image: assets.ostrich_leg_2,
		style: {
			maxWidth: '24px',
			bottom: '50px',
			left: '6px',
			zIndex: 3
		},
		foot: {
			image: assets.ibis_foot_2,
			style: {
				bottom: '2px',
				left: '10px',
				transform: 'scale(1.8)'
			}
		}
	},
	{
		image: assets.lobster_leg_3,
		style: {
			maxWidth: '30px',
			bottom: '50px',
			right: '10px',
			transform: 'rotate(6deg)'
		},
		foot: {
			image: assets.polar_bear_foot_3,
			style: {
				bottom: '13px',
				left: '16px'
			}
		}
	},
	{
		image: assets.zebra_leg_4,
		style: {
			maxWidth: '34px',
			bottom: '54px',
			transform: 'rotate(-10deg)',
			right: '16px'
		},
		foot: {
			image: assets.zebra_foot_4,
			style: {
				bottom: '5px'
			}
		}
	}



	/*
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
	*/
];

const tail = false/*{
	image: assets.peacock_tail,
	style: { maxWidth: '66px', transform: 'translateX(-48px) translateY(-36px) rotate(16deg)', zIndex: 2, transformOrigin: 'top right' }
};*/

const config = { head, torso, legs, tail };



export var Sandbox = {
	view: v => {
		return [
			m('.tc.center', { style: { height: '200px' } }, m(Monster, {configuration: config})),			
			m('.tc.center', { style: { height: '155px' } }, m(Monster, {configuration: girooster})),
			m('.tc.center', { style: { height: '200px' } }, m(Monster, {configuration: lady_tiger}))
		]
	}
};