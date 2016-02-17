//getting user model
var User = require('../models/user.server.model.js');
var emaiLink = require('../app/emailLink.js');


//getting info from body object, which is subbmitted by POST methodfrom front end

//get user document from database

exports.getUser = function(email){
    //var email = user.local.email;
    User.findOne({'local.email':email}, function(err,doc){
        if(err){console.log('While trying to get usef from database encuntered error');}
        console.log('From Doc: '+doc.local.email);
    return doc;
});
};

//Final step in password change
exports.getPostNewPassword = function(req,res){
    //var email = user.local.email;
    User.findOne({'local.email':req.body.email}, function(err,doc){
        console.log('RUNNING_post_key');
        if(doc ===null){
            res.send('No such user');
        }
        else{
            if(doc.local.key===req.body.key){
                
                //res.render('login.ejs',{message:'Password succesfully changed'});
                
                //creating separate module for changing password, here passing new password to the module
                
                require('../app/changePassword.js')(req.body.password,doc);
            }
            else{
                res.send('invalid key');
            }
            //res.send('first: '+req.params.key+' second: '+req.params.keys)
        }
        if(err){console.log('While trying to get usef from database encuntered error');}
});
};

//Verify that we have right e-mail and key combination:: THIS IS WHEN USING LINK WHICH WAS PROVIDED BY SERVER
exports.getVerifyKey = function(req,res){
    //var email = user.local.email;
    User.findOne({'local.email':req.params.key}, function(err,doc){
        console.log('RUNNING');
        if(doc ===null){
            res.send('You have invalid link');
        }
        else{
            if(doc.local.key===req.params.keys){
                
                res.render('./profile/newPassword',{message:'',key:req.params.keys,email:req.params.key});
                
            }
            else{
                res.send('invalid key');
            }
            //res.send('first: '+req.params.key+' second: '+req.params.keys)
        }
        if(err){console.log('While trying to get usef from database encuntered error');}
});
};


//password recovery part THIS IS WHEN REQUIESTING LINK FROM THE SERVER
exports.getPasswordUser = function(req,res){
    //var email = user.local.email;
    User.findOne({'local.email':req.body.email}, function(err,doc){
        if(err){console.log('While trying to get usef from database encuntered error');}
    
    if(doc ===null){
        console.log('cant find user');
        res.render('./profile/retrievePassword.ejs',{message:'User with such e-mail does not exist'});
    }
    else{
        
        console.log('User found');
        
//assembling link here for user password recovery::
var link = "http://"+req.get('host')+"/recoverPassword/"+doc.local.email+'/'+doc.local.key;
        var message = {
  text:    "Password Recovery link",
  from:    "QuizMaster <username@your-email.com>",
  to:      doc.local.email,
  cc:      "",
  subject: "Quizmaster Recovery e-mail",
  attachment: 
  [
      {data:"<html> <h3>This is your recovery link:</h3></hr></br><a href="+link+">Press Here</a></html>", alternative:true}
      //{path:"path/to/file.zip", type:"application/zip", name:"renamed.zip"}
  ]
};
        emaiLink.sendEmail(message);
        res.render('./profile/retrievePassword.ejs',{message:'E-mail with password recovery was sent'});
    }
});
};
//update certain fields in user object, passing argument 
//- updateFields - which consists of necesarry update info
exports.updateUser = function(req,res,user){
    var email = user.local.email;
    console.log(email);
    User.findOne({'local.email':email}, function(err,doc){
        if(err){console.log('error1');}
    //doc.local.email = req.body.email;
    doc.local.name.firstName = req.body.name;
    doc.local.name.surname = req.body.surname;
    doc.local.username = req.body.username;
    doc.local.age = req.body.age;
    doc.save(function(err){
        if(err){console.log('Error while saving');
        }
    });
    res.redirect(301, '/updateUser'); //redirecting to homepage
});
};

//UPDATES ALL ELEMENTS OF USER WHICH ARE SENT AS UPDATE
exports.updateOneElement = function(user,update){
    var email = user.local.email;
    console.log('Updating:: '+email);
    var condition = {'local.email':email};
User.update(condition,update,
function(err, numberAffected,rawResponse){if(err)console.log('error while updating picture url')});
};
//removing user from database
exports.removeElement = function(user){
    var email = user.local.email;
    User.find({'local.email':email}).remove().exec();
    console.log('removed: '+ email);
};
