var express = require('express');
var router = express.Router();
var firebase = require('firebase');


var ref = new Firebase("https://doublecheckproject.firebaseio.com");
var authData = ref.getAuth();

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
            return res.redirect('/signup');

          } else {
            console.log("Authenticated successfully with payload:", authData);
            console.log(authData);
            ref.onAuth(function(authData) {
               if (authData) {
                // save the user's profile into the database so we can list users,
                // use them in Security and Firebase Rules, and show profiles
                ref.child("users").child(authData.uid).set({
                provider: authData.provider,
                name: getName(authData)
            });
          }
         });

            return res.redirect('/essays');
          }
        });
      }   
   });

});

// straight from firebase API documentation
// https://www.firebase.com/docs/web/guide/user-auth.html
function getName(authData) {
  switch(authData.provider) {
     case 'password':
       return authData.password.email.replace(/@.*/, '');
     case 'twitter':
       return authData.twitter.displayName;
     case 'facebook':
       return authData.facebook.displayName;
  }
}


// Render the login page.
router.get('/login', function(req, res) {
  res.render('login', { title: 'Login' });
});

router.post('/login', function(req, res) {
  var ref = new Firebase("https://doublecheckproject.firebaseio.com");
  var authData = ref.getAuth();

  var user_email = req.body.email;
  var password = req.body.password;

   // Grab user fields.
  if (!password || !user_email) {
    return res.render('login', { title: 'Login', error: 'Email and password required.' }); 
  }

  ref.authWithPassword({
    email    : user_email,
    password : password 
  }, function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
      res.render('login', {title: 'Login', error: 'Incorrect email or password'});
    } else {
      console.log("Authenticated successfully with payload:", authData);
      res.redirect('/essays');
    }
  });

});

function logout(req, res, next) {
  var ref = new Firebase("https://doublecheckproject.firebaseio.com");
  ref.unauth();
  return next();
}

// Logout the user, then redirect to the home page.
router.get('/logout', logout, function(req, res) {
  res.redirect('/');
});

module.exports = router;
