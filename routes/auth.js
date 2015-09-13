var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var passport = require('passport');
var client = require('../esClient');

var index = 'sock';
var type = 'users';

router.post('/', passport.authenticate('local', { session: false }), function (req, res) {
  res.json(req.user);
});

router.post('/validate', passport.authenticate('bearer', { session: false }), function (req, res) {
  res.status(200).send('OK');
});

router.post('/invalidate', passport.authenticate('bearer', { session: false }), function (req, res) {
  var token = uuid.v4();
  client.update({
    index: index,
    type: type,
    id: req.user.id,
    body: {
      doc: { token: token }
    }
  }).then(function (response) {
    client.indices.refresh({
      index: 'sock'
    }).then(function() {
      res.status(200).send('OK');
    });
  }, function (err) {
    res.status(500).send(err);
  });
});

module.exports = router;
