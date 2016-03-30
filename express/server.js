// server.js

// set up ======================================================================
// get all the tools we need
var firebase = require('firebase');
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var path = require('path');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// socket.io
var http = require('http').Server(app);
var io = require('socket.io')(http);

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'jade'); // set up jade for templating

app.use(express.static(path.join(__dirname, 'public')));
// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// socket.io
io.on('connection', function(socket){
      console.log('a user connected');
});

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// file uploads ================================================================
function readTextFile(file)
    {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    var allText = rawFile.responseText;
                    alert(allText);
                }
            }
        }
    rawFile.send(null);
}


var multer = require( 'multer' );
var upload = multer( { dest: 'uploads/' } );
var essays = new Firebase('https://doublecheckproject.firebaseio.com/queue/essays')
app.post( '/upload', upload.single( 'file' ), function( req, res, next ) {
    readTextFile(req.file.path); //need to append file://
    essays.push(req.file);
    return res.status( 200 ).send( req.file );
});

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
