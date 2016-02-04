// server.js
/*
 * Reused Code For Authentication
 *
 * Version 0.1
 *
 * 29/01/2016
 *
 * @reference https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
 * @author Deniss Strods, x14100398
 *
 */ 
// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

app.configure(function() {

	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

	app.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
	app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session

});

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

//running app on start
//require('./app/addQuiz.js')('a');
//require('./app/findQuiz.js')();

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
