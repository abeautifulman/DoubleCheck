var Firebase = require('firebase');
var firebase = new Firebase('https://doublecheckproject.firebaseio.com/');

//set these variables dynamically?
var user = 'hillaryClinton';
var name = 'hillary_graduation';

var error_ref = firebase.child('users').child(user).child('proofreads').child(name).child('errors');

var errors = []

error-ref.on('value', function(snap) {
    var obj = snap.val();
    var arr = Object.keys(obj).map(function (key) {return obj[key]});
    console.log(arr);
});
