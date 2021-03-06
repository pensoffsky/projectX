
//TODO add jsonpath as dependency here so we do not have to include it into the whole project?

sap.ui.define(['jquery.sap.global', 'projectX/util/MyManagedObject', 'projectX/util/Helper', 'projectX/util/Constants'],
	function(jQuery, MyManagedObject, Helper, Constants) {
	"use strict";

	var Assertion = MyManagedObject.extend("projectX.util.Assertion", { 
		constructor : function (oData) {
			MyManagedObject.apply(this, arguments);
			if (!oData) {
				return;
			}
		},
		metadata : {
			properties : {
				/**
				 * the name of the assertion. can be used to reference the assertion in 
				 * the javascript supplied by the user in a sequence.
				 * @type {string}
				 */
				name : {type : "string", defaultValue : null},
				
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
				 * the path for json or xmldocument asserts
				 * @type {string}
				 */
				path : {type : "string", defaultValue : null},
				
				/**
				 * the expected value for the property and operation.
				 * e.g. 200 for status code
				 * @type {string}
				 */
				expected : {type : "string", defaultValue : null},
				
				//TEMP DATA
				
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
				result : {type : "boolean", defaultValue : false},
				
				/**
				 * evaluated value of the assert function. Can be used for databinding purposes.
				 * string representation of what was selected with this assertion.
				 * @type {string}
				 */
				evaluatedValue : {type : "string", defaultValue : null}
				},
			events : {
		
			}
		}
	});

	// /////////////////////////////////////////////////////////////////////////////
	// /// Public Methods
	// /////////////////////////////////////////////////////////////////////////////
	
	
	Assertion.createDefaultAssertion = function() {
		var sProperty = Constants.ASSERTPROPERTY_STATUS;
		var sOperation = Constants.ASSERTOPERATION_EQUALS; 
		var oAssertion = new Assertion();
		oAssertion.setAssertProperty(sProperty);
		oAssertion.setOperation(sOperation);
		oAssertion.setExpected("200");
		return oAssertion;
	};
	
	/**
	 * reset temporary data that was set after the ajax request finished.
	 */
	Assertion.prototype.resetTempData = function() {
		this.setResult(false);
		this.setResultReady(false);
		this.setEvaluatedValue(null);
	};
	
	/**
	 * create a serialized version of this assertion.
	 * @return {object} a javascript object containing the data that has to be saved to disk.
	 */
	Assertion.prototype.serialize = function() {
		var oAssertion = {};
		oAssertion.name = this.getName();
		oAssertion.assertProperty = this.getAssertProperty();
		oAssertion.operation = this.getOperation();
		oAssertion.path = this.getPath();
		oAssertion.expected = this.getExpected();
		return oAssertion;
	};

	/**
	 * check response from ajax call for defined condition
	 * @return {booleean} true if the assertion was ok. false if it failed.
	 */
	Assertion.prototype.assert = function(iStatus, sResponseBody, sResponseHeaders, iResponseTime, sSapStatistics) {
		//TODO this method is way to long
		try {
			var sAssertProperty = this.getAssertProperty();
			var sOperation = this.getOperation();
			var sExpected = this.getExpected();
			var sPath = this.getPath(); //value from the xmlpath/jsonpath field
			
			//get the value to run the assertion for
			var sValue = null;
			switch (sAssertProperty) {
				case Constants.ASSERTPROPERTY_STATUS:
				    sValue = "" + iStatus;
					break;
				case Constants.ASSERTPROPERTY_RESPONSEBODY:
				    sValue = sResponseBody;
					break;
				case Constants.ASSERTPROPERTY_HEADER:
				    sValue = sResponseHeaders;
					break;
				case Constants.ASSERTPROPERTY_JSONBODY:
					var oJsonObject = JSON.parse(sResponseBody);
					var vRes = jsonPath(oJsonObject, sPath, {evalType:'RESULT',safeEval:true});
					sValue = JSON.stringify(vRes);
					break;
				case Constants.ASSERTPROPERTY_XMLBODY:
					var oParser = new DOMParser();
					var oXmlDoc = oParser.parseFromString(sResponseBody, "text/xml");
					//var nsResolver = oXmlDoc.createNSResolver( oXmlDoc.ownerDocument == null ? oXmlDoc.documentElement : oXmlDoc.ownerDocument.documentElement);
					var nsResolver = function(prefix) {
					    switch (prefix) {
					        case 'xhtml':
					            return 'http://www.w3.org/1999/xhtml';
					        case 'mathml':
					            return 'http://www.w3.org/1998/Math/MathML';
							case 'atom':
					            return 'http://www.w3.org/2005/Atom';
							case 'd':
					            return 'http://schemas.microsoft.com/ado/2007/08/dataservices';
							case 'm':
					            return 'http://schemas.microsoft.com/ado/2007/08/dataservices/metadata';
					        default:
					            return 'http://www.w3.org/2005/Atom';
					    }
					};
					var vRes = oXmlDoc.evaluate(sPath, oXmlDoc, nsResolver, XPathResult.ANY_TYPE, null);
					sValue = Helper.xpathResultToString(vRes);
					//TODO use other logging
					console.log(sValue);
					break;
				case Constants.ASSERTPROPERTY_RESPONSETIME:
				    sValue = "" + iResponseTime;
					break;
				case Constants.ASSERTPROPERTY_SAPSTATISTICS:
				    var aStatisticEntries = sSapStatistics.split(",");
					for (var i = 0; i < aStatisticEntries.length; i++) {
						var aSingleEntry = aStatisticEntries[i].split("=");
						if (aSingleEntry[0] === sPath) {
							sValue = aSingleEntry[1];
						}
					}
					break;
			  default:
			    return false;
			}
			
			this.setEvaluatedValue(sValue);
			
			//get the operation to run against the value
			var fOp = null;
			switch (sOperation) {
				case Constants.ASSERTOPERATION_EQUALS:
				    fOp = this._opEquals;
					break;
				case Constants.ASSERTOPERATION_EQUALSNOT:
				    fOp = this._opEqualsNot;
					break;
				case Constants.ASSERTOPERATION_LESS:
				    fOp = this._opLess;
					break;
				case Constants.ASSERTOPERATION_LESSOREQUAL:
				    fOp = this._opLessOrEqual;
					break;
				case Constants.ASSERTOPERATION_GREATER:
				    fOp = this._opGreater;
					break;
				case Constants.ASSERTOPERATION_GREATEROREQUAL:
				    fOp = this._opGreaterOrEqual;
					break;
				case Constants.ASSERTOPERATION_EXISTS:
				    fOp = this._opExists;
					break;
				case Constants.ASSERTOPERATION_EXISTSNOT:
				    fOp = this._opExistsNot;
					break;
				case Constants.ASSERTOPERATION_CONTAINS:
				    fOp = this._opContains;
					break;
				case Constants.ASSERTOPERATION_CONTAINSNOT:
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