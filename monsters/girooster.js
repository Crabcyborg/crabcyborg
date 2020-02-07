import * as assets from '$app/assets';

export var config = {
	style: {
		left: '40px'
	},
	head: {
		image: assets.giraffe_head,
		style: {
			top: '62px',
			left: '79px',
			'z-index': 1,
			'max-width': '31px'
		}
	},
	torso: {
		image: assets.porbeagle_shark_torso,
		style: {
			'max-width': '90px',
			top: '6px',
			right: '30px'
		}
	},
	legs: [
		{
			image: assets.rhino_leg_1,
			style: {
				bottom: '35px',
				right: '8px',
				'z-index': 1,
				'max-width': '26px'
			},
			foot: {
				image: assets.tiger_foot_1,
				style: {
					bottom: '4px',
					left: '3px'
				}
			}
		},
		{
			image: assets.leopard_leg_2,
			style: {
				'max-width': '40px',
				right: '10px',
				bottom: '35px',
				zIndex: -1
			},
			foot: {
				image: assets.rooster_foot,
				style: {
					bottom: '5px',
					left: '10px',
					'z-index': -1,
					'max-width': '40px'
				}
			}
		},
		{
			image: assets.lemur_leg_3,
			style: {
				bottom: '42px',
				right: '13px',
				'max-width': '29px',
			},
			foot: {
				image: assets.leopard_foot_3,
				style: {
					bottom: '8px',
					'max-width': '30px',
					right: '2px'
				}
			}
		},
		{
			image: assets.lemur_leg_4,
			style: {
				bottom: '55px',
				right: '14px',
				'z-index': 1,
				'max-width': '34px'
			}
		}
	],
	tail: {
		image: assets.porbeagle_shark_tail,
		style: {
			'max-width': '62px',
			transform: 'translateX(-60px) translateY(-60px) rotate(10deg)',
			'z-index': -1,
			'transform-origin': '100% 60%'
		}
	},
	wings: [
		{
			image: assets.red_snapper_back,
			style: {
				transform: 'translateY(-63px) scaleX(-1) rotate(-12deg)',
				'max-width': '90px'
			}
		}
	]
};