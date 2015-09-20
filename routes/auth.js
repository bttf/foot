var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var passport = require('passport');
var User = require('../models/user');

router.post('/', passport.authenticate('local', { session: false }), function (req, res) {
  res.json(req.user);
});

router.post('/validate', passport.authenticate('bearer', { session: false }), function (req, res) {
  res.status(200).send('OK');
});

router.post('/invalidate', passport.authenticate('bearer', { session: false }), function (req, res) {
  req.user.token = uuid.v4();
  req.logout();
  res.status(200).send('OK');
});

module.exports = router;
