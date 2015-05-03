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
	
	Helper.getBoundObjectForItem = function(oItem, sModelName) {
		var oBindingContext = oItem.getBindingContext(sModelName);
		return oBindingContext.getObject();
	};
	
	Helper.moveArrayElementUp = function(aArray, value, by) {
		var index = aArray.indexOf(value),     
			newPos = index - (by || 1);
		
		if (index === -1) {
			throw new Error("Element not found in array");
		}
		
		if (newPos < 0) {
			newPos = 0;
		}
			
		aArray.splice(index,1);
		aArray.splice(newPos,0,value);
		return newPos;
	};

	Helper.moveArrayElementDown = function(aArray, value, by) {
		var index = aArray.indexOf(value),     
			newPos = index + (by || 1);
		
		if (index === -1) {
			throw new Error("Element not found in array");
		}
		
		if (newPos >= aArray.length) {
			newPos = aArray.length;
		}
		
			aArray.splice(index, 1);
		aArray.splice(newPos,0,value);
		return newPos;
	};
	
	// /////////////////////////////////////////////////////////////////////////////
	// /// Private Methods
	// /////////////////////////////////////////////////////////////////////////////
		

	return Helper;

}, /* bExport= */ true);