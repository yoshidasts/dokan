/* Initialize API Gateway 
   Source JSON is the response data of "getMethod" function adding "api" and "resource" properties.
*/

var aws = require('aws-sdk');
var s3 = new aws.S3();
var apigateway = new aws.APIGateway();
    
exports.handler = function(event, context){
    console.log(event.Records[0].s3.object);
    // Get S3 Object
    s3.getObject({
        Bucket: event.Records[0].s3.bucket.name,
        Key: event.Records[0].s3.object.key
        },
        function(err, data) {
            var conf = JSON.parse(data.Body.toString());
            console.log(conf);
            
            // Get Rest API Id
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
                        // Get Resourcr Id
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
                                // Get Method
                                console.log('API ID:'+apiId + ' Resource ID:' + resourceId + ' HTTP Method:' + conf.httpMethod);
                                apigateway.getMethod({
                                    restApiId: apiId,
                                    resourceId: resourceId,
                                    httpMethod: conf.httpMethod
                                    },
                                    function(err, data) {
                                        if(err && err['NotFoundException'] == ''){
                                            console.log('koko');
                                            console.log(err);
                                            context.done(err);
                                        }else{
                                            // Method is exited.
                                            if(data){
                                                console.log('Detele Existing Method');
                                                apigateway.deleteMethod({
                                                    restApiId: apiId,
                                                    resourceId: resourceId,
                                                    httpMethod: conf.httpMethod
                                                    },
                                                    function(err, data) {
                                                        if(err){
                                                            context.done(err);
                                                        }else{
                                                            creates(apiId, resourceId, conf, context); 
                                                       }
                                                    }
                                                );
                                            }else{
                                                creates(apiId, resourceId, conf, context); 
                                            }
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

// Common function to create API Methods
var creates = function(apiId, resourceId, conf, context){
    //Put Method
    console.log('Create New Method');
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
                //New Method Response
                console.log('Create New Method Response');
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
                            //Put Integration
                            var integration = conf.methodIntegration;
                            console.log('Create New Integration');
                            apigateway.putIntegration({
                                restApiId: apiId,
                                resourceId: resourceId,
                                httpMethod: conf.httpMethod,
                                type: integration.type,
                                credentials: integration.credentials,
                                integrationHttpMethod: integration.httpMethod,
                                uri: integration.uri,
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
                                        console.log('Create New Integration Response');
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
                                                    //Deploy to Test Stage
                                                    console.log('Deploy to Test Stage');
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
                    }
                );
            }
        }
    );
}