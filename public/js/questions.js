var answers = 2;

$(document).ready(function() {
    
    //add another answer
    $("#btnAddAnswer").click(function(){
        answers ++ ;
        var data=   '<div class="row">' + 
                        '<label htmlFor="inputName" class="col-sm-2" control-label>Answer ' + answers + ':</label>' +
                        '<div class="col-sm-10">' +
                            '<input type="text" id="answer' + answers + '" class="form-control" placeholder="Answer" required/>'+
                            '<div class="cb_correct' + answers + '">'+
                                '<label>'+
                                '<input type="checkbox" value="false" id="cb_correct' + answers + '" name="cb_correct' + answers + '"> Correct'+
                                '</label>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<div id="new' + (answers+1) + '"></div>';
        document.getElementById('new' + answers).innerHTML = data;
        $("#new" + answers).addClass("new");
        $('[type="checkbox"]').bootstrapSwitch();
    });
    
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
    $("#btnAddQuestion").click(function(){
        var count = 0
        var item = new Object();
        
        $('.new').each(function( index ) {
            count++;
            var index2 = index + 1;
            var sAnswer  = "#answer" + index2;
            var sCorrect  = "#cb_correct" + index2;
            var fanswer = $(sAnswer).val();
            var fcorrect = $(sCorrect).val();
            
            item["answer"+index] = fanswer
            item["correct"+index] = fcorrect
        });
        item.questionText = $("#newQuestion").val();
        item.id =  getUrlParameter("id");
        item.answNum =  count;
        
        
        // var subQuestion = '{"questionText": "' +  $("#newQuestion").val() + '","answers":[]}';
        // console.log(subQuestion)
        // var obj = JSON.parse(subQuestion);
        

        //building
        // var count = 0
        // $('.new').each(function( index ) {
        //     count++;
        //     var index2 = index +1;
        //     var search  = "#answer" + index2;
        //     var fanswer = $(search).val();
        //     var fcorrect = true;
        //     obj['answers'].push({ answer: fanswer, correct: fcorrect});
        // });
        // obj['id'] =  getUrlParameter("id");
        // obj['answNum'] =  count;
        // //subQuestion.id = getUrlParameter("id");
        // var text = JSON.stringify(obj)
        // console.log("created an object: " + text); 
        
        $.ajax({
          type: "POST",
          url: "/addQuestion",
          data:  item,
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
        
    });
    $("#btn_questions").click(function() {

    var id = "/questions?id=" +
            $(this)
            .parent()
            .parent()
            .parent()
            .attr("id");
            location.href = id;

    });
    
    $("#btn_edit").click(function() {
        var id = "/editqz?id=" +
            $(this)
            .parent()
            .parent()
            .parent()
            .attr("id");
            location.href = id;
    
    });
    
});