var bcrypt = require('bcrypt');
var uuid = require('uuid');
var client = require('./esClient');
var LocalStrategy = require('passport-local').Strategy;

var index = 'sock';
var type = 'users';

module.exports = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function (email, password, done) {
  client.search({
    index: index,
    type: type,
    q: 'email:' + email
  }).then(function (response) {
    if (response.hits.hits.length) {
      var user = response.hits.hits[0]._source;
      var id = response.hits.hits[0]._id;
      bcrypt.compare(password, user.password, function(err, res) {
        if (err) {
          return done(err);
        } else if (!res) {
          return done(null, false, { message: 'Invalid password.' });
        }
        var token = uuid.v4();
        client.update({
          index: index,
          type: type,
          id: id,
          body: {
            doc: { token: token }
          }
        }).then(function (results) {
          client.indices.refresh({
            index: 'sock'
          }).then(function() {
            return done(null, { id: id, email: user.email, token: token });
          });
        }, function (err) {
          return done(err);
        });
      });
    } else {
      return done(null, false, { message: 'User ' + email + ' not found.' });
    }
  }, function(err) {
    return done(err);
  });
});
