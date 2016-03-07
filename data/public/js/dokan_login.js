
//login by Google account
var login_google = function(){
    var client_id = '1046385356949-ltngj67di8jqq433dhcemajhk1jblfeu.apps.googleusercontent.com';
    var callback = 'https://la1o8dfztl.execute-api.us-east-1.amazonaws.com/test/login/google';
//    var client_id = 'your_client_id';
//    var callback = 'your_callback_url';
    window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?response_type=code&scope=openid%20email%20profile&redirect_uri=' + callback + '&client_id=' + client_id;
};
