import * as shape_up from './shape-up';
import * as blocky from './blocky';
import * as blocky_nn from './blocky-nn';
import * as shapeup_webgl from './shapeup-webgl';
import * as shapeup_threejs from './shapeup-threejs';
import * as shapeup_paperjs from './shapeup-paperjs';

export var experiments = {	
	'shape-up': shape_up,
	blocky,
	'blocky-nn': blocky_nn,
	'shapeup-webgl': shapeup_webgl,
	'shapeup-threejs': shapeup_threejs,
	'shapeup-paperjs': shapeup_paperjs
};