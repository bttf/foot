var express = require('express');
var router = express.Router();
var client = require('../esClient');
var jsdom = require('jsdom');
var url = require('url');

var index = 'sock';
var type = 'bookmarks';

router.post('/', function(req, res) {
  // client.indices.putMapping({
  //   index: index,
  //   type: type,
  //   ignoreConflicts: true,
  //   body: {
  //     bookmarks: {
  //       properties: {
  //         user: {
  //           type: 'string',
  //           index: 'not_analyzed',
  //         },
  //       },
  //     },
  //   },
  // }).then(function() {
  //   console.log('shit happened');
  //   client.indices.getFieldMapping({
  //     index: 'sock',
  //     type: 'bookmarks',
  //     field: 'user',
  //     includeDefaults: true,
  //   }).then(function (mappings) {
  //     console.log('mappings', JSON.stringify(mappings, null, 2));
  //   }, function(err) {
  //     console.log('mappings err', err);
  //   });
  // });

  var bookmark = {};
  var bmUrl = url.parse(req.body.bookmark.url);
  for (var key in req.body.bookmark) {
    bookmark[key] = req.body.bookmark[key];
  }
  jsdom.env(
    bookmark.url,
    function (errors, window) { 
      var $ = require('jquery')(window);
      var title = $('title').html();
      var desc = $('meta[name="description"]').attr('content');
      var imgUrl = bmUrl.protocol + '//' + bmUrl.host + '/favicon.ico';
      if ($('link[rel="icon"]').length) {
        imgUrl = $('link[rel="icon"]').attr('href');
      } 
      bookmark.title = title || bookmark.url;
      bookmark.desc = desc;
      bookmark.imgUrl = imgUrl;
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
    }
  ); 
});

router.get('/', function(req, res) {
  client.search({
    index: index,
    type: type,
    body: {
      "sort" : [
        { "dateCreated" : {"order": "desc", "unmapped_type" : "long"} },
      ],
      query: {
        match: {
          user: req.user._id
        }
      }
    },
    size: 50,
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

router.get('/:id', function(req, res, next) {
  client.get({
    index: index,
    type: type,
    id: req.params.id
  }).then(function (response) {
    var bookmark = response._source;
    bookmark.id = response._id;
    res.json({
      bookmark: bookmark
    });
  }, function (err) {
    next(err);
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
