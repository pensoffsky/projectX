
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

				//these fields are only temporary variables. they will not be persisted
				status : {type : "string", defaultValue : null},
				responseHeaders : {type : "string", defaultValue : null},
				responseBody : {type : "string", defaultValue : null},
				responseTime : {type : "int", defaultValue : null},
				assertionsResultReady : {type : "boolean", defaultValue : false},
				assertionsResult : {type : "boolean", defaultValue : false},
				testScriptResult : {type : "string", defaultValue : null},
				preRequestScriptResult : {type : "string", defaultValue : null},
				sapStatistics : {type : "string", defaultValue : null}
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
		oRequest.tags = this.getTags();
		oRequest.requestBody = this.getRequestBody();
		oRequest.scriptCode = this.getScriptCode();
		oRequest.testScriptCode = this.getTestScriptCode();
		oRequest.responseBodyFormat = this.getResponseBodyFormat();

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
		this.setAssertionsResultReady(false);
		this.setAssertionsResult(false);
		this.setTestScriptResult(null);
		this.setPreRequestScriptResult(null);
		this.setSapStatistics(null);
		var aAssertions = this.getAssertions();
		for (var i = 0; i < aAssertions.length; i++) {
			aAssertions[i].resetTempData();
		}
		
		//reset the results from the test script
		this._testResults = [];
	};


Request.prototype.execute = function(oProject, oPreviousRequest) {	
	var bFetchCSRFToken = this.getFetchCSRFToken();
	if (!bFetchCSRFToken) {
		//no csrf token required
		return this._execute(oProject, oPreviousRequest);
	}
	
	var sBaseUrl = oProject.getBaseUrl();
	//create a CSRF request for sap gateway
	var oCSRFDeferred = jQuery.ajax({
		method: "GET",
		headers:{     
              "X-Requested-With": "XMLHttpRequest",
              "Content-Type": "application/atom+xml",
              "DataServiceVersion": "2.0",       
              "X-CSRF-Token":"Fetch"   
						},
		url: sBaseUrl
	});
	
	var oRetDeferred = jQuery.Deferred();
	
	var that = this;
	oCSRFDeferred.done(function(data, textStatus, jqXHR) {
		var sCSRFToken = jqXHR.getResponseHeader("x-csrf-token");
		var oDeferred = that._execute(oProject, oPreviousRequest, sCSRFToken);
		oDeferred.always(function(){
			oRetDeferred.resolve();
		});
	});

	oCSRFDeferred.fail(function() {
		oRetDeferred.reject("failed to fetch CSRF token from: " + sBaseUrl);		
	});
	
	return oRetDeferred;
};

//TODO this method is to long! fix this
	/**
	 * creates and send a jquery ajax request with the parameters defined
	 * in this request instance.
	 * @param {object} oPreviousRequest the request that was executed before this one
	 * in case the request is run in a sequence
	 * @param {object} oProject the project this request belongs to
	 * @param {sCSRFToken} a csrf token if one was fetched before
	 * @return {object} jQuery deferred
	 */
	Request.prototype._execute = function(oProject, oPreviousRequest, sCSRFToken) {
		var oStartTime = new Date();

		//fill the request headers
		//TODO move to seperate function
		var aRequestHeaders = this.getRequestHeaders();
		var oRequestHeaders = {};
		for (var i = 0; i < aRequestHeaders.length; i++) {
			// save this into new array
			var fieldName  = aRequestHeaders[i].getFieldName();
			var fieldValue = aRequestHeaders[i].getFieldValue();
			oRequestHeaders[fieldName] = fieldValue;
		}
		
		//add the csrf token if we have one
		if (sCSRFToken) {
			oRequestHeaders["x-csrf-token"] = sCSRFToken;
		}

		//create the url. use prefix from project if enabled by user
		var sUrl = this.getUrl();
		if (this.getUseProjectPrefixUrl() === true) {
			sUrl = oProject.getPrefixUrl() + sUrl;
		}
		
		//pre-request script preparations.
		//create the objects that can be modified inside the script
		//TODO move to sepeate method
		
		var oReqParam = this._createRequestObjectForScript(sUrl);

		//create the object that hold the info from the previous requestHeader
		//TODO move to sepeate method
		var oPrevReqParam = null;
		if (oPreviousRequest) {
			oPrevReqParam = {
				httpMethod: oPreviousRequest.getHttpMethod(),
				url: oPreviousRequest.getUrl(),
				requestHeader: oPreviousRequest.getRequestHeaders(),
				requestBody: oPreviousRequest.getRequestBody(),
				status: oPreviousRequest.getStatus(),
				responseBody: oPreviousRequest.getResponseBody(),
				responseTime: oPreviousRequest.getResponseTime(),
				assertionsResult: oPreviousRequest.getAssertionsResult(),
				namedAssertions: oPreviousRequest.getNamedAssertionsMap()
			};
		}

		//get the pre-request javascript code, put into function and run
		var sPreRequestScriptCode = this.getScriptCode();
		var fRunPreRequestScript = new Function("req", "prevReq", sPreRequestScriptCode);
		//execute custom javascript code
		try {
			fRunPreRequestScript(oReqParam, oPrevReqParam);
		} catch (e) {
			console.log(e);
			this.setPreRequestScriptResult("SCRIPT ERROR");
		}


		//check if the URL needs encoding
		var isEncoded = typeof oReqParam.url == "string" && decodeURI(oReqParam.url) !== oReqParam.url;
		sUrl = oReqParam.url;
		if (!isEncoded) {
			sUrl = encodeURI(sUrl);
		}
		
		//do the request
		var oDeferred = jQuery.ajax({
			method: oReqParam.httpMethod,
			url: sUrl,
			data: oReqParam.requestBody,
			processData: false,
			contentType: oReqParam.contentType,
			headers: oRequestHeaders
		});

		//handle request results
		var that = this;
		oDeferred.done(function(data, textStatus, jqXHR) {
			var iResponseTime = new Date() - oStartTime;
			that._setAjaxResult(jqXHR, iResponseTime);
			that._runTestScript();
		});
		oDeferred.fail(function(jqXHR, textStatus, errorThrown) {
			var iResponseTime = new Date() - oStartTime;
			that._setAjaxResult(jqXHR, iResponseTime);
			that._runTestScript();
		});

		return oDeferred;
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
	
	//TODO refactor to execute both scripts with one function
	Request.prototype._runTestScript = function() {
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
		var fRunTestScript = new Function("req", "test", sTestScriptCode);
		try {
			//TODO supply req parameter
			fRunTestScript(oReqParam, fTest);
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
			this.setTestScriptResult("" + iTestSuccess + "/" + iTestCount);
		} catch (e) {
			console.log(e);
			this.setTestScriptResult("SCRIPT ERROR");
		}
	};

	Request.prototype.checkAssertions = function(jqXHR, iResponseTime) {
		var aAssertions = this.getAssertions();

		var sStatus = jqXHR ? jqXHR.status : this.getStatus();
		var sResponseBody = jqXHR ? jqXHR.responseText : this.getResponseBody();
		var sResponseHeaders = jqXHR ? jqXHR.getAllResponseHeaders() : this.getResponseHeaders();
		var iResponseT = iResponseTime ? iResponseTime : this.getResponseTime();

		var bAssertionsResult = true;

		for (var i = 0; i < aAssertions.length; i++) {
			var bRes = aAssertions[i].assert(sStatus, sResponseBody, sResponseHeaders, iResponseT);
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
	};

	return Request;

}, /* bExport= */ true);
