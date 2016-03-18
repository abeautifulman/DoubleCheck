// server.js

// set up ======================================================================
// get all the tools we need
var firebase = require('firebase');
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
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

var StormpathStrategy = require('passport-stormpath');
var stormpath = require('express-stormpath');


var strategy = new StormpathStrategy();
passport.use(strategy);
passport.serializeUser(strategy.serializeUser);
passport.deserializeUser(strategy.deserializeUser);



// configuration ===============================================================

require('./config/passport')(passport); // pass passport for configuration
// required for passport
app.use(session({
    secret: process.env.EXPRESS_SECRET,
    key: 'sid',
    cookie: {secure: false},
}));


// set up our express application
app.use(favicon());
app.use(logger('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(cookieParser());


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

// file uploads ================================================================
var multer =  require( 'multer' );
var upload = multer( { dest: 'uploads/' } );
var essays = new Firebase('https://doublecheckproject.firebaseio.com/queue/essays')
app.post( '/upload', upload.single( 'file' ), function( req, res, next ) {
       essays.push(req.file);
       return res.status( 200 ).send( req.file );  
});

// routes ======================================================================
var index_routes = require('./routes/index');
var auth_routes = require('./routes/auth');
app.use('/', index_routes);
app.use('/', auth_routes);


app.use(stormpath.init(app, {

  web: {
    login: {
      enabled: false
    },
    logout: {
      enabled: false
    },
    me: {
      enabled: false
    },
    oauth2: {
      enabled: false
    },
    register: {
      enabled: false
    }
  },
  expandCustomData: true
}));


// launch ======================================================================
//app.listen(port);
//console.log('The magic happens on port ' + port);
app.on('stormpath.ready', function () {
  app.listen(port);
  console.log('Doublecheck is launched on port ' + port);
});

