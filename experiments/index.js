import * as shape_up from './shape-up';
import * as blocky from './blocky';
import * as blocky_nn from './blocky-nn';
import * as shapeup_webgl from './shapeup-webgl';
import * as shapeup_threejs from './shapeup-threejs';
import * as shapeup_paperjs from './shapeup-paperjs';
import * as shapeup_fillrect from './shapeup-fillrect';
import * as shapeup_svg from './shapeup-svg';
import * as shapeup_matter from './shapeup-matter';

export var experiments = {	
	'shape-up': shape_up,
	blocky,
	'blocky-nn': blocky_nn,
	'shapeup-webgl': shapeup_webgl,
	'shapeup-threejs': shapeup_threejs,
	'shapeup-paperjs': shapeup_paperjs,
	'shapeup-fillrect': shapeup_fillrect,
	'shapeup-svg': shapeup_svg,
	'shapeup-matter': shapeup_matter
};