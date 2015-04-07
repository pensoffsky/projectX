
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject'],
	function(jQuery, ManagedObject) {
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
	Assertion.prototype.assert = function(iStatus, sResponseBody, sResponseHeaders) {
		//TODO add error handling. what to do if something is fishy?
		var sAssertProperty = this.getAssertProperty();
		var sOperation = this.getOperation();
		var sExpected = this.getExpected();
		
		var fOpEquals = function(sValue, sExpectedValue){
			return (sValue === sExpectedValue);
		};
		var fOpEqualsNot = function(sValue, sExpectedValue){
			return !(sValue === sExpectedValue);
		};
		
		var sValue = null;
		if (sAssertProperty === this.assertProperties.STATUS){
			sValue = "" + iStatus;
		} else if (sAssertProperty === this.assertProperties.RESPONSEBODY){
			sValue = sResponseBody;
		}
		
		var fOp = null;
		if (sOperation === this.assertOperations.EQUALS){
			fOp = fOpEquals;
		} else if (sOperation === this.assertOperations.EQUALSNOT){
			fOp = fOpEqualsNot;
		}
		
		var bRes = fOp(sValue, sExpected);
		this.setResultReady(true);
		this.setResult(bRes);
		return bRes;
	};

	
	// /////////////////////////////////////////////////////////////////////////////
	// /// Private Methods
	// /////////////////////////////////////////////////////////////////////////////
		

	return Assertion;

}, /* bExport= */ true);