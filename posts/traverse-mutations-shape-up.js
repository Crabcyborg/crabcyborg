import m from 'mithril';
import { Gist, ShapeUp, GoToPost } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { Gradient, Example, bestMethod, methods } from '$app/shapeup/optimization-helper';
import { min } from 'min-string';
import { traverse as t } from '$app/traverse-grid';

export const title = 'Traverse Grid Mutations with Shape Up Components';

const example_size = 7;
const size = 5;

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

const Visualization = { view: v => m(Gradient, { method: v.attrs.method, height: example_size, width: example_size }) };

const Descriptor = { view: v => m('i.gray.f5.ml1', v.children) };

export const content = () => [
    "With traverse-grid it is really easy to apply mutations to methods.",
    m('p', 'In an earlier post, ', m(GoToPost, {key: 'traversing-shape-up'}), ', I briefly go over several mutations including alternate, flip, reposition, shift, waterfall, reflect, bounce and rotate.'),
    "Some other supported mutations applied to the horizontal pattern that do not outperform some of my preferred methods for my library:",
    m('h3', 'Stripe'),
    m(Visualization, { method: t.pipe(t.horizontal, t.stripe) } ),
    m('h3', 'Split'),
    m(Visualization, { method: methods.split }),
    "Mutations can be applied together as well, and any method can be turned into a mutation. These are some that I came up with. I gave a few of them names:",
    m('h3', m(Descriptor, 'diagonal + alternate')),
    m(Visualization, { method: t.pipe(t.diagonal, t.alternate) }),
    m('h3', 'Swirl', m(Descriptor, 'spiral + bounce + reposition + bounce')),
    m(Visualization, { method: methods.swirl }),
    m('h3', 'Donut', m(Descriptor, 'diamond + bounce')),
    m(Visualization, { method: methods.donut }),
    m('h3', 'Leap', m(Descriptor, 'alternate + diagonal + bounce')),
    m(Visualization, { method: methods.leap }),
    "The leap method is the best way to traverse our airplane.",
    m(Example, { method: 'leap' }),
    m('h3', 'Clover', m(Descriptor, 'reposition + spiral')),
    m(Visualization, { method: methods.clover }),
    m('h3', 'Bacon', m(Descriptor, 'diagonal + reposition')),
    m(Visualization, { method: methods.bacon }),
    m('h3', 'Bow', m(Descriptor, 'diamond + reflect')),
    m(Visualization, { method: t.pipe(t.diamond, t.reflect) }),
    m('h3', m(Descriptor, 'bounce + reflect + reposition')),
    m(Visualization, { method: t.pipe(methods.bounce, t.reflect, t.reposition) }),
    m('h3', m(Descriptor, 'split + swap + reflect + swap + reflect')),
    m(Visualization, { method: t.pipe(methods.split, t.swap, t.reflect, t.swap, t.reflect) }),
];