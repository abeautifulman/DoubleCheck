var express = require('express');
var router = express.Router();
var firebase = require('firebase');

router.get('/essays', authenticate, function(req, res) {
  var ref = new Firebase("https://doublecheckproject.firebaseio.com");
  var authData = ref.getAuth();

  ref.child('users').child(authData.uid).child('proofreads').once('value', function(snap) {
    var essays = snap.val();
    
    res.render('essays', {
      title: 'Essays', 
      user: getName(authData),
      essay: essays.essay2.text
    });

    console.log("Proofreads:");
    console.log(essays);
  });

  console.log("User Data:");
  console.log(authData.uid);
});


function authenticate(req, res, next) {
  var ref = new Firebase("https://doublecheckproject.firebaseio.com");
  var authData = ref.getAuth(); 
  if (authData) {
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
    return next();
  } else {
    console.log("User is logged out");
    res.redirect('/login');
  }
}

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

module.exports = router;
