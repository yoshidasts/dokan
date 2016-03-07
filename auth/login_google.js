    var AWS = require('aws-sdk');
    var https = require('https');
    var querystring = require('querystring');
    
    var client_id = '1046385356949-ltngj67di8jqq433dhcemajhk1jblfeu.apps.googleusercontent.com';
    var client_secret = 'uTE9iPbIjV3XXl69tFRr7-QZ';
    var callback = 'https://la1o8dfztl.execute-api.us-east-1.amazonaws.com/test/login/google';
    var credential_region = 'us-east-1';
    var identity_pool_id = 'us-east-1:31498fa9-f706-43be-86a0-9c57eb815465';
    
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
                'redirect_uri': callback,
                'grant_type': 'authorization_code'
            });
            var req = https.request({
                hostname: 'www.googleapis.com',
                path: '/oauth2/v4/token',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': postData.length
                }
            }, function(res) {
                res.setEncoding('utf8');
                res.on('data', function(chunk){
                    data = data + chunk;
                });
                res.on('end', function() {
                    var token = JSON.parse(data);
                    if(token.error){
                        context.done(token.error, event);
                    }else{
                        // Create identity on Cognito
                        AWS.config.region = credential_region;
                        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                            IdentityPoolId: identity_pool_id,
                            Logins: {
                               'accounts.google.com': token.id_token
                            }
                        });
                         AWS.config.credentials.get(function(){
                             context.done(null, data);
                         });
                    }
                });
            });
    
            req.on('error', function(e){
                console.log(e);
                context.done(e, event);
            });
            
            req.write(postData);
            req.end();
        }
    };