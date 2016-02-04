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
        questions: body.questions
    });
    entry.save();
    //redirect to homepage
};
exports.getNode = function(req,res) {
    res.render('newquiz', {title: "Quiz - New node"});
}