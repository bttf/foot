var express = require('express');
var router = express.Router();
var jsdom = require('jsdom');
var url = require('url');

router.post('/', function(req, res) {
  var bmUrl = url.parse(req.body.url);
  jsdom.env(
    bmUrl.href,
    function (errors, window) { 
      var $ = require('jquery')(window);

      var title = $('title').html();
      var desc = $('meta[name="description"]').attr('content');
      var imgUrl = bmUrl.protocol + '//' + bmUrl.host + '/favicon.ico';
      
      // debug: see all meta tags
      // $('meta').each(function(i, e) {
      //   console.log(e.outerHTML);
      // });

      res.json({
        title: title,
        desc: desc,
        imgUrl: imgUrl
      });
    }
  ); 
});

module.exports = router;
