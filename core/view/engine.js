var dom = require("node-dom").dom;
var aws = require('aws-sdk');
var s3 = new aws.S3();
var apigateway = new aws.APIGateway();

exports.handler = function(event, context){
    s3.getObject({
        Bucket: event.Records[0].s3.bucket.name,
        Key: event.Records[0].s3.object.key
        },
        function(err, data) {
            var html = dom(data.Body.toString(),null,{features: {removeScript: true}});
            console.log(html);
            apigateway.getRestApis(function(err, data) {
                console.log(data);
                context.done(err, data);
            });
        }
    );
};
