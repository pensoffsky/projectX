/**
 * collection of constants functions
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/base/Object', 'sap/ui/model/odata/ODataMetadata'],
	function(jQuery, Object, ODataMetadata) {
	"use strict";

	var Constants = Object.extend("projectX.util.Constants", { metadata : {
		// properties : {
		//
		// 	RequestHeaderFields : {
		// 			type : "string",
		// 			defaultValue : [
		// 				"Accept",
		// 				"Accept-Charset",
		// 				"Accept-Encoding",
		// 				"Accept-Lanugage",
		// 				"Accept-Datetime",
		// 				"Authorization",
		// 				"Cache-Control"
		// 			]},
		// 	RequestHeaderFieldsExample : {
		// 			type : "string",
		// 			defaultValue : [
		// 				"Accept: text/plain",
		// 				"Accept-Charset: utf-8"
		// 			]}
		// },
		// events : {
		//
		// }
	}});

	// /////////////////////////////////////////////////////////////////////////////
	// /// Public Functions
	// /////////////////////////////////////////////////////////////////////////////

	Constants.httpMethod = {
		GET : "GET",
		POST : "POST"
	};

	// /////////////////////////////////////////////////////////////////////////////
	// /// Public Functions
	// /////////////////////////////////////////////////////////////////////////////

	/**
	 * static function doing stuff or not
	 */


	// /////////////////////////////////////////////////////////////////////////////
	// /// Private Methods
	// /////////////////////////////////////////////////////////////////////////////


	return Constants;

}, /* bExport= */ true);
