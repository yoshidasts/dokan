/*
event
{
  "cognito":{
    "region": "region of your AWS",
    "identity_pool_id": "Identity pool id of your Cognito"
  },
  "logins":{
      "provider": "access_token"
  }
}

*/
var https = require('https');
var querystring = require('querystring');
var AWS = require('aws-sdk');

exports.handler = function(event, context){
    console.log(event);
    AWS.config.region = event.cognito.region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: event.cognito.identity_pool_id,
        Logins: event.logins
    });
    AWS.config.credentials.get(function(err){
        if(err){
            context.done(err);
        }else{
            AWS.config.credentials.clearCachedId();
            console.log(AWS.config.credentials);
            context.done(null,{message: "Logged out."});
        }
    });
};