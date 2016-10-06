var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  index: path.join(__dirname, '../web/public/index.html'),
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

exports.isUrlInList = function(target, cb) {
  exports.readListOfUrls(function(urlsArray) {
    cb(urlsArray.indexOf(target) !== -1);
  });
};

exports.addUrlToList = function(url, cb) {
  exports.isUrlInList(url, function(exists) {
    if (exists) {
      console.log('it here');
    } else {
      fs.appendFile(exports.paths.list, url, 'utf8', cb);
    }
  });
};

exports.isUrlArchived = function(target, cb) {
  var filePath = exports.paths.archivedSites + '/' + target;
  fs.readFile(filePath, 'utf8', function(err, data) {
    cb(!err ? true : false);
  });
};

exports.downloadUrls = function(urlArray) {
  urlArray.forEach(function(url) {
    exports.isUrlArchived(url, function(exists) {
      if (exists) { return; }

      var filePath = exports.paths.archivedSites + '/' + url;
      fs.writeFile(filePath, url, function(err) {
        if (err) { return console.log(err); }
        
        console.log('downloaded!');
      });     
    });
  });
};
