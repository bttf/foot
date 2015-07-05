var BearerStrategy = require('passport-http-bearer').Strategy;
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({ host: 'localhost:9200' });

var index = 'sock';
var type = 'users';

module.exports = new BearerStrategy(
  function (token, done) {
    client.search({
      index: index,
      type: type,
      q: 'token:' + token
    }).then(function (response) {
      if (response.hits.hits.length) {
        var id = response.hits.hits[0]._id;
        var email = response.hits.hits[0]._source.email;
        return done(null, { id: id, email: email, token: token });
      } else {
        return done(null, false);
      }
    }, function(err) {
      return done(err);
    });
  }
);
