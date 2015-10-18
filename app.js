var express    = require('express');
var path       = require('path');
var logger     = require('morgan');
var bodyParser = require('body-parser');
var routes     = require('./routes/index');
var cors       = require('cors');
var passport   = require('passport');
var bookmarks  = require('./routes/bookmarks');
var users      = require('./routes/users');
var auth       = require('./routes/auth');
var search     = require('./routes/search');
var mongoose   = require('./mongoClient');

var app = express();

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(passport.initialize());
app.use(parseToken);
passport.use(require('./localStrategy'));
passport.use(require('./bearerStrategy'));

app.use('/', routes);
app.use('/auth', auth);
app.use('/bookmarks', passport.authenticate('bearer', { session: false }), bookmarks);
app.use('/users', users);
app.use('/search', passport.authenticate('bearer', { session: false }), search);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err,
      title: 'error'
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {},
    title: 'error'
  });
});

module.exports = app;

function parseToken(req, res, next) {
  if (req.headers['auth-token']) {
    req.query['access_token'] = req.headers['auth-token'];
  }
  next();
}

