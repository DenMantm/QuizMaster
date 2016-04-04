var answers = 2;

var editableAnswers = 0;
var editableQuestionId = '';

$(document).ready(function() {
    /* ===================================
    ====     add another answer       ====
    ====       on the form            ====
    =================================== */
    
    $("#btnAddAnswer").click(function() {
        answers++;
        var data = '<div class="row">' +
            '<label htmlFor="inputName" class="col-sm-2" control-label>Answer ' + answers + ':</label>' +
            '<div class="col-sm-10">' +
            '<input type="text" id="answer' + answers + '" class="form-control" placeholder="Answer" required/>' +
            '<div class="cb_correct' + answers + '">' +
            '<label>' +
            '<input type="checkbox" value="false" id="cb_correct' + answers + '" name="cb_correct' + answers + '"> Correct' +
            '</label>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="new' + (answers + 1) + '"></div>';
        document.getElementById('new' + answers).innerHTML = data;
        $("#new" + answers).addClass("new");
        $('[type="checkbox"]').bootstrapSwitch();
    });

    //function used to get the paramaeter from the current page address
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
    
    /* ===================================
    ====    Save changes from the     ====
    ====      new question form       ====
    =================================== */
    
    $("#btnAddQuestion").click(function() {
        //count -> number of answers
        var count = 0;
        //creating new one dimentional object
        var item = new Object();
        //counting correct answers for validation and setting a question type
        var numOfCorrect = 0;
        //looping through divs with answers
        $('.new').each(function(index) {
            count++;
            console.log(count);
            var iterate = index + 1;
            
            //creating strings which will reffer to the each answer id
            var sAnswer = "#answer" + iterate;
            var sCorrect = "#cb_correct" + iterate;
            
            //assigning users values to variables
            var fcorrect;
            var fanswer = $(sAnswer).val();
            //reset the answer field
            $(sAnswer).val('');
            if ($(sCorrect).is(":checked")) {
                fcorrect = true;
                numOfCorrect++;
            }
            else {
                fcorrect = false;
            }
            
            //adding user values to object
            item["answer" + index] = fanswer;
            item["correct" + index] = fcorrect;
        });
        
        //adding wuestion text to object
        item.questionText = $("#newQuestion").val();
        $("#newQuestion").val('');
        //passing id in the object by taking it from url
        item.id = getUrlParameter("id");
        item.qid = editableQuestionId;
        
        //checking number of correct answers
        item.answNum = count;
        if (numOfCorrect == 0) {
            alert("You must provide at least one correct answer.");
        } else {
            if (numOfCorrect > 1) {
                item.type = "multi";
            }
            else {
                item.type = "single";
            }
            
            //posting object to router
            $.ajax({
                type: "POST",
                url: "/editQuestion",
                data: item,
                cache: false,
                success: function(){
                    location.reload();
                    $("#newQuestion").val('');
                },
                error: function() {
                    alert("No data found.");
                }
            });
        }
    });
    
    /* ===================================
    ====    Save changes from the     ====
    ====      edit question form       ====
    =================================== */
    
        $("#btnEditQuestion").click(function() {
        //count -> number of answers

        var count = 0;
        //creating new one dimentional object
        var item = new Object();
        //counting correct answers for validation and setting a question type
        var numOfCorrect = 0;
        //looping through divs with answers
        $('.new_edit').each(function(index) {

            count++;
            var iterate = index + 1;
            
            //creating strings which will reffer to the each answer id
            var sAnswer = "#eanswer" + iterate;
            var sCorrect = "#cb_ecorrect" + iterate;
            
            //assigning users values to variables
            var fcorrect;
            var fanswer = $(sAnswer).val();
            console.log(fanswer)
            //reset the answer field
            $(sAnswer).val('');
            if ($(sCorrect).is(":checked")) {
                fcorrect = true;
                numOfCorrect++;
            }
            else {
                fcorrect = false;
            }
            
            //adding user values to object
            item["answer" + index] = fanswer;
            item["correct" + index] = fcorrect;
        });
        
        //adding wuestion text to object
        item.questionText = $("#newQuestion").val();
        $("#newQuestion").val('');
        //passing id in the object by taking it from url
        item.id = getUrlParameter("id");
        
        //checking number of correct answers
        item.answNum = count;
        if (numOfCorrect == 0) {
            alert("You must provide at least one correct answer.");
        } else {
            if (numOfCorrect > 1) {
                item.type = "multi";
            }
            else {
                item.type = "single";
            }
            
            //posting object to router
            $.ajax({
                type: "POST",
                url: "/addQuestion",
                data: item,
                cache: false,
                success: function(){
                    location.reload();
                    $("#newQuestion").val('');
                },
                error: function() {
                    alert("No data found.");
                }
            });
        }
    });
    /* ===================================
    ====     Remove the question      ====
    ====      from the database       ====
    =================================== */
    
    $(".btn_remove").click(function() {
        if (confirm("Are you sure?")) {
        //Aquire question id from html id
            var id = "/removeQuest?id=" +
                $(this)
                .parent()
                .parent()
                .attr("id");
                
        //post the generated url
            $.post(id, function() {
                location.reload(); 
            });
        }
    });

    $(".btn_edit").click(function() {
        
        var id = $(this)
                .parent()
                .parent()
                .attr("id");
                
        populateEdit(id);
        editableQuestionId = id;
        
        
        
        function populateEdit(id) {
            var qID = getUrlParameter("id");
            var url = '/api/quiz/' + qID;

            $.getJSON(url, function(data) {
                var html = '';
                var $questions = data.questions;
                for (var i=0; i<$questions.length; i++) {
                    if(id == $questions[i]._id) {
                        var question = $questions[i]
                        $("#editQuestion1").val(question.questionText);
                        for(var x=0; x<question.answers.length;x++) {
                            html = html + '<div id="new' + (x+1) + '" class="new_edit">' + 
                            '<div class="row">' +
                            '<label htmlFor="inputName" class="col-sm-2" control-label>Answer' + (x+1) + ':</label>' + 
                            '<div class="col-sm-10">' + 
                            '<input type="text" id="eanswer' + (x+1) + '" class="form-control" value="' + question.answers[x].answer + '" required/>' + 
                            '<div class="cb_correct' + (x+1) + '">' + 
                            '<label>' + 
                            '<input type="checkbox" id="cb_ecorrect' + (x+1) + '" name="cb_ecorrect' + (x+1)
                            
                            if(question.answers[x].correct == "true") {
                                html = html + '" checked' 
                            } else {
                                html = html + '" ' 
                            }
                            
                            html = html + '> Correct' +
                            '</label>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>'
                        }
                            document.getElementById('new0').innerHTML = html;
                            $('[type="checkbox"]').bootstrapSwitch();
                    }
                }
            });
        }
        
        

       /* var id = "/editQest?id=" + getUrlParameter("id") + "&q=" + 
            main.attr("id");
        location.href = id;*/

    });

});