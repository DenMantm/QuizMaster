  var step = 1;
  
  $(document).ready(function() {
    $("#step2").hide();
    $("#step3").hide();
    $("#step4").hide();
    $("#step5").hide();
    $("#step6").hide();
    $("#submit").hide();
    $("#back").hide();
    $("#next").click(function(){
        next();
    });
    $("#back").click(function(){
        back();
    });
  });
  
  function next(){
      step++;
      refresh();
  }
  
  function back(){
      step--;
      refresh();
  }
  
  function refresh() {
      switch (step) {
        case 1:
            $("#step1").show();
            $("#step2").hide();
            $("#back").hide();
            refreshBar();
            break;
        case 2:
            if ($("#qName").val() === '') {
                alert("Please provide a quiz name first.");
                step--;
                refreshBar();
                break;
            } else {
            $("#step1").hide();
            $("#step2").show();
            $("#step3").hide();
            $("#back").show();
            refreshBar();
            break;
            }
        case 3:
            $("#step2").hide();
            $("#step3").show();
            $("#step4").hide();
            refreshBar();
            break;
        case 4:
            if ($("#qNumber").val() === '') {
                alert("Please provide a number of questions to be displayed.");
                step--;
                refreshBar();
                break;
            } else {
            $("#step3").hide();
            $("#step4").show();
            $("#step5").hide();
            refreshBar();
            break;
            }
        case 5:
            $("#step4").hide();
            $("#step5").show();
            $("#step6").hide();
            $("#next").show();
            $("#submit").hide();
            refreshBar();
            break;
        case 6:
            $("#step5").hide();
            $("#step6").show();
            $("#next").hide();
            $("#submit").show();
            refreshBar();
            break;
        default:
        alert("fdsfsdgf");
      }
  }
  
  function checkName() {
    if ($("#qName").val() === '') {
      alert("Please provide a quiz name first.");
    }
  }
  function refreshBar() {
    var value = (100/5)*(step-1) + "%";
    $(".progress-bar").css('width', value).attr('aria-valuenow', value);       
  }
