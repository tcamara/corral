// Basics
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('./mysql.js');
const socketIo = require('socket.io');

// Init ExpressJS
const app = express();

// Fire up ExpressJS server
const server = app.listen(3000, () => {
	console.log('Listening on port 3000');
});

// Set up socket server
const io = socketIo(server);

// Set up Jade as the view engine
app.set('views', './views');
app.set('view engine', 'jade');

// parse application/json
app.use(bodyParser.urlencoded({ extended: true }));

// View/Modify Existing Corral
app.get('/', (req, res, next) => {
	mysql('SELECT * FROM `Content`', [], (results, fields) => {
		const corrals = [];
		for(var i = 0; i < results.length; i++) {
			corrals.push({
				id: results[i].id,
				href: '/' + results[i].id,
				name: (results[i].name) ? results[i].name : 'Corral #' + results[i].id
			});
		}
		
		res.render('browse', { 
			corrals: corrals,
		});
	}, (error) => {
		return next(error);
	});
});

// Start New Corral
app.get('/new', (req, res, next) => {
	res.render('new', {
		codemirror: true,
	});
});

// Create New Corral
app.post('/create', (req, res, next) => {
	const { name, html, css, js } = req.body;
	const ip_address = req.ip;
	const values = [ name, html, css, js];

	mysql('INSERT INTO `Content` (`name`, `ip_address`, `html`, `css`, `js`) VALUES (?, ?, ?, ?, ?)', values, (results, fields) => {
		res.redirect(`/${results.insertId}`);
	}, (error) => {
		return next(error);
	});
});

// View/Modify Existing Corral
// TODO: check for matching IP to display delete button
app.get('/:id', (req, res, next) => {
	const id = req.params.id;

	mysql('SELECT * FROM `Content` WHERE `id` = ?', [ id ], (results, fields) => {
		if(results.length) {
			res.render('corral', { 
				id: id,
				name: (results[0].name) ? results[0].name : 'Corral #' + results[0].id,
				css: results[0].css,
				html: results[0].html,
				js: results[0].js,
				codemirror: true,
			});
		}
		else {
			return next();
		}
	}, (error) => {
		return next(error);
	});
});

// Get Preview Contents
app.get('/:id/preview', (req, res, next) => {
	const id = req.params.id;

	mysql('SELECT * FROM `Content` WHERE `id` = ?', [id], (results, fields) => {
		if(results.length) {
			res.render('preview', { 
				css: results[0].css,
				html: results[0].html,
				js: results[0].js,
			});
		}
		else {
			return next();
		}
	}, (error) => {
		return next(error);
	});
});

// Update Corral
app.post('/:id/update', (req, res, next) => {
	const id = req.params.id;
	const { html, css, js } = req.body;
	const values = [ html, css, js, id ];

	mysql('UPDATE `Content` SET `html` = ?, `css` = ?, `js` = ? WHERE `id` = ?', values, (results, fields) => {
		res.status(200).send({ success: true });
		io.emit('corral update', 'test');
	}, (error) => {
		return next(error);
	});
});

// Delete Corral
// TODO: check for matching IP address
app.post('/:id/delete', (req, res, next) => {
	const id = req.params.id;

	mysql('DELETE FROM `Content` WHERE `id` = ?', [ id ], (results, fields) => {
		res.redirect('/');
	}, (error) => {
		return next(error);
	});
});

// Static Content
app.use(express.static('public'));

// 404 handler
app.use(function(req, res, next) {
 	console.log('404');
 	res.status(404).send('404');
});

// Generic error handler
app.use(function(err, req, res, next) {
	console.log('generic error');
	console.log(err);
	res.status(500).send(err.message);
});
