/*
event
{
  "provider": {
    "apiKey": "your api key",
    "sharedSecret": "your api secret",
    "hostname": "sandbox.api.visa.com"
  },
  "order": {
    "amount": "0",
    "currency": "USD",
    "payment": {
      "cardNumber": "4111111111111111",
      "cardExpirationMonth": "10",
      "cardExpirationYear": "2016"
    }
  }
}    
*/
var crypto = require('crypto');
var https = require('https');

var baseUri = '/cybersource/';
var resourcePath = 'payments/v1/authorizations';

exports.handler = function(event, context){
    var postData = JSON.stringify(event.order);
    
    var queryParams = 'apikey=' + event.provider.apiKey;
    var timestamp = Math.floor(Date.now() / 1000);
    var preHashString = timestamp + resourcePath + queryParams + postData;
    var hashString = crypto.createHmac('SHA256', event.provider.sharedSecret).update(preHashString).digest('hex');
    var xPayToken = 'xv2:' + timestamp + ':' + hashString;
    var data = '';
    console.log(xPayToken);
    var req = https.request({
        hostname: event.provider.hostname,
        path: baseUri + resourcePath + '?' + queryParams,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length,
            'x-pay-token' : xPayToken
        }
        },function(res){
            res.on('data', function(chunk){
                data = data + chunk;
            });
            res.on('end', function() {
                console.log(data);
                context.done(null, JSON.parse(data));
            });
    });

    req.on('error', function(e){
        console.log(e);
        context.done(e, event.code);
    });
    
    req.write(postData);
    req.end();
}
