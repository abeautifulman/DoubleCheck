var express = require('express');
var router = express.Router();
var firebase = require('firebase');


// Render the home page.
router.get('/', function(req, res) {
  res.render('index', { title: 'Home', user: req.user });
});


router.get('/signup', function(req, res) {
  res.render('signup', { title: 'Signup'}); 
});

router.post('/signup', function(req, res) {

  console.log(req.body);

  var username      = req.body.firstname;
  var user_email    = req.body.email;
  var password      = req.body.password;

  // Grab user fields.
  if (!username || !password || !user_email) {
    return res.render('signup', { title: 'Signup', error: 'Email and password required.' }); 
  }

  var ref = new Firebase("https://doublecheckproject.firebaseio.com");
  ref.createUser({
    email    : user_email,
    password : password 
    }, function(error, userData) {
      if (error) {
        console.log("Error creating user:", error);
      } else {
        console.log("Successfully created user account with uid:", userData.uid);
        ref.authWithPassword({
          email    : user_email,
          password : password 
        }, function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
              return res.redirect('/admin');
          }
        });
      }   
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
