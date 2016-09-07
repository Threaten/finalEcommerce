//this is a library that help with login
var passport = require('passport');
var strategy = require('passport-local').Strategy;

var User = require('../models/user');

//Serialize and deserialize
passport.serializeUser(function(user, cb) {
  cb(null, user._id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function(err, user) {
    cb(err, user);
  });
});

//Middleware
passport.use('login', new strategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, email, password, cb) {
  User.findOne({ email: email }, function(err, user) {
    if (err) return cb(err);

    if(!user) {
      return cb(null, false, req.flash('msg', 'Wrong login details'));
    }

    if(!user.checkPassword(password)) {
      return cb(null, false, req.flash('msg', "Wrong password"));
    }
    return cb(null, user);
  });
}));

//Validating function
exports.isAuthenticated = function(req, res, cb) {
  if(req.isAuthenticated()) {
    return cb();
  }
  res.redirect('/login');
}
