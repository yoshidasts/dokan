
//login by Google account
var login_google = function(){
    var client_id = 'your_client_id';
    var callback = 'your_callback_url';
    window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?response_type=code&scope=openid%20email%20profile&redirect_uri=' + callback + '&client_id=' + client_id;
};
