var Firebase = require('firebase');
var firebase = new Firebase('https://doublecheckproject.firebaseio.com/');

//set these variables dynamically?
var user = 'hillaryClinton';
var name = 'hillary_graduation';

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

