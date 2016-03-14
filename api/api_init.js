/* Initialize API Gateway 
   Source JSON is the response data of "getMethod" function
*/

var aws = require('aws-sdk');
var s3 = new aws.S3();
var apigateway = new aws.APIGateway();
    
exports.handler = function(event, context){
    s3.getObject({
        Bucket: event.Records[0].s3.bucket.name,
        Key: event.Records[0].s3.object.key
        },
        function(err, data) {
            var conf = JSON.parse(data.Body.toString());
            console.log(conf);
            apigateway.getRestApis(function(err, data) {
                var apiId;
                if(err){
                    context.done(err);
                }else{
    
                    for(var i in data.items)
                    {
                        if(data.items[i].name == conf.api) apiId = data.items[i].id;
                    }
                    if(!apiId) {
                        console.log(data);
                        context.done("Rest API is not found", conf.api)
                    }else{
                        apigateway.getResources({restApiId: apiId}, function(err, data) {
                            var resourceId;
                            for(var i in data.items)
                            {
                                if(data.items[i].path == conf.resource) resourceId = data.items[i].id;
                            }
                            if(!resourceId) {
                                console.log(data);
                                context.done("Resource is not found", conf.resource)
                            }else{
                                // Put Method
                                console.log('API ID:'+apiId + ' Resource ID:' + resourceId + ' HTTP Method:' + conf.httpMethod);
                                apigateway.putMethod({
                                    restApiId: apiId,
                                    resourceId: resourceId,
                                    httpMethod: conf.httpMethod,
                                    authorizationType: conf.authorizationType,
                                    apiKeyRequired: conf.apiKeyRequired
                                    },
                                    function(err, data) {
                                        if(err){
                                            context.done(err);
                                        }else{
                                            //Put Method Response
                                            apigateway.putMethodResponse({
                                                restApiId: apiId,
                                                resourceId: resourceId,
                                                httpMethod: conf.httpMethod,
                                                statusCode: '200',
                                                responseModels: conf.methodResponses["200"].responseModels
                                                },
                                                function(err, data) {
                                                    if(err){
                                                        context.done(err);
                                                    }else{
                                                        var integration = conf.methodIntegration;
                                                        //Put Integration
                                                        apigateway.putIntegration({
                                                            restApiId: apiId,
                                                            resourceId: resourceId,
                                                            httpMethod: conf.httpMethod,
                                                            type: integration.type,
                                                            cacheNamespace: conf.cacheNamespace,
                                                            cacheKeyParameters: conf.cacheKeyParameters,
                                                            requestParameters: integration.requestParameters,
                                                            requestTemplates: integration.requestTemplates
                                                            },
                                                            function(err, data) {
                                                                if(err){
                                                                    context.done(err);
                                                                }else{
                                                                    //Put Integration Response
                                                                    apigateway.putIntegrationResponse({
                                                                        restApiId: apiId,
                                                                        resourceId: resourceId,
                                                                        httpMethod: conf.httpMethod,
                                                                        statusCode: '200',
                                                                        selectionPattern: integration.integrationResponses["200"].selectionPattern,
                                                                        responseTemplates : integration.integrationResponses["200"].responseTemplates
                                                                        },
                                                                        function(err, data) {
                                                                            if(err){
                                                                                context.done(err);
                                                                            }else{
                                                                                context.done(err,data);
                                                                            }
                                                                        }
                                                                    );
                                                                }
                                                            }
                                                        );
                                                    }
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                        });
                    }
                }
            });
        }
    );
};