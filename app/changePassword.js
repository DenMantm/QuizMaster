  var bcrypt   = require('bcrypt-nodejs');
  var UserCtrl = require("../controllers/user.server.controller.js");

module.exports = function(new_password,doc){
             var hash =  bcrypt.hashSync(new_password, bcrypt.genSaltSync(8), null);
             var update = {'local.password':hash};
            UserCtrl.updateOneElement(doc,update);
};