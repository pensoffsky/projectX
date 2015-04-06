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