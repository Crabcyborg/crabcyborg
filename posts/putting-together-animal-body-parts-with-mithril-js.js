import m from 'mithril';
import { config as lady_tiger } from '$app/monsters/lady-tiger';
import { Caption, Gist, GoToPost } from '$app/components';

export const title = 'Putting Together Animal Body Parts with Mithril.js';

export const content = [
	lady_tiger,
	"This tutorial is for anyone who grew up wishing to be a mad scientist but ending up as a web developer instead. We are going to be frankensteining our very own monster using JavaScript, mithril, tachyons, and webpack.",
	"If you don't have git or yarn (npm works too) installed, you should probably figure that out first. Then all you need to do to get this entire blog post running on localhost is to execute these commands:",
	m(
		'pre',
		'git clone ...\n',
		'cd frankenfighter\n',
		'yarn install\n',
		'yarn start'
	),
	m('p', "Then open up ", m('b', 'http://localhost:8080/'), " and you should have your very own Lady Tiger!"),
	lady_tiger,
	m(Caption, "Gorgeous, isn't she?"),
	m('h3', "So what is Lady Tiger?"),
	'This femme fatale you are looking at is being pieced together by some pretty straight forward mithril components: Head, Leg, Torso, Tail.',
	m(Gist, {id: 'monster-js', gistId: 'Crabcyborg/c16ab0a430441d050ff6144745cfa67c'}),
	"You can peek at each of those components, but there isn't a lot to look at. Some render additional body parts like feet and antlers, but each component is mostly just a simple div with a few classes that render an image.",
	m('h3', "What else is going on?"),
	m('p', "All of the styling and asset handling is easily passed down to our component from a handy folder titled ", m('i', 'monsters'), " in a file called ", m('i', 'lady-tiger.js'), "."),
	m(Gist, {id: 'lady-tiger-js', gistId: 'Crabcyborg/4b470462136e0a61769f418f8f9b01d0'}),
	m('h3', "What's next?"),
	m('p', "Play with this config file to customize Lady Tiger! Maybe she would look better with some wings! You can add whatever images you want to use to the folder ", m('i', 'assets'), ", then include a reference to the file in ", m('i', 'assets/index.js'), "."),
	"For now, working with this configuration file might be a little tedious, but if we set up an editor that generates these configs for us, it might be already pretty close to useable.",
	m(GoToPost, {prepend: 'Next: ', key: 'animating-your-amalgamation-of-animal-appendages'})
];