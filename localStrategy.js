var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var User = require('./models/user');
var config = require('./config');

module.exports = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function (email, password, done) {
  User.findOne({ email: email }, function(err, user) {
    if (err) {
      return done(err);
    } else if (!user) {
      return done(null, false, { message: 'User not found' } );
    }

    bcrypt.compare(password, user.password, function(err, res) {
      if (err) {
        return done(err);
      } else if (!res) {
        return done(null, false, { message: 'Invalid password' });
      }
      user.token = jwt.sign(user, config.secret, {
        expiresIn: '7d',
      });
      return done(null, user);
    });
  });
});
