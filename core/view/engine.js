var aws = require('aws-sdk');
var s3 = new aws.S3();
var apigateway = new aws.APIGateway();

exports.handler = function(event, context){
    s3.getObject({
        Bucket: event.Records[0].s3.bucket.name,
        Key: event.Records[0].s3.object.key
        },
        function(err, data) {
            var html = data.Body.toString();
            var meta = html.split('\n')[0];
            html = html.replace(meta, '');
            meta = JSON.parse(meta);
            apigateway.getRestApis(function(err, data) {
                var apiId;
                for(var i =0; i < data.items.length; i++)
                {
                    if(data.items[i].name == meta.api) apiId = data.items[i].id;
                }
                if(!apiId) {
                    context.done("Rest API is not found", meta.api)
                }else{
                    apigateway.getResources({restApiId: apiId}, function(err, data) {
                        var resourceId;
                        for(var i =0; i < data.items.length; i++)
                        {
                            if(data.items[i].path == meta.resource) resourceId = data.items[i].id;
                        }
                        if(!resourceId) {
                            context.done("Resource is not found", meta.resource)
                        }else{
                            apigateway.putIntegrationResponse({
                                restApiId: apiId,
                                resourceId: resourceId,
                                httpMethod: meta.httpMethod,
                                statusCode: meta.statusCode,
                                responseTemplates: { 'text/html': html}
                                },
                                function(err, data) {
                                    console.log(data);
                                    context.done(err, data);
                            });
                        }
                    });
                }
            });
        }
    );
};