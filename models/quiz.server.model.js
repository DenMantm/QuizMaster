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
    qNumber: Number,
    shuffleQuestion: Boolean,
    shuffleAnswers: Boolean,
    design: String,
    questions: [subQuestions]
});

var userSchema = new Schema({
    name: {firstName: String, surname: String},
    pictureUrl: String,
    username: String,
    age: Number,
    myQuizzes: [{quizID: String}]
});

//exports the model making it available in other files
module.exports = mongoose.model('Quiz', quizSchema);

// var quiz1 = new Quiz({
//     name: "FIA test",
//     dscription: "Financial information associate test",
//     qNumber: 30,
//     shuffleQuestion: true,
//     shuffleAnswers: false,
//     design: "simple",
//     questions: questions1
    
// });

// var questions1 = [
//     {questionText: "Question 1 text goes here",
//         answers: [
//             {answer: "this is first wrong answer",
//              correct: false},
//              {answer: "this is second wrong answer",
//              correct: false},
//              {answer: "this is first correct answer",
//              correct: true},
//              {answer: "this is third wrong answer",
//              correct: false},
//             ]},
//     {questionText: "Question 2 text goes here",
//         answers: [
//             {answer: "this is first wrong answer",
//              correct: false},
//              {answer: "this is second wrong answer",
//              correct: false},
//              {answer: "this is first correct answer",
//              correct: true},
//              {answer: "this is third wrong answer",
//              correct: false},
//             ]}
//     ];
    
    
// quiz1.save();
