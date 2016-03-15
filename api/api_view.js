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
                console.log(meta);
                apigateway.getRestApis(function(err, data) {
                    var apiId;
                    for(item in data.items)
                    {
                        if(data.items[item].name == meta.api) apiId = data.items[item].id;
                    }
                    if(!apiId) {
                        context.done("Rest API is not found", meta.api)
                    }else{
                        apigateway.getResources({restApiId: apiId}, function(err, data) {
                            var resourceId;
                            for(var item in data.items)
                            {
                                if(data.items[item].path == meta.resource) resourceId = data.items[item].id;
                            }
                            if(!resourceId) {
                                context.done("Resource is not found", meta.resource)
                            }else{
                                console.log('API ID:'+apiId + ' Resource ID:' + resourceId + "HTTP Method:" + meta.httpMethod + " Status Code:" + meta.statusCode);
                                console.log('Delete Integration Response');
                                apigateway.deleteIntegrationResponse({
                                    restApiId: apiId,
                                    resourceId: resourceId,
                                    httpMethod: meta.httpMethod,
                                    statusCode: meta.statusCode
                                    },
                                    function(err, data) {
                                        if(err){
                                            context.done(err, data);
                                        }else{
                                            console.log('Put Integration Response');
                                            apigateway.putIntegrationResponse({
                                                restApiId: apiId,
                                                resourceId: resourceId,
                                                httpMethod: meta.httpMethod,
                                                statusCode: meta.statusCode,
                                                responseTemplates: { 'text/html': html }
                                                },
                                                function(err, data) {
                                                    if(err){
                                                        context.done(err, data);
                                                    }else{
                                                        console.log('Deploy to Test stage');
                                                        apigateway.createDeployment({
                                                            restApiId: apiId,
                                                            stageName: 'test'
                                                        }, function(err, data) {
                                                            console.log(data)
                                                            context.done(err, data);
                                                        });
                                                    }
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                        });
                    }
                });
            }
        );
    };