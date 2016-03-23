var Quiz = require('../models/quiz.server.model.js');


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
        console.log(results);
        console.log("Error: " + err);
    });
    
exports.addQuestion = function(req) {
    var id = req.body.id;
    var body =  req.body;
    console.log(JSON.stringify(body));
    console.log("id: " + id);
    Quiz.findById(id, function(err, quiz){
        if (err) {
            console.log(err);
        } else {
            console.log("before: " + req);
            delete req.body.id;
            console.log("after: " + req);
            
            var objectx = {"questionText":"qweweq","answers":[{"answer":"213","correct":true},{"answer":"qwe213","correct":true},{"answer":"123123","correct":true}],"id":"56d87e3d746792d80357f4f7"}
            
            
            
            quiz.questions.push(JSON.parse(req.body));
    
            var qNumber = quiz.questions.length;
            console.log("number of questions:" +qNumber);
            
        //     body.answers.forEach(function(element, index, array){
			     //   //var newQuiz = element.toJSON();
        //         quiz.questions[qNumber - 1].answers = "test" + index;
        //     })
        //     console.log(quiz);
            quiz.save();
        }
    } );

    //   var body =  req.body;
    // delete body.id;
    

    
    // var condition = { _id: id };
    // var update = {$push: {
    //     questions: body}
    // };
    // console.log(update);
    // Quiz.update(condition, update, function(err, numberAffected, rawResponce) {
    //     console.log("Error: " + err);
    //     console.log("numberAffected: " + numberAffected);
    //     console.log("rawResponce: " + JSON.stringify(rawResponce));
    // });
};

};