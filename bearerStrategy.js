var BearerStrategy = require('passport-http-bearer').Strategy;
var bcrypt = require('bcrypt');
var User = require('./models/user');

module.exports = new BearerStrategy(
  function (token, done) {
    User.findOne({ token: token }, function(err, user) {
      if (err) {
        return done(err);
      } else if (!user) {
        return done(null, false, { message: 'User not found' } );
      }
      return done(null, user);
    });
  }
);
