var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var aws = require('aws-sdk');
var http = require('xmlhttprequest').XMLHttpRequest;

// file uploads ================================================================
var multer = require( 'multer' );
var result = ''; 
var upload = multer({
    dest: 'uploads/',
    inMemory: true,
    onFileUploadData: function(file, data) {    
        result += data;
    },  
    onFileUploadComplete: function(file) {
        alert(result);
        console.log(result);
    }   
});

router.post('/upload', upload.single('file'), function(req, res, next) {
    //http://stackoverflow.com/questions/27029229/how-to-programmatically-create-folders-in-s3-with-js-browser-sdk
    var new_file_name = 'user/'+$scope.account.name.split(' ').join('_').toLowerCase()+'/'+$scope.io.file.name.split(' ').join('_').toLowerCase();
    AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
    AWS.config.region = 'us-east-1';
    var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket }});
    var params = {
      Key: new_file_name,
      ContentType: $scope.io.file.type,
      Body: $scope.io.file,
      ACL: 'public-read'
    };
    bucket.putObject(params, function (err, data) {
      $scope.io.Attchment_URL = 'https://###.s3-us-west-1.amazonaws.com/' + new_file_name;
      $scope.io.$save(function(){
        $location.path("/insertionOrders/all");
      });
    }).on('httpUploadProgress',function(progress) {
      console.log(Math.round(progress.loaded / progress.total * 100) + '% done');
    });
    return res.status( 200 ).send( req.file );
});

router.get('/sign_s3', function(req, res){
    aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
    var s3 = new aws.S3();
    var s3_params = {
        Bucket: S3_BUCKET,
        Key: req.query.file_name,
        Expires: 60,
        ContentType: req.query.file_type,
        ACL: 'public-read'
    };
    s3.getSignedUrl('putObject', s3_params, function(err, data){
        if(err){
            console.log(err);
        }
        else{
            var return_data = {
                signed_request: data,
                url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+req.query.file_name
            };
            res.write(JSON.stringify(return_data));
            res.end();
        }
    });
});

module.exports = router;
