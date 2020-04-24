import m from 'mithril';
import { Gist, ShapeUp, GoToPost } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { bestMethod, onOffDiamond, applyOnOffDiamond, repositionBase49Limit } from '$app/shapeup/optimization-helper';
import { min } from 'min-string';

const size = 5;

export const title = 'Traversing Shape Up Components';

let examples = {
    diamond: 'RUBY',
    spiral: 'SPADE',
    vertical: 'HEEL',
    horizontal: 'TITAN',
    diagonal: 'KNIFE'
};
let bests = {};
let horizontal, vertical, diagonal, spiral, diamond;

/*
let raw = min.decompress('20A9zMYe!fLL23zU');
console.log('A Diamond', bestMethod(raw));
*/

export const oninit = () => {
    let keys = Object.values(examples);
	for(let key_index = 0; key_index < keys.length; ++key_index) {
		let key = keys[key_index];
		let shape = shapes[key];
        bests[key] = bestMethod(shape);
    }

    horizontal = {};
    horizontal.visualization = ((height, width) => {
        let output = [];
        for(let index = 0, y = 0; y < height; ++y) {
            let row = [];
            for(let x = 0; x < width; ++x, ++index) {
                row.push(`${index}`.padStart(2, '0'));
            }
            output.push(row.join(' '));
        }
        return output.join('\n');
    })(7,7);

    vertical = {};
    vertical.visualization = ((height, width) => {
        let output = [];
        for(let y = 0; y < height; ++y) {
            let row = [];
            for(let x = 0; x < width; ++x) {
                let index = x * height + y;
                row.push(`${index}`.padStart(2, '0'));
            }
            output.push(row.join(' '));
        }
        return output.join('\n');
    })(7,7);

    diagonal = {};
    diagonal.visualization = ((height, width) => {
        let x = 0, y = height-1, remaining = height * width, keyed = {}, index = 0;
        while(remaining--) {
            keyed[[x,y]] = index++;

            x += 1;
            y += 1;

            if(x == width || y == height) {
                y -= x + 1;
                x = 0;
            }

            while(y < 0) {
                ++y;
                ++x;
            }
        }

        let output = [];
        for(let y = 0; y < height; ++y) {
            let row = [];
            for(let x = 0; x < width; ++x) {
                let index = keyed[[x,y]];
                row.push(`${index}`.padStart(2, '0'));
            }
            output.push(row.join(' '));
        }

        return output.join('\n');
    })(7,7);

    spiral = {};
    spiral.visualization = ((height, width) => {
        let x = 0, y = 0, dx = 1, dy = 0, remaining = height * width, maxx = width, maxy = height, minx = -1, miny = -1, keyed = {}, index = 0;
        while(remaining--) {
            keyed[[x,y]] = index++;

            x += dx;
            y += dy;

            if(x == minx) {
                x += 1;
                y -= 1;
                dx = 0;
                dy = -1;
                maxy--;
            }

            if(x == maxx) {
                x -= 1;
                y += 1;
                dx = 0;
                dy = 1;
                miny++;
            }

            if(y == miny) {
                x += 1;
                y += 1;
                dx = 1;
                dy = 0;
                minx++;
            }

            if(y == maxy) {
                x -= 1;
                y -= 1;
                dx = -1;
                dy = 0;
                maxx--;
            }
        }

        let output = [];
        for(let y = 0; y < height; ++y) {
            let row = [];
            for(let x = 0; x < width; ++x) {
                let index = keyed[[x,y]];
                row.push(`${index}`.padStart(2, '0'));
            }
            output.push(row.join(' '));
        }

        return output.join('\n');
    })(7,7);

    const diamond_size = 7;
    diamond = onOffDiamond(diamond_size, diamond_size);

    const { keyed, indices, diamond_height, diamond_width, spike_height, spike_width } = diamond;

    let visualization = []
    for(let y = 0; y < diamond_height; ++y) {
        let row = [];    
        for(let x = 0; x < diamond_width; ++x) {
            if(keyed[[x,y]] !== undefined) {
                row.push(`${keyed[[x,y]]}`.padStart(2,'0'));
            } else {
                if(x >= spike_width && x < diamond_width-spike_width && y >= spike_height && y < diamond_height-spike_height) {
                    row.push('__');
                } else {
                    row.push('  ');
                }
            }
        }
    
        visualization.push(row.join(' '));
    }
    diamond.visualization = visualization.join('\n');

    let trimmed = [], reduced = [];
    for(let y = spike_height; y < diamond_size+spike_height; ++y) {
        let row = [], reduced_row = [];
        for(let x = spike_width; x < diamond_size+spike_width; ++x) {
            row.push(`${keyed[[x,y]]}`.padStart(2,'0'));
            
            let index = indices.indexOf(keyed[[x,y]]);
            reduced_row.push(`${index}`.padStart(2,'0'));
        }

        trimmed.push(row.join(' '));
        reduced.push(reduced_row.join(' '));
    }
    diamond.trimmed = trimmed.join('\n');
    diamond.reduced = reduced.join('\n');

    diamond.actual_diamond_configuration = [9,9,8,14,15,143,239,251,248,248,56,8];
    diamond.actual_on_off_diamond = applyOnOffDiamond(diamond.actual_diamond_configuration);
    diamond.actual_diamond_compressed = repositionBase49Limit(diamond.actual_on_off_diamond);
    diamond.actual_diamond_url = `/shapeup/]${diamond.actual_diamond_compressed}`;
};

const Best = {
    view: v => m(
        '.mono',
        {},
        v.attrs.best.ratio, '% ',
        v.attrs.best.length, ' characters ',
        m('a.break', { href: `/shapeup/${v.attrs.best.string}`, target: '_blank' }, `/shapeup/${v.attrs.best.string}`) 
    )
};

export const content = () => [
    m('p', 'In an earlier post, ', m(GoToPost, {key: 'minimizing-large-shape-up'}), ', I mention that I can get a shape smaller by traversing the array from different directions.'),
    m('h3', 'Horizontal'),
    "The most common way to traverse an array.",
    m('pre.mono', horizontal.visualization),
    "It is the best way to traverse the titanic:",
    m(ShapeUp, { configuration: shapes[examples.horizontal], size }),
    m(Best, { best: bests[examples.horizontal] }),
    m('h3', 'Vertical'),
    m('pre.mono', vertical.visualization),
    'It is the best way to traverse our high heel shoe:',
    m(ShapeUp, { configuration: shapes[examples.vertical], size }),
    m(Best, { best: bests[examples.vertical] }),
    m('h3', 'Diagonal'),
    "The diagonal pattern does not win out very often, but when it does it can be very effective.",
    m('pre.mono', diagonal.visualization),
    "It works very well when traversing our knife:",
    m(ShapeUp, { configuration: shapes[examples.diagonal], size }),
    m(Best, { best: bests[examples.diagonal] }),
    m('h3', 'Spiral'),
    'The spiral method is fairly effective as most data is off around the border and on in the center.',
    m('pre.mono', spiral.visualization),
    'It is the best method for traversing our spade:',
    m(ShapeUp, { configuration: shapes[examples.spiral], size }),
    m(Best, { best: bests[examples.spiral] }),
    m('h3', 'Diamond'),
    m('p', "The diamond pattern is harder to implement than the others. It helps to visualize the entire diamond first:"),
    m('pre.mono', diamond.visualization),
    "In actuality, we trim off the triangles and we get this:",
    m('pre.mono', diamond.trimmed),
    "And we have to reduce our values to account for all of those gaps:",
    m('pre.mono', diamond.reduced),
    "It works really well if you want to make a diamond:",
    m(ShapeUp, { configuration: diamond.actual_diamond_configuration, size: 10 }),
    m('p', 'The entire url for this diamond is ', m('a.break', { href: diamond.actual_diamond_url, target: '_blank' }, diamond.actual_diamond_url), ' because it is just 1 on value and 1 off value. The raw data is simply ', diamond.actual_on_off_diamond.join(','), '.'),
    "It is also the best way to traverse a ruby:",
    m(ShapeUp, { configuration: shapes[examples.diamond], size }),
    m(Best, { best: bests[examples.diamond] })
];