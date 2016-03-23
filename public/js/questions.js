var answers = 2;

$(document).ready(function() {

    //add another answer
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
    //building json object
<<<<<<< HEAD
    $("#btnAddQuestion").click(function(){
        var subQuestion = {questionText: $("#newQuestion").val(), answers: [] };

        //building

        $('.new').each(function( index ) {
            var index2 = index +1;
            var search  = "#answer" + index2;
            var fanswer = $(search).val();
            var fcorrect = true;
            subQuestion.answers.push({ answer: fanswer, correct: fcorrect} );
            
        });
        subQuestion.id = getUrlParameter("id");
        console.log(JSON.stringify(subQuestion));
        $.ajax({
        dataType : "text",
          type: "POST",
          url: "/addQuestion",
          data: JSON.stringify(subQuestion),
          cache: false
        });
    });
    
    
    //switch button for displaying all qiestions or not
    $('[name="cb_displayMine"]').on('switchChange.bootstrapSwitch', function(event, state) {
        if (state) {
            $(".notMine").hide();
        }
        else {
            //undo all above if user change the switch state to off
            $(".notMine").show();
        }
    });
    $("#btn_remove").click(function() {
        if (confirm("Are you sure?"))
{
    var id = "/removeqz?id=" +
            $(this)
            .parent()
            .parent()
            .parent()
            .attr("id");
        $.post(id, function() {
            location.href = "/showquiz";
        });
}
=======
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
>>>>>>> 3c75f9d17524bb69eb638d20dbf4eab02c6c291a
        
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


    $(".btn_remove").click(function() {
        if (confirm("Are you sure?")) {
            var id = "/removeQuest?id=" +
                $(this)
                .parent()
                .parent()
                .attr("id");
            $.post(id, function() {
                location.href = "/showquiz";
            });
        }
    });

    $(".btn_edit").click(function() {
        var main = $(this)
            .parent()
            .parent();
            
        var question = main.children("div.question").text();
        var answers = main.children("div.answer").text();
        
        alert(answers);
        
        
       /* var id = "/editQest?id=" + getUrlParameter("id") + "&q=" + 
            main.attr("id");
        location.href = id;*/

    });

});