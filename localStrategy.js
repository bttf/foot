var LocalStrategy = require('passport-local');

var index = 'sock';
var type = 'users';

module.exports = new LocalStrategy(function (email, password, done) {
  // es - find user by email
  client.search({
    index: index,
    type: type,
    q: 'email:' + email
  }, function (err, response) {
    if (err) {
      console.log('error w/ localStrategy', err);
      done(err);
    }
    console.log('auth success', response);
    done(null, { email: email, token: '1234' });
  });

  // call done(null, user) on success
  // call done(null, false) on fail
  // call done(err) on err
});
