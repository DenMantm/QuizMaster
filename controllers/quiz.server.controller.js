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
        var message;
        if (err) {
            console.log("Error: " + err);
        } else {
        if(results.length != 0) {
            message = {text: "Quizz with such a name already exsists"};
        } else {
            message = {text: "OK"};
        }
        console.log(message);
        res.render('newquiz.ejs' , {message: message, user: req.user});
        }
    });
};

exports.list = function(req,res) {
    var query = Quiz.find();
    query.sort({ owner: 'desc' })
    .exec(function(err, results){
        if (!req.user) {
            var user = {local: {username:"empty", email:"empty"}}
             res.render('showlist.ejs', {list:results, user:user});
        } else {
            res.render('showlist.ejs', {list:results, user:req.user});
        }
        console.log("Error: " + err);
    });
};

exports.removeq  = function(req,res) {
    var condition = {_id: req.query.id};
    console.log(req.query.id);
    Quiz.remove(condition, function(err) {
        console.log("Error: " + err);
    });
};

exports.editqz = function(req,res) {
    var id = req.query.id;
    var query = Quiz.findOne();
    query.sort({ owner: 'desc' }).where({_id: id})
    .exec(function(err,results){
        res.render('edit_qz_settings.ejs', {settings: results});
        console.log("Error: " + err);
    });
};

exports.updateqz = function(body) {
    var condition = { _id: body._id };
    var update = {
        qName: body.qName,
        qDescription: body.qDescription,
        qNumber: body.qNumber,
        shuffleQuestion: body.shuffleQuestion,
        shuffleAnswers: body.shuffleAnswers,
        design: body.design
    };
    console.log(update);
    Quiz.update(condition, update, function(err, numberAffected, rawResponce) {
        console.log("Error: " + err);
        console.log("numberAffected: " + numberAffected);
        console.log("rawResponce: " + rawResponce);
    });
    //redirect to homepage
};