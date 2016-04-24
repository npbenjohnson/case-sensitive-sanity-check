# case-sensitive-sanity-check

Middleware to use during development that checks for case-mismatch on web
requests.

## Options

- ### `baseUrlPath` - string

  optional base path of urls to process. default: "/"

- ### `baseFilePath`  - string

  optional file path that corresponds with baseUrlPath

- ### `filter`  - string

  optional minimatch filter run against url path (not including baseUrlPath)
