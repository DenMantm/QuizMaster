var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//pre-define sub-documents
var subQuestions = {
    questionText: String,
    topic: {type:String, default:'Non specific'},
    qType: String,
    anwsNum: Number,
        answers: [subAnswers]
    };

var subAnswers = {
    answer: String,
    correct: Boolean
};

//define main document schema
var quizSchema = new Schema({
    picture: {type:String, default:'img/quizIcons/default.png'},
    createdOn: {type: Date, default: Date.now},
    category: String,
    qName: String,   
    qDescription: String,
    qNumber: String,
    shuffleQuestion: Boolean,
    shuffleAnswers: Boolean,
    timeLimit: Boolean,
    timeLimitVal: Number,
    owner: String,
    questions: [subQuestions]
});

//exports the model making it available in other files
module.exports = mongoose.model('Quiz', quizSchema);
