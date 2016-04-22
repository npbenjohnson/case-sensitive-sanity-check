module.exports = function(opts){
function(req, res, next) {

            if (req.method !== 'GET' && req.method !== 'HEAD') 
                return next();
            // Drop trailing / that wasn't in the original url
            //if (urlPath.substr(-1) !== parseUrl.original(req).pathname.substr(-1)) 
            //  urlPath = urlPath.slice(0,-1);
            // change '.'

            var filePath = path.join(process.cwd(), parseUrl(req).pathname);
            var pathInfo = path.parse(filePath);
            var pathAcc = '';
            var parts = [pathInfo.root];
            parts.push.apply(parts, pathInfo.dir.slice(pathInfo.root.length).split(path.sep));
            parts.push(pathInfo.base);
            for(var i=0;i<parts.length - 1;i++){
                if(parts[i] == '') continue;
                pathAcc += parts[i];
                if(i>0) pathAcc+=path.sep;

                (function(i,parts,pathAcc,filePath){
                    fs.readdir(pathAcc, function(err, files){
                        if(err){
                            console.warn('Error checking case sensitive name at"' + pathAcc + '" for "' + filePath + '"');
                            console.warn(err);
                            return;
                        }
                        var lcFiles = files.map(function(file){ return file.toLowerCase();});
                        var lcIndex = lcFiles.indexOf(parts[i + 1].toLowerCase());
                        if(files.indexOf(parts[i + 1]) === -1 && lcIndex !== -1)
                            console.error('Case Mismatch "' + parts[i + 1] + '" does not match "' + files[lcIndex] + '" for file "' + filePath + '"')
                    });
                })(i,parts,pathAcc,filePath)
            }
            next();
        }
        }
