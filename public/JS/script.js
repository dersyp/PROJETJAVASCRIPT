$( document ).ready(function() {
    $('.loginInput').focus(function(){
        $(this).parents('.form-group').addClass('focused');
    });

    $('.loginInput').blur(function(){
        var inputValue = $(this).val();
        if ( inputValue == "" ) {
            $(this).removeClass('filled');
            $(this).parents('.form-group').removeClass('focused');
        } else {
            $(this).addClass('filled');
        }
    })
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('error');
    console.log(myParam)
    if(myParam.localeCompare('Login_Already_Used') == 0){
        $('#registerAlert').html("Login déjà utilisé");
    }
});
