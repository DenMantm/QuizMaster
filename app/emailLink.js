
//REF: https://github.com/eleith/emailjs
exports.verifyEmail = function(req,userEmail){
   
    //generating simple verification link and saving it to database
    //REF: http://stackoverflow.com/questions/5398737/how-can-i-make-a-simple-wep-key-generator-in-javascript
   function generateHexString(length) {
  var ret = "";
  while (ret.length < length) {
    ret += Math.random().toString(16).substring(2);
  }
  return ret.substring(0,length);
}

        var key = generateHexString(58);
        console.log (key);
var link = "http://"+req.get('host')+"/verifyEmail/"+key;

    //e-mailing part
var email   = require("emailjs");
var server  = email.server.connect({
   user:    "quizmastermail@gmail.com", 
   password:"quizmaster123", 
   host:    "smtp.gmail.com", 
   ssl:     true
});

// send the message and get a callback with an error or details of the message that was sent
var message = {
   text:    "Verification link",
   from:    "QuizMaster <username@your-email.com>", 
   to:      'denmantm@inbox.lv',
   cc:      "",
   subject: "Quizmaster Verification e-mail",
   attachment: 
   [
      {data:"<html> <h3>This is your verification link:</h3></hr></br><a href="+link+">Press Here</a></html>", alternative:true},
      //{path:"path/to/file.zip", type:"application/zip", name:"renamed.zip"}
   ]
};
    message.to = 'NewUser<'+userEmail+'>';
    console.log(message.to);
    server.send(message, function(err, message) {
        if(err)
        console.log(err);
        
        else 
        console.log('email sent');
    });
    return key;
};
//Password recovery to be placed here::