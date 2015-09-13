var host = 'localhost:9200';
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({ host: host });

module.exports = client;
