import m from 'mithril';

export var Foot = {
	view: function(v) {
		return m(
			'img.relative',
			{
				style: { ...v.attrs.style },
				src: v.attrs.image
			}
		);
	}
};