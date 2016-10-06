var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!
//do a get request on http://google.com to get html data

exports.handleRequest = function (req, res) {
  var url = req.url;
  var method = req.method;

  if (url === '/' && method === 'GET') {
    res.writeHead(200, httpHelpers.headers);

    fs.readFile(archive.paths.index, function(err, data) {
      if (err) { return console.log(err); }

      res.end(data);
    });
  } else if (method === 'GET') {
    var filePath = archive.paths.archivedSites + '/' + url;

    fs.readFile(filePath, function(err, data) {
      if (err) { 
        res.writeHead(404, httpHelpers.headers);
      } else {
        res.writeHead(200, httpHelpers.headers);
      }
      
      res.end(data);
    });
  } else if (method === 'POST') {
    req.on('data', function(data) {
      data = '' + data;
      var url = data.slice(4) + '\n';

      archive.addUrlToList(url, function() {
        res.writeHead(302, httpHelpers.headers);
        res.end();
      });
    });
  }
};
