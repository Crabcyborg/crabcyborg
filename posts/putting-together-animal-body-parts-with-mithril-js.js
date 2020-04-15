import m from 'mithril';
import { config as lady_tiger } from '$app/monsters/lady-tiger';
import { Caption, Gist } from '$app/components';
import { wave } from '$app/animations/lady-tiger';

export const title = 'Putting Together Animal Body Parts with Mithril';

export const oncreate = () => {
	wave('wave-target');
};

const github_url = 'https://github.com/Crabcyborg/crabcyborg'; // this should come from a config

export const content = () => [
	{...lady_tiger, id: 'wave-target'},
	m(Caption, "Lady Tiger says hello!"),
	"We're going to begin this tutorial series with Lady Tiger, my first Frankenstein.",
	m('h3', "So what is Lady Tiger?"),
	'This femme fatale you are looking at is being pieced together by a configuration file and this fairly simple Mithril component, Monster.js:',
	m(Gist, {id: 'monster-js', gistId: 'Crabcyborg/c16ab0a430441d050ff6144745cfa67c'}),
	m('h3', "What else is going on?"),
	m('p', "All of the styling and asset handling is easily passed down to our component from a handy folder titled ", m('i', 'monsters'), " in a file called ", m('i', 'lady-tiger.js'), "."),
	m(Gist, {id: 'lady-tiger-js', gistId: 'Crabcyborg/4b470462136e0a61769f418f8f9b01d0'}),
	m('h3', "What's next?"),
	m('p', "You can read on, or you could pull a copy of this website from ", m('a', { href: github_url }, 'github'), ", play with this config file, and create your first monster! You might even notice that Monster.js has a Wing component, but Lady Tiger doesn't have any wings! You can add whatever images you want to use to the folder ", m('i', 'assets'), ", then include a reference to the file in ", m('i', 'assets/index.js'), "."),
	"For now, working with this configuration file might be a little tedious, but if we set up an editor that generates these configs for us, it might be already pretty close to useable."
];

export const next = 'animating-your-amalgamation-of-animal-appendages';