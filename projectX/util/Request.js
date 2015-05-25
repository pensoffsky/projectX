
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject', 'projectX/util/Assertion', 'projectX/util/RequestHeader', 'projectX/util/Constants'],
	function(jQuery, ManagedObject, Assertion, RequestHeader, Constants) {
	"use strict";

	var Request = ManagedObject.extend("projectX.util.Request", { metadata : {

		properties : {
			identifier : {type : "int", defaultValue : null},
			name : {type : "string", defaultValue : null},
			description : {type : "string", defaultValue : null},
			httpMethod : {type : "string", defaultValue : Constants.GET},
			useProjectPrefixUrl : {type : "boolean", defaultValue : false},
			url : {type : "string", defaultValue : null},
			tags : {type : "string", defaultValue : null},
			requestBody : {type : "string", defaultValue : null},
			scriptCode : {type : "string", defaultValue : null},

			//these fields are only temporary variables. they will not be persisted
			status : {type : "string", defaultValue : null},
			responseHeaders : {type : "string", defaultValue : null},
			responseBody : {type : "string", defaultValue : null},
			responseTime : {type : "int", defaultValue : null},
			assertionsResultReady : {type : "boolean", defaultValue : false},
			assertionsResult : {type : "boolean", defaultValue : false}
		},
		events : {

		},
		aggregations : {
			assertions : {type : "projectX.util.Assertion", multiple : true},
			requestHeaders : {type : "projectX.util.RequestHeader", multiple : true}
		}
	}});

	// /////////////////////////////////////////////////////////////////////////////
	// /// Public Methods
	// /////////////////////////////////////////////////////////////////////////////


	Request.prototype.setDataFromRequest = function(oRequest) {
		this.mProperties = oRequest.mProperties;
		this.mAggregations = oRequest.mAggregations;
		this.mRequestHeaders = oRequest.mRequestHeaders;
	};

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
		oRequest.url = this.getUrl();
		oRequest.tags = this.getTags();
		oRequest.requestBody = this.getRequestBody();
		oRequest.scriptCode = this.getScriptCode();

		var aSerializedAssertions = [];
		var aAssertions = this.getAssertions();
		for (var i = 0; i < aAssertions.length; i++) {
			aSerializedAssertions.push(aAssertions[i].serialize());
		}
		oRequest.assertions = aSerializedAssertions;

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
		var aAssertions = this.getAssertions();
		for (var i = 0; i < aAssertions.length; i++) {
			aAssertions[i].resetTempData();
		}
	};

	/**
	 * creates and send a jquery ajax request with the parameters defined
	 * in this request instance.
	 * @param {object} oPreviousRequest the request that was executed before this one
	 * in case the request is run in a sequence
	 * @param {object} oProject the project this request belongs to
	 * @return {object} jQuery deferred
	 */
	Request.prototype.execute = function(oProject, oPreviousRequest) {
		var oStartTime = new Date();

		//create the url. use prefix from project if enabled by user
		var sUrl = this.getUrl();
		if (this.getUseProjectPrefixUrl() === true) {
			sUrl = oProject.getPrefixUrl() + sUrl;
		}

		//create the objects that can be modified inside the script
		var oReqParam = {
			httpMethod: this.getHttpMethod(),
			url: sUrl,
			requestBody: this.getRequestBody(),
			contentType: ""
			//TODO add more parameters here
		};

		var oPrevReqParam = null;
		if (oPreviousRequest) {
			oPrevReqParam = {
				httpMethod: oPreviousRequest.getHttpMethod(),
				url: oPreviousRequest.getUrl(),
				requestBody: oPreviousRequest.getRequestBody(),
				status: oPreviousRequest.getStatus(),
				responseHeaders: oPreviousRequest.getResponseHeaders(),
				responseBody: oPreviousRequest.getResponseBody(),
				responseTime: oPreviousRequest.getResponseTime(),
				assertionsResult: oPreviousRequest.getAssertionsResult(),
				namedAssertions: oPreviousRequest.getNamedAssertionsMap()
			};
		}


		//get the javascript code and put into function
		var sScriptCode = this.getScriptCode();
		var f = new Function("req", "prevReq", sScriptCode);
		//execute custom javascript code
		try {
			f(oReqParam, oPrevReqParam);
		} catch (e) {
			console.log(e);
		}

		var oDeferred = jQuery.ajax({
			method: oReqParam.httpMethod,
			url: oReqParam.url,
			data: oReqParam.requestBody,
			processData: false, 
			contentType: oReqParam.contentType
		});

		var that = this;
		oDeferred.done(function(data, textStatus, jqXHR) {
			var iResponseTime = new Date() - oStartTime;
			that._setAjaxResult(jqXHR, iResponseTime);
		});

		oDeferred.fail(function(jqXHR, textStatus, errorThrown) {
			var iResponseTime = new Date() - oStartTime;
			that._setAjaxResult(jqXHR, iResponseTime);
		});

		return oDeferred;
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
	};

	return Request;

}, /* bExport= */ true);
