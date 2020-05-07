import m from 'mithril';
import { Gist, ShapeUp, GoToPost } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { Gradient, Example, methods, applyOffOn, repositionBase49Limit } from '$app/shapeup/optimization-helper';
import { min } from 'min-string';
import { traverse as t } from 'traverse-grid';

export const title = 'Traversing Shape Up Components';

const example_size = 7;
const size = 5;
let diamond;

export const oninit = () => {
    diamond = t.diamond(example_size, example_size);
    diamond.visualization = (() => {
        let { spike } = diamond, visualization = [];
        const { keyed, height, width } = diamond.diamond;
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
    diamond.trimmed = (() => {
        let { spike } = diamond, trimmed = [];
        const { keyed, height, width } = diamond.diamond;
        for(let y = spike.height; y < example_size+spike.height; ++y) {
            let row = [];
            for(let x = spike.width; x < example_size+spike.width; ++x) row.push(`${keyed[[x,y]]}`.padStart(2,'0'));
            trimmed.push(row.join(' '));
        }
        return trimmed.join('\n');
    })();

    diamond.actual_on_off_diamond = [9,9,40,41];
    diamond.actual_diamond_configuration = applyOffOn(diamond.actual_on_off_diamond, t.diamond);
    diamond.actual_diamond_compressed = repositionBase49Limit(diamond.actual_on_off_diamond);
    diamond.actual_diamond_url = `/shapeup/]${diamond.actual_diamond_compressed}`;
};

const Visualization = { view: v => m(Gradient, { method: v.attrs.method, height: example_size, width: example_size }) };

export const content = () => [
    m('p', 'In an earlier post, ', m(GoToPost, {key: 'minimizing-large-shape-up'}), ', I mention that I can get a shape smaller by traversing the array from different directions.'),
    m('h3', 'Horizontal'),
    "The most common way to traverse an array.",
    m(Visualization, { method: t.horizontal }),
    "None of the shapes in my library are their smallest using this method.",
    m('h3', 'Alternate'),
    'Alternate is a simple mutation that horizontally flips every other row. Applied to a horizontal pattern, it creates a pattern that moves back and forth.',
    m(Visualization, { method: methods.alternate }),
    'It is the best method for traversing our pacman:',
    m(Example, { method: 'alternate' }),
    m('h3', 'Reposition'),
    'The reposition method only iterates even indices in the first iteration, and then odd indices in the second.',
    m(Visualization, { method: methods.reposition }),
    'It works really well if your data looks like our waffle:',
    m(Example, { method: 'reposition' }),
    m('h3', 'Bounce'),
    'The bounce method bounces back and forth between two indices, both from the beginning incrementing forward and from the end decrementing backward, meeting in the center. It works well on data that has some symmetry. It is the best method for traversing our dollar sign:',
    m(Visualization, { method: methods.bounce }),
    m(Example, { method: 'bounce' }),
    m('h3', 'Smooth'),
    m(Visualization, { method: t.pipe(t.horizontal, t.smooth()) }),
    'Smooth looks at all adjacent spaces and tries moves toward the next closest index. It can also be straightened.',
    m('h3', 'Smooth (straight)'),
    m(Visualization, { method: t.pipe(t.horizontal, t.smooth('straight')) }),
    'It is the best method for traversing our bee:',
    m(Example, { method: 'straight_smooth' }),
    m('h3', 'Waterfall'),
    m(Visualization, { method: t.pipe(t.horizontal, t.waterfall) } ),
    'The waterfall is the best method for traversing our chair:',
    m(Example, { method: 'waterfall' }),
    m('h3', 'Diagonal'),
    "The diagonal method does not win out very often, but when it does it can be very effective.",
    m(Visualization, { method: t.diagonal }),
    "It works very well when traversing our knife:",
    m(Example, { method: 'diagonal' }),
    m('h3', 'Spiral'),
    'The spiral method is fairly effective as most data is off around the border and on in the center.',
    m(Visualization, { method: t.spiral }),
    'It is the best method for traversing our yin yang:',
    m(Example, { method: 'spiral' }),
    m('h3', 'Diamond'),
    m('p', "The diamond method is harder to implement than the others. It helps to visualize the entire diamond first:"),
    m('pre.mono', diamond.visualization),
    "In actuality, we trim off the triangles and we get this:",
    m('pre.mono', diamond.trimmed),
    "And we have to reduce our values to account for all of those gaps:",
    m(Visualization, { method: t.diamond }),
    "It works really well if you want to make a diamond:",
    m(ShapeUp, { configuration: diamond.actual_diamond_configuration, size: 10 }),
    m('p', 'The entire url for this diamond is ', m('a.break', { href: diamond.actual_diamond_url, target: '_blank' }, diamond.actual_diamond_url), ' because it is just 1 on value and 1 off value. The raw data is simply ', diamond.actual_on_off_diamond.join(','), '.'),
    "It is also the best way to traverse our moon:",
    m(Example, { method: 'diamond' }),
    m('h3', 'Snake'),
    'The snake method is a 2x2 alternated vertical variation of the Tile method. It works like the horizontal method but instead of always moving to the right, it wiggles down and up throughout the process covering two rows at a time. It is the best method for traversing our dolphin.',
    m(Visualization, { method: t.snake }),
    m(Example, { method: 'snake' })
 /*
    'Why stop at just flipping it when the triangle method can be rotated as well?',
    m(Visualization, { method: t.pipe(t.triangle, t.swap) }),  
    m(ShapeUp, { configuration: triangle.rotated_configuration, size: 6 }),
    m('div', m('a.break', { href: triangle.rotated_url, target: '_blank' }, triangle.flipped_url)),
    "It's the best method for our lips.",
    m(Example, { method: 'triangle_rotated' })
*/
];