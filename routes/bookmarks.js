var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'localhost:9200',
    //log: 'trace'
});

var index = 'sock';
var type = 'bookmarks';

router.post('/', function(req, res) {
  var bookmark = {};
  for (var key in req.body.bookmark) {
    bookmark[key] = req.body.bookmark[key];
  }
  client.create({
    index: index,
    type: type,
    body: bookmark
  }).then(function (response) {
    bookmark.id = response._id;
    res.json({
      bookmark: bookmark
    });
  });
});

router.get('/', function(req, res) {
  client.search({
    index: index,
    type: type,
    q: '*',
    size: 50
  }).then(function (response) {
    var bookmarks = [];
    response.hits.hits.forEach(function(hit) {
      var bookmark = hit._source;
      bookmark.id = hit._id;
      bookmarks.push(bookmark);
    });
    res.json({
      bookmarks: bookmarks
    });
  });
});

router.get('/:id', function(req, res) {
  client.get({
    index: index,
    type: type,
    id: req.params.id
  }).then(function(response) {
    var bookmark = response._source;
    bookmark.id = response._id;
    res.json({
      bookmark: bookmark
    });
  });
});

router.put('/:id', function(req, res) {
  client.update({
    index: index,
    type: type,
    id: req.params.id,
    body: {
      doc: req.body.bookmark
    }
  }).then(function(response) {
    console.log(response);
    var bookmark = req.body.bookmark;
    bookmark.id = response._id;
    res.json({
      bookmark: bookmark
    });
  });
});

router.delete('/:id', function(req, res) {
  client.delete({
    index: index,
    type: type,
    id: req.params.id
  }).then(function() {
    res.json({});
  });
});

module.exports = router;
