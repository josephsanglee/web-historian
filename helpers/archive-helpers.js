var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var https = require('https');
var Promise = require('bluebird');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  index: path.join(__dirname, '../web/public/index.html'),
  loading: path.join(__dirname, '../web/public/loading.html'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(cb) {

  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if (err) { return console.log(err); }
    var inputArray = data.split('\n');
    
    cb(inputArray);
  });

};

// exports.readListOfUrls = function() {
//   return new Promise(function(reject, resolve) {
//     fs.readFile(exports.paths.list, 'utf8', function(err, data) {
//       if (err) { return reject(err, null); }
//       var inputArray = data.split('\n');
//       console.log(inputArray);
      
//       return resolve(null, inputArray);
//     });
//   });
// };

exports.isUrlInList = function(target, cb) {
  exports.readListOfUrls(function(urlsArray) {
    cb(urlsArray.indexOf(target) !== -1);
  });
};

// exports.isUrlInList = function(target) {
//   return new Promise(function(reject, resolve) {
//     exports.readListOfUrls()
//     .then(function(inputArray) {
//       resolve(urlsArray.indexOf(target) !== -1);
//     });
//   });
// };

exports.addUrlToList = function(url, cb) {
  exports.isUrlInList(url, function(exists) {
    if (exists) {
      return console.log('it here');
    } else {
      fs.appendFile(exports.paths.list, url + '\n', 'utf8', cb);
    }
  });
};

// exports.addUrlToList = function(url) {
//   return new Promise(function(reject, resolve) {
//     exports.isUrlInList(url)
//     .then(function(exists) {
//       if (exists) { return reject(); }

//       fs.appendFile(exports.paths.list, url + '\n', 'utf8', resolve);
//     });
//   });
// };

exports.isUrlArchived = function(target, cb) {
  fs.readdir(exports.paths.archivedSites, function(err, files) {
    if (err) { return console.log('err'); }
    cb(files.indexOf(target) !== -1);
  });
};

// exports.isUrlArchived = function(target) {
//   return new Promise(function(reject, resolve) {
//     fs.readdir(exports.paths.archivedSites, function(err, files) {
//       if (err) { return reject(err, null); }

//       resolve(null, files.indexOf(target) !== -1);
//     });
//   });
// };

exports.downloadUrls = function(urlsArray) {
  urlsArray.forEach(function(url) {
    exports.isUrlArchived(url, function(exists) {
      if (exists) { return; }
      var body = '';

      var request = http.get({'host': url}, function(response) {
        response.on('data', function(data) {
          body += data;
        });
        response.on('end', function() {
          var filePath = exports.paths.archivedSites + '/' + url;
          fs.writeFile(filePath, body.toString(), function(err) {
            if (err) { return console.log(err); }
            
            console.log('downloaded!');
          });     
        });
      });
      request.end();
    });
  });
};

// exports.downloadUrls = function(urlsArray) {
//   urlsArray.forEach(function(url) {
//     exports.isUrlArchived(url)
//     .then(function(exists) {
//       if (exists) { return; }
//       var body = '';

//       var request = http.get({'host': url}, function(response) {
//         response.on('data', function(data) {
//           body += data;
//         });
//         response.on('end', function() {
//           var filePath = exports.paths.archivedSites + '/' + url;
//           fs.writeFile(filePath, body.toString(), function(err) {
//             if (err) { return console.log(err); }

//             console.log('downloaded!');
//           });
//         });
//       });
//       request.end();
//     });
//   });
// };