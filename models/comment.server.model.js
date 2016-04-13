    var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//pre-define sub-documents
var subComments = {
    comment:String,
    user:String
    };

//define main document schema
var commentSchema = new Schema({
    quizId: String,
    comments: [subComments]
});

//exports the model making it available in other files
module.exports = mongoose.model('Comments', commentSchema);