# case-sensitive-sanity-check

Middleware to use during development that checks for case-mismatch on web
requests. 

# Why? 
[SystemJs](https://github.com/systemjs/systemjs) is case sensitive (by design), which causes incorrectly cased imports using [systemjs-hot-reloader](https://github.com/capaj/systemjs-hot-reloader) to fail silently.

## Options

- ### `baseUrlPath` - string

  optional base path of urls to process. default: "/"

- ### `baseFilePath`  - string

  optional file path that corresponds with baseUrlPath

- ### `filter`  - string

  optional minimatch filter run against url path (not including baseUrlPath)
