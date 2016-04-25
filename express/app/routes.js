var express = require('express');
var router = express.Router();
var firebase  = require('firebase');

var ref = new Firebase("https://doublecheckproject.firebaseio.com");
var authData = ref.getAuth();

if (authData) {
  console.log("User " + authData.uid + " is logged in with " + authData.provider);
} else {
  console.log("User is logged out");
}

// Render the home page.
router.get('/', function(req, res) {
  res.render('index', { title: 'Home', user: req.user });
});

function LoggedIn(req, res, next) {

  if (authData) {
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
    return next();
  } else {
   console.log("User is logged out");
   res.redirect('/login');
  }
}


module.exports = router;
