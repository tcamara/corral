///////////////
// Variables //
///////////////

// Configuration settings for the three editors we're working with
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

// Number of milliseconds to delay between when the user finishes 
// typing and when we submit the change to the server
const updateDelayMilliseconds = 2000;


//////////////////
// Socket Stuff //
//////////////////

// Set up the client-side socket connection
const socket = io();

// Register the sole socket event listener
socket.on('corral update', function(test) {
	// Hacky way to refresh the iframe
	$('.corral-preview')[0].src = $('.corral-preview')[0].src;
})


/////////////
// Editors //
/////////////

editors.forEach((item) => {
	const $domItem = $(item.selector).first();

	// Check if this editor should be read only
	const readOnly = $domItem.hasClass('read-only') ? 'nocursor' : false;

	// Create this editor
	let codemirror = CodeMirror.fromTextArea($domItem[0], {
		mode: item.mode,
		lineNumbers: true,
		theme: 'base16-dark',
		readOnly,
		extraKeys: {
			"F11": function(editor) {
				handleF11(editor);
			},
			"Esc": function(editor) {
				handleEsc(editor);
			}
		}
	});

	updateOnChange(codemirror);
});

// Handle fullscreen toggling on F11 when the codemirror editor has focus
function handleF11(editor) {
	editor.setOption("fullScreen", !editor.getOption("fullScreen"));
}

// Handle toggling fullscreen off when hitting escape when the codemirror editor has focus
function handleEsc(editor) {
	if (editor.getOption("fullScreen")) {
		editor.setOption("fullScreen", false);
	}
}

// On a change event triggered by the codemirror editor, trigger an update
function updateOnChange(editor) {
	// Set up change handler var for this editor
	let changeTimeout;

	// On change:
	editor.on('change', function() {
		// Clear any previous timeouts
		window.clearTimeout(changeTimeout);
		
		// Set a new timeout for the value of updateDelayMilliseconds
		changeTimeout = window.setTimeout(function() {
			// Save the latest value back to the text editor, so the form will serialize the right value
			editor.save();
			
			// Trigger the update AJAX request
			submitUpdate();
		}, updateDelayMilliseconds);
	})
}

// Submits the updated form values (serialized) to the server as an AJAX call
function submitUpdate() {
	const corralForm = $('.corral-form');

	$.post(corralForm.attr('action'), corralForm.serialize(), function() {
		//console.log('successfully updated');
	}).done(function() {
		//console.log('done firing');
	}).fail(function() {
		console.log('update failed');
	}).always(function() {
		//console.log('always firing');
	});
}
