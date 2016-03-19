$(function(){
    // Add cart registration event on item page
    if($('body#item')){
        $('#addCart').on('click', function(obj){
            $.cookie('cart', JSON.stringify(item_json), { path: '/test', secure: true });
            window.location.href = '/test/cart';
        });
    }
});
