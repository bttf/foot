var BearerStrategy = require('passport-http-bearer').Strategy;
var jwt = require('jsonwebtoken');
var config = require('./config');

module.exports = new BearerStrategy(
  function (token, done) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return done(err);
      } 
      return done(null, decoded);
    });
  }
);
