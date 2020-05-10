import m from 'mithril';
import { Gist, ShapeUp, GoToPost } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { Gradient, Example, bestMethod, bestSeed, applyOffOn, repositionBase49Limit, methods, cascade } from '$app/shapeup/optimization-helper';
import { min } from 'min-string';
import { traverse as t } from 'traverse-grid';

export const title = 'Traverse Grid Mutations';

const example_size = 7;
const size = 5;

export const oninit = () => {
    /*
    const shape = shapes.RUBY;
    console.log(bestMethod(shape));
    let from = Math.floor(Math.random() * 1000000);
    let count = 10000;
    console.log(from, bestSeed(shape, from, from + count));
    */

    /*
    let keys = Object.keys(shapes);
	for(let key_index = 0; key_index < keys.length; ++key_index) {
		let key = keys[key_index];
        let shape = shapes[key];
        const { best, ratio } = bestMethod(shape);
        console.log({key, length: best.length, methods: best.methods.join(', '), ratio, best});
    }   
    //*/ 
};

const Visualization = { view: v => m(Gradient, { method: v.attrs.method, height: v.attrs.height || example_size, width: v.attrs.width || example_size }) };
const Descriptor = { view: v => m('i.gray.f5.ml1', v.children) };

export const content = () => [
    "With traverse-grid it is really easy to apply mutations to methods. The focus of this post is to show some of the fun combinations.",
    m('h3', 'Pulse (corner)'),
    m(Visualization, { method: t.pulse('corner') }),
    'Can also be recreated with corner (crawl) + invert + flip (xy) + swap.',
    m(Visualization, { method: t.pipe(t.corner('crawl'), t.invert, t.flip('xy'), t.swap ) }),
    m('h3', m(Descriptor, 'diagonal + alternate')),
    m(Visualization, { method: t.pipe(t.diagonal, t.alternate()) }),
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
    m('h3', m(Descriptor, 'corner (out) + smooth')),
    m(Visualization, { method: t.pipe(t.corner('out'), t.smooth()) }),
    m('h3', m(Descriptor, 'waterfall + reflect')),
    m(Visualization, { method: t.pipe(t.horizontal, t.waterfall, t.reflect) }),
    m('h3', m(Descriptor, 'concatenate (vertical, sliced spiral + waterfall)')),
    m(Visualization, { method: (height, width) => t.pipe(t.spiral, t.slice({ top: 2 }))(height, width).concatenate(methods.waterfall(3,3), 'vertical')}),
    m('h3', m(Descriptor, 'concatenate (vertical, sliced diamond + spiral)')),
    m(Visualization, { method: (height, width) => t.pipe(t.diamond, t.slice({ top: 3 }))(example_size, example_size).concatenate(t.spiral(3, 3), 'vertical')}),
    m('h3', m(Descriptor, 'concatenate (horizontal, sliced diamond + reposition)')),
    m(Visualization, { method: () => t.pipe(t.diamond, t.slice({ top: 3 }))(example_size, example_size).concatenate(methods.reposition(8, 3), 'horizontal')}),
    m('h3', 'Cinnamon Roll', m(Descriptor, 'tiled 3x3 spiral')),
    m(Visualization, { method: methods.cinnamon_roll }),
    m('h3', 'Rotated Watertile'),
    m(Visualization, { method: methods.rotated_watertile }),
    m('h3', 'Bounce 2'),
    m(Visualization, { method: methods.bounce2 }),
    m('h3', 'Cascade 3'),
    m(Visualization, { method: methods.cascade3 }),
    m('h3', 'Cascade 4'),
    m(Visualization, { method: methods.cascade4 }),
    m('h3', 'Skew 2'),
    m(Visualization, { method: methods.skew2 }),
    m('h3', 'Skew 3'),
    m(Visualization, { method: methods.skew3 }),
    m('h3', 'Reposition 2'),
    m(Visualization, { method: methods.reposition2 }),
    m('h3', 'Reposition 3'),
    m(Visualization, { method: methods.reposition3 }),
    m('h3', m(Descriptor, 'watertile + alternate + reposition')),
    m(Visualization, { method: t.pipe(methods.watertile, t.alternate(), t.reposition) }), 
    m('h3', 'Slide (3)'),
    m(Visualization, { method: methods.slide3 }),
    m('h3', m(Descriptor, 'waterfall + spiral')),
    m(Visualization, { method: t.pipe(t.horizontal, t.waterfall, t.mutate(t.spiral)) })
];