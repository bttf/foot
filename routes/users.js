var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var uuid = require('uuid');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({ host: 'localhost:9200' });

var index = 'sock';
var type = 'users';

router.get('/', function(req, res) {
  client.search({
    index: index,
    type: type,
    q: '*',
    size: 100
  }).then(function (response) {
    var users = [];
    response.hits.hits.forEach(function (hit) {
      var user = hit._source;
      user.id = hit._id;
      users.push(user);
    });
    res.json({
      users: users
    });
  });
});

router.get('/:id', function(req, res, next) {
  client.get({
    index: index,
    type: type,
    id: req.params.id
  }).then(function (response) {
    var user = response._source;
    user.id = response._id;
    res.json({
      user: user
    });
  }, function (err) {
    next(err);
  });
});

router.post('/', function(req, res) {
  var user = {};
  user.email = req.body.email;
  user.password = req.body.password;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      user.token = uuid.v4();

      client.create({
        index: index,
        type: type,
        body: user
      }).then(function (response) {
        client.indices.refresh({
          index: index
        }).then(function() {
          user.id = response._id;
          res.json({
            user: user
          });
        });
      }, function (err) {
        next(err);
      });
    });
  });
});

router.put('/:id', function(req, res) {
  client.update({
    index: index,
    type: type,
    id: req.params.id,
    body: {
      doc: req.body.user
    }
  }).then(function (response) {
    var user = req.body.user;
    user.id = response._id;
    res.json({
      user: user 
    });
  });
});

module.exports = router;

