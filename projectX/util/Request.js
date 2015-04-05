
// Provides control sap.m.App.
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject', 'projectX/util/Assertion'],
	function(jQuery, ManagedObject, Assertion) {
	"use strict";

	var Request = ManagedObject.extend("projectX.util.Request", { metadata : {
	
		properties : {
			url : {type : "string", defaultValue : null},
			name : {type : "string", defaultValue : null},
			identifier : {type : "int", defaultValue : null},
			httpMethod : {type : "string", defaultValue : "GET"},
			
			
			//TODO the status should not be serialized
			status : {type : "string", defaultValue : null},
			responseHeaders : {type : "string", defaultValue : null},
			responseBody : {type : "string", defaultValue : null}
		},
		events : {
	
		},
		aggregations : {
			assertions : {type : "projectX.util.Assertion", multiple : true}
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
		var oDeferred = jQuery.ajax({
			method: this.getHttpMethod(),
			url: this.getUrl()
		});

		var that = this;
		oDeferred.done(function(data, textStatus, jqXHR) {
			that._setAjaxResult(jqXHR);
		});

		oDeferred.fail(function(jqXHR, textStatus, errorThrown) {
			that._setAjaxResult(jqXHR);
		});
		
		return oDeferred;
	};
	
	Request.prototype.checkAssertions = function(jqXHR) {
		var aAssertions = this.getAssertions();

		var sStatus = jqXHR ? jqXHR.status : this.getStatus();
		var sResponseBody = jqXHR ? jqXHR.responseText : this.getResponseBody();
		var sResponseHeaders = jqXHR ? jqXHR.getAllResponseHeaders() : this.getResponseHeaders();

		for (var i = 0; i < aAssertions.length; i++) {
			aAssertions[i].assert(sStatus, sResponseBody, sResponseHeaders);
		}
	};
	
	
	// /////////////////////////////////////////////////////////////////////////////
	// /// Private Methods
	// /////////////////////////////////////////////////////////////////////////////
	
	/**
	 * helper function that sets the status of the finished ajax call.
	 * @param {object} jqXHR the reuslt form the ajax call
	 */
	Request.prototype._setAjaxResult = function(jqXHR) {
		this.setStatus(jqXHR.status);
	};

	return Request;

}, /* bExport= */ true);