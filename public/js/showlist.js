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
});