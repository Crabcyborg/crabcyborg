import * as assets from '$app/assets';

export var config = {
	style: {
		left: '50px'
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
			'max-width': '156px',
			top: '5px',
			right: '76px'
		}
	},
	legs: [
		{
			image: assets.lemur_leg_1,
			style: {
				bottom: '20px',
				right: '8px',
				'z-index': -1
			}
		},
		{
			image: assets.rooster_foot,
			style: {
				bottom: '26px',
				right: '14px',
				'z-index': -1,
				'max-width': '60px'
			}
		},
		{
			image: assets.lemur_leg_3,
			style: {
				bottom: '20px',
				right: '33px',
				'max-width': '29px'
			}
		},
		{
			image: assets.lemur_leg_4,
			style: {
				bottom: '30px',
				right: '38px',
				'z-index': 1,
				'max-width': '34px'
			}
		}
	]
};