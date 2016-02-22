var should = require("should"),
    sinon = require("sinon");
    
describe('Quizz Controller Test', function(){
    describe('POST' , function(){
        it('should not allow empty quiz name on post', function(){
            var quiz = function(quiz){this.save = function(){}};
            var req = {
                body: {
                    qDescription: "testing lack of name"
                }
            }
            
            var res = {
                status: sinon.spy(),
                send: sinon.spy()
            }
            var quizController = require("../controllers/quizController")(quiz);
            quizController.post(req,res);
            res.status.calledWith(400).should.equal(true, 'Bad status: ' + res.status.args[0][0])
            res.send.calledWith('Name is required').should.equal(true);
        })
    })
})