// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('/Users/student/Desktop/2016-09-web-historian/helpers/archive-helpers.js');
var fs = require('fs');
var path = require('path');
var http = require('http');

exports.fetch = function() {
  console.log('we fetching');
  archive.readListOfUrls(function(urlsArray) {
    archive.downloadUrls(urlsArray.slice(0, urlsArray.length - 1));
  });
};

exports.fetch();