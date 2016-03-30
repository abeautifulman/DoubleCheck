var express = require('express');
var router = express.Router();
var passport = require('passport');
//var stormpath = require('express-stormpath');
var stormpath = require('express-stormpath');


// Render the home page.
router.get('/', function(req, res) {
  res.render('index', { title: 'Home', user: req.user });
});


router.get('/control', isDEV, isLoggedIn, stormpath.loginRequired, function(req,res) {
    res.render('control', {
      user : req.user
    });
});

router.get('/disabled_control', isLoggedIn, stormpath.loginRequired, function(req,res) {
    res.render('disabled_control', {
      user : req.user
    });
});

router.get('/status', isLoggedIn, function(req,res) {
  res.render('status', {
    user : req.user
  });
});

router.get('/info', function(req,res) {
  res.render('data', {
    user : req.user
  });
});

router.get('/about', function(req,res) {
  res.render('about', {
    user : req.user
  });
});

router.get('/dev', function(req,res) {
  res.render('devlog', {
    user : req.user
  });
});


function isLoggedIn(req, res, next) {
  
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}

function isNASA(req, res, next) {

  group = "NASA"
  req.user.getGroups({ name: group }, function(err, groups) {
    groups.each(function(group, cb) {
      console.log(group.name);
      if (group.name == "NASA") {
        return next();
      }
      cb();
    }, function(err) {
    console.log('Finished iterating over groups.');
    });
  });
}

function isDEV(req, res, next) {

  group = "Dev"
  req.user.getGroups({ name: group }, function(err, groups) {
    groups.each(function(group, cb) {
      console.log(group.name);
      if (group.name == "Dev") {
        return next();
      }
      cb();
    }, function(err) {
    console.log('Finished iterating over groups.');
    res.redirect('/disabled_control');
    });
  });
}

module.exports = router;
