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
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Quiz = require('./models/quiz.server.model');


var configDB = require('./config/database.js');

// set up our express application
app.use(logger('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

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

var quizRouter = require('./routes/quizRoutes')(Quiz);
app.use('/api/quiz', quizRouter);

// routes ======================================================================
require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

//running app on start
//require('./app/addQuiz.js')('a');
//require('./app/findQuiz.js')();



					//########################### Creating socket chat handlers here:: ###################################




//array for users
var clients = {};
function handleIO(socket){
	
	//adding user to list
	socket.on('add-user', function(data){
		//writing to the object
    clients[data] = {
      "socket": socket.id,
      'name': data
    };
                     //if user connects, provide him with userlist and others as well
    socket.broadcast.emit('update-list',clients);
    socket.emit('update-list',clients);

  });
					//handling Small Chat window::



					socket.on('messageToAll',function(msg){
						    socket.broadcast.emit('chatIncomingMessage',msg);
    						socket.emit('chatIncomingMessage',msg);
    					
					})

				socket.on('inviteUser',function(invite){
					
					if(clients[invite.user]===undefined){
						socket.emit('inviteStatus','noUser');
						return;
					}
					//sending request to certain person::
					console.log('USER TO INVITE: '+ clients[invite.user].socket);
					console.log(invite);

					//send invite to the user
					io.to(clients[invite.user].socket).emit("invite", invite);

					socket.on('inviteStatusFromUser',function(answer){
						if(answer.type ==='accept'){
							console.log('accepting');
						io.to(clients[answer.user].socket).emit('inviteStatus','accept');
						return;
						}
						if(answer.type === 'reject'){
							console.log('reject');
						io.to(clients[answer.user].socket).emit('inviteStatus','reject');
						return;
						}
					});	
					
					
				})       
			
				
	                 //when requireing userlist presenting it

	socket.on('user-list',function(){
		                   //if new user connects, emmit userlist
		socket.emit('update-list',clients);
		console.log('working');
	});

					//Handling Disconnection::
	
	function disconnect(){
		//finding which user disconnected
		for (var key in clients) {
	if(clients[key].socket === socket.id){
		console.log(key);
		//deleting that entry
		delete clients[key];
	}
 
	}
		socket.broadcast.emit('update-list',clients);
	};

	console.log("connected");
	//whenever client disconnected
	socket.on("disconnect",disconnect);
}

var server = app.listen(port);
var io = require('socket.io').listen(server);
//requireing debug messages to go away
//io.set('log level', 1);
//event listner on connection fires funct
io.on("connection",handleIO);
    
console.log('Listening on port number: ' + port);


// // launch ======================================================================
// app.listen(port);
// console.log('The magic happens on port ' + port);
module.exports = app;