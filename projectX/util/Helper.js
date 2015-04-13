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
	 * converts a xpathResult object from xmldocument.evaluate to string.
	 * @param {object} oXpathResult result form xmldocument evaluate function.
	 */
	Helper.xpathResultToString = function(oXpathResult){
		var sRes = "";
		var oNode = null;
		switch (oXpathResult.resultType) {
			case XPathResult.NUMBER_TYPE:
				sRes =  "" + oXpathResult.numberValue;
				break;
			case XPathResult.STRING_TYPE:
				sRes = oXpathResult.stringValue;
				break;
			case XPathResult.BOOLEAN_TYPE:
				sRes =  "" + oXpathResult.booleanValue;
				break;
			case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
				oNode = oXpathResult.iterateNext();
				while (oNode) {
					sRes += oNode.textContent;
					oNode = oXpathResult.iterateNext();
				}
				break;
			case XPathResult.ORDERED_NODE_ITERATOR_TYPE:
				oNode = oXpathResult.iterateNext();
				while (oNode) {
					sRes += oNode.textContent;
					oNode = oXpathResult.iterateNext();
				}
				break;
			case XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE:
				for ( var i = 0; i < oXpathResult.snapshotLength; i++ ) {
				  sRes += oXpathResult.snapshotItem(i).textContent;
				}
				break;
			case XPathResult.ORDERED_NODE_SNAPSHOT_TYPE:
				for ( var i = 0; i < oXpathResult.snapshotLength; i++ ) {
					sRes += oXpathResult.snapshotItem(i).textContent;
				}
				break;
			case XPathResult.ANY_UNORDERED_NODE_TYPE:
				sRes += oXpathResult.singleNodeValue.textContent;
				break;
			case XPathResult.FIRST_ORDERED_NODE_TYPE:
				sRes += oXpathResult.singleNodeValue.textContent;
				break;
		default:
			return "";
		}
		
		jQuery.sap.log.error(sRes);
		return sRes;
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