var Firebase = require('firebase');
var ref = new Firebase("https://doublecheckproject.firebaseio.com");

signup_button = document.getElementById('signup-button');
signup_button.addEventListener('click', signup);

function signup () {
    ref.createUser({
      email    : document.getElementById('email');
      password : document.getElementById('password');
    }, function(error, userData) {
      if (error) {
	console.log("Error creating user:", error);
      } else {
	console.log("Successfully created user account with uid:", userData.uid);
      }
    });
};
