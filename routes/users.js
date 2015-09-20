var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var uuid = require('uuid');
var User = require('../models/user');

router.get('/', function(req, res, next) {
  User.find(function(err, users) {
    if (err) {
      next(err);
    }

    res.json({
      users: users
    });
  });
});

router.get('/:id', function(req, res, next) {
  User.findById(req.params.user_id, function(err, user) {
    if (err) {
      next(err);
    } else if (!user) {
      next('User not found');
    }

    res.json({
      user: user
    });
  });
});

router.post('/', function(req, res, next) {
  var user = new User();
  var email = req.body.email;
  var password = req.body.password;

  if (email && password) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash) {
        user.email = email;
        user.password = hash;
        user.token = uuid.v4();
        user.save(function(err) {
          if (err) {
            next(err);
          }
          res.json({
            user: user
          });
        });
      });
    });
  }
  else {
    next('Missing arguments');
  }
});

router.put('/:id', function(req, res) {
  User.findById(req.params.user_id, function(err, user) {
    if (err) {
      next(err);
    } else if (!user) {
      next('User not found');
    }

    User.schema.eachPath(function(path) {
      user[path] = req.body.user[path] || user[path];
    });

    user.save(function(err) {
      if (err) {
        next(err);
      }
      res.json({
        user: user
      });
    });
  });
});

module.exports = router;
