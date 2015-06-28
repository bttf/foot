var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var uuid = require('uuid');
var passport = require('passport');

var index = 'sock';
var type = 'bookmarks';

router.post('/', passport.authenticate('local', { session: false }), function(req, res) {
  res.json(req.user);
});

module.exports = router;
