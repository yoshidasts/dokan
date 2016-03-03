var aws = require('aws-sdk');
var s3 = new aws.S3();

exports.handler = function(event, context){
    s3.putObjectAcl({
        Bucket: event.Records[0].s3.bucket.name,
        Key: event.Records[0].s3.object.key,
        ACL: 'public-read'
        },
        function(err, data) {
            console.log(data);
            context.done(err, data);
        }
    );
};