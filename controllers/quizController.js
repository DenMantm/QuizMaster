var quizController = function (quiz){
    
    var post = function(req,res){
		var quizz = new quiz(req.body);
		
		if(!req.body.qName) {
		    res.status(400);
		    res.send("Name is required");
		} else {
		quizz.save();
		res.status(201);
		res.send(quizz);
		}
	};
	
	var get = function(req,res){
		
		var query = {};
		if (req.query.owner) {
			query.owner = req.query.owner;
		}
		quiz.find(query, function(err,quiz){
			if (err) {
			res.status(500).send(err);
					console.log("error :" + err)
			} else {

			    var returnQuiz = [];
			    quiz.forEach(function(element, index, array){
			        var newQuiz = element.toJSON();
			        newQuiz.links = {};
			        newQuiz.links.self = 'http://' + req.headers.host + '/api/quiz/' + newQuiz._id;
			        returnQuiz.push(newQuiz);
			    });
				res.json(returnQuiz);
			}
		});
	}
	
	var IDget = function(req,res){
	    
	    var returnQuiz = req.quiz.toJSON();
	    returnQuiz.links = {};
	    var newLink = 'http://' + req.headers.host + '/api/quiz/?owner=' + returnQuiz.owner;
	    returnQuiz.links.filterByThisOwner = newLink.replace(' ', '%20')
        res.json(returnQuiz);
    }
    
    var put = function(req,res){
        req.quiz.qName          = req.body.qName;
        req.quiz.qDescription   = req.body.qDescription;
        req.quiz.qNumber        = req.body.qNumber;
        req.quiz.shuffleQuestion = req.body.shuffleQuestion;
        req.quiz.shuffleAnswers = req.body.shuffleAnswers;
        req.quiz.design         = req.body.design;
        req.quiz.viewCount      = req.body.viewCount;
        req.quiz.questions      = req.body.questions;
        req.quiz.owner          = req.user.local.email;
        req.quiz.save(function(err){
            if(err) {
                res.status(500).send(err);
            } else {
                res.json(quiz);
            }
        });
    }
    
    var patch = function(req,res){
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
    }
    
    var Delete = function(req,res){
        console.log("removing now")
        req.quiz.remove(function(err){
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(204).send('Removed');
            }
        });
    }
    
	return { 
	    get: get,
	    post:post,
	    IDget: IDget,
	    put: put,
	    patch: patch,
	    Delete: Delete
	};
};

module.exports = quizController;