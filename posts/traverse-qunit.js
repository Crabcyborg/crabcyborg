import m from 'mithril';
import { injectScript, injectStyle } from '$app/helpers';
import { traverse as t } from 'traverse-grid';
import { methods } from '$app/shapeup/optimization-helper';
import { _3x3, _8x4, _5x7 } from '$app/tests/data';
import { call } from 'file-loader';

export const title = 'Testing Traverse Grid with QUnit';

export const oncreate = () => {
	injectStyle('https://cdnjs.cloudflare.com/ajax/libs/qunit/2.10.0/qunit.min.css');

	injectScript('https://cdnjs.cloudflare.com/ajax/libs/qunit/2.10.0/qunit.min.js', () => {
		const dimensions = { '3x3': _3x3, '8x4': _8x4, '5x7': _5x7 };
		const tests = Object.keys(dimensions);
		for(let test of tests) {
			let [ height, width ] = test.split('x');			
			height = parseInt(height);
			width = parseInt(width);

			const data = dimensions[test];

			QUnit.test(test, assert => {
				for(let key of Object.keys(data)) {
					const callback = methods[key] || t[key];
					callback && assert.equal( t.visualize(callback(height, width)), data[key], key );
				}
			});	
		}
	});
};

export const content = () => [
	"The other day I was given a programming challenge that included some QUnit testing. I didn't really have the time left to really touch QUnit beyond confirming that none of my tests had broken.",
	m('p', "Where I went wrong, is that I need to ", m('i', 'start'), " with unit tests. QUnit is actually really easy to use and I'm excited to write some tests. I know there are still a few bugs in traverse-grid that I need to work out. Visualizations were really useful but unit testing is required to know that everything really works without having to really look at anything but a summary and I should have been doing this earlier."),
	"In fact, I was writing tests a lot like this but doing it way more manually. I wasn't going about these problems enough like a programmer.",
	"It's already helped me identify some of the issues that have been bothering me as it revealed patterns that I hadn't noticed myself.",
	m('h3', 'What are we going to test?'),
	"traverse-grid contains a lot of functions, and every one of those functions could be tested against several times as there are a lot of possible outcomes.",
	m('#qunit'),
	m('#qunit-fixture')
];