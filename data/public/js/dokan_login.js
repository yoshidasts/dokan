var region = 'us-east-1';
var identity_pool_id = 'us-east-1:31498fa9-f706-43be-86a0-9c57eb815465';
//    var identity_pool_id = 'your_identity_pool';

//login by Google account
var login_google = function(){
    var client_id = '1046385356949-ltngj67di8jqq433dhcemajhk1jblfeu.apps.googleusercontent.com';
    var callback = 'https://la1o8dfztl.execute-api.us-east-1.amazonaws.com/test/login/google';
//    var client_id = 'your_client_id';
//    var callback = 'your_callback_url';
    window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?response_type=code&scope=openid%20email%20profile&redirect_uri=' + callback + '&client_id=' + client_id;
};

//login by Facebook account
var login_facebook = function(){
    var client_id = '441850122675369';
    var callback = 'https://la1o8dfztl.execute-api.us-east-1.amazonaws.com/test/login/facebook';
//    var client_id = 'your_client_id';
//    var callback = 'your_callback_url';
    window.location.href = 'https://www.facebook.com/dialog/oauth?client_id='+ client_id + '&redirect_uri='+ callback;
};

//login by Twitter account
var login_twitter = function(){
    var access_token = 'bR6Q4mwnzlProdeItjxlMyWvG ';
//    var client_id = 'your_client_id';
//    var callback = 'your_callback_url';
    $.post('https://api.twitter.com/oauth/request_token', '', function(data, textStatus, jqXHR){
    });
    window.location.href = 'https://api.twitter.com/oauth/authenticate?oauth_token='+ access_token;
};

//login by Instagram account
var login_instagram = function(){
    var client_id = 'fba4fa97c65b48e0afe39b50d325840d';
    var callback = 'https://la1o8dfztl.execute-api.us-east-1.amazonaws.com/test/login/instagram';
//    var client_id = 'your_client_id';
//    var callback = 'your_callback_url';
    window.location.href = 'https://api.instagram.com/oauth/authorize/?client_id='+ client_id + '&redirect_uri=' + callback + '&response_type=token';
};

// Logout
var logout = function(){
    var logins = JSON.parse('{"' + localStorage['aws.cognito.identity-providers.' + identity_pool_id] + '":"' + sessionStorage['aws.cognito.token'] + '"}');
    AWS.config.region = region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: identity_pool_id,
        Logins: logins
    });
    AWS.config.credentials.get(function(err){
        if(err){
            console.log(err);
        }
        console.log(AWS.config.credentials);
        AWS.config.credentials.clearCachedId();
        console.log(AWS.config.credentials);
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: identity_pool_id });
        console.log(AWS.config.credentials);
    });
   localStorage.removeItem('aws.cognito.token');
   return false;
}
