var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var schema = mongoose.Schema;
/* User */
var userSchema = new mongoose.Schema({
  email: {type: String, unique: true, lowercase: true},
  password: String,

  profile: {
    name: {type: String, default: ''},
    profile_img: {type: String, default: ''},
    address: {type: String, default: ''},
  },
    history: [{
      date: Date,
      cost: {type: Number, default: 0},
      //item: {type: schema.Types.ObjectId, ref: ''}
    }]
});

/* Password Encryption using BCrypt */
userSchema.pre('save', function(cb) {
  var user = this;

  if(!user.isModified('password')) return cb();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return cb(err);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return cb(err);
      user.password = hash;
      cb();
    });
  });
});

/* Password Comparison */
userSchema.methods.checkPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

//
userSchema.methods.avatar = function(size) {
  if (!this.size) size = 200;
  if (!this.email) return 'https://gravatar.com/avatar/?s' + size + '&d=retro';
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/?s'+ md5 + '?s=' + size + '%d=retro';
}

module.exports = mongoose.model('user', userSchema);
