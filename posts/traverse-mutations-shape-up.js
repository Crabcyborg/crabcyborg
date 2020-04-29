import m from 'mithril';
import { Gist, ShapeUp, GoToPost } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { Gradient, bestMethod, applyOnOff, applyOffOn, repositionBase49Limit, bounce } from '$app/shapeup/optimization-helper';
import { min } from 'min-string';
import { traverse as t } from '$app/traverse-grid';

export const title = 'Traverse Grid Mutations with Shape Up Components';

const example_size = 7;
const size = 5;
const visualize = method => t.pipe(method, t.visualize)(example_size, example_size);
const examples = {

};

export const oninit = () => {

    /*
    let keys = Object.keys(shapes);
	for(let key_index = 0; key_index < keys.length; ++key_index) {
		let key = keys[key_index];
		let shape = shapes[key];
        console.log({key, ...bestMethod(shape)});
    }   
    //*/ 
};

const Visualization = { view: v => m('pre.mono', visualize(v.attrs.method)) };

const Example = {
    oninit: v => {
        const { method } = v.attrs, shape = shapes[examples[method]], best = bestMethod(shape);
        v.state = { shape, best };
    },
    view: v => m(
        'div',
        m(ShapeUp, { configuration: v.state.shape, size }),
        m(
            '.mono',
            {},
            v.state.best.method, ' ',
            v.state.best.ratio, '% ',
            v.state.best.length, ' characters ',
            m('a.break', { href: `/shapeup/${v.state.best.string}`, target: '_blank' }, `/shapeup/${v.state.best.string}`) 
        )
    )
};

export const content = () => [
    "With traverse-grid it is really easy to apply mutations to methods. Let's see what we can come up with.",
    m('p', 'In an earlier post, ', m(GoToPost, {key: 'traversing-shape-up'}), ', I briefly go over several mutations including alternate, flip, reposition, bounce and rotate. It is also possible to apply any of the methods as a mutation as well using the mutate function.'),

    m(Gradient, { method: t.pipe(t.skip, t.reposition), width: example_size, height: example_size }),
    m(Gradient, { method: t.pipe(t.skip, t.reposition, t.reposition), width: example_size, height: example_size }),
    m(Gradient, { method: t.pipe(t.diagonal, t.reposition), width: example_size, height: example_size }),

];