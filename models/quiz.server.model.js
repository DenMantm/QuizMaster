var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//pre-define sub-documents
var subQuestions = {
    questionText: String,
        picture: String,
        answers: [subAnswers]
    };

var subAnswers = {
    answer: String,
    correct: Boolean
};

//define main document schema
var quizSchema = new Schema({
    qName: String,   
    qDescription: String,
    qNumber: String,
    shuffleQuestion: Boolean,
    shuffleAnswers: Boolean,
    design: String,
    owner: String,
    questions: [subQuestions]
});


//exports the model making it available in other files
module.exports = mongoose.model('Quiz', quizSchema);
