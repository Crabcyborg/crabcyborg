import m from 'mithril';
import { Gist, ShapeUp, GoToPost } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { bestMethod, applyOnOff, applyOffOn, applyOnOffDiamond, applyOnOffTriangle, repositionBase49Limit, flippedOffOnTriangle, rotatedOffOnTriangle, offOnTriangle } from '$app/shapeup/optimization-helper';
import { min } from 'min-string';
import { traverse} from '$app/traverse-grid';
const t = traverse;

export const title = 'Traversing Shape Up Components';

const example_size = 7;
const size = 5;
const visualize = method => t.pipe(method, t.visualize)(example_size, example_size);
const examples = {
    diamond: 'LUNAR',
    spiral: 'CLUB',
    vertical: 'HEEL',
    horizontal: 'DINO',
    diagonal: 'KNIFE',
    snake: 'PINK',
    triangle: 'CHECK',
    triangle_rotated: 'SPADE'
};

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
    triangle.actual_triangle_configuration = applyOffOn(triangle.actual_on_off_triangle, t.triangle);
    triangle.actual_triangle_compressed = repositionBase49Limit(triangle.actual_on_off_triangle);
    triangle.actual_triangle_url = `/shapeup/--${triangle.actual_triangle_compressed}`;
    triangle.flipped = t.pipe(t.triangle, t.flipy)(example_size, example_size);
    triangle.flipped_visualization = t.visualize(triangle.flipped);
    triangle.flipped_configuration = flippedOffOnTriangle([9,17,72,81]);
    triangle.flipped_compressed = repositionBase49Limit([9,17,72,81]);
    triangle.flipped_url = `/shapeup/~~${triangle.flipped_compressed}`;
    triangle.rotated = t.pipe(t.triangle, t.rotate)(example_size, example_size);
    triangle.rotated_visualization = t.visualize(triangle.rotated);
    triangle.rotated_configuration = rotatedOffOnTriangle([17,9,72,81]);
    triangle.rotated_compressed = repositionBase49Limit([17,9,72,81]);
    triangle.rotated_url = `/shapeup/\`\`${triangle.rotated_compressed}`;

    /*
    keys = Object.keys(shapes);
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
            v.state.best.ratio, '% ',
            v.state.best.length, ' characters ',
            m('a.break', { href: `/shapeup/${v.state.best.string}`, target: '_blank' }, `/shapeup/${v.state.best.string}`) 
        )
    )
};

export const content = () => [
    m('p', 'In an earlier post, ', m(GoToPost, {key: 'minimizing-large-shape-up'}), ', I mention that I can get a shape smaller by traversing the array from different directions.'),
    m('h3', 'Horizontal'),
    "The most common way to traverse an array.",
    m(Visualization, { method: t.horizontal }),
    "It is the best way to traverse our triceratops:",
    m(Example, { method: 'horizontal' }),
    m('h3', 'Vertical'),
    m(Visualization, { method: t.vertical }),
    'It is the best way to traverse our high heel shoe:',
    m(Example, { method: 'vertical' }),
    m('h3', 'Diagonal'),
    "The diagonal pattern does not win out very often, but when it does it can be very effective.",
    m(Visualization, { method: t.diagonal }),
    "It works very well when traversing our knife:",
    m(Example, { method: 'diagonal' }),
    m('h3', 'Spiral'),
    'The spiral method is fairly effective as most data is off around the border and on in the center.',
    m(Visualization, { method: t.spiral }),
    'It is the best method for traversing our club:',
    m(Example, { method: 'spiral' }),
    m('h3', 'Diamond'),
    m('p', "The diamond pattern is harder to implement than the others. It helps to visualize the entire diamond first:"),
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
    'The snake method works like the horizontal pattern but instead of always moving to the right, it wiggles down and up throughout the process covering two rows at a time. This works well with large empty areas and large filled areas. As our flamingo has a lot of white space the snake method works best.',
    m(Visualization, { method: t.snake }),
    m(Example, { method: 'snake' }),
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
    m('pre.mono', triangle.flipped_visualization),
    m(ShapeUp, { configuration: triangle.flipped_configuration, size: 6 }),
    m('div', m('a.break', { href: triangle.flipped_url, target: '_blank' }, triangle.flipped_url)),
    'The upside down triangle pattern is the best method for traversing our checkmark.',
    m(Example, { method: 'triangle' }),
    'Why stop at just flipping it when the triangle method can be rotated as well?',
    m('pre.mono', triangle.rotated_visualization),
    m(ShapeUp, { configuration: triangle.rotated_configuration, size: 6 }),
    m('div', m('a.break', { href: triangle.rotated_url, target: '_blank' }, triangle.flipped_url)),
    "It's the best method for our spade!",
    m(Example, { method: 'triangle_rotated' }),
];