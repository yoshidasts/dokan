var https = require('https');
var querystring = require('querystring');

var client_id = '441850122675369';
var client_secret = 'f1673b4d8083fd43106d3aaa51ecd807';
var callback = 'https://la1o8dfztl.execute-api.us-east-1.amazonaws.com/test/login/facebook';

exports.handler = function(event, context){
    if(event.error !== ''){
        context.done(err, event);
    }else{
        var err;
        var data = '';
        var postData = querystring.stringify({
            'code' : event.code,
            'client_id': client_id,
            'client_secret': client_secret,
            'redirect_uri': callback
        });
        var req = https.get('https://graph.facebook.com/oauth/access_token?' + postData,
        function(res) {
            res.setEncoding('utf8');
            res.on('data', function(chunk){
                data = data + chunk;
            });
            res.on('end', function() {
                var token = querystring.parse(data);
                if(token.error){
                    context.done(token.error, event);
                }else{
                    context.done(null, token);
                }
            });
        });

        req.on('error', function(e){
            console.log('error:'+ e);
            context.done(e, event);
        });
        req.end();
    }
};