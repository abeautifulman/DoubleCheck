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

// routes ======================================================================
var routes = require('./app/routes');
var auth   = require('./app/auth');
var essays = require('./app/essays');
app.use('/', routes);
app.use('/', auth);
app.use('/', essays);


// launch ======================================================================
//app.listen(port);
//console.log('The magic happens on port ' + port);

app.listen(port, function () {
  console.log('Doublecheck is launched on port ' + port);
});

