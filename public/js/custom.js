var cmHtml = CodeMirror.fromTextArea($('.html-editor')[0], {
	mode: "text/html",
	lineNumbers: true,
	theme: 'base16-dark'
});

var cmCss = CodeMirror.fromTextArea($('.css-editor')[0], {
	mode: "text/css",
	lineNumbers: true,
	theme: 'base16-dark'
});

var cmJs = CodeMirror.fromTextArea($('.js-editor')[0], {
	mode: "text/javascript",
	lineNumbers: true,
	theme: 'base16-dark'
});