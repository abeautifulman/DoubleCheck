var Firebase = require("firebase");
var UserData = new Firebase('https://marsoasis.firebaseio.com/users');

user = UserData.child("hillaryClinton"); // replace this with actual user 

$('#essay-name').text("hillary clinton");

proofreads = user.child("proofreads");
console.log("jo");
essay = proofreads.child("hillary_graduation"); // replace this with a loop over all proofreads

essay.child("stats").once('value', function(snapshot) { 
    var obj = snapshot.val();
    var arr = Object.keys(obj).map(function (key) {return obj[key]}); // this is where we can implement progression of essay
    $('#grammar-errors').text(arr[0]['grammar-errors']); 
});    

essay.child("errors").once('value', function(snapshot) {
    var obj = snapshot.val();
    var arr = Object.keys(obj).map(function (key) {return obj[key]}); // this is where we can implement progression of essay
    $('#spelling-errors').text(arr[0]['spelling-errors']); 
});    


