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
    m('h3', 'Vertical'),
    m(Visualization, { method: t.vertical }),
    'Vertical is really nothing special. In fact, it is just a rotated horizontal method.',
    m('h3', 'Alternate (diagonal)'),
    m(Visualization, { method: methods.alternate_diagonal }),
    m('h3', 'Skew'),
    m(Visualization, { method: methods.skew } ),
    m('h3', 'Flip (x)'),
    m(Visualization, { method: t.pipe(t.horizontal, t.flip('x')) } ),
    m('h3', 'Flip (y)'),
    m(Visualization, { method: t.pipe(t.horizontal, t.flip('y')) } ),
    m('h3', 'Flip (xy)'),
    m(Visualization, { method: t.pipe(t.vertical, t.flip('xy')) } ),
    m('h3', 'Stripe'),
    m(Visualization, { method: methods.stripe } ),
    m('h3', 'Split'),
    m(Visualization, { method: methods.split }),
    m('h3', 'Shift'),
    'Shift might be the simplest mutation of all. It just starts from somewhere else than the beginning. In this case, I start from half way',
    m(Visualization, { method: methods.shift }),
    "Mutations can be applied together as well, and any method can be turned into a mutation. These are some that I came up with. I gave a few of them names:",
    m('h3', m(Descriptor, 'diagonal + alternate')),
    m(Visualization, { method: methods.alternate }),
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
    m('h3', m(Descriptor, 'reposition + smooth (straight x2)')),
    m(Visualization, { method: t.pipe(t.horizontal, t.reposition, t.smooth('straight', 2)) } ),
    m('h3', m(Descriptor, 'smooth (straight x6)')),
    m(Visualization, { method: t.pipe(t.horizontal, t.smooth('straight', 6)) } ),
    m('h3', m(Descriptor, 'bounce + smooth (straight x5)')),
    m(Visualization, { method: t.pipe(t.horizontal, t.bounce, t.smooth('straight', 5)) } ),
    m('h3', 'Smooth (x5)'),
    m(Visualization, { method: t.pipe(t.horizontal, t.smooth('default', 5)) }),
    m('h3', 'Smooth (straight x5)'),
    m(Visualization, { method: t.pipe(t.horizontal, t.smooth('straight', 5)) }),
    m('h3', m(Descriptor, 'diagonal + smooth (x3)')),
    m(Visualization, { method: t.pipe(t.diagonal, t.smooth('default', 3)) }),
    m('h3', m(Descriptor, 'spiral + smooth (x2)')),
    m(Visualization, { method: t.pipe(t.spiral, t.smooth('default', 2)) }),
    m('h3', m(Descriptor, 'diamond + smooth')),
    m(Visualization, { method: t.pipe(t.diamond, t.smooth()) }),
    m('h3', m(Descriptor, 'bounce + smooth (x4)')),
    m(Visualization, { method: t.pipe(t.horizontal, t.bounce, t.smooth('default', 4)) }),
    m('h3', m(Descriptor, 'donut + smooth (straight x2)')),
    m(Visualization, { method: t.pipe(methods.donut, t.smooth('straight', 2)) }),
    m('h3', m(Descriptor, 'spiral + smooth (straight x2)')),
    m(Visualization, { method: t.pipe(t.spiral, t.smooth('straight')) }),
    m('h3', m(Descriptor, 'tile (spiral 3x3)')),
    m(Visualization, { method: t.tile(t.spiral(3,3)) }),
    m('h3', m(Descriptor, 'tile (diamond 3x3)')),
    m(Visualization, { method: t.tile(t.diamond(3,3)) }),
];