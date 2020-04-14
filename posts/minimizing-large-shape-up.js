import m from 'mithril';
import { Caption, Gist, ShapeUp, TargetShape, Score } from '$app/components';
import { shapes } from '$app/shapeup/shapes';
import { shapes as optimized } from '$app/shapeup/shapes-optimized';
import { onOff, offOn } from '$app/shapeup/optimization-helper';
import { min } from 'min-string';

export const title = 'Minimizing a Large Shape Up Component';

const targets = [128,64,32,16,8,4,2,1];

const compress = min.compress, decompress = min.decompress;

const key = 'DOG';
const raw = shapes[key];

const compressed = compress(raw);
const compressed_length = compressed.length;

const raw_length = raw.length;
const raw_csv = raw.join(',');
const raw_csv_length = raw_csv.length;

const on_off = onOff(raw);
const on_off_length = on_off.length;
const on_off_csv = on_off.join(',');
const on_off_csv_length = on_off_csv.length;

const on_off_compressed = compress(on_off);
const on_off_compressed_length = on_off_compressed.length;

const back_to_raw = offOn(on_off);

const url = `/shapeup/|${on_off_compressed}`;

export const content = () => [
	m(ShapeUp, {configuration: raw, size: 2}),
	m(ShapeUp, {configuration: back_to_raw, size: 2}),
	m('p', "It turns out that once our data becomes larger like our adorable 94x89 vizsla, it can be much more efficient at times to just count how many cells in a row are on, then how many are off."),
	m('p.mb0', 'Raw Array Length: ', raw_length),
	m('p.mt0.mb0', 'Raw CSV Length: ', raw_csv_length),
	m('p.mt0.mb0', 'On/Off Array Length: ', on_off_length),
	m('p.mt0', 'On/Off CSV Length: ', on_off_csv_length),
	m('p', "The initial set of raw values is already ", Math.round(raw_csv_length / on_off_csv_length * 10) / 10, "x smaller but it is also less predictable."),
	m('p.mb0', 'Compressed Length: ', compressed_length),
	m('p.mt0', 'Compressed On/Off Length: ', on_off_compressed_length),
	m('p', "Our On/Off version is ", Math.round(compressed_length / on_off_compressed_length * 10) / 10, "x smaller than the previous optimized size and ", Math.round(raw_csv_length / on_off_compressed_length * 10) / 10, "x smaller than the original raw data."),
	m('div.mt2', m('a', { style: { wordWrap: 'break-word' }, href: url, target: '_blank' }, url))
];