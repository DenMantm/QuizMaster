var Quiz = require('../models/quiz.server.model.js');

exports.create = function(req, res) {
    var entry = new Quiz ({
        qName: req.body.qName,
        qDescription: req.body.qDescription,
        qNumber: req.body.qNumber,
        shuffleQuestion: req.body.shuffleQuestion,
        shuffleAnswers: req.body.shuffleAnswers,
        design: req.body.design,
        questions: req.body.questions
    });
    
    entry.save();
    
    //redirect to homepage
    res.redirect(301, '/');
};
exports.getNode = function(req,res) {
    res.render('newquiz', {title: "Quiz - New node"});
}