import m from 'mithril';
import { ShapeUp, TargetShape, Score } from '$app/components';
import { shapes } from '$app/shapeup/shapes';

const logo_size = 6;
const target_size = 3;

export var Logo = {
	view: v => {
		const on_homepage = m.route.get() === '/';
		return m(
			'.dib.relative',
			{
				onclick: on_homepage ? false : () => m.route.set('/')
			},
			m(ShapeUp, {i: 'logo', size: logo_size, configuration: shapes.LOGO, behaviour: on_homepage ? 'click-target' : false}),
			on_homepage && [
				m(
					'.absolute',
					{
						style: {
							top: 0,
							bottom: 0,
							left: (shapes.LOGO[1]*logo_size + 20)+'px',
							width: (shapes.LOGO[1]*target_size*.6)+'px',
							border: '1px solid #efefef'
						}
					},
					m(TargetShape, {i: 'logo', size: target_size, style: { top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)' }})
				),
				m(Score, {i: 'logo', style: { position: 'absolute', left: (shapes.LOGO[1]*(logo_size+target_size*.6) + 40)+'px' }})
			]
		);
	}
};