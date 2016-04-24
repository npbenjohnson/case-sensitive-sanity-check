var promise = require('q')
var path = require('path')
var parseUrl = require('parseurl')
var fs = require('fs')
var readdir = promise.denodeify(fs.readdir)
var filter = require('minimatch')

module.exports = function (opts) {
  opts = opts || { filter: '**/*.js', baseUrlPath: 'app', baseFilePath: 'app'};
  var baseUrlPath = opts.baseUrlPath || '/'; // for use if there is a relative path not reflected by the fs
  if(!baseUrlPath.startsWith('/')) baseUrlPath = '/' + baseUrlPath;
  var baseFilePath = opts.baseFilePath || process.cwd(); // this will be used as the path to locate files from (request.path - relativeUrl)
  if (!path.isAbsolute(baseFilePath))
    baseFilePath = path.join(process.cwd(), baseFilePath);

  return function (req, res, next) {
    if (req.method !== 'GET' && req.method !== 'HEAD')
      return next();

    var requestPath = parseUrl(req).pathname;
    if (!!baseUrlPath && !requestPath.startsWith(baseUrlPath))
      return next();

    requestPath = requestPath.slice((baseUrlPath || '').length);
    if(opts.filter && !filter(requestPath, opts.filter))
      return next();

    var currentFilePath = baseFilePath;
    var parts = requestPath.split('/');
    for (var i = 0; i < parts.length; i++) {
      if (parts[i] == '') continue;
      (function (parts, i) {
        readdir(currentFilePath)
          .then(function (files) {
            var lcFiles = files.map(function (file) {
              return file.toLowerCase();
            });
            var lcIndex = lcFiles.indexOf(parts[i].toLowerCase());
            if (files.indexOf(parts[i]) === -1 && lcIndex !== -1)
              console.error('Case Mismatch "' + parts[i] + '" does not match "' + files[lcIndex] + '" for request "' + requestPath + '"')
          })
          .catch(function (err) {
            console.warn('Error checking case sensitive name at"' + currentFilePath + '" for "' + requestPath + '"');
            console.warn(err);
          });
      })(parts, i);
      currentFilePath += path.sep + parts[i];
    }
    next();
  }
}
