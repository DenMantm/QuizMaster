  var step = 1

  
  $(document).ready(function() {
    //on document load hide all items except those necesary to compleet step1
    $("#step2").hide();
    $("#step3").hide();
    $("#step4").hide();
    $("#step5").hide();
    $("#step6").hide();
    $("#submit").hide();
    $("#back").hide();
    
    //activate action listeners for buttons
    //next button
    $("#next").click(function(){
        next();
    });
    //back button
    $("#back").click(function(){
        back();
    });
    $("#check").click(function(){
        var name =  $("#qName").val;
        checkName(name);
    });
    //switch button for displaying all qiestions or not
    $('[name="cb_qNumber"]').on('switchChange.bootstrapSwitch', function(event, state) {    
      if(state) {
          //if user decide to show all questions then set number of questions to 'all' and hife the field from user
          //also in this cese user will not have option to choose rether questions should or should not be shuflled in next step
          //if the setting is set to show all questions they are automaticaly being shuffled
          $("#qNumber_field").hide();
          $("#qNumber").val('all');
          $("#shuffleQuestion").val(true);
      } else {
          //undo all above if user change the switch state to off
          $("#qNumber_field").show();
          $("#qNumber").val('');
      }
    });
    
    //switch button for shuffling or not answers
    $('[name="cb_shuffleAnswers"]').on('switchChange.bootstrapSwitch', function(event, state) {    
      if(state) {
          //if state is true hidden input shuffleAnswers will receive true vaule
          //hidden field has been set due the fact that checkboxes post their state only when they are shecked (when the state is true)
          //therefore if false checkbox field was not saved to the database at all
          $("#shuffleAnswers").val(true);
      } else {
          $("#shuffleAnswers").val(false);
      }
    });
    
    //switch button for shuffling or not questions
    $('[name="cb_shuffleQuestion"]').on('switchChange.bootstrapSwitch', function(event, state) {    
      if(state) {
          $("#shuffleQuestion").val(true);
      } else {
          $("#shuffleQuestion").val(false);
      }
    });
  });
  
  //next button function
  function next(){
      step++;
      refresh();
  }
  
  //next button function
  function back(){
      //if the user is on step 5 and decide to go back when display all questions has been choosen page should go back 2 steps back
      //skipping step 4 and going to step 3 as step4 is only relevant when display all questions is set to FALSE state
      if ($("#qNumber").val() === 'all' && step===5) {
        step--;
        step--;
        refresh();
      } else {
        step--;
        refresh();
      }
  }
  
  //refresh function is run after every back or nex button click and it show() or hide() all necesary items acording to the Step counter
  function refresh() {
      switch (step) {
        //step one displaying and hiding items only, just used when user is on step 2 and decided to go back
        case 1:
            $("#step1").show();
            $("#step2").hide();
            $("#back").hide();
            refreshBar();
            break;
        //step two checks if the user have provided a quiz name in the previous step if not it will change the classes of step1 and not progress any fuerther
        case 2:
            var test = $("#qName").val();
            //checkName(test);
           // console.log('<%= user.local.email%>');
            if ($("#qName").val() === '') {
                $("#step1").addClass("has-error bg-danger");
                step--;
                refreshBar();
                break;
        //if the name in step1 has been provided hide items from step1, display step2 and back button
            } else {
            $("#step1").removeClass("has-error bg-danger");
            $("#step1").hide();
            $("#step2").show();
            $("#step3").hide();
            $("#back").show();
            refreshBar();
            break;
            }
        case 3:
        //hide step2 and step4 (in case user is coming here bu pressing back button) items and display step3
            $("#step2").hide();
            $("#step3").show();
            $("#step4").hide();
            $("#step5").hide();
            refreshBar();
            break;
        case 4:
        //check if previous step (step3) has a number of questions populated if not set thestep 3 class to error and not progress any fuerther
            if ($("#qNumber").val() === '') {
                $("#step3").addClass("has-error bg-danger");
                step--;
                refreshBar();
                break;
            //if user decided to display all questions then skip the step 4 where the decision rather questions should or should not be shuffled 
            } else if ($("#qNumber").val() === 'all') {
                $("#step3").removeClass("has-error bg-danger");
                next();
                break;
            //if none of the above show step 2 and hide step 3 and 5
            } else { 
            $("#step3").hide();
            $("#step4").show();
            $("#step5").hide();
            refreshBar();
            break;
            }
        case 5:
            //display step 5 and hide all other items that may be shown
            $("#step3").hide();
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
      }
  }
  
  //check database if the quiz with such a name already exsist
  function checkName(name) {
    $.ajax({
      type: "POST",
      url: "/checkqName",
      data: {qName: name},
      cache: false
    });
  }
  
  //maintain the barr progress base on step counter
  function refreshBar() {
    var value = (100/5)*(step-1) + "%";
    $(".progress-bar").css('width', value).attr('aria-valuenow', value);       
  }
