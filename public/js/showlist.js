$(document).ready(function() {
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