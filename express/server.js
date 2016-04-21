// server.js

// set up ======================================================================
// get all the tools we need
var firebase = require('firebase');
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8083;
var passport = require('passport');
var flash    = require('connect-flash');

var path = require('path');
var favicon = require('static-favicon');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

// socket.io
var http = require('http').Server(app);
var io = require('socket.io')(http);

// file reading
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
// AWS file uploading
var aws = require('aws-sdk');

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

// set up our express application
app.use(favicon());
app.use(logger('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded());
app.use(bodyParser()); // get information from html forms
app.use(cookieParser());


app.set('view engine', 'jade'); // set up jade for templating

app.use(express.static(path.join(__dirname, 'public')));
// required for passport
//app.use(passport.initialize());
//app.use(passport.session()); // persistent login sessions
//app.use(flash()); // use connect-flash for flash messages stored in session

/* socket.io
io.on('connection', function(socket){
      console.log('a user connected');
}); */

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
var essays = new Firebase('https://doublecheckproject.firebaseio.com/queue/essays')
app.post('/upload', upload.single('file'), function(req, res, next) {
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


app.get('/sign_s3', function(req, res){
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

// routes ======================================================================
var routes = require('./app/routes');
var auth   = require('./app/auth');
app.use('/', routes);
app.use('/', auth);


// launch ======================================================================
//app.listen(port);
//console.log('The magic happens on port ' + port);

app.listen(port, function () {
  console.log('Doublecheck is launched on port ' + port);
});

