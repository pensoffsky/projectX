
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject', 'projectX/util/Constants'],
	function(jQuery, ManagedObject, Constants) {
	"use strict";

	var RequestHeader = ManagedObject.extend("projectX.util.RequestHeader", { 
		constructor : function (oData) {
			ManagedObject.apply(this, arguments);
			this.setFieldName(oData.fieldName);
			this.setFieldValue(oData.fieldValue);
		},
		metadata : {
			properties : {
				/**
				 * the name of HTTP request head item
				 * e.g. Accept, Accept-Encoding, Cache-Control, ...
				 * @type {string}
				 */
				fieldName : {type : "string", defaultValue : null},

				/**
				 * the value of the HTTP request head item
				 * @type {string}
				 */
				fieldValue : {type : "string", defaultValue : null}

				},
			events : {

			}
		}
	});

	// /////////////////////////////////////////////////////////////////////////////
	// /// Public Methods
	// /////////////////////////////////////////////////////////////////////////////
	/**
	 * create a serialized version of this assertion.
	 * @return {object} a javascript object containing the data that has to be saved to disk.
	 */
	RequestHeader.prototype.serialize = function() {
		var oRequestHeader = {};
		oRequestHeader.fieldName = this.getFieldName();
		oRequestHeader.fieldValue = this.getFieldValue();
		return oRequestHeader;
	};


	// /////////////////////////////////////////////////////////////////////////////
	// /// Private Methods
	// /////////////////////////////////////////////////////////////////////////////


	return RequestHeader;

}, /* bExport= */ true);
