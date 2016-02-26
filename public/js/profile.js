   $(document).ready(function() {
       
                //this one is for shaking red
              function shakeMe(shakeId) {
           $('#' + shakeId).removeClass().addClass('alert alert-danger animated bounceIn')
               .one('webkitAnimationEnd oAnimationEnd', function() {
                   $(this).removeClass().addClass('alert alert-danger');
               });
       }
                    //sahking green box
                     function shakeMeGreen(shakeId) {
           $('#' + shakeId).removeClass().addClass('alert alert-success animated bounceIn')
               .one('webkitAnimationEnd oAnimationEnd', function() {
                   $(this).removeClass().addClass('alert alert-success');
               });
       }
       
       
       
    var panels = $('.user-infos');
    var panelsButton = $('.dropdown-user');
    panels.hide();

    //Click dropdown
    panelsButton.click(function() {
        //get data-for attribute
        var dataFor = $(this).attr('data-for');
        var idFor = $(dataFor);

        //current button
        var currentButton = $(this);
        idFor.slideToggle(400, function(){
            //Completed slidetoggle
            if(idFor.is(':visible'))
            {
                currentButton.html('<i class="glyphicon glyphicon-chevron-up text-muted"></i>');
            }
            else
            {
                currentButton.html('<i class="glyphicon glyphicon-chevron-down text-muted"></i>');
            }
        })
    });
    $('[data-toggle="tooltip"]').tooltip();

    // $('#enableEdit').click(function() {
        
    //     $('.fields').toggle();  
    //     $('#enableEdit').toggle();
    //     $('.editProfileField').toggle();
    //     $('#enableSave').toggle();
    //     $('#enableCancel').toggle();

    // });
    //  $('#enableCancel').click(function() {
    //     $('.fields').toggle();  
    //     $('#enableEdit').toggle();
    //     $('.editProfileField').toggle();
    //     $('#enableSave').toggle();
    //     $('#enableCancel').toggle();
    // });
    
         $('#enableSavePicture').click(function() {
            $('#saveImageModal').modal();
            });
            
         $('#enableDeleteUser').click(function() {
            $('#deleteUserModal').modal();
            });
    
    
    
           $('#profile_change_password').click(function() {
               if($('#password_change_password_new').val()!==$('#password_change_password_verify').val()){
                   
                    $('#message_change_password').show();
                       document.getElementById("message_change_password").innerHTML = "Passwords doesnt match";
                       document.getElementById('password_change_password_old').style.borderColor = "#ccc";
                       document.getElementById('password_change_password_new').style.borderColor = "red";
                       document.getElementById('password_change_password_verify').style.borderColor = "red";
                       shakeMe('message_change_password');
                   return;
               }
               
               
           $.ajax({
               type: "POST",
               dataType: 'json',
               data: {
                   "password_old": $('#password_change_password_old').val(),
                   "password_new": $('#password_change_password_new').val()
               },
               url: "/change_password/ajax",
               success: function(data) {
                   if (data.status === 'wrongPassword') {
                       $('#message_change_password').show();
                       document.getElementById("message_change_password").innerHTML = "Wrong old password entered";
                       document.getElementById('password_change_password_old').style.borderColor = "red";
                       document.getElementById('password_change_password_new').style.borderColor = "#ccc";
                       document.getElementById('password_change_password_verify').style.borderColor = "#ccc";
                       shakeMe('message_change_password');

                   }
                   if (data.status === 'done') {
                       $('#message_change_password').show();
                       document.getElementById("message_change_password").innerHTML = "Password succesfully changed";
                       document.getElementById('password_change_password_old').style.borderColor = "green";
                       document.getElementById('password_change_password_new').style.borderColor = "green";
                       document.getElementById('password_change_password_verify').style.borderColor = "green";
                       shakeMeGreen('message_change_password');
                      // window.location.href = '/index';
                   }
               }
           });
       }); //finishing change password button
    
               $('#profile_change_details').click(function() {
                   
               if($('#change_details_name').val()===""||$('#change_details_surname').val()===""||$('#change_details_username').val()===""){
                    $('#message_change_details').show();
                       document.getElementById("message_change_details").innerHTML = "All fields have to fe filled";
                       document.getElementById('password_change_password_old').style.borderColor = "red";
                       document.getElementById('password_change_password_new').style.borderColor = "red";
                       document.getElementById('password_change_password_verify').style.borderColor = "red";
                       shakeMe('profile_change_details');
                   return;
               }
           $.ajax({
               type: "POST",
               dataType: 'json',
               data: {
                   "name": $('#change_details_name').val(),
                   "username": $('#change_details_username').val(),
                   "surname": $('#change_details_surname').val()
               },
               url: "/updateUser",
               success: function(data) {
                   if(data.status === 'userExists'){
                     $('#message_change_details').show();
                document.getElementById('change_details_username').style.borderColor = "red";
                document.getElementById("message_change_details").innerHTML = "This username is already taken";
                       shakeMe('message_change_details');
                   }
                   if (data.status === 'done') {
                       $('#message_change_details').show();
                       document.getElementById('change_details_username').style.borderColor = "green";
                       document.getElementById('change_details_surname').style.borderColor = "green";
                       document.getElementById('change_details_name').style.borderColor = "green";
                        document.getElementById("message_change_details").innerHTML = "Details were succesfully updated";
                       shakeMeGreen('message_change_details');
                       
                    //   CHANGING VALUES IN FIELDS WHERE NECESARRY
                        
                    document.getElementById('details_static_name').innerHTML = $('#change_details_name').val()+' '+$('#change_details_surname').val();
                    document.getElementById('details_static_username').innerHTML = $('#change_details_username').val();

                       
                       
                      // window.location.href = '/index';
                      
                   }
               }
           });
       }); //finishing change password button
    
    
    
    
    
    
});

