
function validSubmitform() {
    (function ($) {
        "use strict";


        /*==================================================================
        [ Validate ]*/
        var pseudo = $('.validate-input input[name="pseudo"]');
        var email = $('.validate-input input[name="email"]');
        var password = $('.validate-input input[name="password"]');


        $('.validate-form').on('submit',function(){
            var check = true;

            if($(pseudo).val().trim() == ''){
                showValidate(pseudo);
                check=false;
            }
            if($(email).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                showValidate(email);
                check=false;
            }

            if($(password).val().trim() == ''){
                showValidate(password);
                check=false;
            }

            return check;
        });
        $('.validate-form .input1').each(function(){
            $(this).focus(function(){
                hideValidate(this);
            });
        });

        function showValidate(input) {
            var thisAlert = $(input).parent();

            $(thisAlert).addClass('alert-validate');
        }

        function hideValidate(input) {
            var thisAlert = $(input).parent();

            $(thisAlert).removeClass('alert-validate');
        }



    })(jQuery);
}