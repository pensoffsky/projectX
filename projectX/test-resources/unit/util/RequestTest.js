//jQuery.sap.registerModulePath("projectX", "base/projectX");

jQuery.sap.require("projectX.util.Request");

QUnit.module("util/request", {
    setup: function() {
        //create a fake server with different responses
        this._oFakeServer = sinon.fakeServer.create();
        this._oFakeServer.autoRespond = true;
        this._oFakeServer.respondWith("GET", "/200okJSON",
            [200, { "Content-Type": "application/json" },
             '[{ "name": "ok"}]']);
        this._oFakeServer.respondWith("GET", "/404csrf",
            [404, { "x-csrf-token": "myCSRFtoken" },'']);
        this._oFakeServer.respondWith("GET", "/200csrf",
            [200, { "x-csrf-token": "myCSRFtoken" },'']);
        this._oFakeServer.respondWith("GET", "/200noHeader",
            [200, { },'']);
        
        this.oRequest = new projectX.util.Request({
            name : "name1",
            url : "http://www.url1.com",
            scriptCode : "asdf = bla;"
        });
    },
    teardown: function() {
        this._oFakeServer.restore();
    },
    
    _executeRequestWithCSRF: function (oRequestData, oProjectData) {
        var bCSRFTokenInReqHeader = false;
        //configure fake server to allow the ajax request to be tested
        this._oFakeServer.respondWith("GET", "/200ok", function(req){
            bCSRFTokenInReqHeader = req.requestHeaders["x-csrf-token"] === "myCSRFtoken";
            req.respond(200, { }, '');
        });
        //create request and project
        var oRequest = new projectX.util.Request(oRequestData);
        var oProject = new projectX.util.Project(oProjectData);
        
        var oDeferred = oRequest.execute(oProject, undefined, {});
        oDeferred.always(function(){
            assert.ok(bCSRFTokenInReqHeader, 'csrf token in header of real request');
            QUnit.start();
        });
    }
    
});

//execute request with csrf fetch where csrf url returns 404 with valid token
QUnit.asyncTest('execute request with csrf 404 response', 1, function (assert) {
    this._executeRequestWithCSRF({
            //the request object
            url : "/200ok",
            fetchCSRFToken : true
        },{ 
            //the project object
            csrfTokenUrl : "/404csrf"
        }
    );
});

//execute request with csrf fetch where csrf url returns 200 with valid token
QUnit.asyncTest('execute request with csrf 200 response', 1, function (assert) {
    this._executeRequestWithCSRF({
            //the request object
            url : "/200ok",
            fetchCSRFToken : true
        },{ 
            //the project object
            csrfTokenUrl : "/200csrf"
        }
    );
});

//execute request with csrf fetch where csrf url returns 200 without token
QUnit.asyncTest('execute request with csrf 200 response but no csrf in header', 1, function (assert) {
    //create request and project
    var oRequest = new projectX.util.Request({
        url : "/200okJSON",
        fetchCSRFToken : true
    });
    var oProject = new projectX.util.Project({
        csrfTokenUrl : "/200noHeader"
    });

    var oDeferred = oRequest.execute(oProject, undefined, {});
    oDeferred.fail(function(){
        assert.ok(true, 'will fail because there was no csrf token found');
        QUnit.start();
    });
});


QUnit.asyncTest('execute request with defined headers', 4, function (assert) {
    //configure fake server to allow the ajax request to be tested
    this._oFakeServer.respondWith("GET", "/200ok", function(req){
        assert.ok(req.requestHeaders["sap-statistics"] === "true", 'sap-statistics ok');
        assert.ok(req.requestHeaders["Accept"] === "application/json", 'accept ok');
        assert.ok(req.requestHeaders["x-csrf-token"] === "myCSRFtoken", 'x-csrf-token ok');
        assert.ok(req.requestHeaders["Authorization"], 'Authorization ok');
        
        req.respond(200, { }, '');
        QUnit.start();
    });
    
    //create request and project
    var oRequest = new projectX.util.Request({
        url : "/200ok",
        "useBasicAuthentication": true,
        "usernameBasicAuth": "bla",
        "passwordBasicAuth": "blub",
        "requestHeaders": [
            {
              "fieldName": "sap-statistics",
              "fieldValue": "true"
            },
            {
              "fieldName": "Accept",
              "fieldValue": "application/json"
            }
        ]
    });
    var oProject = new projectX.util.Project({
        
    });

    var oDeferred = oRequest._execute(oProject, null, "myCSRFtoken", {});
    // oDeferred.resolve(function(){
    //     assert.ok(true, 'will fail because there was no csrf token found');
    //     QUnit.start();
    // });
});

QUnit.test("_preparePrefixedUrl function", 2, function(assert) {
  var oRequest = new projectX.util.Request();
  var sUrl = null;
  sUrl = oRequest._preparePrefixedUrl("\n/as\ndf", true, "http://bla.com");
  assert.ok(sUrl === "http://bla.com/asdf", "prefixed ok");
  sUrl = oRequest._preparePrefixedUrl("\n/as\ndf", false, "http://bla.com");
  assert.ok(sUrl === "/asdf", "no prefix ok");
});

QUnit.test("constructor empty", 1, function(assert) {
  var oRequest = new projectX.util.Request();
  assert.ok(oRequest != null, "request instance created");
});


QUnit.test("constructor property values", 3, function(assert) {
  assert.equal(this.oRequest.getName(), "name1", "name setter and getter");
  assert.equal(this.oRequest.getUrl(), "http://www.url1.com", "url setter and getter");
  assert.equal(this.oRequest.getScriptCode(), "asdf = bla;", "scriptCode setter and getter");
});

QUnit.test("constructor binding problem", 1, function(assert) {
  var oRequest = new projectX.util.Request(
      {
          scriptCode : "var oasdf = {;"
      }
  );
  assert.equal(oRequest.getScriptCode(), 
    "var oasdf = {;", "scriptCode with { paranthesis");
});

QUnit.test("serialize", 1, function(assert) {
  var sSerialized = this.oRequest.serialize();
  assert.ok(sSerialized, sSerialized);
});

QUnit.test("reset", 2, function(assert) {
  this.oRequest.setFinalUrl("myFinalURL");
  assert.equal(this.oRequest.getFinalUrl(), "myFinalURL", "finalUrl set");
  this.oRequest.resetTempData();
  assert.equal(this.oRequest.getFinalUrl(), "", "finalUrl resetted");
});

QUnit.test("_setAjaxResult", 6, function(assert) {
  var oRequest = new projectX.util.Request();
  assert.throws(function(){
      oRequest._setAjaxResult()
  }, /TypeError/, "empty throws error");
  
  var oMockjqXHR = {
      status: "1",
      responseText: "myResponseText",
      getAllResponseHeaders: function(){return "myResponseHeaders"},
      getResponseHeader: function(){return "gwtotal=2274,gwhub=138,gwrfcoh=110,gwbe=82,gwapp=1944";}
  }
  var iResponseTime = 234;
  
  oRequest._setAjaxResult(oMockjqXHR, iResponseTime);
  assert.equal(oRequest.getStatus(), "1", "status set ok");
  assert.equal(oRequest.getResponseBody(), "myResponseText", "responseBody set ok");
  assert.equal(oRequest.getResponseHeaders(), "myResponseHeaders", "ResponseHeaders set ok");
  assert.equal(oRequest.getSapStatistics(), "gwtotal=2274,gwhub=138,gwrfcoh=110,gwbe=82,gwapp=1944", "SapStatistics set ok");
  assert.ok(oRequest.getResponseTime() === 234, "ResponseTime set ok");
});

QUnit.test("checkAssertions", function(assert) {
  var oRequest = new projectX.util.Request();
  oRequest.setStatus("200");
  
  oRequest.checkAssertions();
  
  //create the assertion
  var sProperty = projectX.util.Constants.ASSERTPROPERTY_STATUS;
  var sOperation = projectX.util.Constants.ASSERTOPERATION_EQUALS; 
  var oAssertion = new projectX.util.Assertion();
  oAssertion.setAssertProperty(sProperty);
  oAssertion.setOperation(sOperation);
  oAssertion.setExpected("199");
  oRequest.addAssertion(oAssertion);
  
  //test negative case
  oRequest.checkAssertions();
  assert.ok(oAssertion.getResult() === false, "assertion result false");
  
  //test positive case
  oAssertion.setExpected("200");
  oRequest.checkAssertions();
  assert.ok(oAssertion.getResult() === true, "assertion result true");
});


QUnit.asyncTest('execute request with url from prev request', 1, function (assert) {
    var oRequest = new projectX.util.Request({
        url : "",
        scriptCode : "req.url = prevReq.url;"
    });
    var oPreviousRequest = new projectX.util.Request({
        url : "/200okJSON"
    });
    var oProject = new projectX.util.Project({});

    var oDeferred = oRequest._execute(oProject, oPreviousRequest, "myCSRFtoken", {});
    oDeferred.done(function(){
        //the request is only ok when the prerequestScript ran
        //and got the url from the previous request
        assert.ok(true, 'url from previous request was set');
        QUnit.start();
    });
});
