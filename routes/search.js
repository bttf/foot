var express = require('express');
var router = express.Router();
var client = require('../esClient');

var index = 'sock';
var type = 'bookmarks';

router.get('/:search_term', function(req, res, next) {
  client.search({
    index: index,
    type: type,
    size: 50,
    body: {
      query: {
        filtered: {
          query: {
            wildcard: {
              _all: '*' + req.params.search_term + '*',
            },
          },
          filter: {
            term: { user: req.user.id },
          },
        },
      },
    },
  }).then(function (response) {
    var bookmarks = [];
    response.hits.hits.forEach(function (hit) {
      var bookmark = hit._source;
      bookmark.id = hit._id;
      bookmarks.push(bookmark);
    });
    res.json({
      bookmarks: bookmarks
    });
  });
});

module.exports = router;
