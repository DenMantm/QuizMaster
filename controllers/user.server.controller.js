//getting user model
var User = require('../models/user.server.model.js');

//getting info from body object, which is subbmitted by POST methodfrom front end

//get user document from database
exports.getUser = function(user,done){
    
    var email = user.local.email;
   var query = User.findOne({'local.email':email}
    ,function(err,doc){
    if(err){console.log('error1');}
    console.log('2 running');

    
    
    
    console.log(doc);
    return doc;
   
});

};

//update certain fields in user object, passing argument 
//- updateFields - which consists of necesarry update info
exports.updateUser = function(req,res,user){
    

       
    var email = user.local.email;
    console.log(email);
   var query = User.findOne({'local.email':email}
    ,function(err,doc){
    if(err){console.log('error1');}
    console.log('2... running');
    
    
    //doc.local.email = req.body.email;
    doc.local.name.firstName = req.body.name;
    doc.local.name.surname = req.body.surname;
    doc.local.username = req.body.username;
    doc.local.age = req.body.age;
    console.log(doc);
    doc.save(function(err){
        
        if(err){console.log('Error while saving');
  
        }
        console.log(doc.local.email);
    });
        
    
    res.redirect(301, '/updateUser'); //redirecting to homepage


    
    
    
    console.log(doc);
    return doc;
   
});
 
    


};

