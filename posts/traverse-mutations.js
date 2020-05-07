import m from 'mithril';
import { Gist, ShapeUp, GoToPost } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { Gradient, Example, bestMethod, bestSeed, applyOffOn, repositionBase49Limit, methods } from '$app/shapeup/optimization-helper';
import { min } from 'min-string';
import { traverse as t } from 'traverse-grid';

export const title = 'Traverse Grid Mutations';

const example_size = 7;
const size = 5;
let triangle;

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

    triangle = t.triangle(example_size, example_size);
    triangle.visualization = (() => {
        let { spike } = triangle, visualization = [];
        const { keyed, height, width } = triangle.triangle;
        for(let y = 0; y < height; ++y) {
            let row = [];    
            for(let x = 0; x < width; ++x) {
                if(keyed[[x,y]] !== undefined) {
                    row.push(`${keyed[[x,y]]}`.padStart(2,'0'));
                } else {
                    if(x >= spike.width && x < width-spike.width && y >= spike.height && y < height-spike.height) {
                        row.push('__');
                    } else {
                        row.push('  ');
                    }
                }
            }
        
            visualization.push(row.join(' '));
        }

        return visualization.join('\n');
    })();
    triangle.trimmed = (() => {
        let { spike } = triangle, trimmed = [];
        const { keyed, height, width } = triangle.triangle;
        for(let y = spike.height; y < example_size+spike.height; ++y) {
            let row = [];
            for(let x = spike.width; x < example_size+spike.width; ++x) row.push(`${keyed[[x,y]]}`.padStart(2,'0'));
            trimmed.push(row.join(' '));
        }

        return trimmed.join('\n');
    })();
    triangle.actual_on_off_triangle = [9,17,72,81];
    triangle.actual_on_off_triangle_swapped_dimensions = [17,9,72,81];

    triangle.actual_triangle_configuration = applyOffOn(triangle.actual_on_off_triangle, t.triangle);
    triangle.actual_triangle_compressed = repositionBase49Limit(triangle.actual_on_off_triangle);
    triangle.actual_triangle_url = `/shapeup/--${triangle.actual_triangle_compressed}`;
    triangle.flipped = t.pipe(t.triangle, t.flip('y'))(example_size, example_size);
    triangle.flipped_configuration = applyOffOn(triangle.actual_on_off_triangle, t.pipe(t.triangle, t.flip('y')));
    triangle.flipped_compressed = repositionBase49Limit(triangle.actual_on_off_triangle);
    triangle.flipped_url = `/shapeup/~~${triangle.flipped_compressed}`;
    triangle.rotated = t.pipe(t.triangle, t.swap)(example_size, example_size);
    triangle.rotated_configuration = applyOffOn(triangle.actual_on_off_triangle_swapped_dimensions, t.triangle, true);
    triangle.rotated_compressed = repositionBase49Limit(triangle.actual_on_off_triangle_swapped_dimensions);
    triangle.rotated_url = `/shapeup/\`\`${triangle.rotated_compressed}`;
};

const Visualization = { view: v => m(Gradient, { method: v.attrs.method, height: v.attrs.height || example_size, width: v.attrs.width || example_size }) };

const Descriptor = { view: v => m('i.gray.f5.ml1', v.children) };

export const content = () => [
    "With traverse-grid it is really easy to apply mutations to methods.",
    m('p', 'In an earlier post, ', m(GoToPost, {key: 'traversing-shape-up'}), ', I briefly go over several mutations including alternate, flip, reposition, waterfall, reflect, bounce and rotate.'),
    "Some other supported mutations applied to the horizontal pattern that do not outperform some of my preferred methods for my library:",
    m('h3', 'Vertical'),
    m(Visualization, { method: t.vertical }),
    'Vertical is really nothing special. In fact, it is just a rotated horizontal method.',
    m('h3', 'Alternate (diagonal)'),
    m(Visualization, { method: methods.alternate_diagonal }),
    m('h3', 'Cascade'),
    m(Visualization, { method: t.cascade }),
    m('h3', 'Climb'),
    m(Visualization, { method: t.climb }),
    m('h3', 'Fan'),
    m(Visualization, { method: t.fan }),
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
    m('h3', 'Fold'),
    m(Visualization, { method: methods.fold } ),
    m(Visualization, { method: t.pipe(t.horizontal, t.swap, t.fold, t.swap) } ),
    m('h3', 'Split'),
    m(Visualization, { method: methods.split }),
    m('h3', 'Trade'),
    m(Visualization, { method: t.pipe(t.horizontal, t.trade) }),
    m('h3', 'Shift'),
    'Shift might be the simplest mutation of all. It just starts from somewhere else than the beginning. In this case, I start from half way',
    m(Visualization, { method: methods.shift }),
    m('h3', 'Seed'),
    m(Visualization, { method: t.seed(746387463287648372) }),
    m(Visualization, { method: t.seed(14) }),
    m(Visualization, { method: t.seed(487328947239847) }),
    m('h3', 'Step (2)'),
    m(Visualization, { method: t.pipe(t.horizontal, t.step(2)) }),
    m('h3', 'Step (3)'),
    m(Visualization, { method: t.pipe(t.horizontal, t.step(3)) }),
    m('h3', 'Step (4)'),
    m(Visualization, { method: t.pipe(t.horizontal, t.step(4)) }),
    m('h3', 'Step (5)'),
    m(Visualization, { method: t.pipe(t.horizontal, t.step(5)) }),
    m('h3', 'Step (7)'),
    m(Visualization, { method: t.pipe(t.horizontal, t.step(7)) }),
    m('h3', 'Corner (out)'),
    m(Visualization, { method: t.corner('out') }),
    m('h3', 'Corner (in)'),
    m(Visualization, { method: t.corner('in') }),
    m('h3', 'Corner (crawl)'),
    m(Visualization, { method: t.corner('crawl') }),
    m('h3', 'Pulse (edge)'),
    m(Visualization, { method: methods.pulse_edge }),
    m('h3', 'Pulse (corner)'),
    m(Visualization, { method: t.pulse('corner') }),
    'Which can also be recreated with corner (crawl) + invert + flip (xy) + swap, but that is hardly effective',
    m(Visualization, { method: t.pipe(t.corner('crawl'), t.invert, t.flip('xy'), t.swap ) }),
    "Mutations can be applied together in many ways, and any method can be turned into a mutation. These are some that I came up with. I gave a few of them names:",
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
    m('h3', 'Stitch'),
    m(Visualization, { method: t.pipe(t.stitch) } ),
    'Stitch zig zags in pairs along two cell columns until it fills a space. It is the best method for traversing our note:',
    m(Example, { method: 'stitch' }),
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
    m('h3', 'Cinnamon Roll'),
    m(Visualization, { method: methods.cinnamon_roll }),
    m('h3', 'Reflect'),
    m(Visualization, { method: methods.reflect }),
    'The reflect method is a pretty simple mutation. It is the best method for traversing our martini glass:',
    m('h3', 'Double'),
    'The double method as a 2x2 horizontal variation of the Tile method. It works like the horizontal method but 2 pixels at a time, covering 2 rows in each iteration. It is the best method for traversing blockier looking shapes, including our house:',
    m(Visualization, { method: t.double }),
    m('h3', 'Watertile', m(Descriptor, 'tiled 1xwidth waterfall')),
    m(Visualization, { method: methods.watertile }),
    m(Example, { method: 'watertile' }),
    m(Visualization, { method: methods.watertile2 }),
    m(Visualization, { method: methods.rotated_watertile }),
    m('h3', 'Triangle'),
    'The triangle method is pretty similar to the diamond method:',
    m('pre.mono', triangle.visualization),
    'Trimmed:',
    m('pre.mono', triangle.trimmed),
    'And reduced:',
    m(Visualization, { method: t.triangle }),
    'It works better than anything else if your shape is this exact type of triangle',
    m(ShapeUp, { configuration: triangle.actual_triangle_configuration, size: 6 }),
    m('p', 'The entire url for this triangle is ', m('a.break', { href: triangle.actual_triangle_url, target: '_blank' }, triangle.actual_triangle_url), ' because it is just 1 on value and 1 off value. The raw data is simply ', triangle.actual_on_off_triangle.join(','), '.'),
    'However none of the shapes in my library are smallest using this exact triangle. It\'s a good thing we can flip the pattern and try the same thing upside down.',
    m(Visualization, { method: t.pipe(t.triangle, t.flip('y')) }),    
    m(ShapeUp, { configuration: triangle.flipped_configuration, size: 6 }),
    m('div', m('a.break', { href: triangle.flipped_url, target: '_blank' }, triangle.flipped_url)),
    'The upside down triangle method is the best method for traversing our checkmark.',
    m(Example, { method: 'triangle' }),
];