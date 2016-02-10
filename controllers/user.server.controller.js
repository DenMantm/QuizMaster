//getting user model
var User = require('../models/user.server.model.js');

//getting info from body object, which is subbmitted by POST methodfrom front end


//get user document from database
exports.refreshUser = function(){
  

};

//update certain fields in user object, passing argument 
//- updateFields - which consists of necesarry update info
exports.updateUser = function(req,res){
    //var query = User.findOne({email:user.email});
    User.findOne({'email':req.user.email},function(err,doc){
    if(err){console.log('error1');}

    //doc.local.email = req.body.email;
    doc.local.name.firstName = req.body.name;
    doc.local.name.surname = req.body.surname;
    doc.local.username = req.body.username;
    doc.local.age = req.body.age;
    
    
   
    doc.save(function(err){
        
        if(err){console.log('error1');
            
            
        }
        console.log(doc.local.email);
         req.user = doc;
        return doc;
    });
        
    
    res.redirect(301, '/updateUser'); //redirecting to homepage
});


};
