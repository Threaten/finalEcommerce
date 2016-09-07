var router = require('express').Router();
var passport = require('passport');
var config = require('../config/passport');
var async = require('async');

var User = require('../models/user');
var Cart = require('../models/cart');

router.get('/login', function(req, res) {
  if (req.user) return res.redirect('/');
  res.render('users/login', { message: req.flash('msg')});
})

router.post('/login', passport.authenticate('login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/profile', function(req, res, cb) {
  if (!req.user) {
    res.redirect('/login');
  }
  User.findOne({ _id: req.user._id }, function(err, user) {
    if (err) return cb(err);
    res.render('users/profile', { user: user });
  });
});

router.get('/register', function(req, res, cb) {
  res.render('users/register', {
    error: req.flash('error')
  });
});

router.post('/register', function(req, res, cb) {
  async.waterfall([
    function(callback) {
      var user = new User();

      user.email = req.body.email;
      user.password = req.body.password;
      user.profile.name = req.body.name;
      user.profile.profile_img = user.avatar();
      user.profile.address = req.body.address;
      User.findOne({ email: req.body.email}, function(err, userExisted) {
        if (userExisted) {
          req.flash('error', "Account with the provided Email is existed");
          //console.log(req.body.email + " is existed");
          return res.redirect('/register');
        } else {
          user.save(function(err, user) {
            if (err) return cb(err);
            //res.json("User created");
            callback(null, user);
          });
        }
      });
    },
    function(user) {
      var cart = new Cart();
      cart.owner = user._id;
      cart.save(function(err) {
        if (err) return cb(err);
        req.logIn(user, function(err) {
          if (err) return cb(err);
          res.redirect('/profile');
        });
      });
    }
  ]);
});

router.get('/logout', function(req, res, cb) {
  req.logout();
  res.redirect('/');
});

router.get('/editProfile', function(req, res, cb) {
  res.render('users/editProfile.ejs', { message: req.flash('OK')});
});

router.post('/editProfile', function(req, res ,cb) {
  User.findOne({ _id: req.user._id }, function(err, user) {
    if (err) return cb(err);
    if (req.body.name) user.profile.name = req.body.name;
    if (req.body.address) user.profile.address = req.body.address;

    user.save(function(err) {
      if (err) return cb(err);
      req.flash('OK', "User Profile edited");
      return res.redirect('/profile');
    });
  });
});

module.exports = router;
