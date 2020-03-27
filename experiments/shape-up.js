import m from 'mithril';
import { ShapeUp, TargetShape, Score, Trigger } from '$app/components';
import { shapes } from '$app/shapeup/shapes-optimized';
import { raw } from '$app/shapeup/optimization-helper';

const configuration_keys = Object.keys(shapes);
var configuration_index = 0;
const shape_size = 6;
const target_size = 4;

export var title = 'Shape Up';

export var experiment = {
	view: v => [
		m(
			'.dib.mr2',
			configuration_keys.map(
				key => m(
					'div',
					m(
						Trigger,
						{
							onclick: () => {
								configuration_index = configuration_keys.indexOf(key);
								ShapeUp.trigger({task: 'redraw', i: 'shapeup'});
							}
						},
						key
					)
				)
			)
		),
		m(
			'div',
			{ style: { position: 'fixed', top: '20px', left: '100px' } },
			m(
				ShapeUp,
				{
					i: 'shapeup',
					configuration: () => raw(shapes[configuration_keys[configuration_index]]),
					size: shape_size,
					behaviour: 'click-target',
					blink_delay: 1000,
					style: { marginRight: '10px' }
				}
			),
			m(
				'.absolute',
				{
					style: {
						top: 0,
						bottom: 0,
						left: (raw(shapes[configuration_keys[configuration_index]])[1]*shape_size + 60)+'px',
						width: (raw(shapes[configuration_keys[configuration_index]])[1]*target_size) * 1.25+'px',
						border: '1px solid #efefef'
					}
				},
				m(TargetShape, {i: 'shapeup', size: target_size, style: { top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)' }})
			),
			m(Score, {i: 'shapeup', style: { position: 'absolute', left: (raw(shapes[configuration_keys[configuration_index]])[1]*(shape_size+target_size*1.25) + 80)+'px' }}),
			m(
				Trigger,
				{
					onclick: () => {
						configuration_index = (configuration_index + 1) % configuration_keys.length;
						ShapeUp.trigger({task: 'redraw', i: 'shapeup'})
					}
				},
				'Next'
			)
		)
	]
};