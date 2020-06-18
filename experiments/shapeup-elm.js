import m from 'mithril';
import { ShapeUp } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { refactorColors } from '$app/shapeup/colors';
import { injectScript } from '$app/helpers';

const size = 6;
const elm_source_code_url = 'https://github.com/Crabcyborg/shape-up-elm/blob/master/src/Main.elm';

let colors = refactorColors('#ffffff');
let loaded_elm = false;
let app = false;

const oncreate = () => injectScript('/elm/render-shape-up.js', () => {
	loaded_elm = true;
});

const onUpdate = shapeup => {
	if(!loaded_elm) {
		setTimeout(() => onUpdate(shapeup), 5);
		return;
	}

	let { grid, width, height } = shapeup.state;

	grid = grid.flat().reduce(
		(total, cell) => {
            !cell.empty && total.push({
                x: cell.x,
                y: cell.y,
                color: colors[cell.color_index]
            });
            return total;
		},
		[]
	);

    const node = document.getElementById('elm-target');
	const payload = { grid, height, width };

	if(node) {
		app = Elm.Main.init({node, flags: payload});
	} else {
		app.ports.receiveData.send(payload);
	}
};

export var title = 'Rendering Shape Up using Elm';

export var experiment = {
    oncreate,
	view: v => [
		[
			m('#elm-wrapper', m('#elm-target')),
            m(ShapeUp, {configuration: shapes.DEER, size, behaviour: 'blink', blink_delay: 1000, onUpdate}),
			m('p', "I'm still trying to wrap my mind around functional programming, but I managed to get this experiment going! ", m('a', { href: elm_source_code_url }, 'Check out the Elm Source code here'), '.'),
			m('p', "This was my first time using Elm and it is really awesome. I just might try using it again.")
		]
	]
};