import m from 'mithril';
import { ShapeUp, TargetShape } from '$app/components';
import { shapes } from '$app/shapeup/shapes';

export var Logo = {
	view: v => {
		const on_homepage = m.route.get() === '/';

		return m(
			'a.dib',
			{
				href: on_homepage ? false : '/'
			},
			m(ShapeUp, {i: 'logo', size: 6, configuration: shapes.LOGO, behaviour: on_homepage ? 'click-target' : false}),
			on_homepage && m(
				'.absolute',
				{
					style: {
						border: '1px solid #eee',
						padding: '5px',
						display: 'inline-block',
						top: '40px',
						left: '160px'
					}
				},
				m(TargetShape, {i: 'logo', size: 4})
			)
		);
	}
};