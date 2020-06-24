import m from 'mithril';
import { injectScript, injectStyle } from '$app/helpers';
import { traverse as t } from 'traverse-grid';
import * as _3x3 from '$app/tests/data/3x3';

export const title = 'Testing Traverse Grid with QUnit';

export const oncreate = () => {
	injectStyle('https://cdnjs.cloudflare.com/ajax/libs/qunit/2.10.0/qunit.min.css');

	injectScript('https://cdnjs.cloudflare.com/ajax/libs/qunit/2.10.0/qunit.min.js', () => {
		QUnit.test('3x3', assert => {
			for(let key of Object.keys(_3x3)) {
				assert.equal( t.visualize(t[key](3,3)), _3x3[key], key );
			}
		});
	});
};

export const content = () => [
	"The other day I was given a programming challenge that included some QUnit testing. I didn't really have the time left to research into how QUnit works and I feel bad that I hadn't added any tests (but I looked at it and at least I didn't break anything).",
	"I knew QUnit was out there but it never really popped into my mind as something I could make a post about until after taking this challenge.",
	"And I know there are still a few bugs in traverse-grid that I need to work out, and without the proper tests it's difficult to know that I'm really in the clear.",
	m('h3', 'What are we going to test?'),
	"traverse-grid contains a lot of functions, and every one of those functions could be tested against several times as there are a lot of possible outcomes.",
	m('#qunit'),
	m('#qunit-fixture')
];