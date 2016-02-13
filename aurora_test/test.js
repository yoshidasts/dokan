
var event = {};
var context = {
    invokeid: 'invokeid',
    done: function(err,message){
        if(err){
            console.log(err);
        }else{
            console.log('Message: ' + message);
        }
        return;
    }
};

var lambda = require("../aurora");
lambda.handler(event,context);
