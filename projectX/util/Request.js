
// Provides control sap.m.App.
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject'],
	function(jQuery, ManagedObject) {
	"use strict";

	var Request = ManagedObject.extend("projectX.util.Request", { metadata : {
	
		properties : {
			url : {type : "string", defaultValue : null},
			name : {type : "string", defaultValue : null},
			identifier : {type : "int", defaultValue : null},
			httpMethod : {type : "string", defaultValue : "GET"},
			//TODO the status should not be serialized
			status : {type : "string", defaultValue : null},
		},
		events : {
	
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
		return this.mProperties;
	};

	/**
	 * reset temporary data that was set after the ajax request finished.
	 */
	Request.prototype.resetTempData = function() {
		this.setStatus(null);
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