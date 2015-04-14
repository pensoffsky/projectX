
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject', 'projectX/util/Assertion', 'projectX/util/RequestHeader', 'projectX/util/Constants'],
	function(jQuery, ManagedObject, Assertion, RequestHeader, Constants) {
	"use strict";

	var Request = ManagedObject.extend("projectX.util.Request", { metadata : {

		properties : {
			identifier : {type : "int", defaultValue : null},
			name : {type : "string", defaultValue : null},
			description : {type : "string", defaultValue : null},
			httpMethod : {type : "string", defaultValue : Constants.GET},
			url : {type : "string", defaultValue : null},
			tags : {type : "string", defaultValue : null},
			requestBody : {type : "string", defaultValue : null},

			//TODO the status should not be serialized
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

	/**
	 * create a serialized version of this request.
	 * set temporary data to null.
	 * @return {object} a javascript object containing the data that has to be saved to disk.
	 */
	Request.prototype.serialize = function() {
		//set status to null because we dont need this info
		//in the config file that describes the project and requests
		this.resetTempData();
		//TODO really delete status from mProperties, create copy first
		var oRequest = this.mProperties;

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
	 * @return {object} jQuery deferred
	 */
	Request.prototype.execute = function() {
		var oStartTime = new Date();
		var oDeferred = jQuery.ajax({
			method: this.getHttpMethod(),
			url: this.getUrl()
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
