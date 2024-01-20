const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

if (!process.env.S3_USC_BUCKET_NAME) throw new Error('S3_USC_BUCKET_NAME must be defined in env');
if (!process.env.S3_USC_BUCKET_ENDPOINT) throw new Error('S3_USC_BUCKET_ENDPOINT must be defined in env');
if (!process.env.S3_USC_BUCKET_REGION) throw new Error('S3_USC_BUCKET_REGION must be defined in env');
if (!process.env.AWS_ACCESS_KEY_ID) throw new Error('AWS_ACCESS_KEY_ID must be defined in env');
if (!process.env.AWS_SECRET_ACCESS_KEY) throw new Error('AWS_SECRET_ACCESS_KEY must be defined in env');

// AWS.config.loadFromPath('./credentials-ehl.json');



module.exports = {
    async beforeCreate(event) {
        console.log('>>> beforeCreate!');
        
    },

    // when strapi deletes a USC, we delete the related files in the S3 bucket.
    async afterDelete(event) {

        console.log('>>> afterDelete');
        console.log(event);

        const { result } = event;

        

        // a client can be shared by different commands.
        const client = new S3Client({ 
            endpoint: process.env.S3_USC_BUCKET_ENDPOINT,
            region: process.env.S3_USC_BUCKET_REGION
        });
        // https://fp-usc-dev.s3.us-west-000.backblazeb2.com/GEB7_QcaUAAQ29O.jpg

        const res = await client.send(new DeleteObjectCommand({
            Bucket: process.env.S3_USC_BUCKET_NAME,
            Key: result.key
        }));

        console.log(res);



        // var s3 = new S3();
        // var params = { Bucket: process.env.S3_USC_BUCKET, Key: 'your object' };

        // const res = await s3.deleteObject(params).promise();

        // console.log('deletion complete.');
        // console.log(res);
        
        // , function(err, data) {
        //     if (err) console.log(err, err.stack);  // error
        //     else     console.log();                 // deleted
        // });
    }
}