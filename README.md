[![Build Status](https://travis-ci.org/pensoffsky/projectX.svg?branch=master)](https://travis-ci.org/pensoffsky/projectX)

# Features 
- fetch and set CSRF token
- runs in browser or as standalone app (thanks to [Electron](http://electron.atom.io))
- create assertions for requests
- import and export project in JSON format

<img src="documentation/gifs/overview.gif" width="900"/>

## Tutorials
* [Switch projects](documentation/projectSwitch.md)
* [Grouping of requests](documentation/requestGrouping.md)
* [Sequences of requests](documentation/sequenceOfRequests.md)
* [Customzine requests with JavaScript](documentation/prerequestScript.md)
* [Create test scripts](documentation/testScript.md)
* [Switch to fullscreen mode for response body](documentation/fullscreenResponsebody.md)

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

## or build [Electron](http://electron.atom.io) application
```
grunt build
```

## or build BSP-application for SAP Gateway
The following statement, executes the 'buildGw' task. It builds an BSP compatible application, ready for uploading to SAP Gateway.
The task runs endless in your Terminal and provides the ZIP file (release_projectX.zip), which can be uploaded with report /UI5/UI5_REPOSITORY_LOAD_HTTP. You can end the task by pressing CTRL + C.
```
grunt buildGw
```

## Update version number
Change version number in package.json file and use following grunt task to update version information in index*.html files. 
```
grunt htmlbuild
```
