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
var standardCtrl = require("./controllers/quiz.server.controller.js");
module.exports = function(app, passport) {
			//ROUTES FOR QUIZ GET, POST
			
	app.get('/newquiz',isLoggedIn, function(req, res) {
	return standardCtrl.getNode(req,res);
});

app.post('/newquiz',isLoggedIn, function(req, res) {
	return standardCtrl.create(req,res);
});

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	
		app.get('/', isLoggedIn, function(req, res) {
		res.render('login.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	//app.get('/', function(req, res) {

	//	res.render('index.ejs'); // load the index.ejs file
	//});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

		app.get('/index', isLoggedIn, function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('index.ejs');
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/index', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/index', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
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
