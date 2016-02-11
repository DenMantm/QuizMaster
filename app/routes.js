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
 var user,
	 condition = false, //this value is set accordingly if you are logged in or not
	 fs 	   = require('fs');
	 
	 
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
		//body with data is passed to standardCtrl
		app.post('/newquiz', function(req, res) {
			  standardCtrl.create(req.body);  //saving object to database
			  res.redirect(301, '/index'); //redirecting to homepage
			  
		});
				app.get('/x', function(req, res) {
				res.render('new_index.ejs');
		});
		
		//POST method for user update
		app.post('/updateUser',isLoggedIn, function(req, res) {
    		UserCtrl.updateUser(req,res, req.user);//querying current user
		});
		//Getting user info 
		app.get('/updateUser',isLoggedIn, function(req, res) {
		res.render('profile.ejs',{user : req.user, date:Date.now()});
		});
		
		//Uploading file REF:
		//UPLOADING IMAGE FROM THE USER
		//http://stackoverflow.com/questions/5149545/uploading-images-using-node-js-express-and-mongoose
		app.post('/upload', function(req, res) {
    // Get the temporary location of the file
    var tmp_path    = req.files.image.path,
    	target_path = './upload/userPics/' + req.user.local.email;
    // Set where the file should actually exists - in this case it is in the "images" directory.
    // Move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err)
            throw err;
        // Delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files.
        fs.unlink(tmp_path, function() {
            if (err)
                throw err;
            //
        });
    });
    
    var update = {'local.pictureUrl':"./upload/userPics/"+req.user.local.email};
    
    UserCtrl.updateOneElement(req.user,update);
    
    res.redirect(301, '/updateUser'); //redirecting to homepage
		});
		
	//THIS FUNCTION RETURNS PROFILE IMAGE IN BINARY FORMAT TO FRONT END
	app.get('/getProgilePic', function(req, res) {
			console.log(req.user.local.pictureUrl);
		
		fs.readFile(req.user.local.pictureUrl, "binary", function(error, file) {
		    if(error) {
		        res.writeHead(500, {"Content-Type": "text/plain"});
		        res.write(error + "\n");
		        res.end();
		    }
		    else {
		        res.writeHead(200, {"Content-Type": "image/png"});
		        res.write(file, "binary");
		        res.end();
		    }
});
			
			
		});
		
	//Reading user image::


	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
		app.get('/', isLoggedIn, function(req, res) {
			
		res.render('index.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

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
	if (req.isAuthenticated()){
		condition = true;
		return next();}
	
	// if they aren't redirect them to the home page
	condition = false;
	res.redirect('/login');
}

//Asynchrosity generation function REF: 
//http://stackoverflow.com/questions/11278018/how-to-execute-a-javascript-function-only-after-multiple-other-functions-have-co

var when = function() {
  var args = arguments;  // the functions to execute first
  return {
    then: function(done) {
      var counter = 0;
      for(var i = 0; i < args.length; i++) {
        // call each function with a function to call on done
        args[i](function() {
          counter++;
          if(counter === args.length) {  // all functions have notified they're done
            done();
          }
        });
      }
    }
  };
};
  //  	when(
  //function(done) {
		// user = UserCtrl.getUser(req.user,done);
		// console.log('1 running');
  //	}
		// ).then(function() {
		// 	console.log('3 running');
    		
  //  		UserCtrl.updateUser(req,res,user);
    	
		// });