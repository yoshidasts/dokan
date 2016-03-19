$(function(){
    // Add cart registration event on item page
    if($('body#item')){
        $('#addCart').on('click', function(obj){
            $.cookie('cart', JSON.stringify(item_json), { path: '/test', secure: true });
            window.location.href = '/test/cart';
        });
    }
    
    // Add Credit payment to cart page
    if($('body#cart')){
        $(function(){
            $('#payment-visa').on('click', function(obj){
                var postBody  = {amount: "1", currency: "USD", payment: { cardExpirationMonth: $('#payment-visa-exmonth').attr('value'), cardExpirationYear: $('#payment-visa-exyear').attr('value'), cardNumber: $('#payment-visa-number').attr('value')}};
                $.ajax({
                    type : 'post',
                    url : '/test/checkout/visa/credit',
                    headers: {
                        'content-type' : 'application/json'
                    },
                    data : JSON.stringify(postBody),
                    success : function(data) {
                        console.log(data);
                        $('#payment ul').remove();
                        $('#payment h2').after('<p>Credit Payment Succeeded.<br>Transaction id: ' + data.id + '<br>status:' + data.status + '</p>');
                    },
                    error : function(data) {
                        console.log(data);
                    }
                });
            });
            
            $("#payment li h3").on("click", function() {
                $("#payment li dl:visible").slideToggle();
                $(this).next().slideToggle();
            });
        });
    }
});
