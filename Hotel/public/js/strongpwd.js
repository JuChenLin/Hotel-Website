$(document).ready(function() {
    $('#signup').prop('disabled', true);
    $('input[type=password]').keyup(function() {
        var pswd = $(this).val();
        var btn_disabled = false;
        //validate the length
        if ( pswd.length < 8 ) {
            $('#length').removeClass('valid').addClass('invalid');
            btn_disabled = true;
        } else {
            $('#length').removeClass('invalid').addClass('valid');
        }
        //validate letter
        if ( pswd.match(/[A-z]/) ) {
            $('#letter').removeClass('invalid').addClass('valid');
        } else {
            $('#letter').removeClass('valid').addClass('invalid');
            btn_disabled = true;
        }

        //validate capital letter
        if ( pswd.match(/[A-Z]/) ) {
            $('#capital').removeClass('invalid').addClass('valid');
        } else {
            $('#capital').removeClass('valid').addClass('invalid');
            btn_disabled = true;
        }

        //validate number
        if ( pswd.match(/\d/) ) {
            $('#number').removeClass('invalid').addClass('valid');
        } else {
            $('#number').removeClass('valid').addClass('invalid');
            btn_disabled = true;
        }
        
        if(btn_disabled) {
            $('#signup').prop('disabled', true);
        }
        else{
            $('#signup').prop('disabled', false);
        }

    }).focus(function() {
        $('#pswd_info').show();
    }).blur(function() {
        $('#pswd_info').hide();
    });
});
