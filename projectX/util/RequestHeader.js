
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject', 'projectX/util/Constants'],
	function(jQuery, ManagedObject, Constants) {
	"use strict";

	var RequestHeader = ManagedObject.extend("projectX.util.RequestHeader", { metadata : {

		properties : {
			/**
			 * the name of HTTP request head item
			 * e.g. Accept, Accept-Encoding, Cache-Control, ...
			 * @type {string}
			 */
			fieldName : {type : "string", defaultValue : Constants.REQUEST_HEADER_FIELD_ACCEPT},

			/**
			 * the value of the HTTP request head item
			 * @type {string}
			 */
			fieldValue : {type : "string", defaultValue : Constants.REQUEST_HEADER_VALUE_APPL_ATOM_XML}

			},
		events : {

		}
	}});

	// /////////////////////////////////////////////////////////////////////////////
	// /// Public Methods
	// /////////////////////////////////////////////////////////////////////////////
	/**
	 * create a serialized version of this assertion.
	 * @return {object} a javascript object containing the data that has to be saved to disk.
	 */
	RequestHeader.prototype.serialize = function() {
		return this.mProperties;
	};


	// /////////////////////////////////////////////////////////////////////////////
	// /// Private Methods
	// /////////////////////////////////////////////////////////////////////////////


	return RequestHeader;

}, /* bExport= */ true);
