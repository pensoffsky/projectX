# Features 
- switch between multiple projects
- grouping of requests
- sequences of requests
- customize requests with JavaScript
- create test scripts
- create assertions for requests
- import and export project in JSON format
- formatted output for request response
- fullscreen view of request response
- fetch and set CSRF token
- runs in browser or as standalone app (thanks to electron)



# Installation

Clone the git repository.

Install [NPM](https://www.npmjs.com/), [GRUNT](http://gruntjs.com/) and [Bower](http://bower.io/)

```
npm install -g bower grunt-cli
```

Install the project dependencies
```
npm install
bower install
grunt copyresources
```

## Host locally
```
grunt
```

## Build [Electron](http://electron.atom.io) application
```
grunt build
```

## Build BSP-application for SAP Gateway
The following statement, executes the 'buildGw' task. It builds an BSP compatible application, ready for uploading to SAP Gateway.
The task runs endless in your Terminal and provides the ZIP file (release_projectX.zip), which can be uploaded with report /UI5/UI5_REPOSITORY_LOAD_HTTP. You can end the task by pressing CTRL + C.
```
grunt buildGw
```

