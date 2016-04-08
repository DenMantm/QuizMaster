var answers = 3;

var editableAnswers = 0;
var editableQuestionId = '';

function eRemove(x) {
    $("#enew" + x).remove();
}

function nRemove(x) {
    $("#new" + x).remove();
}


$(document).ready(function() {

    /* ===================================
    ====     add another answer       ====
    ===   on the new question form    ====
    =================================== */

    $("#btnAddAnswer").click(function() {
        var data = '<div class="row">' +
            '<label htmlFor="inputName" class="col-sm-2" control-label>' +
            '<button type="button" onclick="nRemove(' + answers + ')" class="btn btn-danger btn-sm btn-round"><span class="glyphicon glyphicon-trash"></span></button>' +
            ' Answer ' + answers + ':</label>' +
            '<div class="col-sm-10">' +
            '<input type="text" class="answer form-control" placeholder="Answer" required/>' +
            '<div">' +
            '<label>' +
            '<input type="checkbox" value="false" class="cb_correct" name="cb_correct' + answers + '"> Correct' +
            '</label>' +
            '</div>' +
            '</div>' +
            '</div>';

        var newDiv = '<div id="free"></div>';
        document.getElementById('free').innerHTML = data;
        $("#free").addClass("new");
        $('#free').attr('id', 'new' + answers);
        $('#body').append(newDiv);
        $('[type="checkbox"]').bootstrapSwitch();
        answers++;
    });

    /* ===================================
    ====     add another answer       ====
    ===   on the new question form    ====
    =================================== */

    $("#btnAddAnswerE").click(function() {
        var data = '<div class="row">' +
            '<label htmlFor="inputName" class="col-sm-2" control-label>' +
            '<button type="button" onclick="eRemove(' + editableAnswers + ')" class="btn btn-danger btn-sm btn-round"><span class="glyphicon glyphicon-trash"></span></button>' +
            ' Answer ' + editableAnswers + ':</label>' +
            '<div class="col-sm-10">' +
            '<input type="text" id="eanswer' + editableAnswers + '" class="form-control" value="" required/>' +
            '<div class="cb_correct' + editableAnswers + '">' +
            '<label>' +
            '<input type="checkbox" class="cb_correct" name="cb_ecorrect' + editableAnswers + '"> Correct' +
            '</label>' +
            '</div>' +
            '</div>' +
            '</div>';
        var newDiv = '<div id="eFree"></div>';
        document.getElementById("eFree").innerHTML = data;
        $("#eFree").addClass("new_edit");
        $('#eFree').attr('id', 'enew' + editableAnswers);
        $("#new0").append(newDiv);
        $('[type="checkbox"]').bootstrapSwitch();
        editableAnswers++;
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

            //creating strings which will reffer to the each answer id
            var sAnswer = $(this).find(".answer");
            var sCorrect = $(this).find(".cb_correct");

            //assigning users values to variables
            var fcorrect;
            var fanswer = $(sAnswer).val();
            //reset the answer field

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

        //adding question text to object
        item.questionText = $("#newQuestion").val();
        
        //passing id in the object by taking it from url
        item.id = getUrlParameter("id");

        //checking number of correct answers
        item.answNum = count;
        if (numOfCorrect == 0) {
            alert("You must provide at least one correct answer.");
        }
        else {
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
                success: function() {
                    location.reload();
                    $("#newQuestion").val('');
                    $('.new').each(function(index) {
                        var sAnswer = $(this).find(".answer");
                        $(sAnswer).val('');
                    });
                },
                error: function() {
                    alert("No data found.");
                }
            });
        }
    });

    /* ===================================
    ====    Save changes from the     ====
    ====      edit question form      ====
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
            console.log(index)
            count++;

            //creating strings which will reffer to the each answer id
            var sAnswer = $(this).find(".eanswer");
            var sCorrect = $(this).find(".cb_ecorrect");

            //assigning users values to variables
            var fcorrect;
            var fanswer = $(sAnswer).val();
            console.log(fanswer)

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
        item.questionText = $("#editQuestion1").val();
        //passing id in the object by taking it from url
        item.id = getUrlParameter("id");
        item.qid = editableQuestionId;

        //checking number of correct answers
        item.answNum = count;
        if (numOfCorrect == 0) {
            alert("You must provide at least one correct answer.");
        }
        else {
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
                success: function() {
                    location.reload();
                    $("#newQuestion").val
                    $('.new').each(function(index) {
                        var sAnswer = $(this).find(".answer");
                        $(sAnswer).val('');
                    });
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

    /* ===================================
    ====     Open question to be      ====
    ====            edited            ====
    =================================== */


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
                for (var i = 0; i < $questions.length; i++) {
                    if (id == $questions[i]._id) {
                        var question = $questions[i]
                        $("#editQuestion1").val(question.questionText);
                        editableAnswers = question.answers.length + 1;
                        for (var x = 0; x < question.answers.length; x++) {
                            html = html + '<div id="enew' + (x + 1) + '" class="new_edit">' +
                                '<div class="row">' +
                                '<label htmlFor="inputName" class="col-sm-2" control-label>' +
                                '<button type="button" onclick="eRemove(' + (x+1) + ')" class="btn btn-danger btn-sm btn-round"><span class="glyphicon glyphicon-trash"></span></button>' +
                                ' Answer ' + (x + 1) + ':</label>' +
                                '<div class="col-sm-10">' +
                                '<input type="text" class="eanswer form-control" value="' + question.answers[x].answer + '" required/>' +
                                '<div class="cb_correct">' +
                                '<label>' +
                                '<input type="checkbox" id="cb_ecorrect' + (x + 1) + '" class="cb_ecorrect" name="cb_ecorrect' + (x + 1)

                            if (question.answers[x].correct == "true") {
                                html = html + '" checked'
                            }
                            else {
                                html = html + '" '
                            }

                            html = html + '> Correct' +
                                '</label>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '</div>'
                        }
                        
                        var newDiv = '<div id="eFree">';
                        var lastDiv = "#enew" + (editableAnswers-1);
                        document.getElementById('new0').innerHTML = html;
                        $("#new0").append(newDiv)
                        $('[type="checkbox"]').bootstrapSwitch();
                    }
                }
            });
        }

    });

});