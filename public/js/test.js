  $(document).ready(function() {
    var question = new Object();
    var count = 0;
    var correct = 0;
    var wrong = 0;
    var start = new Date().getTime();
    var t;
    var timeinterval;

    var qNum = '';
    var getUrlParameter = function(sParam) {
      var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

      for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined ? true : sParameterName[1];
        }
      }
    };
    var id = getUrlParameter("id");
    var url = '/api/quiz/' + id;


    $.getJSON(url, function(data) {
      
    function getTimeRemaining(endtime) {
      t = Date.parse(endtime) - Date.parse(new Date());
      var seconds = Math.floor((t / 1000) % 60);
      var minutes = Math.floor((t / 1000 / 60));
      return {
        'total': t,
        'minutes': minutes,
        'seconds': seconds
      };
    }

    function initializeClock(id, endtime) {

      var clock = document.getElementById(id);

      var minutesSpan = clock.querySelector('.minutes');
      var secondsSpan = clock.querySelector('.seconds');

      function updateClock() {
        t = getTimeRemaining(endtime);
        minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
        secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

        if (t.total <= 0) {
          clearInterval(timeinterval);
          count++;
          updateWrong();
          display_ct();
          nextQuestion(count)
        }
      }

      updateClock();
      timeinterval = setInterval(updateClock, 1000);
    }

      var $questions = data.questions;
      //number of questions provided in the quiz
      qNum = $questions.length;
      //Number of questions specified by user
      var questionsNum = data.qNumber;
      var maxQuestion
      if (questionsNum == 'all' || questionsNum >= questionsNum) {
        maxQuestion = qNum;
      } else {
        maxQuestion = questionsNum;
      }

      //########## create an array of random numbers for questions ###########    
      var arr = [];
      if (data.shuffleQuestion) {

        while (arr.length < qNum) {
          var randomnumber = Math.ceil(Math.random() * qNum);
          var found = false;
          for (var i = 0; i < arr.length; i++) {
            if (arr[i] == randomnumber) {
              found = true;
              break;
            }
          }
          if (!found) arr[arr.length] = randomnumber;
        }
        //######### if shuffleQuestion is false just create array of sorted numbers ##############
      }
      else {
        while (arr.length < maxQuestion) {
          arr[arr.length] = arr.length + 1
        }
      }


      var list = '';

      //########## GENERATE NEXT QUESTION #############

      function nextQuestion(i) {
        if (data.timeLimit) {
          clearInterval(timeinterval);
          var deadline = new Date(Date.parse(new Date()) + data.timeLimitVal * 1000);
        initializeClock('clockdiv', deadline);
          
        }
        var newElement = document.createElement('div');

        //pull the question number from random number array
        var qNumber = arr[i] - 1;
        question.text = $questions[qNumber].questionText;
        question.answer = [];
        question.st = [];

        var $answers = $questions[qNumber].answers;
        var x = 0;
        $.each($answers, function(index, item) {

          question.answer[x] = item.answer;
          console.log("found question" + item.answer)
          question.st[x] = item.correct;
          if (question.st[x] === "true") {
            question.correct = x;
          }
          x++;
        });


        list = '<div class="row" id="qBox"><p class="col-sm-12">Question ' + (i + 1) + ': ' + question.text +
          '</p><form class="form" id="question' + i + '" action=""><table>';

        var aNum = question.answer.length;


        //########## create an array of random numbers for answers ###########    
        var arrA = [];

        if (data.shuffleAnswers) {
          while (arrA.length < aNum) {
            var randomnumber = Math.ceil(Math.random() * aNum);
            var found = false;
            for (var j = 0; j < arrA.length; j++) {
              if (arrA[j] == randomnumber) {
                found = true;
                break;
              }
            }
            if (!found) arrA[arrA.length] = randomnumber;
          }
        }
        else {
          //######### if shuffleQuestion is false just create array of sorted numbers ##############
          while (arrA.length < aNum) {
            arrA[arrA.length] = arrA.length + 1
          }
        }

        for (var z = 0; z < arrA.length; z++) {
          var w = arrA[z] - 1;


          list = list + '<tr><td class="cratio col-sm-1" id="answer' + w +
            '"><input type="radio" class="canswer" name="answer" value="' + w + '" id="radio' + i +
            w + '"></td><td class="col-sm-11"><label   for="radio' + i + w + '">' + question.answer[w] + '</label></td>';
        }
        list = list + '</form></div>';
        newElement.innerHTML = list;

        document.getElementById("main-mid").appendChild(newElement);

        if (count == maxQuestion - 1) {
          document.getElementById("main-bot").innerHTML = '<button type="button" id="fbtn" class="btn btn-default btn-sm btn-block" data-toggle="modal">Finish</button>';
           $("#fbtn").click(function() {
             clearInterval(timeinterval);
             //getting name of div with latest question
            var current = "#question" + count;
            //serialize form will generate string "answer=x" where x is a number of selected answer
            var answer = $(current).serialize();
            //check if any answer has been selected before progressing
            if (answer.length === 0) {
              alert("Select your answer.");
            }
            else {
              
              //check the number of answer selected using regular expression
              var matches = answer.match(/answer=(\d+)/);
              //check the first found
              var answNum = Number(matches[1]);
              validate(answNum, question.correct);
  
            
              $("html, body").animate({
                scrollTop: $(document).height()
              }, "slow");
              display_ct();
              sendResults();
            }
           })
        }
      }

      nextQuestion(count);
      ferfreshButton();

      function display_ct() {

        var now = new Date().getTime();
        var time = now - start;
        var average = Math.floor((time / count) / 1000);

        document.getElementById('time').innerHTML = average;

      }

      function updateCorrect() {
        correct++;
        document.getElementById("acorrect").innerHTML = correct;
        updateRate();
      }

      function updateWrong() {
        wrong++;
        document.getElementById("awrong").innerHTML = wrong;
        updateRate();
      }

      function updateRate() {
        var rate = Math.round((correct / count) * 100);
        document.getElementById("srate").innerHTML = rate + "%";
      }

      function validate(answNum, right){
        var currentAnsw = "#question" + count + " #answer" + answNum;
        //check if the selected answer is the same as correct answer
            if (answNum === right) {
              //mark selected answer acordingly to the correct attribute (true or false) - true in this case, this will generate the green tick
              $(currentAnsw).addClass(question.st[answNum]);
              // update correct answers count
              updateCorrect();
            }
            else {
              // update incorrect answers count
              updateWrong();
              //mark selected answer acordingly to the correct attribute (true or false) - false in this case, this will generate red cross
              $(currentAnsw).addClass(question.st[answNum]);
              var rightAnsw = "#question" + count + " #answer" + question.correct;
              //add true class to the correct answer which will generate green tick
              $(rightAnsw).addClass("true");
            }
            $(currentAnsw).addClass(question.st[answNum]);
      }
      
      function ferfreshButton() {
        $("#qbtn").click(function() {
          //getting name of div with latest question
          var current = "#question" + count;
          //serialize form will generate string "answer=x" where x is a number of selected answer
          var answer = $(current).serialize();
          //check if any answer has been selected before progressing
          if (answer.length === 0) {
            alert("Select your answer.");
          }
          else {
            
            //check the number of answer selected using regular expression
            var matches = answer.match(/answer=(\d+)/);
            //check the first found
            var answNum = Number(matches[1]);
            validate(answNum, question.correct);
          
            $("html, body").animate({
              scrollTop: $(document).height()
            }, "slow");
            display_ct();
            count = count + 1;

            nextQuestion(count);
          }
        });
      }
      
      function sendResults() {
        var results = new Object();
        results.qID = id;
        results.correct = correct;
        results.wrong = wrong;
        results.user = $("#result").attr("name");
        
         $.ajax({
          type: "POST",
          url: "/sendResults",
          data: results,
          cache: false,
          success: function() {
            window.location = "/showquiz";
          },
          error: function() {
            alert("No data found.");
          }
        });
      }
    })
  });