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
var logger   = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration



	// set up our express application
	app.use(logger('dev')); // log every request to the console
	app.use(cookieParser()); // read cookies (needed for auth)
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
 // get information from html forms
	
	 //HANDLING STATIC CONTENT
    app.use('/', express.static(__dirname + '/public'));
    app.use('/scripts', express.static(__dirname + '/node_modules/'));
    
    //HANDLING UPLADS
    /** Form Handling */
    //app.use(express.limit('5mb'));

	app.set('view engine', 'ejs'); // set up ejs for templating

	// // required for passport
	app.use(require('express-session')({
	    secret: 'ilovescotchscotchyscotchscotch',
	    resave: false,
	    saveUninitialized: false
	}));

	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session



// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

//running app on start
//require('./app/addQuiz.js')('a');
//require('./app/findQuiz.js')();

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
