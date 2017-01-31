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

// Static Content
app.use(express.static('public'));

// parse application/json
app.use(bodyParser.urlencoded({ extended: true }));

// View Existing Corrals
app.get('/', (req, res, next) => {
	mysql('SELECT * FROM `Content` WHERE `saved` = 1', [], (results, fields) => {
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
	const ip_address = req.ip;
	const values = [ip_address, 0];

	mysql('INSERT INTO `Content` (`ip_address`, `saved`) VALUES (?, ?)', values, (results, fields) => {
		unsaved_rows_cleanup(results.insertId);

		res.render('new', {
			id: results.insertId,
			codemirror: true,
		});
	}, (error) => {
		return next(error);
	});
});

// Create New Corral
app.post('/create', (req, res, next) => {
	const { id, name } = req.body;
	const ip_address = req.ip;
	const values = [name, id, ip_address];

	mysql('UPDATE `Content` SET `name` = ?, `saved` = 1 WHERE `id` = ? AND ip_address = ?', values, (results, fields) => {
		res.redirect(`/${id}`);
	}, (error) => {
		return next(error);
	});
});

// View/Modify Existing Corral
app.get('/:id', (req, res, next) => {
	const id = req.params.id;

	mysql('SELECT * FROM `Content` WHERE `id` = ?', [ id ], (results, fields) => {
		if(results.length) {
			const canEdit = results[0].ip_address == req.ip ? true : false;

			res.render('corral', { 
				id: id,
				name: (results[0].name) ? results[0].name : 'Corral #' + results[0].id,
				css: results[0].css,
				html: results[0].html,
				js: results[0].js,
				codemirror: true,
				canEdit,
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
	const values = [ html, css, js, id, req.ip ];

	mysql('UPDATE `Content` SET `html` = ?, `css` = ?, `js` = ? WHERE `id` = ? AND ip_address = ?', values, (results, fields) => {
		res.status(200).send({ success: true });
		io.emit('corral update', 'test');
	}, (error) => {
		return next(error);
	});
});

// Delete Corral
app.post('/:id/delete', (req, res, next) => {
	const id = req.params.id;

	if(canDelete) {
		mysql('DELETE FROM `Content` WHERE `id` = ? AND ip_address = ?', [ id, req.ip ], (results, fields) => {
			res.redirect('/');
		}, (error) => {
			return next(error);
		});
	}
});

// 404 handler
app.use(function(req, res, next) {
	console.log(req.originalUrl);
 	res.status(404).render('error_404');
});

// Generic error handler
app.use(function(err, req, res, next) {
	console.log(err);
	res.status(500).render('error', {
		error: err.message,
	})
});

function unsaved_rows_cleanup(insertId) {
	// Run a cleanup delete every 20 insertions
	if(insertId % 20 == 1) {
		mysql('DELETE FROM `Content` WHERE `saved` = 0 AND `last_update` < NOW() - INTERVAL 7 DAY', (results, fields) => {
			// Do nothing
		}, (error) => {
			// Do nothing
		});
	}
}

