import m from 'mithril';
import { Home, Sandbox, Post } from '$app/containers';
import { posts } from '$app/posts';

var container = document.getElementById('container');

var lastRoute = null;
var route = function(key, component) {
	return {
		onmatch: function(params) {
			if(lastRoute !== key) {
				window.scrollTo(0, 0);
				lastRoute = key;
				document.body.setAttribute('data-route', key);
			}

			return component.onmatch ? component.onmatch() : component;
		}
	}
};

const routing = function() {
	let routeDetails = [
		[Sandbox, '/sandbox'],
		[Home, '/']
	];

	const postSlugs = Object.keys(posts);
	for(let slug of postSlugs) {
		routeDetails.push([Post, '/post/'+slug]);
	}
	
	let routeData = {};
	for(let routeDetail of routeDetails) {
		const component = routeDetail[0];
		const paths = Array.isArray(routeDetail[1]) ? routeDetail[1] : [routeDetail[1]];
		const call = route;
		for(let path of paths) {
			routeData[path] = call(path, component);
		}
	}

	m.route.prefix('');
	m.route(container, '/', routeData);
};

routing();