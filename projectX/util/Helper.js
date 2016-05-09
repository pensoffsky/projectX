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
	
	
	Helper.createMarkdownDocuForProject = function(oProject){
		var sRes = "";
		sRes += Helper._mdLevel(oProject.getName(), 1) + "\n";
		
		sRes += "Prefix URL: `" + oProject.getPrefixUrl() + "\n";
		sRes += "CSRF Token URL: `" + oProject.getCsrfTokenUrl() + "\n\n";
		
		//requests
		var aRequests = oProject.getRequests();
		var aFields = ["Name", "Description", "HttpMethod", "UseProjectPrefixUrl", "FetchCSRFToken", "Url", "Tags", "RequestBody", "ScriptCode", "TestScriptCode", "ResponseBodyFormat", "GroupName", "UseBasicAuthentication", "UsernameBasicAuth"];
		for (var i = 0; i < aRequests.length; i++) {
			sRes += Helper._mdLevel("Request: " + aRequests[i].getName() ,2);
			sRes += Helper._mdObject(aRequests[i], aFields) + "\n";
			
			// var aAssertions = aRequests[i].getAssertions();
			// aFields = ["Name", "AssertProperty", "Operation", "Path", "Expected"];
			// for (var i = 0; i < aAssertions.length; i++) {
			// 	sRes += Helper._mdObject(aAssertions[i], aFields);	
			// }
		}
		
		return sRes;
	};
	
	Helper._mdLevel = function(sValue, iLevel) {
		var sRes = "";
		for (var i = 0; i < iLevel; i++) {
			sRes += "#";
		}
		return sRes + " " + sValue + "\n";
	};
	
	Helper._mdObject = function(oRequest, aRequestFields) {
		var sRes = "";
		for (var i = 0; i < aRequestFields.length; i++) {
			var sValue = oRequest["get" + aRequestFields[i]]();
			if(!sValue) {
				continue;
			}
			sRes += aRequestFields[i] + "\n> " + sValue + "\n\n";
		}
		return sRes + "\n";
	};
	
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
		try {
			var oBindingContext = oItem.getBindingContext(sModelName);
			return oBindingContext.getObject();	
		} catch (e) {
			return null;
		}
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
	
	/**
	 * scroll the sap.m.List control to the selected item.
	 * @param  {object} oList list control
	 * @return {boolen}       true if scroll function was called
	 */
	Helper.scrollSelectedItemOfListIntoView = function(oListCtrl) {
		if (!oListCtrl) {
			return false;
		}
	
		var oSelectedItem = oListCtrl.getSelectedItem();
		if (!oSelectedItem) {
			return false;
		}
		var iIndex = oListCtrl.indexOfItem(oSelectedItem);
		var oDomRef = oListCtrl.getItems()[iIndex].getDomRef();
		
		if (!oDomRef) {
			return false;
		}
		
		oDomRef.scrollIntoView();
		return true;
	};
	
	/**
	 * Add a filter to a binding
	 * @param  {function} FilterConstructor constructor function of sap.ui.model.Filter
	 * @param  {object} oBinding          the binding from the control
	 * @param  {[type]} vFilterOperator   filter operator from sap.ui.model.FilterOperator
	 * @param  {string} sPropPath         the path to put the filter on
	 * @param  {string} sQuery            the query to filter for
	 */
	Helper.addFilterToListBinding = function(FilterConstructor, oBinding, vFilterOperator, sPropPath ,sQuery) {
		// add filter for search
		var aFilters = [];

		if (sQuery && sQuery.length > 0) {
			var filter = new FilterConstructor(sPropPath,
				vFilterOperator,
				sQuery);
			aFilters.push(filter);
		}

		// update list binding
		oBinding.filter(aFilters, "Application");
	};
	
	// /////////////////////////////////////////////////////////////////////////////
	// /// Private Methods
	// /////////////////////////////////////////////////////////////////////////////
		

	return Helper;

}, /* bExport= */ true);