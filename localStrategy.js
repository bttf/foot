var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var uuid = require('uuid');
var User = require('./models/user');

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
      user.token = uuid.v4();
      user.save(function(err) {
        if (err) {
          return done(err);
        } 

        return done(null, user);
      });
    });
  });
});
