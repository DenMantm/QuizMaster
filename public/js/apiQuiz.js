    // var  workspace = document.getElementById('api_quiz_sub_window_avalableTopics_list')
               //global variable
               var userQuestions = [];
               var tempArray =[];
               var topicx = '';
               //array of owned quizes from database
               var myQuizes;
               //quiz which user picks to edit
               var selQuiz;
            //   GLOBAL FUNCTIONS
            
            
            
            //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ REMOVE QUESTIONS FROM THE LIST @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            
            
                                function removeQuestionFromList(idx){
                                    var id = "added_"+idx;
                                    console.log(id);
                                    
                                    for(var i =0;i<userQuestions.length;i++){
                                        console.log(i);
                                        if("added_"+userQuestions[i].id==id){
                                            //remove here
                                            userQuestions.splice(i, 1);
                                            
                                            console.log('removing element no: '+i);
                                        $("#"+id).addClass('animated zoomOut').one('webkitAnimationEnd oAnimationEnd', function() {
                                         $(this).remove();
                                     })
                                     
                                     $("#question_"+idx).removeClass().addClass('list-group-item animated zoomIn');
                                            //Some magic here, returning back question if topic is the same
                                        };
                                    }
                                }
                                
                                
                                
            //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ADD QUESTIONS TO USER LIST @@@@@@@@@@@@@@@@@@@@@@@
            
            
            
            
                                function addQuestionToList(index){
                                    //data.topic = topic.topic;
                                  //informing that question is already there
                                    var data = tempArray[index-1];
                                    data.tempTopic = topicx;
                                    data.answerCount = 1;
                                    data.answer = [data.answer];
                                    
                                    for(var i = 0; i<userQuestions.length;i++){
                                        if(userQuestions[i].id === data.id){
                                            alert('Question already added');
                                            return;
                                        }
                                    }
                                    userQuestions.push(data);
                                     $("#question_"+data.id).addClass('makeUsed');

                                    //adding line to inform that question is takken
                        var tmp = $('<a/>', {
                            class:"list-group-item animated zoomIn",
                            id:"added_"+data.id,
                            style:"",
                        }).appendTo('#api_quiz_sub_window_attachedQuestions');
                        
                        //description
                         $('<h4/>', {
                            class:'list-group-item-heading',
                            style:"",
                            text:"Question_id:" + data.id +", Dificulty: " + data.value + ", Topic: "+data.tempTopic
                        }).appendTo(tmp);
                        
                        //Question itself
                        $('<h4/>', {
                            class:'list-group-item-heading',
                            id:'question_h_'+data.id,
                            style:"",
                            text: "Question: "+data.question
                        }).appendTo(tmp);
                        
                        //answer + functs
                         $('<p/>', {
                            style:"",
                            class:'list-group-item-text',
                            text: "Answer: "+data.answer
                        }).appendTo(tmp);
                        
                        
                        $('<a/>', {
                            id: 'add_button_'+data.id,
                            href: 'javascript:removeQuestionFromList('+data.id+')',
                            style:"margin-left:10px;color:red;",
                            text: 'Remove'
                        }).appendTo(tmp);
                        
                        $('<a/>', {
                            id: 'edit_button_'+data.id,
                            href: 'javascript:editQuestionInList('+data.id+')',
                            style:"margin-left:10px;color:blue;",
                            text: 'Edit'
                        }).appendTo(tmp);
                        
                                }
                                
                                //Some activity here:::
                                
                                
                                                function addMyQuestionToList(index){
                                 data = userQuestions[index];

                                    //adding line to inform that question is takken
                        var tmp = $('<a/>', {
                            class:"list-group-item animated zoomIn",
                            id:"added_"+data.id,
                            style:"",
                        }).appendTo('#api_quiz_sub_window_attachedQuestions');
                        
                        //description
                         $('<h4/>', {
                            class:'list-group-item-heading',
                            style:"",
                            text:"Question_id:" + data.id +", Dificulty: " + data.value + ", Topic: "+data.tempTopic
                        }).appendTo(tmp);
                        
                        //Question itself
                        $('<h4/>', {
                            class:'list-group-item-heading',
                            id:'question_h_'+data.id,
                            style:"",
                            text: "Question: "+data.question
                        }).appendTo(tmp);
                        
                        //answer + functs
                         $('<p/>', {
                            style:"",
                            class:'list-group-item-text',
                            text: "Answer: "+data.answer
                        }).appendTo(tmp);
                        
                        
                        $('<a/>', {
                            id: 'add_button_'+data.id,
                            href: 'javascript:removeQuestionFromList('+data.id+')',
                            style:"margin-left:10px;color:red;",
                            text: 'Remove'
                        }).appendTo(tmp);
                        
                        $('<a/>', {
                            id: 'edit_button_'+data.id,
                            href: 'javascript:editQuestionInList('+data.id+')',
                            style:"margin-left:10px;color:blue;",
                            text: 'Edit'
                        }).appendTo(tmp);
                        
                                }                
                                
                                
                //@@@@@@@@@@@@@@@@@@@@@ HIDE EDITABLE DETAILS @@@@@@@@@@@@@@@@@@@@@@@@@
                
                
                
                
                function hideEditQuestionInList(id){
                    
                      for(var i = 0; i<userQuestions.length;i++){
                              if(userQuestions[i].id === id){
                                 
                                 for(var g = userQuestions[i].answer.length; g>0; g--){
                                     console.log(g);
                                     if(userQuestions[i].answer[g] == null){
                                         console.log(g+ " is null");
                                    userQuestions[i].answer.splice(g, 1);
                                         
                                     }
                                 }
                                       console.log(userQuestions[i].answer.length)
                                       
                                        }
                                    }

               var button_edit = document.getElementById('edit_button_'+id);
               button_edit.innerHTML = "Edit";
               button_edit.href = 'javascript:editQuestionInList('+id+')';
               
               //converting some things back to normal
               
               $("#edit_"+id).remove();
               
                }
                
                
                                
              //@@@@@@@@@@@@@@@@@@@@@@@@ EDIT QUESTION IN THE LIST @@@@@@@@@@@@@@@@@@@@
              
              
              
	                       //     function editQuestionInList(data){
	                       // // var instance = new editQuestionInListx(data);
                        //     //return instance;
	                       //     }
                               function editQuestionInList(data){
                                   var tmpQuestion;
                           for(var i = 0; i<userQuestions.length;i++){
                                 
                              if(userQuestions[i].id === data){
                                  tmpQuestion = userQuestions[i];
                                  
                                        }
                                    }

                                   //getting all necesarry
               //changing button and href in the button                    
               var button_edit = document.getElementById('edit_button_'+data);
               button_edit.innerHTML = "Hide Edit";
               button_edit.href = 'javascript:hideEditQuestionInList('+data+')'
                           // href: 'javascript:editQuestionInList('+data.id+')',
                                  //id to attach to it::
                                  //added_"+data
                            //finding question field:    
                            var question = document.getElementById('question_h_'+data);
                                  console.log(data);
                        var tmp = $('<div/>', {
                            //class:"list-group-item",
                            class:"form-group has-warning has-feedback",
                            id:"edit_"+data
                            //style:"border:1px solid black",
                            
                        }).appendTo('#added_'+data);
                            $('<h3/>', {
                            class:'',
                            style:"",
                            text:'Edit Question:'
                        }).appendTo(tmp);

                        //TOPIC
                        
                           $('<label/>', {
                            class:'control-label',
                            for:"input_topic"+data,
                            style:"",
                            text:'Topic: '
 
                        }).appendTo(tmp);
                        
                           var tmp1 = $('<input/>', {
                            class:'form-control',
                            id:"input_topic"+data,
                            style:"width:200px;",
                            value: tmpQuestion.tempTopic
                        }).appendTo(tmp);
                                 
                                  
                          $('<span/>', {
                            class:'glyphicon glyphicon-warning-sign form-control-feedback',
                            style:""
                        }).appendTo(tmp1);
                        
                        //QUESTION:::
                        
                           $('<label/>', {
                            class:'control-label',
                            for:"input_question"+data,
                            style:"",
                            text:'Question: '
 
                        }).appendTo(tmp);
                        
                           var tmp2 = $('<input/>', {
                            class:'form-control',
                            id:"input_question"+data,
                            style:"",
                            value: tmpQuestion.question
                        }).appendTo(tmp);
                                 
                                  
                          $('<span/>', {
                            class:'glyphicon glyphicon-warning-sign form-control-feedback',
                            style:""
                        }).appendTo(tmp2);



                        //ANSWERS HERE::
                        $('<h3/>', {
                            class:'',
                            style:"",
                            text:'Answers:(first answer always right one)'
                        }).appendTo(tmp);
                             
                               
                        $('<div/>', {
                            class:'',
                            id:"question_answer_"+data,
                            style:""
 
                        }).appendTo(tmp);
                               
                        $('<a/>', {
                            id: 'add_button_'+data,
                            href: 'javascript:addAnswer('+data+',false)',
                            style:"margin-left:10px;",
                            text: 'Add Answer'
                        }).appendTo(tmp);
                        
                        
                        
                        //SAVE BUTTON
                        
                        
                        //<input id='profile_change_details' type="button" class="btn btn-primary" value="Save Changes">
                         $('<a/>', {
                            href: 'javascript:saveQuestionChanges('+data+')',
                            class:"btn btn-primary",
                            type:'button',
                            style:"margin-left:10px;float:right';",
                            text:"Save Changes"
                        }).appendTo(tmp);
                        

                        addAnswer(data,true);
                               }     

           
                //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ REMOVE ANSWERE HERE @@@@@@@@@@@@@@@@@@@@@@@@@@@@@

                function removeAnswer(remObj,id,qcounter){
                    
                            for(var i = 0; i<userQuestions.length;i++){
                                 
                              if(userQuestions[i].id === id){
                                  
                                  //userQuestions[i].answerCount--;
                                  userQuestions[i].answer[qcounter-1] = null;
                                  
                                        }
                                    }
                    $(remObj).hide();  
                    $(remObj).val("");
                }
                
                
                //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ADD ANSWERE HERE @@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                
                

                function addAnswer(data,condition){
                    
                    //object 
                  var qobject;
                  
                  //thbis just takes answer count from the object
                  var counter;
                  
                             for(var i = 0; i<userQuestions.length;i++){
                                 
                              if(userQuestions[i].id === data){
                                  
                                  qobject = userQuestions[i];
                                  
                                  //sets marker on current question
                                  counter = qobject.answerCount;
                                        }
                                    }
      
                        if(condition){
                            for(var i = 0;i<qobject.answerCount;i++){
                                generateA(qobject,i+1);
                            }
                        }
                        else{
                            qobject.answerCount++;
                            qobject.answer.push("");
                            counter = qobject.answerCount;
                           generateA(qobject,counter);
                           
                        }//finishing else
                        
                        
                         function generateA(qobject,counter){

                        var tmp = $('<div/>', {
                            class:'',
                            id:"answer_"+counter+"_"+qobject.id,
                            style:""
                        }).appendTo("#question_answer_"+qobject.id);
                        
                        
                        $('<label/>', {
                            class:'control-label',
                            for:"answer_topic"+qobject.id+"_"+counter,
                            style:"",
                            text: "Answer "+counter+":"
 
                        }).appendTo(tmp);
                        
                           var tmp1 = $('<input/>', {
                            class:'form-control',
                            id:"answer_topic"+qobject.id+"_"+counter,
                            style:"width:200px;",
                            value: qobject.answer[counter-1]
                        }).appendTo(tmp);
                                 
                                  
                          $('<span/>', {
                            class:'glyphicon glyphicon-warning-sign form-control-feedback',
                            style:""
                        }).appendTo(tmp1);
                        
                        if(counter>1){
                        $('<a/>', {
                            id: 'delete_button_'+data,
                            href: 'javascript:removeAnswer(answer_'+counter+'_'+qobject.id+','+qobject.id+','+counter+')',
                            style:"margin-left:10px;color:red",
                            text: 'Remove Answer'
                        }).appendTo(tmp);
                        }
                        
                        
                        }//finishinng generate q
                        
                    
                }
                
                //@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Save Question changes button @@@@@@@@@@@@@@@@@@@@@@@@
                
                            function saveQuestionChanges(data){
                                
                                var tmpTopic = document.getElementById('input_topic'+data).value;
                                var tmpQuestion = document.getElementById('input_question'+data).value
                                
                                if(tmpQuestion==""||tmpTopic==""){
                                    alert('Please dont Leave Question and Topic Fields blank');
                                    return;
                                }
                                document.getElementById("question_h_"+data).innerHTML = "Question: " + tmpQuestion;
 
                                //function to reset all nulls to zeros::
                       // console.log('running');
                    for(var i = 0; i<userQuestions.length;i++){
                              if(userQuestions[i].id === data){
                                 for(var g = 0; g<userQuestions[i].answer.length; g++){
                                     
                                     //var answ = $("#answer_topic"+data+"_"+(g+1)).val();
                                     var htmansw = document.getElementById("answer_topic"+data+"_"+(g+1)).value;
                                   userQuestions[i].answer[g] = htmansw;
                                 }
                                       console.log(userQuestions[i].answer)
                                        }
                              }
                                //cleaning empty question answers
                                
                            for(var i = 0; i<userQuestions.length;i++){
                              
                              if(userQuestions[i].id === data){
                                  userQuestions[i].question = tmpQuestion;
                                  userQuestions[i].tempTopic = tmpTopic;
                                 for(var g = userQuestions[i].answer.length; g>0; g--){
                                     console.log(g);
                                     if(userQuestions[i].answer[g] == null||userQuestions[i].answer[g] == ""){

                                    userQuestions[i].answer.splice(g, 1);
                                    userQuestions[i].answerCount = userQuestions[i].answer.length;
                                         
                                     }
                                 }
                                       console.log(userQuestions[i].answer.length)
                                       
                                        }
                              }
                                
                                //Generating fresh question list
                                
                                document.getElementById("question_answer_"+data).innerHTML = "";
                         // $("#question_answer_"+data).innerHTML = "";
                          
                          addAnswer(data,true);
                

                                
                                
                            }
            
                                
              //@@@@@@@@@@@@@@@@@@@@@@@ DISPLAY QUESTIONS WHEN PRESSING TOPIC @@@@@@@@@@@@@@@@@

                                function displayQuestions(id,topic){
                                        //setting global variable topic
                                        topicx = topic.topic;
                                                      $.ajax({
                              type: "GET",
                              dataType: 'json',
                              url: "https://jservice.io/api/category?id="+id,
                              success: function(data) {
                                    //change topic of the HEad
                                    tempArray =[];
                                        document.getElementById("api_quiz_topics_title").innerHTML = 'Questions for topic: <b>'+topic.topic+"</b>";
                                        document.getElementById("api_quiz_sub_window_avalableQuestion_list").innerHTML = "";
                                        //add question code here
                                 // data = JSON.parse(data);
                                    for(var i = 0;i<data.clues_count;i++){

                                        tempArray.push(data.clues[i]);
                                        addQuestionElement(data.clues[i],i+1);
                                        
                                      
                              }
                              },
                              complete:function(){
                                        //after compreting load do something
                                    }
                              })//end ajax
                    }//end function
                        //generating question here
                        
                        
                         
               // @@@@@@@@@@@@@@@@@@@@@@@@@@ ADD QUESTION ELEMENT TO BIG TOPIC LIST @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                        
                        
                        
                        function addQuestionElement(data,index,fromWhere){
                           
                         if(fromWhere){   
                        var tmp = $('<a/>', {
                            class:"list-group-item animated zoomIn",
                            id:"question_"+data.id,
                            style:"",
                        }).prependTo('#api_quiz_sub_window_avalableQuestion_list');
                         }
                         else{
                        var tmp = $('<a/>', {
                            class:"list-group-item animated zoomIn",
                            id:"question_"+data.id,
                            style:"",
                        }).appendTo('#api_quiz_sub_window_avalableQuestion_list');
                         }
                        
                        //description
                         $('<h4/>', {
                            class:'list-group-item-heading',
                            style:"",
                            text: "Question_id:" + data.id + ", Dificulty: " + data.value
                        }).appendTo(tmp);
                        
                        
                        
                        //Question itself
                        $('<h4/>', {
                            class:'list-group-item-heading',
                            style:"",
                            text: "Question: "+data.question
                        }).appendTo(tmp);
                        
                        
                        
                        //answer
                         $('<p/>', {
                            style:"",
                            class:'list-group-item-text',
                            text: "Answer: "+data.answer
                        }).appendTo(tmp);



                            $('<a/>', {
                            id: 'add_button_'+data.id,
                            href: 'javascript:addQuestionToList('+index+')',
                            style:"margin-left:10px;",
                            text: 'Add'
                        }).appendTo(tmp);
                        
                    }
                    
        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ This function allows to save edited quiz to database
        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        
                    function saveQuiz(objectToSave){
                                                      $.ajax({
        url: "saveModifiedQuiz",
        type: "POST",
        data: objectToSave,
        dataType: "json",
        success: function (result) {
            consloe.log('Quiz Saved');
        }

    });

                        
                    }
                    
                            function quizSelection(index){
            
            selQuiz = myQuizes[index];
        
        //handling navigation bar
        
           document.getElementById("api_quiz_select_button").parentNode.className ="";
           document.getElementById("api_quiz_details_button").parentNode.className ="active";
           document.getElementById("api_quiz_questions_button").parentNode.className ="";
           document.getElementById("api_quiz_finish_button").parentNode.className ="";
        
        
        
        
        //showing menue choices
           
           $("#api_quiz_details_button").show();
           $("#api_quiz_questions_button").show();
           $("#api_quiz_finish_button").show();
           
           $('#api_quiz_window_select').hide();
           $('#api_quiz_window_info').show();
           $('#api_quiz_sub_window_avalableTopics').hide();
           $('#api_quiz_window_questions').hide();
           $('#api_quiz_window_finish').hide();
           
           
           //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
           //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Starting to populate arrays with data from database and change thing in DOM
           //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
           
           document.getElementById("api_quiz_name").innerHTML = selQuiz.qName;
           document.getElementById("api_quiz_topic").innerHTML = selQuiz.topic;
           document.getElementById("api_quiz_questionCount").innerHTML = selQuiz.questions.length;
           document.getElementById("api_quiz_dateCreated").innerHTML = selQuiz.createdOn;
           
           //assembling propper array ith qestios:
           for(var i = 0; i < selQuiz.questions.length;i++){
               var answer = [];
               for(var g = 0; g < selQuiz.questions[i].answers.length;g++){
               answer.push(selQuiz.questions[i].answers[g].answer)
                   
               }
               
               userQuestions.push({"question":   selQuiz.questions[i].questionText,
                                   "answerCount": selQuiz.questions[i].answers.length,
                                   "tempTopic":   selQuiz.questions[i].topic,
                                   "id":i,
                                   "answerCount":answer.length,
                                   "answer":answer
               });
               addMyQuestionToList(i);
              // selQuiz.questions[i]
           }
            
        }
        
        //saving entity
              function saveToDatabase(){
                    var subQuestions = [];
          
          //console.log(selQuiz);
          for(var i = 0; i < userQuestions.length;i++){
              var subAnswers = [];
              
              for(var g = 0; g < userQuestions[i].answer.length;g++){
              if(g==0){
                  subAnswers.push({"answer":userQuestions[i].answer[g],"correct":true});
              }
              else{
                  subAnswers.push({"question":userQuestions[i].answer[g],"correct":false});
              }
              // userQuestions[i].question
          }
          
         subQuestions.push({
          "_id":selQuiz._id+i,
          "answers" : subAnswers,
          "answNum" : subAnswers.length,
          "qType":"",
          "questionText" : userQuestions[i].question,
          "topic" : userQuestions[i].tempTopic
          
            });
            //console.log(subQuestions);
          
          }
          selQuiz.questions = subQuestions;
           // console.log(subAnswers);
            console.log(selQuiz);
          saveQuiz(selQuiz);
          
          
      };
                    
  $(document).ready(function() {
      
      
      //saving quiz
      $("#finishAndCreate").click(function(){
            saveToDatabase();
            location.reload();
      })
      
      
      
          function showSelectQuiz(){
             document.getElementById("api_quiz_select_button").parentNode.className ="active";
              
              $("#api_quiz_select_button").show();
            $("#api_quiz_details_button").hide();
           $("#api_quiz_questions_button").hide();
           $("#api_quiz_finish_button").hide();
           
           
            $('#api_quiz_window_select').show();
               $('#api_quiz_window_info').hide();
           $('#api_quiz_sub_window_avalableTopics').hide();
           $('#api_quiz_window_questions').hide();
           $('#api_quiz_window_finish').hide();
           
          }
          showSelectQuiz();
      //in the first screen button on each quiz entity::
    //   $('#backToSelect').click(function(){
         
            
    //   })
      
      
      
      //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ::GENERATING QUIZ ENTITIES TO DISPLAY TO THE USER:: @@@@@@@@@@@@@@@@@@@@@@
      
     // $('#getMyQuizes').click(function(){
                        $.ajax({
              type: "GET",
              dataType: 'json',
              url: "myQuizList",
              success: function(data) {
                  //data = JSON.parse(data);
                    myQuizes = data;
                    console.log(data);
              },
              complete:function(){
                      for(var i = 0; i<myQuizes.length;i++){
                          
                          
    var tmp = $('<div/>', {class:"col-sm-6 col-md-4",style:"clear:right"}).appendTo('#generatingUserQuizes');
    var tmp2 = $('<div/>', {class:"thumbnail"}).appendTo(tmp);
        console.log(myQuizes[i].picture);
            //@@@@@@@@@@@@@@@@@@@@@@@@@@@ HAVE TO CHANGE THIS TO MORE APPROPRIATE SRC @@@@@@@@@@@@@@@@@@@@@
            $('<img/>', {src: myQuizes[i].picture, class:"thumbnail_image_list" }).appendTo(tmp2);
    
    var tmp3 = $('<div/>', {class:"caption"}).appendTo(tmp2);
        $('<h3/>', { text:myQuizes[i].qName }).appendTo(tmp3);
         var tmp5 = $('<div/>', { style:"overflow-y: scroll;height:80px" }).appendTo(tmp3);
             $('<p/>', { text:myQuizes[i].qDescription }).appendTo(tmp5);
            
              var tmp4 = $('<p/>', { text:'' }).appendTo(tmp3);
              $('<a/>', { href:"javascript:quizSelection("+i+")", class:"btn btn-primary", role:"button",text:'Edit Quiz'}).appendTo(tmp4);
                          
                      }

                  //         <div class="col-sm-6 col-md-4">
                    //     <div class="thumbnail">
                //       <img src="..." alt="...">
                    //       <div class="caption">
                //         <h3>Thumbnail label</h3>
                    //         <p>...</p>
                //         <p><a href="#" class="btn btn-primary" role="button">Button</a> <a href="#" class="btn btn-default" role="button">Button</a></p>
                    //       </div>
//     </div>
//   </div>
                        
                        
                    }
              });
      //});
                 $('#getMyQuizes').click(function(){
            $.ajax({
        url: "saveModifiedQuiz",
        type: "POST",
        data: myQuizes,
        dataType: "json",
        success: function (result) {
        
        }
    });
                     
                     
          });
      
      
                          
                    function generateListElement(id,topic,count){
                       
                        var tmp = $('<a/>', {
                            id: id,
                            class:"list-group-item",
                            //style:"float:left",
                            href: 'javascript:displayQuestions('+id+",{topic:'"+topic+"'})",
                            text: topic
                        }).appendTo('#api_quiz_sub_window_avalableTopics_list');
                        
                        $('<span/>', {
                            id: id,
                            class:'badge',
                            style:"margin-left:10px;",
                            text: count
                        }).appendTo(tmp);
                    }
              $.ajax({
              type: "GET",
              dataType: 'json',
              url: "apiQuiz/getTopicList",
              success: function(data) {
                  //data = JSON.parse(data);
                    for(var i = 0;i<data.length;i++){
                        
                        generateListElement(data[i].id,data[i].title,data[i].clues_count);
              }
              },
              complete:function(){
                  
                        //after compreting load do something
                        
                    }
              })
        //   });
           
    //         $.get("apiQuiz/getTopicList", function(data, status){
    //                                 // data = JSON.parse(data);
    //               console.log(data);
    //                 for(var i = 0;i<data.length;i++){
    //                     console.log('running');
    //                     generateListElement(data[i].id,data[i].title,data[i].clues_count);
    //                 }
    // });

                   // generateListElement(001,'topic goes here',11);
    //deleting user part 
           //just login button:::::
    //   $('#generateCall').click(function() {
    //       var topics =[];
    //       var offset = 100;
    //       var whenToStop = 700;
    //       var counter = 0;
    //       for(var inn = 0 ; inn<whenToStop;inn++){
               
          
    //       $.ajax({
    //           type: "GET",
    //           dataType: 'json',
    //           url: "https://jservice.io/api/categories?count=100&offset=100"+offset,
    //           success: function(data) {
    //                                           //  if(inn===whenToStop){
    //                         // console.log("RUNNING");
    //                         // scanArray();
    //                 for(var i = 0; i < data.length;i++){
    //                       //var b = new Object();
    //                       //console.log(data[i]);
    //                       //b = data[i];
    //                       if(data[i].clues_count>80){
    //                       topics.push(data[i]);
    //                       //console.log('PUTTING IN, clues count: ' + data[i].clues_count);
    //                       }
    //                       //else console.log('skipping, clues count: '+ data[i].clues_count);
    //                   }
                      

    //                             //}
                    
    //       offset+=100;
                   
           
    //           },
    //           complete: function(){
    //               console.log('Call complete');
    //               counter++;
    //                 if(counter == whenToStop){
    //                     console.log("::::Its time to stop;:::::" + topics.length);
    //                     for (var i =0; i<topics.length;i++){
    //                       console.log('topic: '+topics[i].title);
    //                       console.log('clues: '+topics[i].clues_count);
    //                     }
                        
    //                 }
                            
                            
    //                     }
   
    //       });
    //     //   function scanArray(){
    //     //       var i = topics.length-1;
    //     //       while(i>0){
    //     //           if(topics[i].clues_count<100){
    //     //               topics.splice(i, 1);
    //     //               i--;
    //     //           }
                   
                   
    //     //           i--;
    //     //       }
    //     //       console.log(topics);
               
    //     //   }

    //       }
           
           
    //   }); //finishing login button
       
       //DISREGARD ABOVE, I WILL REMOVE IT LATTER< FOR NOW JUS LET IT STAY.. :)
       
    //     function switchMe(hiding,showing,param) {
    //         if(param == true){
    //             $('#'+showing).removeClass().addClass('animated zoomIn');
    //             return;
    //         }
    //       $('#' + hiding).removeClass().addClass('animated bounceOut')
    //       //animated bounceOut
    //       //old naim: zoomOutUp zoomInDown
    //           .one('webkitAnimationEnd oAnimationEnd', function() {
    //               $(this).removeClass().addClass('hidden_container');
    //                 $('#'+showing).removeClass().addClass('animated zoomIn');
    //               //$('#'+showing+' li').removeClass().addClass('');
    //           });
    //   }
               //------------------STARTING TO HANDLE SWITCH_SIDE MENU--------------------------------
      
    //   var current = 'api_quiz_window_info';
    //   var switch_to ='';
    
    //OND DOCUMENT LOAD::
    
        
            
        //      $('#api_quiz_window_select').show();
        //       $('#api_quiz_window_info').hide();
        //   $('#api_quiz_sub_window_avalableTopics').hide();
        //   $('#api_quiz_window_questions').hide();
        //   $('#api_quiz_window_finish').hide();
       
      
       $('#api_quiz_details_button').click(function() {
            
            document.getElementById("api_quiz_select_button").parentNode.className ="";
           document.getElementById("api_quiz_details_button").parentNode.className ="active";
           document.getElementById("api_quiz_questions_button").parentNode.className ="";
           document.getElementById("api_quiz_finish_button").parentNode.className ="";
           
           $('#api_quiz_window_select').hide();
           $('#api_quiz_window_info').show();
           $('#api_quiz_sub_window_avalableTopics').hide();
           $('#api_quiz_window_questions').hide();
           $('#api_quiz_window_finish').hide();
           
           
           
        // switch_to = 'api_quiz_window_info';
        // switchMe(current,switch_to);
        // switchMe('api_quiz_sub_window_avalableTopics','');
        // current = 'api_quiz_window_info';
       
        
       });
       
              $('#api_quiz_select_button').click(function() {
        var r = confirm("Are you sure you want to select other quiz? All progress will be lost if you dont save work!!");
                if (r == true) {
                    location.reload();
                    
        //      userQuestions = [];
        //       tempArray =[];
        //       topicx = '';
        //       //array of owned quizes from database
        //         document.getElementById("api_quiz_sub_window_attachedQuestions").innerHTML = "";
        //       //quiz which user picks to edit
        //       selQuiz = [];

                    
        //     document.getElementById("api_quiz_select_button").parentNode.className ="active";
        //   document.getElementById("api_quiz_details_button").parentNode.className ="";
        //   document.getElementById("api_quiz_questions_button").parentNode.className ="";
        //   document.getElementById("api_quiz_finish_button").parentNode.className ="";
                    
        //             showSelectQuiz();
                    } else {
            }
          
                  
                  
        //     $('#api_quiz_window_select').show();
        //   $('#api_quiz_window_info').hide();
        //   $('#api_quiz_sub_window_avalableTopics').hide();
        //   $('#api_quiz_window_questions').hide();
        //   $('#api_quiz_window_finish').hide();
           
           
           
        // switch_to = 'api_quiz_window_info';
        // switchMe(current,switch_to);
        // switchMe('api_quiz_sub_window_avalableTopics','');
        // current = 'api_quiz_window_info';
       
        
       });
       
       
       
        $('#api_quiz_questions_button').click(function() {
            
                        document.getElementById("api_quiz_select_button").parentNode.className ="";
           document.getElementById("api_quiz_details_button").parentNode.className ="";
           document.getElementById("api_quiz_questions_button").parentNode.className ="active";
           document.getElementById("api_quiz_finish_button").parentNode.className ="";
            
            $('#api_quiz_window_select').hide();
            $('#api_quiz_window_questions').show();
            $('#api_quiz_sub_window_avalableTopics').show();
            $('#api_quiz_window_info').hide();
            $('#api_quiz_window_finish').hide();
            
        // switch_to = 'api_quiz_window_questions';
        // switchMe(current,switch_to);
        // current = 'api_quiz_window_questions';
        // switchMe('api_quiz_sub_window_avalableTopics','api_quiz_sub_window_avalableTopics',true);
        
       });
       
              $('#api_quiz_finish_button').click(function() {
                  
           document.getElementById("api_quiz_select_button").parentNode.className ="";
           document.getElementById("api_quiz_details_button").parentNode.className ="";
           document.getElementById("api_quiz_questions_button").parentNode.className ="";
           document.getElementById("api_quiz_finish_button").parentNode.className ="active";
                  
                  $('#api_quiz_window_select').hide();
            $('#api_quiz_window_info').hide();
           $('#api_quiz_sub_window_avalableTopics').hide();
           $('#api_quiz_window_questions').hide();
           $('#api_quiz_window_finish').show();
           
        // switch_to = 'api_quiz_window_finish';
        // switchMe(current,switch_to);
        // switchMe('api_quiz_sub_window_avalableTopics','');

        // current = 'api_quiz_window_finish';
       });
       
  });