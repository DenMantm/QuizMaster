var Quiz = require('../models/quiz.server.model.js');
var mongoose = require('mongoose');

//getting info from body object, which is subbmitted by POST methodfrom front end
exports.create = function(req) {
    var entry = new Quiz ({
        qName: req.body.qName,
        qDescription: req.body.qDescription,
        qNumber: req.body.qNumber,
        shuffleQuestion: req.body.shuffleQuestion,
        shuffleAnswers: req.body.shuffleAnswers,
        design: req.body.design,
        viewCount: req.body.viewCount,
        questions: req.body.questions,
        owner: req.user.local.email,
        questions : []
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
            message = {err: "Quizz with such a name already exsists"};
        } else {
            message = {text: "OK"};
        }
        res.send(message);
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

exports.Questions = function(req,res) {
    var id = req.query.id;
    var query = Quiz.findOne();
    query.where({_id: id})
    .exec(function(err,results){
        res.render('questions.ejs', {settings: results});
        console.log("Error: " + err);
    });
};
    
exports.addQuestion = function(body) {
    //get the ID of Quiz provided in the body
    var id = body.id;
    //get a number of answers provided in body
    var answNum = body.answNum;
    //get the correct quizz and assign it to quiz variable by passing it in the function
    Quiz.findById(id, function(err, quiz){
        if (err) {
            console.log(err);
        } else {
            //delete id value from body as we wont want to pass those to the DB
            delete body.id;
            
            //push the guestion with initial settings and empty array of answers which we will populate below
            quiz.questions.push({
                questionText: body.questionText,
                answers: [],
                qType: body.type,
                anwsNum: answNum
            });

            //get the number of questions already added in order to push the answers to the latest question
            var index = quiz.questions.length-1;
            //loop through all answers provided
            for (var i=0; i < answNum;i++){
                //push each answer to the array of 
                
                quiz.questions[index].answers.push({answer: body["answer" + i],correct: body["correct" + i]});
            }            
            //save your work in DB
            quiz.save();
        }
    } );

};


exports.removeQest = function(req) {
    //get question id
    var qid = req.query.id;
    //create mongoose IbjectID
    var id = mongoose.Types.ObjectId(qid);
    //search conditions
    var conditions = { };
    //edit conditions
    var update = { $pull: { questions: { _id: id } } };
    //edit options
    var options = { multi: true };
    //Execute query
    Quiz.update(conditions, update, options, function(err) {
        console.log(err);
    });
};

exports.editQest = function(req) {
    var qid = req.query.id;
    console.log("Searching for id: : " + qid);
    var id = mongoose.Types.ObjectId(qid);
    var conditions = { };
    var update = { $pull: { questions: { _id: id } } };
    var options = { multi: true };
    Quiz.update(conditions, update, options, function(err) {
        console.log(err);
    });
};