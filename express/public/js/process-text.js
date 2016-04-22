var Firebase = require('firebase');
var firebase = new Firebase('https://doublecheckproject.firebaseio.com/');

var current_essay = 'Upload an essay!' // default (no essays)

var authData = firebase.getAuth(); // is the user logged in?
if (authData) {
  console.log("Authenticated user with uid:", authData.uid);
  var user = authData.uid;
  var proofread_ref = firebase.child('users').child(user).child('proofreads');
  proofread_ref.on('val', function(snap) {
    var arr = snap.val();
    console.log(arr);
  });
}

var essay_ref = firebase.child('users').child(user).child('proofreads').child(name);

var text, errors;

essay_ref.on('value', function(snap) {
    var obj = snap.val();
    text = Object.keys(obj['text']).map(function (key) {return obj['text'][key]});
    $('#essay-text').text(text);
    errors = Object.keys(obj['errors']).map(function (key) {return obj['errors'][key]});
    for (var i=0; i<errors.length; i++) { // history of errors
        for (var j=0; j<errors[i].length; j++) { // list of error objects
            $("#essay-text:contains("+errors[i][j].string+")").css("color", "red");
            console.log('type: ' + errors[i][j].type + ' string: ' + errors[i][j].string);
            //console.log(errors[i][j]);
        }
    }
});
