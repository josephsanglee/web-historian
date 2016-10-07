var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var Promise = require('bluebird');

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
      // console.log('here first');
      data = '' + data;
      var url = data.slice(4);

      archive.isUrlArchived(url, function(exists) {
        if (exists) {
          
          res.writeHead(302, {Location: 'http://127.0.0.1:8080/' + url});
          res.end();
        } else {
          archive.addUrlToList(url.toString(), function() {
            // console.log('here');
            fs.readFile(archive.paths.loading, 'utf8', function(err, data) {
              if (err) { return console.log(err); }

              res.writeHead(302, httpHelpers.headers);
              res.write(data);
              res.end();
            });
          });
        }
      });
    });

    // req.on('data', function(data) {
    //   // console.log('here first');
    //   data = '' + data;
    //   var url = data.slice(4);

    //   archive.isUrlArchived(url)
    //   .then(function(exists) {
    //     if (exists) {
          
    //       res.writeHead(302, {Location: 'http://127.0.0.1:8080/' + url});
    //       res.end();
    //     } else {
    //       archive.addUrlToList(url.toString())
    //       .then(function() {
    //         // console.log('here');
    //         fs.readFile(archive.paths.loading, 'utf8', function(err, data) {
    //           if (err) { return console.log(err); }

    //           res.writeHead(302, httpHelpers.headers);
    //           res.write(data);
    //           res.end();
    //         });
    //       });
    //     }
    //   });
    // });
  }
};
