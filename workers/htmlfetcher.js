// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var path = require('path');

exports.fetch = function() {
  archive.readListOfUrls(function(urlsArray) {
    archive.downloadUrls(urlsArray);
  });
};