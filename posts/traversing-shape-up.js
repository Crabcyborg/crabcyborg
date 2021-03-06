import m from 'mithril';
import { Gist, ShapeUp, GoToPost } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { Gradient, Example, methods, applyOffOn, repositionBase49Limit } from '$app/shapeup/optimization-helper';
import { min } from 'min-string';
import { traverse as t } from 'traverse-grid';

export const title = 'Traversing Shape Up Components';

const traverse_grid_url = 'https://github.com/Crabcyborg/traverse-grid';
const traverse_grid_docs = 'https://traverse-grid.crabcyb.org/';

const example_size = 7;
const size = 5;
let diamond, triangle;

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
    diamond.actual_on_off_csv = diamond.actual_on_off_diamond.join(',');
    diamond.actual_diamond_configuration = applyOffOn(diamond.actual_on_off_diamond, t.diamond);
    diamond.actual_diamond_compressed = repositionBase49Limit(diamond.actual_on_off_diamond);
    diamond.actual_diamond_url = `/shapeup/]${diamond.actual_diamond_compressed}`;

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
    triangle.actual_on_off_csv = triangle.actual_on_off_triangle.join(',');
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

const Visualization = { view: v => m(Gradient, { method: v.attrs.method, height: example_size, width: example_size }) };
const Descriptor = { view: v => m('i.gray.f5.ml1', v.children) };

export const content = () => [
    m('p', 'In an earlier post, ', m(GoToPost, {key: 'minimizing-large-shape-up'}), ', I mention that I can get a shape smaller by traversing the array from different directions.'),
    m('p', "I have developed a package dedicated to handling all of my traversing, available ", m('a', {href: traverse_grid_url, target: '_blank'}, 'on github'), '. All of the core patterns are shown on the ', m('a', {href: traverse_grid_docs, target: '_blank'}, 'official traverse-grid page'), '.'),
    m('p', 'I am going to skip a lot of these methods and focus on the methods that work best for optimizing a Shape Up component.'),
    m('h3', 'Alternate'),
    'Alternate is a simple mutation that horizontally flips every other row. Applied to a horizontal pattern, it creates a pattern that moves back and forth.',
    m(Visualization, { method: methods.alternate }),
    'It is the best method for traversing our pacman (actually a three way tie):',
    m(Example, { method: 'alternate', details: { methods: ['alternate','rotated_waterfall','rotated_watertile'] } }),
    m('h3', 'Reposition'),
    'The reposition method only iterates even indices in the first iteration, and then odd indices in the second.',
    m(Visualization, { method: methods.reposition }),
    'It works really well if your data looks like our waffle:',
    m(Example, { method: 'reposition', details: { methods: ['reposition'] } }),
    m('h3', 'Bounce'),
    'The bounce method bounces back and forth between two indices, both from the beginning incrementing forward and from the end decrementing backward, meeting in the center. It works well on data that has some symmetry. It is the best method for traversing our dollar sign:',
    m(Visualization, { method: methods.bounce }),
    m(Example, { method: 'bounce', details: { methods: ['bounce'] } }),
    m('h3', 'Smooth'),
    m(Visualization, { method: methods.smooth }),
    'Smooth looks at all adjacent spaces and tries moves toward the next closest index. It can also be straightened.',
    m('h3', 'Smooth (straight)'),
    m(Visualization, { method: methods.straight_smooth }),
    'It is the best method for traversing our bee:',
    m(Example, { method: 'straight_smooth', details: { methods: ['straight_smooth'] } }),
    m('h3', 'Waterfall'),
    m(Visualization, { method: methods.waterfall } ),
    'The waterfall is the best method for traversing our chair:',
    m(Example, { method: 'waterfall', details: { methods: ['waterfall'] } }),
    m('h3', 'Diagonal'),
    "The diagonal method does not win out very often, but when it does it can be very effective.",
    m(Visualization, { method: t.diagonal }),
    "It works very well when traversing our knife:",
    m(Example, { method: 'diagonal', details: { methods: ['diagonal'] } }),
    m('h3', 'Spiral'),
    'The spiral method is fairly effective as most data is off around the border and on in the center.',
    m(Visualization, { method: t.spiral }),
    'It is the best method for traversing our yin yang:',
    m(Example, { method: 'spiral', details: { methods: ['spiral'] } }),
    m('h3', 'Diamond'),
    m('p', "The diamond method is harder to implement than the others. It helps to visualize the entire diamond first:"),
    m('pre.mono', diamond.visualization),
    "In actuality, we trim off the triangles and we get this:",
    m('pre.mono', diamond.trimmed),
    "And we have to reduce our values to account for all of those gaps:",
    m(Visualization, { method: t.diamond }),
    "It works really well if you want to make a diamond:",
    m(ShapeUp, { configuration: diamond.actual_diamond_configuration, size: 10 }),
    m('p', 'The entire url for this diamond is ', m('a.break', { href: diamond.actual_diamond_url, target: '_blank' }, diamond.actual_diamond_url), ' because it is just 1 on value and 1 off value. The raw data is simply ', diamond.actual_on_off_csv, '.'),
    "It is also the best way to traverse our moon:",
    m(Example, { method: 'diamond', details: { methods: ['diamond'] } }),
    m('h3', 'Snake'),
    'The snake method is a 2x2 alternated vertical variation of the Tile method. It works like the horizontal method but instead of always moving to the right, it wiggles down and up throughout the process covering two rows at a time. It is the best method for traversing our dolphin.',
    m(Visualization, { method: t.snake }),
    m(Example, { method: 'snake', details: { methods: ['snake'] } }),
    m('h3', 'Stitch'),
    m(Visualization, { method: t.stitch } ),
    'Stitch zig zags in pairs along two cell columns until it fills a space. It is the best method for traversing our note (at a two-way tie):',
    m(Example, { method: 'stitch', details: { methods: ['stitch', 'vertical'] } }),
    m('h3', 'Watertile', m(Descriptor, 'tiled 1xwidth waterfall')),
    m(Visualization, { method: methods.watertile }),
    m('h3', 'Watertile (2)', m(Descriptor, 'tiled 2xwidth waterfall')),
    m(Visualization, { method: methods.watertile2 }),
    m(Example, { method: 'watertile', details: { methods: ['watertile2'] } }),
    m('h3', 'Triangle'),
    'The triangle method is pretty similar to the diamond method:',
    m('pre.mono', triangle.visualization),
    'Trimmed:',
    m('pre.mono', triangle.trimmed),
    'And reduced:',
    m(Visualization, { method: t.triangle }),
    'It works better than anything else if your shape is this exact type of triangle',
    m(ShapeUp, { configuration: triangle.actual_triangle_configuration, size: 6 }),
    m('p', 'The entire url for this triangle is ', m('a.break', { href: triangle.actual_triangle_url, target: '_blank' }, triangle.actual_triangle_url), ' because it is just 1 on value and 1 off value. The raw data is simply ', triangle.actual_on_off_csv, '.'),
    'However none of the shapes in my library are smallest using this exact triangle. It\'s a good thing we can flip the pattern and try the same thing upside down.',
    m(Visualization, { method: methods.triangle_flipped }),
    m(ShapeUp, { configuration: triangle.flipped_configuration, size: 6 }),
    m('div', m('a.break', { href: triangle.flipped_url, target: '_blank' }, triangle.flipped_url)),
    'The upside down triangle method is the best method for traversing our checkmark (at a two-way tie).',
    m(Example, { method: 'triangle', details: { methods: ['triangle_flipped', 'vertical'] } })
];