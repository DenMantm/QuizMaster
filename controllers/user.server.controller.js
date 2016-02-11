//getting user model
var User = require('../models/user.server.model.js');

//getting info from body object, which is subbmitted by POST methodfrom front end

//get user document from database

exports.getUser = function(user){
    var email = user.local.email;
    User.findOne({'local.email':email}, function(err,doc){
        if(err){console.log('While trying to get usef from database encuntered error');}
    return doc;
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
exports.updateOneElement = function(user,update){
    
    var email = user.local.email;
    var condition = {'local.email':email};

User.update(condition,update,
function(err, numberAffected,rawResponse){if(err)console.log('error while updating picture url')});

    
};