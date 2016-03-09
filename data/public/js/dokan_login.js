
//login by Google account
var login_google = function(){
    var client_id = 'your_client_id';
    var callback = 'your_callback_url';
    if(!localStorage.getItem('login_after')){
        localStorage.setItem('login_after', '/test/list/A01');
    }
    window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?response_type=code&scope=openid%20email%20profile&redirect_uri=' + callback + '&client_id=' + client_id;
};

//login by Facebook account
var login_facebook = function(){
    var client_id = 'your_client_id';
    var callback = 'your_callback_url';
    if(!localStorage.getItem('login_after')){
        localStorage.setItem('login_after', '/test/list/A01');
    }
    window.location.href = 'https://www.facebook.com/dialog/oauth?client_id='+ client_id + '&redirect_uri='+ callback;
};

// Login by AWS Cognito
var login_aws = function(provider, token_id, callback){
    var region = 'us-east-1';
    var identity_pool_id = 'your_identity_pool';
    var logins = JSON.parse('{"' + provider + '":"' + token_id + '"}');
    AWS.config.region = region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: identity_pool_id,
        Logins: logins
    });
    AWS.config.credentials.get(function(err){
        if(err){
            console.log(err);
        }else{
            callback(AWS.config.credentials);
        }
    });
};
