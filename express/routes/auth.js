var express = require('express');
var router = express.Router();
var passport = require('passport');
var stormpath = require('stormpath');


// Render the home page.
router.get('/', function(req, res) {
  res.render('index', { title: 'Home', user: req.user });
});


// Render the registration page.
router.get('/signup', function(req, res) {
  res.render('signup', { title: 'Signup', error: req.flash('error')[0] });
});


// Signup a new user to Stormpath.
router.post('/signup', function(req, res) {

  var first    = req.body.firstName;
  var last     = req.body.lastName;
  var username = req.body.username;
  var password = req.body.password;

  // Grab user fields.
  if (!username || !password || !group) {
    return res.render('signup', { title: 'Signup', error: 'Email and password required.' });
  }

  // Initialize our Stormpath client.
  var apiKey = new stormpath.ApiKey(
    process.env['STORMPATH_API_KEY_ID'],
    process.env['STORMPATH_API_KEY_SECRET']
  );
  var spClient = new stormpath.Client({ apiKey: apiKey });

  // Grab our app, then attempt to create this user's account.
  var app = spClient.getApplication(process.env['STORMPATH_APP_HREF'], function(err, app) {
    if (err) throw err;

    app.createAccount({
      givenName: first,
      surname: last,
      username: username,
      email: username,
      password: password,

    }, function (err, createdAccount) {
      if (err) {
        return res.render('signup', {'title': 'Signup', error: err.userMessage });
      } else {
          console.log("acount created successfully!");
          });
         });

        passport.authenticate('stormpath')(req, res, function () {
        console.log(createdAccount);
          return res.redirect('/profile');
        });
      }
    });

  });
});


// Render the login page.
router.get('/login', function(req, res) {
  res.render('login', { title: 'Login', error: req.flash('error')[0] });
});


// Logout the user, then redirect to the home page.
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


// Authenticate a user.
router.post(
  '/login',
  passport.authenticate(
    'stormpath',
    {
      successRedirect: '/profile',
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.',
    }
  )
);


// Render the profile page.
router.get('/profile', function (req, res) {
  if (!req.user || req.user.status !== 'ENABLED') {
    return res.redirect('/login');
  }

  res.render('profile', {
    title: 'Profile',
    user: req.user
    }
  );
});

module.exports = router;
