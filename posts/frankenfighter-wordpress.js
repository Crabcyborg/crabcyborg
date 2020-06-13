import m from 'mithril';
import { config as lady_tiger } from '$app/monsters/lady-tiger';
import { Caption, Gist } from '$app/components';
import { wave } from '$app/animations/lady-tiger';

const wp_frankenfighter_github_url = 'https://github.com/Crabcyborg/wp-frankenfighter';
const wp_jsoneditor_github_url = 'https://github.com/Crabcyborg/wp-jsoneditor';
const jsoneditor_github_url = 'https://github.com/josdejong/jsoneditor';
const wordpress_url = 'https://wordpress.crabcyb.org/';
const screenshot_url = 'https://raw.githubusercontent.com/Crabcyborg/wp-jsoneditor/master/screenshot-1.png';

export const title = 'A Frankenfighter Back End via a WordPress Plugin';

export const oncreate = () => {
	wave('wave-target');
};

export const content = () => [
	"I have taken a recent interest in WordPress again. The CMS now commands 37% of the Internet. Because WordPress is open source, and because so many websites use it, a lot of developers have put a lot of work into solving a lot of problems. WordPress has over 56,000 Plugins, so it can be hard to actually find any missing gaps.",
	"That is a lot of plugins. Today I'm going to make one more. Lady Tiger wants her spot.",
	{...lady_tiger, id: 'wave-target'},
	m(Caption, m('span', "Lady tiger is ", m('a.f7', { href: wordpress_url, target: '_blank' }, "back in action!"))),
	"Excluding comments and white space, my frankenfighter plugin can render a shortcode with several configuration options, via a PHP config, raw encoded data, or through a key connected to the WordPress options table, in 27 lines of PHP code and frankenfighter's original JavaScript (slightly modified to work better in a WordPress plugin).",
	m('p', "It was really easy. WordPress made it easy. And now a configurable back end is available to everyone that ", m('a', { href: wp_frankenfighter_github_url, target: '_blank' }, "wants to throw a shortcode on their WordPress website"), "."),
	"Alright, there is no back end. What gives?",
	m('p', "There is a specific line of code I would love to draw attention to ", m('i', "get_option('jsoneditor_frankenfighter_'.$atts['key'])"), ". Our WordPress option is referring to a prefix jsoneditor_ which introduces our ", m('a', { href: wp_jsoneditor_github_url, target: '_blank' }, "second WordPress plugin"), "!"),
	m('p', "I wanted a simple JSON editor back end to start out here, since I could get really good control without having to overcomplicate anything. As far as I could tell, WordPress does not have such a plugin, ", m('a', { href: 'jsoneditor_github_url', target: '_blank' }, 'but an Open Source editor for the web'), " was right there and ", m('a', { href: wp_jsoneditor_github_url, target: '_blank' }, "porting it to a plugin did not take very much code"), "."),
	m('img', { src: screenshot_url }),
	"All you need to do is plug in frankenfighter as your prefix, choose a key, and start writing your new JSON configuration!",
	"Is this a friendly UI for a beginner? Maybe not, but developing a more friendly UI for Frankenfighter will take a lot of work."
];