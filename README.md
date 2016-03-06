# Features 
- fetch and set CSRF token
- runs in browser or as standalone app (thanks to [Electron](http://electron.atom.io))
- create assertions for requests
- import and export project in JSON format

## Switch between multiple projects
<img src="https://github.com/pensoffsky/projectX/blob/master/documentation/gifs/projectSwitch.gif" width="500"/>

## grouping of requests
<img src="https://github.com/pensoffsky/projectX/blob/master/documentation/gifs/requestGrouping.gif" width="500"/>

## sequences of requests
<img src="https://github.com/pensoffsky/projectX/blob/master/documentation/gifs/sequenceOfRequests.gif" width="500"/>

## customize requests with JavaScript
<img src="https://github.com/pensoffsky/projectX/blob/master/documentation/gifs/prerequestScript.gif" width="500"/>

## create test scripts
<img src="https://github.com/pensoffsky/projectX/blob/master/documentation/gifs/testScript.gif" width="500"/>

## fullscreen view of request response
<img src="https://github.com/pensoffsky/projectX/blob/master/documentation/gifs/fullscreenResponsebody.gif" width="500"/>

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

## Update version number in index files
Change version number in package.json file and use following grunt task to update version information in index*.html files. 
```
grunt htmlbuild
```
