import * as putting_together_animal_body_parts_with_mithril_js from './putting-together-animal-body-parts-with-mithril-js';
import * as animating_your_amalgamation_of_animal_appendages from './animating-your-amalgamation-of-animal-appendages';
import * as flappy_tiger from './flappy-tiger';
import * as a_challenger_appears from './a-challenger-appears';
import * as using_anime_js from './using-anime-js';
import * as shape_up from './shape-up';
import * as shape_up_anime from './shape-up-anime';
import * as minimizing_shape_up from './minimizing-shape-up';
import * as minimizing_large_shape_up from './minimizing-large-shape-up';
import * as mirroring_shape_up from './mirroring-shape-up';
import * as traversing_shape_up from './traversing-shape-up';
import * as traverse_mutations from './traverse-mutations';
import * as tracing_shape_up from './tracing-shape-up';
import * as shape_up_text from './shape-up-text';
import * as tracing_shape_up_font from './tracing-shape-up-font';

const imports = {
	putting_together_animal_body_parts_with_mithril_js,
	animating_your_amalgamation_of_animal_appendages,
	flappy_tiger,
	a_challenger_appears,
	using_anime_js,
	shape_up,
	shape_up_anime,
	minimizing_shape_up,
	minimizing_large_shape_up,
	mirroring_shape_up,
	traversing_shape_up,
	traverse_mutations,
	tracing_shape_up,
	shape_up_text,
	tracing_shape_up_font
};

export const posts = Object.keys(imports).reduce(function(posts, key) {
	posts[key.replace(/_/g, '-')] = imports[key];
	return posts;
}, []);