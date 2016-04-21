var Firebase = require('firebase');
var ref = new Firebase("https://doublecheckproject.firebaseio.com");

signup_button = document.getElementById('signup-button');
signup_button.addEventListener('click', signup);

function signup () {
    ref.createUser({
      email    : document.getElementById('input-32');
      password : document.getElementById('input-33');
    }, function(error, userData) {
      if (error) {
	console.log("Error creating user:", error);
      } else {
	console.log("Successfully created user account with uid:", userData.uid);
      }
    });
};
