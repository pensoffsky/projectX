/**
 * collection of helper functions
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/base/Object', 'sap/ui/model/odata/ODataMetadata'],
	function(jQuery, Object, ODataMetadata) {
	"use strict";

	var Helper = Object.extend("projectX.util.Helper", { metadata : {
	
	}});
	
	// /////////////////////////////////////////////////////////////////////////////
	// /// Public Functions
	// /////////////////////////////////////////////////////////////////////////////
	
	/*
	 * Constants for the Assertion Property
	 */
	Helper.ASSERTPROPERTY_STATUS = "STATUS";
	Helper.ASSERTPROPERTY_RESPONSEBODY = "RESPONSEBODY";
	Helper.ASSERTPROPERTY_HEADER = "RESPONSEHEADER";
	Helper.ASSERTPROPERTY_JSONBODY = "JSONBODY";
	Helper.ASSERTPROPERTY_XMLBODY = "XMLBODY";
	Helper.ASSERTPROPERTY_RESPONSETIME = "RESPONSETIME";

	/**
	 * array of keys for assertion property select control.
	 * @type {Array}
	 */
	Helper.ASSERTPROPERTIES = [
		{key : Helper.ASSERTPROPERTY_STATUS},
		{key : Helper.ASSERTPROPERTY_RESPONSEBODY},
		{key : Helper.ASSERTPROPERTY_HEADER},
		{key : Helper.ASSERTPROPERTY_JSONBODY},
		{key : Helper.ASSERTPROPERTY_XMLBODY},
		{key : Helper.ASSERTPROPERTY_RESPONSETIME}
	];

	/*
     * Constants for the Assertion Operation
	 */
	Helper.ASSERTOPERATION_EQUALS = "EQUALS";
	Helper.ASSERTOPERATION_EQUALSNOT = "EQUALSNOT";
	Helper.ASSERTOPERATION_LESS = "LESS";
	Helper.ASSERTOPERATION_LESSOREQUAL = "LESSOREQUAL";
	Helper.ASSERTOPERATION_GREATER = "GREATER";
	Helper.ASSERTOPERATION_GREATEROREQUAL = "GREATEROREQUAL";
	Helper.ASSERTOPERATION_EXISTS = "EXISTS";
	Helper.ASSERTOPERATION_EXISTSNOT = "EXISTSNOT";
	Helper.ASSERTOPERATION_CONTAINS = "CONTAINS";
	Helper.ASSERTOPERATION_CONTAINSNOT = "CONTAINSNOT";

	/**
	* array of keys for assertion property select control.
	* @type {Array}
	*/
	Helper.ASSERTOPERATIONS = [
		{key : Helper.ASSERTOPERATION_EQUALS},
		{key : Helper.ASSERTOPERATION_EQUALSNOT},
		{key : Helper.ASSERTOPERATION_LESS},
		{key : Helper.ASSERTOPERATION_LESSOREQUAL},
		{key : Helper.ASSERTOPERATION_GREATER},
		{key : Helper.ASSERTOPERATION_GREATEROREQUAL},
		{key : Helper.ASSERTOPERATION_EXISTS},
		{key : Helper.ASSERTOPERATION_EXISTSNOT},
		{key : Helper.ASSERTOPERATION_CONTAINS},
		{key : Helper.ASSERTOPERATION_CONTAINSNOT}
	];
	
	
	
	/**
	 * static function doing stuff or not
	 */
	Helper.stuff = function() {
		
	};
	
	Helper.getODataServiceMetadata = function(sServiceUrl) {
		var oDeferred = jQuery.Deferred();
		
		var sMetadataUrl = sServiceUrl + "/$metadata";
		var oMetaData = new ODataMetadata(sMetadataUrl,{
			async: true
		});
		oMetaData.attachFailed(function(){
			oMetaData.destroy();
			oDeferred.reject();
		});
		oMetaData.attachLoaded(function(){
			var oServiceMetadata = oMetaData.getServiceMetadata();
			oMetaData.destroy();
			oDeferred.resolve(oServiceMetadata);
		});
		
		return oDeferred;
	};
	
	Helper.getBoundObjectForItem = function(oItem) {
		var oBindingContext = oItem.getBindingContext();
		var oModel = oBindingContext.getModel();
		var sPath = oBindingContext.getPath();
		var oboundObject = oModel.getProperty(sPath);
		return oboundObject;
	};
	
	// /////////////////////////////////////////////////////////////////////////////
	// /// Private Methods
	// /////////////////////////////////////////////////////////////////////////////
		

	return Helper;

}, /* bExport= */ true);