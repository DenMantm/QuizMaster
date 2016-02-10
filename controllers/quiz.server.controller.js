var Quiz = require('../models/quiz.server.model.js');


//getting info from body object, which is subbmitted by POST methodfrom front end
exports.create = function(body) {
     console.log(body.qName);
    var entry = new Quiz ({
        qName: body.qName,
        qDescription: body.qDescription,
        qNumber: body.qNumber,
        shuffleQuestion: body.shuffleQuestion,
        shuffleAnswers: body.shuffleAnswers,
        design: body.design,
        viewCount: body.viewCount,
        questions: body.questions,
        owner: body.owner
    });
    entry.save();
    //redirect to homepage
};
exports.getNode = function(req,res) {
    res.render('newquiz', {title: "Quiz - New node"});
};

exports.checkqName = function(req,res) {
    var query = Quiz.find();
    var search = req.body.qName;
    
    if (search.length > 0)
    {
        query.where({ qName: search});
    }
    query.exec(function(err, results) {
        console.log(results[0]);
        var message;
        if(results.length != 0) {
            message = {text: "Quizz with such a name already exsists"}
        } else {
            message = {text: "OK"}
        }
        console.log(message);
        res.render('newquiz.ejs' , {message: message, user: req.user});
    });
};