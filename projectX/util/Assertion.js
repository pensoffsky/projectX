
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject', 'projectX/util/Helper'],
	function(jQuery, ManagedObject, Helper) {
	"use strict";

	var Assertion = ManagedObject.extend("projectX.util.Assertion", { metadata : {
	
		properties : {
			/**
			 * the property of the response that will be evaluated.
			 * e.g. ResponseText, ResponseHeader, Status
			 * @type {string}
			 */
			assertProperty : {type : "string", defaultValue : null},
			
			/**
			 * the operation that will be used to assert the property.
			 * e.g. Equals, does not equal, lesser than, ...
			 * @type {string}
			 */
			operation : {type : "string", defaultValue : null},
			
			/**
			 * the expected value for the property and operation.
			 * e.g. 200 for status code
			 * @type {Object}
			 */
			expected : {type : "string", defaultValue : null},
			
			
			/**
			 * true if the result variable represent the result of the assertion check.
			 * @type {boolean}
			 */
			resultReady: {type : "boolean", defaultValue : false},
			
			/**
			 * result of the assert function. Can be used for databinding purposes.
			 * true if assert was successfull.
			 * @type {boolean}
			 */
			result : {type : "boolean", defaultValue : false}
			},
		events : {
	
		}
	}});
	
	// /////////////////////////////////////////////////////////////////////////////
	// /// Enums
	// /////////////////////////////////////////////////////////////////////////////

	Assertion.prototype.assertProperties = {
		STATUS : "STATUS",
		RESPONSEBODY : "RESPONSEBODY"
	};
	
	Assertion.prototype.assertOperations = {
		EQUALS : "EQUALS",
		EQUALSNOT : "EQUALSNOT"
	};

	// /////////////////////////////////////////////////////////////////////////////
	// /// Public Methods
	// /////////////////////////////////////////////////////////////////////////////
	
	/**
	 * reset temporary data that was set after the ajax request finished.
	 */
	Assertion.prototype.resetTempData = function() {
		this.setResult(false);
		this.setResultReady(false);
	};
	
	/**
	 * create a serialized version of this assertion.
	 * @return {object} a javascript object containing the data that has to be saved to disk.
	 */
	Assertion.prototype.serialize = function() {
		return this.mProperties;
	};

	/**
	 * check response from ajax call for defined condition
	 * @return {booleean} true if the assertion was ok. false if it failed.
	 */
	Assertion.prototype.assert = function(iStatus, sResponseBody, sResponseHeaders, iResponseTime) {
		//TODO add error handling. what to do if something is fishy?
		try {
			var sAssertProperty = this.getAssertProperty();
			var sOperation = this.getOperation();
			var sExpected = this.getExpected();
			
			//get the value to run the assertion for
			
			if (sAssertProperty === this.assertProperties.STATUS){
				sValue = "" + iStatus;
			} else if (sAssertProperty === this.assertProperties.RESPONSEBODY){
				sValue = sResponseBody;
			}
			
			var sValue = null;
			switch (sAssertProperty) {
				case Helper.ASSERTPROPERTY_STATUS:
				    sValue = "" + iStatus;
					break;
				case Helper.ASSERTPROPERTY_RESPONSEBODY:
				    sValue = sResponseBody;
					break;
				case Helper.ASSERTPROPERTY_HEADER:
				    sValue = sResponseHeaders;
					break;
				case Helper.ASSERTPROPERTY_JSONBODY:
					//TODO implement evaluation of json path
				    sValue = JSON.parse(sResponseBody);
					break;
				case Helper.ASSERTPROPERTY_XMLBODY:
					//TODO implement evaluation of xml path
					var oParser = new DOMParser();
					sValue = oParser.parseFromString(sResponseBody, "text/xml");
					break;
				case Helper.ASSERTPROPERTY_RESPONSETIME:
				    sValue = "" + iResponseTime;
					break;
			  default:
			    return false;
			}
			
			//get the operation
			var fOp = null;
			switch (sOperation) {
				case Helper.ASSERTOPERATION_EQUALS:
				    fOp = this._opEquals;
					break;
				case Helper.ASSERTOPERATION_EQUALSNOT:
				    fOp = this._opEqualsNot;
					break;
				case Helper.ASSERTOPERATION_LESS:
				    fOp = this._opLess;
					break;
				case Helper.ASSERTOPERATION_LESSOREQUAL:
				    fOp = this._opLessOrEqual;
					break;
				case Helper.ASSERTOPERATION_GREATER:
				    fOp = this._opGreater;
					break;
				case Helper.ASSERTOPERATION_GREATEROREQUAL:
				    fOp = this._opGreaterOrEqual;
					break;
				case Helper.ASSERTOPERATION_EXISTS:
				    fOp = this._opExists;
					break;
				case Helper.ASSERTOPERATION_EXISTSNOT:
				    fOp = this._opExistsNot;
					break;
				case Helper.ASSERTOPERATION_CONTAINS:
				    fOp = this._opContains;
					break;
				case Helper.ASSERTOPERATION_CONTAINSNOT:
				    fOp = this._opContainsNot;
					break;
			  default:
			    return false;
			}
			
			var bRes = fOp(sValue, sExpected);
			this.setResultReady(true);
			this.setResult(bRes);
			return bRes;
		} catch (e) {
			jQuery.sap.log.error("Assertion: " + e);
		} 
		
		this.setResultReady(true);
		this.setResult(false);
		return false;
	};

	
	// /////////////////////////////////////////////////////////////////////////////
	// /// Private Methods
	// /////////////////////////////////////////////////////////////////////////////
		
		
	Assertion.prototype._opEquals = function(sValue, sExpectedValue){
		return (sValue === sExpectedValue);
	};
	
	Assertion.prototype._opEqualsNot = function(sValue, sExpectedValue){
		return !(sValue === sExpectedValue);
	};
	
	Assertion.prototype._opLess = function(sValue, sExpectedValue){
		var iValue = parseInt(sValue, 10);
		var iExpectedValue = parseInt(sExpectedValue, 10);
		return iValue < iExpectedValue;
	};

	Assertion.prototype._opLessOrEqual = function(sValue, sExpectedValue){
		var iValue = parseInt(sValue, 10);
		var iExpectedValue = parseInt(sExpectedValue, 10);
		return iValue <= iExpectedValue;
	};

	Assertion.prototype._opGreater = function(sValue, sExpectedValue){
		var iValue = parseInt(sValue, 10);
		var iExpectedValue = parseInt(sExpectedValue, 10);
		return iValue > iExpectedValue;
	};

	Assertion.prototype._opGreaterOrEqual = function(sValue, sExpectedValue){
		var iValue = parseInt(sValue, 10);
		var iExpectedValue = parseInt(sExpectedValue, 10);
		return iValue >= iExpectedValue;
	};

	Assertion.prototype._opExists = function(sValue, sExpectedValue){
		if (sValue && sValue !== ""){
			return true;
		}
		return false;
	};

	Assertion.prototype._opExistsNot = function(sValue, sExpectedValue){
		if (sValue && sValue !== ""){
			return false;
		}
		return true;
	};

	Assertion.prototype._opContains = function(sValue, sExpectedValue){
		var iRes = sValue.indexOf(sExpectedValue);
		return (iRes >= 0);
	};

	Assertion.prototype._opContainsNot = function(sValue, sExpectedValue){
		var iRes = sValue.indexOf(sExpectedValue);
		return (iRes === -1);
	};	

	return Assertion;

}, /* bExport= */ true);