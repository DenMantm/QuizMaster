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