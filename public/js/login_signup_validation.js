   $(document).ready(function() {
       //generate cool animation in case of an error
       function shakeMe(shakeId) {
           $('#' + shakeId).removeClass().addClass('alert alert-danger animated bounceIn')
               .one('webkitAnimationEnd oAnimationEnd', function() {
                   $(this).removeClass().addClass('alert alert-danger');
               });
       }
       //validate e-mail with regular expressions with REVERSED logic 
       function ValidateEmail(mail) {
           if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(mail))
               return false;
           else
               return true;
       }
       //just login button:::::
       $('#Login_index').click(function() {
           $.ajax({
               type: "POST",
               dataType: 'json',
               data: {
                   "email": $('#email').val(),
                   "password": $('#password').val()
               },
               url: "/login/ajax",
               success: function(data) {
                   if (data.status === 'noUser') {
                       $('#message').show();
                       document.getElementById("message").innerHTML = "Wrong user or password";


                       document.getElementById('email').style.borderColor = "red";
                       document.getElementById('password').style.borderColor = "red";

                       shakeMe('message');

                   }
                   if (data.status === 'done') {
                       window.location.href = '/index';
                   }
               }
           });
       }); //finishing login button
       $('#signup_index').click(function() {
           if (ValidateEmail($('#email_signup').val())) {

               $('#message_signup').show();
               document.getElementById("message_signup").innerHTML = "Please provide valid e-mail!";

               shakeMe('message_signup');

               document.getElementById('password_confirm_signup').style.borderColor = "#ccc";
               document.getElementById('password_signup').style.borderColor = "#ccc";
               document.getElementById('email_signup').style.borderColor = "red";
               document.getElementById('nickname').style.borderColor = "#ccc";

               return;
           }

           if ($('#password_signup').val() != $('#password_confirm_signup').val()) {
               $('#message_signup').show();
               document.getElementById("message_signup").innerHTML = "Passwords doesnt match, please check fields";

               shakeMe('message_signup');

               document.getElementById('password_confirm_signup').style.borderColor = "red";
               document.getElementById('password_signup').style.borderColor = "red";
               document.getElementById('email_signup').style.borderColor = "#ccc";
               document.getElementById('nickname').style.borderColor = "#ccc";


               return;
           }
           if ($('#password_signup').val().length < 6) {
               $('#message_signup').show();
               document.getElementById("message_signup").innerHTML = "Password is to short";

               shakeMe('message_signup');

               document.getElementById('password_confirm_signup').style.borderColor = "red";
               document.getElementById('password_signup').style.borderColor = "red";
               document.getElementById('email_signup').style.borderColor = "#ccc";
               document.getElementById('nickname').style.borderColor = "#ccc";

               return;
           }

           $.ajax({
               type: "POST",
               dataType: 'json',
               data: {
                   "email": $('#email_signup').val(),
                   "password": $('#password_signup').val(),
                   "username": $('#username_signup').val()

               },
               url: "/signup/ajax",
               success: function(data) {

                   if (data.status === 'emailExists') {
                       $('#message_signup').show();
                       document.getElementById("message_signup").innerHTML = "E-mail is already taken";

                       shakeMe('message_signup');

                       document.getElementById('password_confirm_signup').style.borderColor = "#ccc";
                       document.getElementById('password_signup').style.borderColor = "#ccc";
                       document.getElementById('email_signup').style.borderColor = "red";
                       document.getElementById('nickname').style.borderColor = "#ccc";

                   }
                   if (data.status === 'userExists') {
                       $('#message_signup').show();
                       document.getElementById("message_signup").innerHTML = "Username is already taken";

                       shakeMe('message_signup');

                       document.getElementById('password_confirm_signup').style.borderColor = "#ccc";
                       document.getElementById('password_signup').style.borderColor = "#ccc";
                       document.getElementById('email_signup').style.borderColor = "#ccc";
                       document.getElementById('nickname').style.borderColor = "red";

                   }
                   if (data.status === 'done') {
                       //document.getElementById("message_signup").innerHTML = "E-mail with password recovery link was sent";
                       window.location.href = '/index';
                   }
               }
           });
       });
       $('#retrieve_index').click(function() {


           if (ValidateEmail($('#email_retrieve').val())) {

               $('#message_retrieve').show();
               document.getElementById("message_retrieve").innerHTML = "Please provide valid e-mail!";

               document.getElementById('email_retrieve').style.borderColor = "red";

               shakeMe('message_retrieve');

               return;

           }
           $.ajax({
               type: "POST",
               dataType: 'json',
               data: {
                   "email": $('#email_retrieve').val()
               },
               url: "/retrievePassword/ajax",
               success: function(data) {
                   if (data.status === 'noUser') {
                       $('#message_retrieve').show();
                       document.getElementById("message_retrieve").innerHTML = "No such email is attached to any user";
                       shakeMe('message_retrieve');
                   }
                   if (data.status === 'done') {
                       $('#message_retrieve').show();
                       document.getElementById("message_retrieve").innerHTML = "E-mail with password recovery link was sent";
                       shakeMe('message_retrieve');

                       document.getElementById('email_retrieve').style.borderColor = "#ccc";
                       //	window.location.href = '/index';
                   }
               }
           });
       });
   });