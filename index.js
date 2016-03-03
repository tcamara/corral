// Basics
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('./mysql.js');

// Controllers
const home = require('./controllers/home.js');
const auth = require('./controllers/auth.js');
const post = require('./controllers/post.js');
const user = require('./controllers/user.js');
const tag = require('./controllers/tag.js');

// Init ExpressJS
const app = express();

// Set up Jade as the view engine
app.set('views', './views');
app.set('view engine', 'jade');

// parse application/json
app.use(bodyParser.urlencoded({ extended: true }));

// Register our controllers
app.use('/', home);
app.use('/', auth);
app.use('/post', post);
app.use('/user', user);
app.use('/tag', tag);

// 404 handler
app.use(function(req, res, next) {
 	res.status(404).send('404');
});

// Generic error handler
app.use(function(err, req, res, next) {
	console.log(err);
	res.status(500).send(err.message);
});

// Fire up server
app.listen(3000, () => {
	console.log('Listening on port 3000');
});

