/*
event
{
  "error": "",
  "code": "code fomr Open ID Provider",
  "provider": {
      "client_id": "your_client_id_set_at_API_Gateway",
      "client_secret": "your_client_secret_set_at_API_Gateway",
      "redirect_uri": "your registered redirect_uri",
      "hostname": "hostname of Open ID Provider,
      "path": "Path of Open ID Provider"
  }
}

*/
var https = require('https');
var querystring = require('querystring');

exports.handler = function(event, context){
    if(event.error !== ''){
        context.done(err, event);
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
        console.log("Post Datra: " + postData);
        var req = https.request({
            hostname: event.provider.hostname,
            path: event.provider.path,
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
                    context.done(JSON.stringify(token.error), event.code);
                }else{
                    context.done(null, token);
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