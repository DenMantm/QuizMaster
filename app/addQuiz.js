var MongoClient = require('mongodb').MongoClient;


//object passed in to the method is saved to the database
module.exports = function(object){
    console.log('Running');
    
// Retrieve


// Connect to the db
MongoClient.connect("mongodb://user:user@ds041924.mongolab.com:41924/testbase", function(err, db) {
  if(!err) {
    console.log("We are connected");
        // Get the documents collection
    var collection = db.collection('Quizez');

 //Create some users
    var quiz = {name: 'Quiz1',
                topic: 'Topic1',
                views: 0,
                questions: 5,
                Status: 'Public',
                type: 'Quiz',
                topic: 'Topic1',
                owner: 'Username',
                source: 'User',
                questions: [
    {question:'1Question Text goes here',answer1:'answer1',answer2:'answer2',answer3:'answer4',rightAnswer:'answer1'},
    {question:'2Question Text goes here',answer1:'answer1',answer2:'answer2',answer3:'answer4',rightAnswer:'answer1'},
    {question:'3Question Text goes here',answer1:'answer1',answer2:'answer2',answer3:'answer4',rightAnswer:'answer1'}
                            ]};


   // Insert some users
    collection.insert(quiz, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log('Inserted %d documents into the "quiz" collection. The documents inserted with "_id" are:', result.length, result);
      }
      //Close connection
      db.close();
    });
  }
});
};