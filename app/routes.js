// app/routes.js
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
//controller for quizes
var standardCtrl = require("../controllers/quiz.server.controller.js");
//controler for users
var UserCtrl = require("../controllers/user.server.controller.js");
module.exports = function(app, passport) {

	// ==================================
	// == ROUTES FOR QUIZ GET, POST =====
	// ==================================

	app.get('/newquiz', function(req, res) {

		res.render('newquiz.ejs', {
			user: req.user,
			message : {text : "none"}
		});

	});
	
	app.post('/checkqName', function(req, res) {
		console.log('Doing /chekname');
		return standardCtrl.checkqName(req,res);
	  });
	
	//body with data is passed to standardCtrl
	app.post('/newquiz', function(req, res) {
		standardCtrl.create(req.body); //saving object to database
		res.redirect(301, '/index'); //redirecting to homepage

	});


	//POST method for user update
	app.post('/updateUser', isLoggedIn, function(req, res) {

		UserCtrl.updateUser(req, res); //saving object to database
	});

	//Getting user info 
	app.get('/updateUser', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user: req.user,
			date: Date.now()
		});
	});

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', isLoggedIn, function(req, res) {
		res.render('login.ejs', {
			user: req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('login.ejs', {
			message: req.flash('loginMessage')
		});
	});
	app.get('/index', isLoggedIn, function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('index.ejs');
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/index', // redirect to the secure profile section
		failureRedirect: '/login', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));
	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', {
			message: req.flash('signupMessage')
		});
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/index', // redirect to the secure profile section
		failureRedirect: '/signup', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user: req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	res.redirect('/login');
}
