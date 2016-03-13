/*
event
{
  "error": "",
  "code": "code fomr Open ID Provider",
  "provider": {
      "provider_name": "accounts.google.com | graph.facebook.com",
      "client_id": "your_client_id_set_at_API_Gateway",
      "client_secret": "your_client_secret_set_at_API_Gateway",
      "hostname": "hostname of Open ID Provider,
      "path": "Path of Open ID Provider"
  },
  "redirect_uri": "your registered redirect_uri",
  "cognito":{
    "region": "region of your AWS",
    "identity_pool_id": "Identity pool id of your Cognito"
  }
}

*/
var https = require('https');
var querystring = require('querystring');
var AWS = require('aws-sdk');

exports.handler = function(event, context){
    console.log('Provider: '+ event.provider.hostname);
    if(event.error){
        context.done(event.error, event.code);
    }else{
        var err;
        var data = '';
        var postData = querystring.stringify({
            'code' : event.code,
            'client_id': event.provider.client_id,
            'client_secret': event.provider.client_secret,
            'redirect_uri': event.redirect_uri,
            'grant_type': 'authorization_code'
        });
        console.log("Post Data: " + postData);
        
        var mime;
        var req = https.request({
            hostname: event.provider.hostname,
            path: event.provider.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        }, function(res) {
            mime = res.headers['content-type'].split(';')[0];
            res.setEncoding('utf8');
            res.on('data', function(chunk){
                data = data + chunk;
            });
            res.on('end', function() {
                console.log('Content-type: ' + mime);
                console.log('Received: ' + data);
                var token;
                if(mime == 'application/json'){
                    token = JSON.parse(data);
                }else{
                    token = querystring.parse(data);
                }
                if(token.error){
                    console.log(token.error);
                    context.done(token.error, event.code);
                }else{
                    var logins;
                    if(token.id_token){
                        logins = JSON.parse('{"' + event.provider.provider_name + '":"' + token.id_token + '"}');
                    }else{
                        logins = JSON.parse('{"' + event.provider.provider_name + '":"' + token.access_token + '"}');
                    }
                    AWS.config.region = event.cognito.region;
                    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                        IdentityPoolId: event.cognito.identity_pool_id,
                        Logins: logins
                    });
                    AWS.config.credentials.get(function(err){
                        if(err){
                            context.done(err);
                        }else{
                            console.log(AWS.config.credentials);
                            context.done(null,logins);
                        }
                    });
                }
            });
        });

        req.on('error', function(e){
            console.log(e);
            context.done(e, event.code);
        });
        
        req.write(postData);
        req.end();
    }
};