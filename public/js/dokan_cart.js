$(function(){
    // Add cart registration event on item page
    if($('body#item')){
        $('#addCart').on('click', function(obj){
            $.cookie('cart', JSON.stringify(item_json), { path: '/test', secure: true });
            window.location.href = '/test/cart';
        });
    }
    
    // Configure Payment on cart page
    if($('body#cart')){
        $(function(){
            // Add Credit payment to cart page
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
            
            //VISA Checkout
            $('head script').last().after('<script type="text/javascript">' +
                'function onVisaCheckoutReady (){'+
                'V.init({ apikey: "7O07VN664O10JW6A9ESS113p8sf9JeGzr6_2haC9F9m_ANtLM"});'+
                'V.on("payment.success", function(payment) {console.log(payment); });'+
                'V.on("payment.cancel", function(payment) {console.log(payment);  });'+
                'V.on("payment.error", function(payment,error) {console.log(payment); });' +
                '}</script>');
            $('head script').last().after('<script type="text/javascript" src="//sandbox-assets.secure.checkout.visa.com/checkout-widget/resources/js/integration/v1/sdk.js"></script>');
            
            // Toggle button
            $("#payment li h3").on("click", function() {
                $("#payment li dl:visible").slideToggle();
                $(this).next().slideToggle();
            });
        });
    }
});

