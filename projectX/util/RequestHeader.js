
sap.ui.define(['jquery.sap.global', 'projectX/util/MyManagedObject', 'projectX/util/Constants'],
	function(jQuery, MyManagedObject, Constants) {
	"use strict";

	var RequestHeader = MyManagedObject.extend("projectX.util.RequestHeader", {
		constructor : function (oData) {
			MyManagedObject.apply(this, arguments);
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
