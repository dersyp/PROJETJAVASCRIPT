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
});
