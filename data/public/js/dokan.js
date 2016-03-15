$(function(){
    // Add Menu event on header
    $('#menu').on('click', function(obj){
        if($('#menuList').css('display') == 'none'){
            $('#menuList').css('display', 'block');
        }else{
            $('#menuList').css('display', 'none');
        }
    });
    
    // Control Login/Logout button
    if(sessionStorage['aws.cognito.token']){
        $('header').attr('class', 'login');
        $('#menuList #mnLogin').css('display', 'none');
        $('#menuList #mnRegistry').css('display', 'none');
        $('#menuList #mnMypage').css('display', 'block');
        $('#menuList #mnLogout').css('display', 'block');
    }
    
    // Add Logout ajax
    $('#mnLogout').on('click', function(obj){
        $.ajax({
            type : 'post',
            url : '/test/logout',
            data : JSON.stringify(sessionStorage['aws.cognito.token']),
            contentType :'application/json',
            dataType: 'text/html',
            scriptCharset: 'utf-8',
            success : function(data) {
                    console.log(data);
                    $('html').html(data);
            },
            error : function(data) {
                    console.log(data);
                    $('html').html(data);
            }
        });
        return false;
    });
});
