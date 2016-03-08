const editors = [
	{
		selector: '.html-editor',
		mode: 'text/html',
	},
	{
		selector: '.css-editor',
		mode: 'text/css',
	},
	{
		selector: '.js-editor',
		mode: 'text/javascript',
	},
];

editors.forEach((item) => {
	// Create it
	let codemirror = CodeMirror.fromTextArea($(item.selector)[0], {
		mode: item.mode,
		lineNumbers: true,
		theme: 'base16-dark',
		extraKeys: {
			"F11": function(cm) {
				handleF11(cm);
			},
			"Esc": function(cm) {
				handleEsc(cm);
			}
		}
	});

	// Make it resizable
	setResizable(codemirror);
});

// Handle fullscreen toggling on F11 when the codemirror has focus
// This is only complicated because it doesn't play nice with jQuery UI's resizable widget
function handleF11(cm) {
	var $wrapper = $(cm.getWrapperElement());
	var isFullScreen = cm.getOption("fullScreen");

	if(!isFullScreen) {
		$wrapper.resizable('disable').removeClass('ui-resizable');
	}
	else {
		$wrapper.addClass('ui-resizable').resizable('enable');
	}

	cm.setOption("fullScreen", !isFullScreen);
}

// Handle toggling fullscreen off when hitting escape when the codemirror has focus
// This is only complicated because it doesn't play nice with jQuery UI's resizable widget
function handleEsc(cm) {
	if (cm.getOption("fullScreen")) {
		$(cm.getWrapperElement()).addClass('ui-resizable').resizable('enable');
		cm.setOption("fullScreen", false);
	}
}

// Add jQuery UI's resizable widget to the given codemirror
function setResizable(cm) {
	var $wrapper = $(cm.getWrapperElement());
	$wrapper.resizable({
		resize: function() {
			cm.setSize($(this).width(), $(this).height());
		}
	});
}
