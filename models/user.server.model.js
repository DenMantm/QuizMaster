// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    local            : {
        email        : String,
        password     : String,
        name:       {firstName:{type:String, default:'John'},
        surname:    {type:String, default:'Doe'}},
        pictureUrl: {type:String, default:'./upload/userPics/default.jpg'},
        username: String, //as default populated wit e-mail in passport.js when new user is created
        age:{type:Number, default:99},
        createdOn: {type: Date, default: Date.now},
        key:String,
        validEmail: {type:Boolean, default:false},
        myQuizzes: [{quizID: String}]
    }
});
// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
