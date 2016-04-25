var Firebase = require('firebase');
var ref = new Firebase("https://doublecheckproject.firebaseio.com");

console.log(ref.getAuth());

ref.child('users').child(ref.getAuth().uid).child('proofreads').once('value', function(snap) {
    var essays = snap.val();
    console.log("Proofreads:");
    console.log(essays);
});
