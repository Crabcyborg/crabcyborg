const targets = [ 128,64,32,16,8,4,2,1 ];

const shuffle = a => {
	let j, x, i;
	for ( i = a.length - 1; i > 0; i-- ) {
		j = Math.floor( Math.random() * ( i + 1 ) );
		x = a[ i ];
		a[ i ] = a[ j ];
		a[ j ] = x;
	}
	return a;
};

const getShuffledColorIndices = length => {
	const from = { length };
	return shuffle( Array.from( from, ( x, i ) => i ) );
};

const getDefaultState = ( configuration, colorLength ) => {
	let state = {
		configuration,
		colorLength,
		count_by_color_index: {},
		coordinates_by_color_index: {},
		grid: [],
		unassigned: []
	};
	state.assign = makeAssignFunction( state );
	return state;
}

const makeAssignFunction = ({ count_by_color_index, coordinates_by_color_index }) => {
	return ( target, adjacent ) => {
		if ( adjacent.empty || adjacent.unassigned || coordinates_by_color_index[ adjacent.color_index ] === undefined ) {
			return false;
		}

		target.color_index = adjacent.color_index;
		target.unassigned = false;

		count_by_color_index[ target.color_index ]++;
		coordinates_by_color_index[ target.color_index ].push({ x: target.x, y: target.y });

		return true;
	};
};

const fillGrid = ({ configuration, colorLength, assign, grid, unassigned, count_by_color_index, coordinates_by_color_index }) => {
	const
	[ height, width ] = configuration,
	use_colors = getShuffledColorIndices( colorLength );

	let
	x = -1,
	y = -1,
	data_index = 2,
	target_index = 0,
	color_index = 0,
	random_target = 0.1,
	row;

	const getObject = () => {
		const obj = {
			x,
			y,
			empty: ( configuration[ data_index ] & targets[ target_index ] ) === 0
		};

		let checks, check, cell;

		if ( ! obj.empty ) {
			obj.unassigned = true;

			checks = [];
			grid.length && checks.push( 'up' );
			x > 0 && checks.push( 'left' );

			// randomly pick between checking vertically or horizontally first.
			if ( checks.length > 1 && Math.random() < .5 ) {
				checks = [ checks[1], checks[0] ];
			}

			for ( check of checks ) {
				if ( Math.random() > random_target ) {
					continue;
				}

				switch ( check ) {
					case 'up': cell = grid[ grid.length-1 ][ x ]; break;
					case 'left': cell = row[ x-1 ]; break;
				}

				if ( assign( obj, cell ) ) {
					break;
				}
			}

			if ( obj.unassigned ) {
				obj.color_index = use_colors[ color_index++ ];
				color_index % 5 === 0 && ( random_target = Math.max( random_target + .5, 1 ) );

				if ( color_index + 1 >= colorLength ) {
					delete obj.color_index;
					unassigned.push( obj );
				} else {
					count_by_color_index[ obj.color_index ] = 1;
					coordinates_by_color_index[ obj.color_index ] = [{ x: obj.x, y: obj.y }];
					obj.unassigned = false;
				}
			}
		}

		return obj;
	};

	while ( ++y < height ) {
		row = [];

		while ( ++x < width ) {
			row.push( getObject() );

			if ( target_index++ === 7 ) {
				++data_index;
				target_index = 0;
			}
		}

		grid.push( row );
		x = -1;
	}
};

const secondPass = ({ configuration, unassigned, assign, grid }) => {
	const filterCallback = makeSecondPassFilterCallback({ configuration, grid, assign });
	let tries = 0;
	while ( unassigned.length && tries++ < 10 ) {
		unassigned = unassigned.filter( filterCallback );
	}
};

const makeSecondPassFilterCallback = ({ configuration, grid, assign }) => {
	const [ height, width ] = configuration;

	return obj => {
		let checks, random_index, check;

		checks = [];
		obj.x > 1 && checks.push( grid[ obj.y ][ obj.x-1 ] );
		obj.y > 1 && checks.push( grid[ obj.y-1 ][ obj.x ] );
		obj.x + 1 < width && checks.push( grid[ obj.y ][ obj.x + 1 ] );
		obj.y + 1 < height && checks.push( grid[ obj.y + 1 ][ obj.x ] );

		while ( checks.length ) {
			random_index = Math.floor( Math.random() * checks.length );
			check = checks.splice( random_index, 1 );

			if ( assign( obj, check ) ) {
				return false;
			}
		}

		return true;
	};
}

const pickHighestColorIndex = count_by_color_index => {
	let
	color_keys = Object.keys( count_by_color_index ),
	highest = 0,
	highest_color_index,
	color_index;

	for ( color_index of color_keys ) {
		if ( count_by_color_index[ color_index ] > highest ) {
			highest_color_index = color_index;
			highest = count_by_color_index[ highest_color_index ];

			// randomly quit early to avoid only picking the largest object
			if ( highest > 10 && Math.random() < .5 ) {
				break;
			}
		}
	}

	return highest_color_index;
};

const prepareGeneratedData = ({ configuration, grid, count_by_color_index, coordinates_by_color_index }) => {
	const
	[ height, width ] = configuration,
	highest_color_index = pickHighestColorIndex( count_by_color_index ),
	highest_color_coordinates = coordinates_by_color_index[ highest_color_index ];
	return { height, width, grid, highest_color_index, highest_color_coordinates };
}

const shapeup = {
	generate: ( configuration, colorLength ) => {
		const state = getDefaultState( configuration, colorLength );
		fillGrid( state );
		secondPass( state );
		return prepareGeneratedData( state );
	}
};

export { shapeup };