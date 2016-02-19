var should = require('should'),
request = require('supertest'),
app = require('../server.js'),
mongoose = require('mongoose'),
quiz = mongoose.model('Quiz'),
agent = request.agent(app);



describe('Quiz Crud Test', function(){
    it('Should allow a quiz to be posted and return an _id', function(done){
        var quizPOST =   {
            qName: "Integration test",
            qDescription: "decription of int test",
            qNumber: "123",
            shuffleQuestion: true,
            shuffleAnswers: false,
            design: "pink",
            owner : "Kamil",
            questions: []
          };

          agent.post('/api/quiz')
            .send(quizPOST)
            .expect(200)
            .end(function(err, result){
                result.body.should.have.property('_id');
                done();
            });
    });

    afterEach(function(done){
   //     quiz.remove().exec();
        done();
        
    });
})