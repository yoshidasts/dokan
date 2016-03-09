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
    if($.cookie("IdentityId") && $.cookie("IdentityId") != ''){
        $('#menuList #mnLogin').css('display', 'none');
        $('#menuList #mnRegistry').css('display', 'none');
        $('#menuList #mnMypage').css('display', 'block');
        $('#menuList #mnLogout').css('display', 'block');
    }
});
