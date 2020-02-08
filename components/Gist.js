import m from 'mithril';

const entityMap = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
	'/': '&#x2F;',
	'`': '&#x60;',
	'=': '&#x3D;'
};

const escapeHtml = (string) => {
	return String(string).replace(/[&<>"'`=\/]/g, s => entityMap[s]);
};

const loadGist = (id, gistId) => {
	var element = document.getElementById(id);

	if(element === null) {
		setTimeout(() => loadGist(id, gistId), 50);
		return;
	}
	
	var callbackName = "gist_callback";
	var counter = 2;
	while(callbackName in window) {
		callbackName = "gist_callback"+counter++;
	}

    window[callbackName] = gistData => {
        delete window[callbackName];
        var html = '<link rel="stylesheet" href="' + escapeHtml(gistData.stylesheet) + '"></link>';
        html += gistData.div;
        element.innerHTML = html;
        script.parentNode.removeChild(script);
    };
    var script = document.createElement("script");
    script.setAttribute("src", "https://gist.github.com/" + gistId + ".json?callback=" + callbackName);
	document.body.appendChild(script);
};

export var Gist = {
	oninit: v => loadGist(v.attrs.id, v.attrs.gistId),
	view: v => m('#'+v.attrs.id)
};