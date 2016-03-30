var express = require('express');
var router = express.Router();
//var passport = require('passport');
//var stormpath = require('express-stormpath');
var stormpath = require('express-stormpath');


// Render the home page.
router.get('/', function(req, res) {
  res.render('animations', { title: 'Home', user: req.user });
});


router.get('/modal', function(req, res) {
  res.render('modal_example', { title: 'Home', user: req.user });
});

router.get('/admin', function(req, res) {
  res.render('admin', { title: 'Home', user: req.user });
});



module.exports = router;
