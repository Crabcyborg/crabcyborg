import * as assets from '$app/assets';

export var config = {
	head: {
		image: assets.bowhead_whale_head,
		style: {
			top: '42px',
			left: '84px',
			'z-index': 5,
			'max-width': '54px'
		},
		antlers: {
			image: assets.koodoo_antlers,
			style: {
				'max-width': '50px',
				'z-index': 4,
				transform: 'translateX(-20px) translateY(-60px)',
			}
		}
	},
	torso: {
		image: assets.tiger_torso,
		style: {
			'max-width': '90px',
			'z-index': 1
		}
	},
	legs: [
		{
			image: assets.water_buffalo_leg_1,
			style: {
				'max-width': '22px',
				right: '10px',
				bottom: '54px',
				zIndex: 1
			},
			foot: {
				image: assets.baboon_foot_1,
				style: {
					bottom: '8px',
					'max-width': '20px',
					right: '8px'
				}
			}
		},
		{
			image: assets.water_buffalo_leg_2,
			style: {
				'max-width': '30px',
				right: '10px',
				bottom: '60px'
			},
			foot: {
				image: assets.baboon_foot_2,
				style: {
					bottom: '5px',
					'max-width': '20px',
					left: '5px'
				}
			}
		},
		{
			image: assets.water_buffalo_leg_3,
			style: {
				'max-width': '22px',
				left: '8px',
				bottom: '62px'
			},
			foot: {
				image: assets.baboon_foot_3,
				style: {
					bottom: '8px',
					'max-width': '12px',
					left: '0px'
				}
			}
		},
		{
			image: assets.water_buffalo_leg_4,
			style: {
				'max-width': '22px',
				bottom: '80px',
				zIndex: 4,
				position: 'relative'
			},
			foot: {
				image: assets.lady_crab_claw,
				style: {
					position: 'absolute',
					top: '35px',
					left: '33px',
					zIndex: 1,
					'max-width': '24px',
					'transform-origin': 'top left',
					transform: 'rotate(90deg)'
				}
			}
		}
	],
	tail: {
		image: assets.peacock_tail,
		style: {
			'max-width': '66px',
			transform: 'translateX(-48px) translateY(-52px) rotate(16deg)',
			'z-index': 2,
			'transform-origin': 'top right'
		}
	}
};