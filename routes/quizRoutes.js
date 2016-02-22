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
	.get(quizController.IDget)
    .put(quizController.put)
    .patch(quizController.patch)
    .delete(quizController.Delete);
return quizRouter;
};

module.exports = routes;