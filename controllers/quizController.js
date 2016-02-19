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
		    console.log("quiz: " + quiz)
		    console.log("query" + query);
			if (err) {
			res.status(500).send(err);
					console.log("error :" + err)
			} else {

			    var returnQuiz = [];
			    quiz.forEach(function(element, index, array){
			        var newQuiz = element.toJSON();
			        console.log(element)
			        newQuiz.links = {};
			        newQuiz.links.self = 'http://' + req.headers.host + '/api/quiz/' + newQuiz._id;
			        returnQuiz.push(newQuiz);
			    });
				res.json(returnQuiz);
			}
		});
	}
	return { 
	    get: get,
	    post:post
	}
};

module.exports = quizController;