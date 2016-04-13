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
	fs = require('fs'),
	bcrypt = require('bcrypt-nodejs'),
	$ = require('jquery');
var quizCtrl = require("../controllers/quiz.server.controller.js");
//controler for users
var UserCtrl = require("../controllers/user.server.controller.js");
// load up the user model
var User       		= require('../models/user.server.model');
// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

module.exports = function(app, passport) {
	// ==================================
	// == CONTENT FOR API AND FTUFF =====
	// ==================================
		
		//calling page
		app.get('/apiQuiz', function(req, res) {
		res.render('apiQuiz.ejs',{user: req.user});//displaying page where you can add existing questions
		});
		
		//returning existing topic list from the server
		app.get('/apiQuiz/getTopicList', function(req, res) {
			
		var list = require('../from_jservice_API/best_topic_ids.json');
			res.send(list);
		});
	
	
	// ================================================================
	// ========= AIP Quiz, getting and storing list ===================
	// ================================================================
	
	
	
	//I WILL MOVE THIS TO OTHER LOCATION AFTER< NOW ITS HERE FOR TESTING PURPOSES
	
	//when this function fired, it scans all database from jservice api and assebbles json, which is latter saver to disk
	app.get('/apiCallGenerateList', function(req, res) {

  	var http = require('http');
  	var offset = 0;
  	var counter = 0;
  	var whenToStop = 250;
  	
  	var topics =[];

var options = {
  host: 'www.jservice.io',
  path: '/api/categories?count=100&offset='+offset
};

var callback = function(response) {
	var data = "";

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (data_rec) {
 data += data_rec;
  	
    console.log('chunkHere finished');
    
  });
  response.on('error',function(){
  	console.log('encountered error');
  })

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
  	data = JSON.parse(data);
	if(data[0] == undefined){
		console.log('empty data set')
		saveToFile();
	}  	
  	  	for(var i = 0; i < data.length;i++){
                           //var b = new Object();
                           //console.log(data[i]);
                           //b = data[i];
                           if(data[i].clues_count>90){
                           topics.push(data[i]);
                           console.log('PUTTING IN, clues count: ' + data[i].clues_count);
                           
                           }
                           else console.log('skipping, clues count: '+ data[i].clues_count);
                       }
    console.log('Finishing'+ counter+"offset: "+offset);
    offset+=100;
    options.path = '/api/categories?count=100&offset='+offset;
    
                       counter++;
                    if(counter == whenToStop){
                    	
						saveToFile();
                        
                    }
                   // http.request(options, callback).end();
                    
  });
  
  function saveToFile(){
  	                    	var fs = require('fs');
									var outputFilename = './from_jservice_API/best_topic_ids.json';
									fs.writeFile(outputFilename, JSON.stringify(topics, null, 4), function(err) {
									    if(err) {
									      console.log(err);
									    } else {
									      console.log("JSON saved to " + outputFilename);
									    }
									}); 
                        console.log("::::Its time to stop;:::::" + topics.length);
                        //for (var i =0; i<topics.length;i++){
                           //console.log('topic: '+topics[i].title);
                           //console.log('clues: '+topics[i].clues_count);
                       // }
                       return;
  }
}
	
	http.request(options, callback).end();
	
	});
	
	
		
	// ==================================
	// == ROUTES FOR QUIZ GET, POST =====
	// ==================================

	// ==================================
	// ========== NEW QUIZ ==============
	// ==================================		


	
	app.get('/newquiz', isLoggedIn, function(req, res) {
		res.render('newquiz.ejs', {
			user: req.user,
			message: {
				text: "none"
			}
		});
	});

	app.post('/newquiz', isLoggedIn, function(req, res) {
		return quizCtrl.create(req,res); //saving object to database
});

	app.get('/testing', function(req, res){
		return quizCtrl.findId(req, res);
	});

	app.get('/questions', function(req, res){
		return quizCtrl.Questions(req, res);
	});

	app.post('/updateqz' , function(req, res) {
		quizCtrl.updateqz(req.body);
		res.redirect(301, '/showMyQuiz');
	});
	
	app.post('/addQuestion' , function(req,res){
		quizCtrl.addQuestion(req.body);
		res.redirect(req.get('referer'));
	});
	
	app.post('/editQuestion' , function(req,res){
		quizCtrl.editQuestion(req.body);
		res.redirect(req.get('referer'));
	});

	
	app.get('/showquiz', function(req, res) {
		console.log('getting showquiz');
		return quizCtrl.list(req, res);
	});
	
	
	app.get('/showMyQuiz',isLoggedIn, function(req, res) {
		return quizCtrl.MyList(req, res);
	});

	app.post('/removeqz', function(req, res) {
		quizCtrl.removeq(req);
		console.log('received removeqz') ;
		res.redirect(301, '../index'); //redirecting to homepage
		console.log('redirected') ;
	});
	
	app.post('/removeQuest', function(req, res) {
		quizCtrl.removeQest(req);
		console.log("Redirecting to the: " + req.get('referer'))
		res.redirect(req.get('referer'));
	});
	
	app.get('/editqz', function(req, res){
		return quizCtrl.editqz(req, res);
	});

	app.post('/checkName', function(req, res){
		return quizCtrl.checkqName(req, res);
	});
	
	app.get('/quiz', function(req, res){
		
		return quizCtrl.start(req, res);
		
	});	
	
	app.post('/sendResults', function(req, res){
		return quizCtrl.sendResults(req.body, res);
		//res.redirect(301, '/showquiz');
	});

	// ==================================
	// ========= UPDATE USER ============
	// ==================================

	//test function here on returning myQuizes
	app.get('/myQuizList', function(req, res) {
		quizCtrl.myQuizList(req,res);
	});
	app.post('/saveModifiedQuiz', function(req, res){
		console.log("Checking: " + req)
		quizCtrl.saveModifiedQuiz(req,res);
		
	});



	//POST method for user update limited method which first checks if user nam can be updated and is not taken :-)
	app.post('/updateUser', isLoggedIn, function(req, res) {
		
		 	when(
function(done) {
//first this
UserCtrl.updateWithCheck(req,res,done);

}
).then(function() {
	//then this
	UserCtrl.updateUser(req,res,req.user);

});

		
	});
	//Getting user info 
	app.get('/updateUser', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user: req.user,
			date: Date.now()
		});
	});

	//Uploading file REF:http://stackoverflow.com/questions/5149545/uploading-images-using-node-js-express-and-mongoose
	//###############################################################################################                   
	//#################################	UPLOADING IMAGE FROM THE USER ###############################
	//###############################################################################################

	// app.post('/upload', isLoggedIn, function(req, res) {
	// 	// Get the temporary location of the file
	// 	console.log(req.files);
	// 	var tmp_path = req.files.image.path,
	// 		target_path = './upload/userPics/' + req.user.local.email;
	// 	// Move the file from the temporary location to the intended location
	// 	fs.rename(tmp_path, target_path, function(err) {
	// 		if (err) throw err;
	// 		// Delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files.
	// 		fs.unlink(tmp_path, function() {
	// 			if (err) throw err;
	// 		});
	// 	});
	// 	//update profile image link in database
	// 	var update = {
	// 		'local.pictureUrl': "./upload/userPics/" + req.user.local.email
	// 	};
	// 	UserCtrl.updateOneElement(req.user, update);

	// 	res.redirect(301, '/updateUser'); //redirecting to homepage
	// });

///REBUILDING FILE UPLOAD FOR EXPRESSS 4


   	var formidable = require('formidable'),
    fs = require('fs'),
    path = require('path');

    app.post('/uploadQuizIcon', isLoggedIn, function(req, res) {
    // 	console.log("something");
    // console.log(req.body._id);
    	console.log(req.originalUrl);
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        // `file` is the name of the <input> field of type `file`
        
        var old_path = files.file.path,
            file_size = files.file.size,
            file_ext = files.file.name.split('.').pop(),
            index = old_path.lastIndexOf('/') + 1,
            file_name = old_path.substr(index),
            new_path = './public/img/quizIcons/' + fields._id;

        fs.readFile(old_path, function(err, data) {
            fs.writeFile(new_path, data, function(err) {
                fs.unlink(old_path, function(err) {
                    if (err) {
                        res.status(500);
                        res.json({'success': false});
                    } else {
                    	
             var update = {
			'picture': "img/quizIcons/" + fields._id
		};
		
		quizCtrl.updateqzIcon(fields._id, update);

			res.redirect(301, '/editqz?id='+fields._id); //redirecting to homepage
	
                    }
                });
            });
        });
    });
});


							//~~~~~~~~~~~~~~~~~~~~~Showing Quiz Index page here::~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
							//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
							
							app.get('/showQuizIndex', function(req,res){
								quizCtrl.showQuizIndex(req,res);
							});
							
							//UPLOADING USER PICTURE

 app.post('/upload', isLoggedIn, function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        // `file` is the name of the <input> field of type `file`
        var old_path = files.file.path,
            file_size = files.file.size,
            file_ext = files.file.name.split('.').pop(),
            index = old_path.lastIndexOf('/') + 1,
            file_name = old_path.substr(index),
            new_path = './upload/userPics/' + req.user.local.email;

        fs.readFile(old_path, function(err, data) {
            fs.writeFile(new_path, data, function(err) {
                fs.unlink(old_path, function(err) {
                    if (err) {
                        res.status(500);
                        res.json({'success': false});
                    } else {
             var update = {
			'local.pictureUrl': "./upload/userPics/" + req.user.local.email
		};
		UserCtrl.updateOneElement(req.user, update);

		res.redirect(301, '/updateUser'); //redirecting to homepage
                    }
                });
            });
        });
    });
});



	//Uploading file REF:http://stackoverflow.com/questions/5149545/uploading-images-using-node-js-express-and-mongoose
	//###############################################################################################               
	//############## THIS FUNCTION RETURNS PROFILE IMAGE IN BINARY FORMAT TO FRONT END ##############
	//###############################################################################################

	app.get('/getProgilePic',isLoggedIn, function(req, res) {
		console.log(req.user.local.pictureUrl);

		fs.readFile(req.user.local.pictureUrl, "binary", function(error, file) {
			if (error) {
				res.writeHead(500, {
					"Content-Type": "text/plain"
				});
				res.write(error + "\n");
				res.end();
			}
			else {
				res.writeHead(200, {
					"Content-Type": "image/png"
				});
				res.write(file, "binary");
				res.end();
			}
		});
	});
	//REF: http://stackoverflow.com/questions/24583608/nodejs-in-bcrypt-it-returns-false-at-compare-password-hash
	//###############################################################################################                   
	//#################################	DELETING USER FROM DATABASE #################################
	//###############################################################################################
	app.post('/deleteUser/ajax',isLoggedIn, function(req, res) {

		var hashFromDB = req.user.local.password;
		var plainPassFromUser = req.body.password;

		bcrypt.compare(plainPassFromUser, hashFromDB, function(err, matches) {
			if (err)
				console.log('Error while checking password');
			else if (matches) {
				console.log('The password matches!');
				UserCtrl.removeElement(req.user);
				req.logout();
				res.send({status:'done'});
			}
			else {
				res.send({status:'wrongPassword'});
			}
		});



	});
	
	//###############################################################################################
	//############################# Change password while logged in #################################
	//###############################################################################################
		app.post('/change_password/ajax', function(req, res) {
		
		//putting this just for now, latter will combine in one module::
		
				var hashFromDB = req.user.local.password;
		var plainPassFromUser = req.body.password_old;

		bcrypt.compare(plainPassFromUser, hashFromDB, function(err, matches) {
			if (err)
				console.log('Error while checking password');
			else if (matches) {
				console.log('The password matches!');
				
				require('../app/changePassword.js')(req.body.password_new, req.user);
				
				res.send({status:'done'});
			}
			else {
				res.send({status:'wrongPassword'});
			}
		});
			
			
         
         
	});
	
	//###############################################################################################
	//#################################Verifying user e-mail by link#################################
	//###############################################################################################
	app.get('/verifyEmail/:key', function(req, res) {
		
		if (!req.isAuthenticated()) {
				res.send('<h3>You have to be logged in to verify your profile, please login here: <a href="/login">WebSite</a></h3>');
				return;
			}
		
		
		if (req.params.key == req.user.local.key) {
			//update profile image link in database
			var update = {
				'local.validEmail': true
			};
			UserCtrl.updateOneElement(req.user, update);

			res.send('<h4>Your e-mail is now verified link to website: <a href="/login">WebSite</a></h4>');
		}
		else {
			res.send('This is invalid key: ' + req.params.key);
		}
	});
	//###############################################################################################             
	//#################################	Retrieving password for user ################################
	//###############################################################################################
	app.post('/retrievePassword/ajax', function(req, res) {
         UserCtrl.getPasswordUser(req,res);
	});
	
	app.get('/retrievePassword', function(req, res) {
		res.render('./profile/retrievePassword.ejs',{message:''});
	});
	
	//HANDLING LINK RECIEVED BY E_MAIL key = email from the form, keys = hex generated key which is attached to user profile
	
	app.get('/recoverPassword/:key/:keys', function(req, res) {
		UserCtrl.getVerifyKey(req,res);
	});
	
	app.post('/recoverPassword', function(req, res) {
		UserCtrl.getPostNewPassword(req,res);
		});
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/',isLoggedIn, function(req, res) {
		res.render('login_new.ejs', {
			user: req.user // get the user out of session and pass to template
		});
	});
	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('login_new.ejs', {
			message: req.flash('loginMessage')
		});
	});
	app.get('/index', isLoggedIn, function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('index.ejs',{user: req.user});
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/index', // redirect to the secure profile section
		failureRedirect: '/login', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));
	//login trough ajax call
			app.post('/login/ajax', function(req, res, next) {
	 passport.authenticate('local-login', function(err, user, info) {
        if (err)  { return next(err); }
        if (!user) { return res.send({"status": 'noUser'}); }
        req.logIn(user, function(err) {
          if (err) { return res.send({"status": 'noUser'});}
          return res.send({"status": 'done'});
        });
		 })(req, res, next);    
			});
	
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
	
	
	
		//signup trough ajax call
			app.post('/signup/ajax',checkSignup, function(req, res, next) {
				
	 passport.authenticate('local-signup', function(err, user, info) {
	 	
        if (err)  { return next(err); }
        
        // if (user) { return res.send({"status": 'emailExists'});}
        
        req.logIn(user, function(err) {
        	
          if (err) { return res.send({"status": 'error'});}
          
          return res.send({"status": 'done'});
        });
		 })(req, res, next);    
	
			});
			
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
	if (req.isAuthenticated()) {
		
		//HERE CHECKING IF USER IS VALIDATED HIS E_MAIL ADDRESS
		
		//DISABLING FOR NOW E_MAIL VALIDATION TRIGGER
		// if(!req.user.local.validEmail){
		// //condition = true;
		// return res.render('./profile/pleaseValidateEmail.ejs',{user:req.user});
		// }
		// else
		return next();
	}

	// if they aren't redirect them to the home page
	condition = false;
	res.redirect('/login');
}

//creating minleware to check ir that kind e-mail or nickname is already takem
function checkSignup(req, res, next) {
console.log('USER: '+ req.body.email);
        User.findOne({ 'local.email' :  req.body.email }, function(err, user) {
            // if there are any errors, return the error
            if (err){
            console.log(err);
              return  res.send({"status": err});
}
            // check to see if theres already a email with that email
            if (user) {
                return res.send({"status": 'emailExists'});
            }  else {
            	        User.findOne({ 'local.username' :  req.body.username }, function(err, user) {
            // if there are any errors, return the error
            if (err){
            console.log(err);
              return  res.send({"status": err});
}
            // check to see if theres already a username with that email
            if (user) {
                return res.send({"status": 'userExists'});
            }  else {
			return	next();
                     }
        });
                     }
        });



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
// function(done) {

// console.log('1 running');

// done();
	
// }
// ).then(function() {
	
	
// 	console.log('2 running');


// });