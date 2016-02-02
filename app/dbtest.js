var MongoClient = require('mongodb').MongoClient;

module.exports = function(){
    console.log('Running');
    
// Retrieve


// Connect to the db
MongoClient.connect("mongodb://user:user@ds041924.mongolab.com:41924/testbase", function(err, db) {
  if(!err) {
    console.log("We are connected");
        // Get the documents collection
    var collection = db.collection('users');

 //Create some users
    var user1 = {name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']};
    var user2 = {name: 'modulus user', age: 22, roles: ['user']};
    var user3 = {name: 'modulus super admin', age: 92, roles: ['super-admin', 'admin', 'moderator', 'user']};

   // Insert some users
    collection.insert([user1, user2, user3], function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
      }
      //Close connection
      
    });

var cursor = collection.find({name: 'modulus user'});

    //We need to sort by age descending
    cursor.sort({age: -1});

    //Limit to max 10 records
    cursor.limit(10);

    //Skip specified records. 0 for skipping 0 records.
    cursor.skip(0);

    //Lets iterate on the result
    cursor.each(function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        console.log('Fetched:', doc);
      }
    });



  }
});
    
    
};