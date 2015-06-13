var express = require('express');
var router = express.Router();
var jsdom = require('jsdom');
var fs = require('fs');

router.post('/', function(req, res) {
  jsdom.env(
    req.body.url, 
    function (errors, window) { 
      var $ = require('jquery')(window);
      var title = $('title').html();
      var desc = $('meta[name="description"]').attr('content');

      var imgUrl;
      if ($('meta[itemprop="image"]').length) {
        imgUrl = $('meta[itemprop="image"]').attr('content');
      } else if ($('meta[property="og:image"]').length) {
        imgUrl = $('meta[property="og:image"]').attr('content');
      } else if ($('meta[name="twitter:image"]').length) {
        imgUrl = $('meta[name="twitter:image"]').attr('content');
      } else if ($('meta[name="msapplication-TileImage"]').length) {
        imgUrl = $('meta[name="msapplication-TileImage"]').attr('content');
      } else if ($('meta[name="twitter:image:src"]').length) {
        imgUrl = $('meta[name="twitter:image:src"]').attr('content');
      }

      // debug: see all meta tags
      // $('meta').each(function(i, e) {
      //   console.log(e.outerHTML);
      // });

      if (imgUrl && imgUrl.indexOf('//') === 0) {
        imgUrl = "http:" + imgUrl;
      } else if (imgUrl && imgUrl.indexOf('http') !== 0) {
        imgUrl = req.body.url + imgUrl;
      }

      res.json({
        title: title,
        desc: desc,
        imgUrl: imgUrl
      });
    }
  ); 
});

module.exports = router;
