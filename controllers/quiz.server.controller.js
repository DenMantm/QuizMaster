var Quiz = require('../models/quiz.server.model.js');
var User = require('../models/user.server.model.js')
var mongoose = require('mongoose');

//getting info from body object, which is subbmitted by POST methodfrom front end
exports.create = function(req,res) {
    var entry = new Quiz ({
        qName: req.body.qName,
        //not sure why default values dont work, no time to investigate, insetring manually
        topic:"Non specific",
        picture: "img/quizIcons/default.png",
        qDescription: req.body.qDescription,
        qNumber: req.body.qNumber,
        shuffleQuestion: req.body.shuffleQuestion,
        shuffleAnswers: req.body.shuffleAnswers,
        viewCount: req.body.viewCount,
        owner: req.user.local.email,
        questions : [],
        timeLimit : req.body.timeLimit,
        timeLimitVal : req.body.timeLimitVal
    });
    entry.save(function(err,quiz) {
    var link = "questions?id=" + quiz._id;
    res.redirect(301, link);
    console.log("Error:" + err);
    });
};

exports.getNode = function(req,res) {
    res.render('newquiz', {user: req.user, title: "Quiz - New node"});
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

//ADDING EXTRA METHOD TO RETURN ONLY OWNED QUIZES::
exports.myQuizList = function(req,res) {
    Quiz.find({owner:req.user.local.email}, function(err,result){
        
        if(err){
            console.log("Error: " + err);
        }
        else{
            res.send(result);
        }
        
    });

    
};

exports.findId = function(req,res) {
    Quiz.find({qName:req.body.qName}, function(err,result){
        
        if(err){
            console.log("Error: " + err);
        }
        else{
            console.log("Looking for quiz with name : " + req.body.qName)
             res.send(result);
             console.log("Found: " + result);
        }
    });
};

exports.saveModifiedQuiz = function(req,res){
    var condition = {_id: req.body._id};
    //var parsedBody = JSON.parse(body);
    //console.log(body.qDescription);
    var update = req.body;
    console.log( JSON.stringify(req.body));
    
    Quiz.update(condition,update,
    function(err, numberAffected,rawResponse){
        if(!err){
        console.log("CHANGING THIS");
        }
        
        else
        console.log("Error: "+err);
    });
};


exports.list = function(req,res) {

    var query = Quiz.find();
    query.sort({ owner: 'desc' })
    .exec(function(err, results){
        if (!req.user) {
            var user = {local: {username:"empty", email:"empty"}}
             res.render('showlist.ejs', {user: req.user, list:results, user:user});
        } else {
            res.render('showlist.ejs', {user: req.user, list:results, user:req.user});
        }
        console.log("Error: " + err);
    });
};


//This one is to show only owner quizes

exports.MyList = function(req,res) {
     var user = req.user.local.email;
    var query = Quiz.find({"owner":user});
    query.sort({ owner: 'desc' })
    .exec(function(err, results){
        if (!req.user) {
            var user = {local: {username:"empty", email:"empty"}}
             res.render('showMyList.ejs', {user: req.user, list:results, user:user});
        } else {
            res.render('showMyList.ejs', {user: req.user, list:results, user:req.user});
        }
        console.log("Error: " + err);
    });
};



exports.removeq  = function(req,res) {
    var condition = {_id: req.query.id};
    Quiz.remove(condition, function(err) {
        console.log("Error: " + err);
    });
};

exports.editqz = function(req,res) {
    var id = req.query.id;
    var query = Quiz.findOne();
    query.sort({ owner: 'desc' }).where({_id: id})
    .exec(function(err,results){
        res.render('edit_qz_settings.ejs', {user: req.user, settings: results});
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
        timeLimit: body.timeLimit,
        timeLimitVal: body.timeLimitVal
    };
    console.log(update);
    console.log(body);
    Quiz.update(condition, update, function(err, numberAffected, rawResponce) {
        console.log("Error: " + err);
        console.log("numberAffected: " + numberAffected);
        console.log("rawResponce: " + rawResponce);
    });
    //redirect to homepage
};

exports.updateqzIcon = function(id,update) {
    var condition = { _id: id};
    // var update = {
    //     qName: body.qName,
    //     qDescription: body.qDescription,
    //     qNumber: body.qNumber,
    //     shuffleQuestion: body.shuffleQuestion,
    //     shuffleAnswers: body.shuffleAnswers,
    //     timeLimit: body.timeLimit,
    //     timeLimitVal: body.timeLimitVal
    // };
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
        res.render('questions.ejs', {api_list: require('../from_jservice_API/best_topic_ids.json'),user: req.user, settings: results});
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

exports.editQuestion = function(body) {
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
            console.log("found " + quiz.questions.length + "number of questions, and searching for question ID " + body.qid)
            
            for (var i=0 ; i< quiz.questions.length ; i++){
                if (quiz.questions[i]._id == body.qid) {
                    quiz.questions[i].questionText = body.questionText
                    quiz.questions[i].answers = []
                    quiz.questions[i].qType = body.type
                    quiz.questions[i].anwsNum = answNum
                    for (var x=0; x < answNum;x++){
                        quiz.questions[i].answers.push({answer: body["answer" + x],correct: body["correct" + x]});
                    }
                }
            }
      
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

exports.start = function(req,res) {
    var id = req.query.id;
    var query = Quiz.findOne();
    query.where({_id: id})
    .exec(function(err,results){
        res.render('test.ejs', {user: req.user, settings: results});
        console.log("Error: " + err);
    });
};

exports.sendResults = function(body, res) {

    var qID = body.qID;
    var user = body.user;
    var correct = body.correct;
    var wrong = body.wrong;

    User.findById(user, function(err, user){
        if (err) {
            console.log(err);
        } else {
            user.local.results.push({
                qID : qID,
                correct: correct,
                wrong: wrong,
                timeStamp: Date.now()
            });

            user.save();
        }
    } );
    res.end();
};