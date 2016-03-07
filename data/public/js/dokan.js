// Add Menu event on header
$(function(){
    $('#menu').on('click', function(obj){
        if($('#menuList').css('display') == 'none'){
            $('#menuList').css('display', 'block');
        }else{
            $('#menuList').css('display', 'none');
        }
    });
});
