import m from 'mithril';
import { Logo, Posts } from '$app/components';

export var Home = {
	view: v => [m(Logo), m(Posts)]
};