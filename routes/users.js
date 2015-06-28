var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var uuid = require('uuid');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({ host: 'localhost:9200' });

var index = 'sock';
var type = 'users';

router.get('/:id', function(req, res) {
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
        user.id = response._id;
        res.json({
          user: user
        });
      });
    });
  });
});

module.exports = router;
