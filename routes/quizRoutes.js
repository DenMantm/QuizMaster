var express = require("express");

var routes = function(quiz) {
var quizRouter = express.Router();
var quizController = require("../controllers/quizController.js")(quiz);
    
quizRouter.route('/')
	.get(quizController.get)
	.post(quizController.post);
	
quizRouter.use('/:quizId' , function(req,res,next){
    quiz.findById(req.params.quizId, function(err,quiz){
    	if (err) 
    	    res.status(500).send(err);
    	else if (quiz) {
    	    req.quiz = quiz;
    	    next();
    	} else {
    	    res.status(404).send('quiz not found');
    	}
    });   	
});
quizRouter.route('/:quizId')
	.get(function(req,res){
	    
	    var returnQuiz = req.quiz.toJSON();
	    returnQuiz.links = {};
	    var newLink = 'http://' + req.headers.host + '/api/quiz/?owner=' + returnQuiz.owner;
	    returnQuiz.links.filterByThisOwner = newLink.replace(' ', '%20')
        res.json(returnQuiz);
    })
    .put(function(req,res){
        req.quiz.qName          = res.body.qName;
        req.quiz.qDescription   = res.body.qDescription;
        req.quiz.qNumber        = res.body.qNumber;
        req.quiz.shuffleQuestion = res.body.shuffleQuestion;
        req.quiz.shuffleAnswers = res.body.shuffleAnswers;
        req.quiz.design         = res.body.design;
        req.quiz.viewCount      = res.body.viewCount;
        req.quiz.questions      = res.body.questions;
        req.quiz.owner          = res.body.owner;
        req.quiz.save(function(err){
            if(err) {
                res.status(500).send(err);
            } else {
                res.json(quiz);
            }
        });
    })
    .patch(function(req,res){
        if(req.body._id) 
            delete req.body._id;
        for (var p in req.body) {
            req.quiz[p] = req.body[p];
        }
        req.quiz.save(function(err){
            if(err) {
                res.status(500).send(err);
            } else {
                res.json(req.quiz);
            }
        });
    })
    .delete(function(req,res){
        console.log("removing now")
        req.quiz.remove(function(err){
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(204).send('Removed');
            }
        });
    });
return quizRouter;
};

module.exports = routes;