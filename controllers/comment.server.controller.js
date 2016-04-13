var Comment = require('../models/comment.server.model.js');

//{"comment":comment,"user":user,"quizId":quizId},
exports.addComment = function(req,res){
    //var email = user.local.email;
    req.body.user
    Comment.findOne({'quizId':req.body.quizId}, function(err,doc){
        
        if(err){console.log('While trying to get usef from database encuntered error');}
        if(doc == null||doc==undefined||doc==""){
            
            console.log("No such doc exists");

        var entry = new Comment ({
        'quizId':req.body.quizId,
        comments:[{user:req.body.user,comment:req.body.comment}]
    });
    entry.save(function(err,quiz) {
        res.end('{"success" : "Updated Successfully", "status" : 200}');
    //var link = "questions?id=" + quiz._id;
   // res.redirect(301, link);
    //console.log("Error:" + err);
    
    });

        }
        else{
        doc.comments.push({user:req.body.user,comment:req.body.comment});
    //doc.local.age = req.body.age;
    doc.save(function(err){
        res.end('{"success" : "Updated Successfully", "status" : 200}');
        if(err){console.log('Error while saving');
        }
    });
            
        }
    
});
};

exports.getComments = function(req,res,results){
    
       Comment.findOne({'quizId':req.query.id}, function(err,doc){
            console.log("ID: "+req.query.id);
        if(err){console.log('While trying to get usef from database encuntered error');}
        
        if(doc == null||doc==undefined||doc==""){
            res.render('QuizIndexPage.ejs', {user: req.user, quiz: results, comments:{comments:""}});
            console.log("cond1: "+ doc);
        }
        else{
            res.render('QuizIndexPage.ejs', {user: req.user, quiz: results, comments:doc});
            console.log("cond2: "+ doc);
        }
        
        
        
        
       // console.log('From Doc: '+doc.local.email);
   // return doc;
});
    
}