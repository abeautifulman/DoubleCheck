var express = require('express');
var router = express.Router();
//var passport = require('passport');
//var stormpath = require('express-stormpath');
var stormpath = require('express-stormpath');
var firebase  = require('firebase');


// Render the home page.
router.get('/', function(req, res) {
  res.render('index', { title: 'Home', user: req.user });
});


router.get('/modal', function(req, res) {
  res.render('modal_example', { title: 'Home', user: req.user });
});

router.get('/admin', function(req, res) {
  res.render('admin', { title: 'Home', user: req.user });
});

router.get('/essays', function(req, res) {
  res.render('essays', { title: 'Home', user: req.user });
});

router.get('/signup', function(req, res) {
  res.render('signup', { title: 'Home', user: req.user });
});

router.post('/signup', function(req, res) {

  console.log(req.body);

  var username = req.body.firstname;
  var user_email    = req.body.email;
  var password = req.body.password;

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
      }   
   }); 

});




module.exports = router;
