var MongoClient = require('mongodb').MongoClient;

module.exports = function(){
    console.log('Running');
    
// Retrieve


// Connect to the db
MongoClient.connect("mongodb://user:user@ds041924.mongolab.com:41924/testbase", function(err, db) {
  if(!err) {
    console.log("We are connected");
        // Get the documents collection
    var collection = db.collection('Quizez');

var cursor = collection.find({topic: 'Topic1'});
    //Limit to max 10 records
    cursor.limit(10);

    //Skip specified records. 0 for skipping 0 records.
    cursor.skip(0);

    //Lets iterate on the result
    cursor.each(function (err, doc) {
      if (err) {
        console.log(err);
      } else {
          if(doc === null){
              return;
          };
        console.log('Fetched:', doc);
        
      }
    });
  }
});
};