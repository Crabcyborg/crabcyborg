import m from 'mithril';
import { ShapeUp } from '$app/components';

export var Shape = {
	view: v => m(ShapeUp, {size: 10, configuration: v.attrs.shape.split(','), behaviour: 'blink', blink_delay: 500})
};