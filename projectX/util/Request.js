sap.ui.define(['jquery.sap.global', 'projectX/util/MyManagedObject', 'projectX/util/Assertion', 'projectX/util/RequestHeader', 'projectX/util/Constants'],
	function(jQuery, MyManagedObject, Assertion, RequestHeader, Constants) {
	"use strict";

	var Request = MyManagedObject.extend("projectX.util.Request", {
		constructor : function (oData) {
			MyManagedObject.apply(this, arguments);
		},
		metadata : {
			properties : {
				identifier : {type : "int", defaultValue : null},
				name : {type : "string", defaultValue : null},
				description : {type : "string", defaultValue : null},
				httpMethod : {type : "string", defaultValue : Constants.GET},
				useProjectPrefixUrl : {type : "boolean", defaultValue : false},
				fetchCSRFToken : {type : "boolean", defaultValue : false},
				url : {type : "string", defaultValue : null},
				tags : {type : "string", defaultValue : null},
				requestBody : {type : "string", defaultValue : null},
				scriptCode : {type : "string", defaultValue : null},
				testScriptCode : {type : "string", defaultValue : null},
				responseBodyFormat : {type : "string", defaultValue : "text"},
				//used for grouping the requests in the request list
				groupName : {type : "string", defaultValue : ""},
				
				useBasicAuthentication : {type : "boolean", defaultValue : false},
				usernameBasicAuth : {type : "string", defaultValue : null},
				passwordBasicAuth : {type : "string", defaultValue : null},
				
				changed : {type : "boolean", defaultValue : false},
				revision : {type : "int", defaultValue : null},
				uuid: {type : "string", defaultValue : null},

				//these fields are only temporary variables. they will not be persisted
				status : {type : "string", defaultValue : null},
				responseHeaders : {type : "string", defaultValue : null},
				responseBody : {type : "string", defaultValue : null},
				responseTime : {type : "int", defaultValue : null},
				assertionsResultReady : {type : "boolean", defaultValue : false},
				assertionsResult : {type : "boolean", defaultValue : false},
				testScriptResult : {type : "string", defaultValue : null},
				testScriptSuccess : {type : "boolean", defaultValue : null},
				preRequestScriptResult : {type : "string", defaultValue : null},
				sapStatistics : {type : "string", defaultValue : null},
				//the final url used for the request (including the changes from prerequest script)
				finalUrl : {type : "string", defaultValue : null},
				finalRequestBody : {type : "string", defaultValue : null},
				finalHttpMethod : {type : "string", defaultValue : null},
				finalRequestHeaders : {type : "string", defaultValue : null},
				
				//state
				requestIsRunning : {type : "boolean", defaultValue : false}
			},
			events : {

			},
			aggregations : {
				assertions : {type : "projectX.util.Assertion", multiple : true},
				requestHeaders : {type : "projectX.util.RequestHeader", multiple : true}
			}
		}
	});

	// /////////////////////////////////////////////////////////////////////////////
	// /// Members
	// /////////////////////////////////////////////////////////////////////////////

	/**
	 * deferred object of the currently running request.
	 * used to abort the request if needed.
	 * @type {object}
	 */
	Request.prototype._oRequestDeferred = undefined;

	// /////////////////////////////////////////////////////////////////////////////
	// /// Public Methods
	// /////////////////////////////////////////////////////////////////////////////

	/**
	 * create a serialized version of this request.
	 * @return {object} a javascript object containing the data that can be persisted.
	 */
	Request.prototype.serialize = function() {
		var oRequest = {};
		oRequest.identifier = this.getIdentifier();
		oRequest.name = this.getName();
		oRequest.description = this.getDescription();
		oRequest.httpMethod = this.getHttpMethod();
		oRequest.useProjectPrefixUrl = this.getUseProjectPrefixUrl();
		oRequest.fetchCSRFToken = this.getFetchCSRFToken();
		oRequest.url = this.getUrl();
		oRequest.tags = this.getTags(); //TODO remove this, not used
		oRequest.requestBody = this.getRequestBody();
		oRequest.scriptCode = this.getScriptCode();
		oRequest.testScriptCode = this.getTestScriptCode();
		oRequest.responseBodyFormat = this.getResponseBodyFormat();
		oRequest.groupName = this.getGroupName();
		
		oRequest.useBasicAuthentication = this.getUseBasicAuthentication();
		oRequest.usernameBasicAuth = this.getUsernameBasicAuth();
		oRequest.passwordBasicAuth = this.getPasswordBasicAuth();
		
		oRequest.changed = this.getChanged();
		oRequest.revision = this.getRevision();
		oRequest.uuid = this.getUuid();
		
		//make sure every request has a uuid even if it is an old request
		//before the time uuid was used
		if(!oRequest.uuid) {
				oRequest.uuid = Request.generateUuid();
		}
		
		

		var aSerializedAssertions = [];
		var aAssertions = this.getAssertions();
		for (var i = 0; i < aAssertions.length; i++) {
			aSerializedAssertions.push(aAssertions[i].serialize());
		}
		oRequest.assertions = aSerializedAssertions;

		// attach request headers to request object
		var aSerializedRequestHeaders = [];
		var aRequestHeaders = this.getRequestHeaders();
		for (var i = 0; i < aRequestHeaders.length; i++) {
			aSerializedRequestHeaders.push(aRequestHeaders[i].serialize());
		}
		oRequest.requestHeaders = aSerializedRequestHeaders;

		return oRequest;
	};

	/**
	 * reset temporary data that was set after the ajax request finished.
	 * also reset the results from the assertions
	 */
	Request.prototype.resetTempData = function() {
		this.setStatus(null);
		this.setResponseHeaders(null);
		this.setResponseBody(null);
		this.setResponseTime(null);
		this.setTestScriptResult(null);
		this.setTestScriptSuccess(false);
		this.setPreRequestScriptResult(null);
		this.setSapStatistics(null);
		this.resetAssertionsData();
		this.setFinalUrl(null);
		this.setFinalRequestBody(null);
		this.setFinalHttpMethod(null);
		this.setFinalRequestHeaders(null);
		
		//reset the results from the test script
		this._testResults = [];
	};
	
	/**
	 * reset the temporary assertions data.
	 */
	Request.prototype.resetAssertionsData = function() {
		this.setAssertionsResultReady(false);
		this.setAssertionsResult(false);
		var aAssertions = this.getAssertions();
		for (var i = 0; i < aAssertions.length; i++) {
			aAssertions[i].resetTempData();
		}
	};
	
	/**
	 * abort the current request
	 */
	Request.prototype.abortRequest = function() {
		if (this._oRequestDeferred) {
			this._oRequestDeferred.abort();
		}
	};

	Request.prototype.execute = function(oProject, oPreviousRequest, oSequenceStorage) {	
		var that = this;
		var bFetchCSRFToken = this.getFetchCSRFToken();
		if (!bFetchCSRFToken) {
			//no csrf token required
			this.setRequestIsRunning(true);
			this._oRequestDeferred = this._execute(oProject, oPreviousRequest, undefined, oSequenceStorage);
			this._oRequestDeferred.always(function(){
				that.setRequestIsRunning(false);
			});
			return this._oRequestDeferred;
		}
		
		//get csrf token
		var sCsrfTokenUrl = oProject.getCsrfTokenUrl();
		var oCSRFDeferred = this._sendCSRFRequest(sCsrfTokenUrl);
		
		var oRetDeferred = jQuery.Deferred();
		oCSRFDeferred.done(function(data, textStatus, jqXHR) {
			that._executeRequestWithCSRF(jqXHR, this._oRequestDeferred, oRetDeferred, oProject, oPreviousRequest, oSequenceStorage);
		});

		oCSRFDeferred.fail(function(jqXHR, textStatus, errorThrown) {
			that._executeRequestWithCSRF(jqXHR, this._oRequestDeferred, oRetDeferred, oProject, oPreviousRequest, oSequenceStorage);
		});

		return oRetDeferred;
	};
	
	Request.prototype._executeRequestWithCSRF = function (jqXHR, oRequestDeferred, oRetDeferred, oProject, oPreviousRequest, oSequenceStorage) {
		var that = this;
		var sCSRFToken = jqXHR.getResponseHeader("x-csrf-token");
		if (!sCSRFToken) {
			oRetDeferred.reject("failed to fetch CSRF token");
			return;
		}
		this.setRequestIsRunning(true);
		this._oRequestDeferred = this._execute(oProject, oPreviousRequest, sCSRFToken, oSequenceStorage);
		this._oRequestDeferred.always(function(){
			that.setRequestIsRunning(false);
			oRetDeferred.resolve();
		});
	};

//TODO this method is to long! fix this
	/**
	 * creates and send a jquery ajax request with the parameters defined
	 * in this request instance.
	 * @param {object} oPreviousRequest the request that was executed before this one
	 * in case the request is run in a sequence
	 * @param {object} oProject the project this request belongs to
	 * @param {string} sCSRFToken a csrf token if one was fetched before
	 * @param {object} oSequenceStorage an object that in a sequence is passed from request to request
	 * @return {object} jQuery deferred
	 */
	Request.prototype._execute = function(oProject, oPreviousRequest, sCSRFToken, oSequenceStorage) {
		var oStartTime = new Date();

		//fill the request headers
		var aRequestHeaders = this.getRequestHeaders();
		var oRequestHeaders = this._convertHeadersArrayToObject(aRequestHeaders);
		//add the csrf token if we have one
		this._addCSRFTokenToHeaderObject(oRequestHeaders, sCSRFToken);
		//add basic authentication header if it was set in the project or in request
		//the settings from the request overwrite the project settings
		this._addBasicAuthToHeaderObject(oRequestHeaders,
			 oProject,
			 this);

		//create the url. use prefix from project if enabled by user
		var sUrl = this._preparePrefixedUrl(this.getUrl(),
											this.getUseProjectPrefixUrl(),
											oProject.getPrefixUrl());

		//pre-request script preparations.
		//create the objects that can be modified inside the script
		var oReqParam = this._createRequestObjectForScript(sUrl);
		//create the object that hold the info from the previous requestHeader
		var oPrevReqParam = null;
		if (oPreviousRequest) {
			oPrevReqParam = oPreviousRequest._createPreviousRequestObjectForScript();
		}
		//get the pre-request javascript code, put into function and run
		this._runPreRequestScript(this.getScriptCode(), oReqParam, oPrevReqParam, oSequenceStorage);

		//check if the URL needs encoding
		var isEncoded = typeof oReqParam.url == "string" && decodeURI(oReqParam.url) !== oReqParam.url;
		sUrl = oReqParam.url;
		if (!isEncoded) {
			sUrl = encodeURI(sUrl);
		}
		
		this.setFinalUrl(sUrl);
		this.setFinalRequestBody(oReqParam.requestBody);
		this.setFinalHttpMethod(oReqParam.httpMethod);
		try {
			var sFinalReqHeaders = JSON.stringify(oRequestHeaders, null, 2);
			this.setFinalRequestHeaders(sFinalReqHeaders);
		} catch (e) {
			this.setFinalRequestHeaders(null);
		}
		
		//do the request
		var oDeferred = jQuery.ajax({
			method: oReqParam.httpMethod,
			url: sUrl,
			data: oReqParam.requestBody,
			processData: false,
			contentType: oReqParam.contentType,//TODO what is this??
			headers: oRequestHeaders
		});

		//handle request results
		var that = this;
		oDeferred.done(function(data, textStatus, jqXHR) {
			var iResponseTime = new Date() - oStartTime;
			that._setAjaxResult(jqXHR, iResponseTime);
			that._runTestScript(oSequenceStorage);
		});
		oDeferred.fail(function(jqXHR, textStatus, errorThrown) {
			var iResponseTime = new Date() - oStartTime;
			that._setAjaxResult(jqXHR, iResponseTime);
			that._runTestScript(oSequenceStorage);
		});

		return oDeferred;
	};

	Request.prototype.checkAssertions = function() {
		var aAssertions = this.getAssertions();

		var sStatus = this.getStatus();
		var sResponseBody = this.getResponseBody();
		var sResponseHeaders = this.getResponseHeaders();
		var iResponseT = this.getResponseTime();
		var sSapStatistics = this.getSapStatistics();

		var bAssertionsResult = true;
		for (var i = 0; i < aAssertions.length; i++) {
			var bRes = aAssertions[i].assert(sStatus, sResponseBody, sResponseHeaders, iResponseT, sSapStatistics);
			if (bRes !== true){
				bAssertionsResult = false;
			}
		}

		this.setAssertionsResult(bAssertionsResult);
		this.setAssertionsResultReady(true);
		return bAssertionsResult;
	};

	/**
	 * @return {object} get a map object of the named assertions with result and evaluated value.
	 */
	Request.prototype.getNamedAssertionsMap = function() {
		var aAssertions = this.getAssertions();
		if (!aAssertions){
			return null;
		}

		var oRes = {};
		for (var i = 0; i < aAssertions.length; i++) {
			var sName = aAssertions[i].getName();
			if (!sName || sName.length <= 0) {
				continue;
			}

			oRes[sName] = {
				result: aAssertions[i].getResult(),
				evaluatedValue: aAssertions[i].getEvaluatedValue()
			};
		}
		return oRes;
	};

	Request.prototype.appendToUrl = function(sString) {
		this.setUrl(this.getUrl() + "\n" + sString);
	};

	// /////////////////////////////////////////////////////////////////////////////
	// /// Private Methods
	// /////////////////////////////////////////////////////////////////////////////

	Request.prototype._convertHeadersArrayToObject = function (aRequestHeaders) {
		var oRequestHeaders = {};
		for (var i = 0; i < aRequestHeaders.length; i++) {
			// save this into new array
			var fieldName  = aRequestHeaders[i].getFieldName();
			var fieldValue = aRequestHeaders[i].getFieldValue();
			oRequestHeaders[fieldName] = fieldValue;
		}
		return oRequestHeaders;
	};

	Request.prototype._addCSRFTokenToHeaderObject = function (oRequestHeaders, sCSRFToken) {
		if (sCSRFToken) {
			oRequestHeaders["x-csrf-token"] = sCSRFToken;
		}
	};

	Request.prototype._addBasicAuthToHeaderObject = function (oRequestHeaders, oProject, oRequest) {
		if (oRequest.getUseBasicAuthentication() === true) {
			oRequestHeaders["Authorization"] = "Basic " + btoa(oRequest.getUsernameBasicAuth() + ":" + oRequest.getPasswordBasicAuth());
		} else if (oProject && oProject.getUseBasicAuthentication() === true) {
			oRequestHeaders["Authorization"] = "Basic " + btoa(oProject.getUsername() + ":" + oProject.getPassword());
		}
	};

	Request.prototype._preparePrefixedUrl = function (sReqUrl, bProjUsePrefixUrl, sProjPrefixUrl) {
		var sUrl = sReqUrl;
		if (sUrl) {
			//remove newlines from the url string.
			//this enables the user to use multiline URLs
			sUrl = sUrl.replace(/(\r\n|\n|\r)/gm,"");
		}
		if (bProjUsePrefixUrl === true) {
			sUrl = sProjPrefixUrl + sUrl;
		}
		return sUrl;
	};

	//create a CSRF request for sap gateway
	Request.prototype._sendCSRFRequest = function (sCsrfTokenUrl) {
		var oCSRFDeferred = jQuery.ajax({
			method: "GET",
			headers:{
				"X-Requested-With": "XMLHttpRequest",
				"Content-Type": "application/atom+xml",
				"DataServiceVersion": "2.0",
				"X-CSRF-Token":"Fetch"
			},
			url: sCsrfTokenUrl
		});
		return oCSRFDeferred;
	};

	/**
	 * helper function that sets the status of the finished ajax call.
	 * @param {object} jqXHR the reuslt form the ajax call
	 */
	Request.prototype._setAjaxResult = function(jqXHR, iResponseTime) {
		this.setStatus(jqXHR.status);
		this.setResponseBody(jqXHR.responseText);
		this.setResponseHeaders(jqXHR.getAllResponseHeaders());
		this.setResponseTime(iResponseTime);
		//try to get the sap-statistics data from the response headers
		this.setSapStatistics(jqXHR.getResponseHeader("sap-statistics"));

		//this is testdata for the statistics feature
		//this.setSapStatistics("gwtotal=2274,gwhub=138,gwrfcoh=110,gwbe=82,gwapp=1944");
	};
	
	Request.prototype._runPreRequestScript = function (sScriptCode, oReqParam, oPrevReqParam, oSequenceStorage) {
		try {
			var fRunPreRequestScript = new Function("req", "prevReq", "seqStorage", sScriptCode);
			fRunPreRequestScript(oReqParam, oPrevReqParam, oSequenceStorage);
		} catch (e) {
			console.log(e);
			this.setPreRequestScriptResult("SCRIPT ERROR");
		}
	};

	Request.prototype._createRequestObjectForScript = function(sUrl) {
		var oReqParam = {
			httpMethod: this.getHttpMethod(),
			url: sUrl,
			requestBody: this.getRequestBody(),
			status: this.getStatus(),
			responseTime: this.getResponseTime(),
			responseBody: this.getResponseBody(),
			responseHeaders: this.getResponseHeaders()
			//TODO add more parameters here
		};
		return oReqParam;
	};
	
	Request.prototype._createPreviousRequestObjectForScript = function() {
		var oPrevReqParam = {
			httpMethod: this.getHttpMethod(),
			url: this.getUrl(),
			requestHeader: this.getRequestHeaders(),
			requestBody: this.getRequestBody(),
			status: this.getStatus(),
			responseBody: this.getResponseBody(),
			responseTime: this.getResponseTime(),
			assertionsResult: this.getAssertionsResult(),
			namedAssertions: this.getNamedAssertionsMap()
		};
		return oPrevReqParam;
	};

	Request.prototype._runTestScript = function(oSequenceStorage) {
		//TODO why is check Assertions called from outside?

		var oReqParam = this._createRequestObjectForScript(this.getUrl());

		//get the test script javascript code, put into function and run
		var that = this;
		that._testResults = [];
		var fTest = function(sName, bResult){
			that._testResults.push({
					name: sName,
				 result: bResult
			 });
		};

		var sTestScriptCode = this.getTestScriptCode();
		try {
			var fRunTestScript = new Function("req", "test", "seqStorage", sTestScriptCode);
			fRunTestScript(oReqParam, fTest, oSequenceStorage);
			//check the test results and generate the result string e.g. "3/20"
			//3 from 20 test succeeded
			var iTestCount = 0;
			var iTestSuccess = 0;
			for (var i=0; i<this._testResults.length; i++) {
				iTestCount++;
				if (this._testResults[i].result === true) {
					iTestSuccess++;
				}
			}
			
			this.setTestScriptSuccess(iTestCount === iTestSuccess);
			this.setTestScriptResult("" + iTestSuccess + "/" + iTestCount);
		} catch (e) {
			console.log(e);
			this.setTestScriptSuccess(false);
			this.setTestScriptResult("SCRIPT ERROR");
		}
	};

	Request.generateUuid = function() {
		return "" + Date.now() + uuid.v4();
	};

	return Request;

}, /* bExport= */ true);