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

	/*
	 * Constants for the Assertion Property
	 */
	Constants.ASSERTPROPERTY_STATUS = "STATUS";
	Constants.ASSERTPROPERTY_RESPONSEBODY = "RESPONSEBODY";
	Constants.ASSERTPROPERTY_HEADER = "RESPONSEHEADER";
	Constants.ASSERTPROPERTY_JSONBODY = "JSONBODY";
	Constants.ASSERTPROPERTY_XMLBODY = "XMLBODY";
	Constants.ASSERTPROPERTY_RESPONSETIME = "RESPONSETIME";

	/**
	 * array of keys for assertion property select control.
	 * @type {Array}
	 */
	Constants.ASSERTPROPERTIES = [
		{key : Constants.ASSERTPROPERTY_STATUS},
		{key : Constants.ASSERTPROPERTY_RESPONSEBODY},
		{key : Constants.ASSERTPROPERTY_HEADER},
		{key : Constants.ASSERTPROPERTY_JSONBODY},
		{key : Constants.ASSERTPROPERTY_XMLBODY},
		{key : Constants.ASSERTPROPERTY_RESPONSETIME}
	];

	/*
     * Constants for the Assertion Operation
	 */
	Constants.ASSERTOPERATION_EQUALS = "EQUALS";
	Constants.ASSERTOPERATION_EQUALSNOT = "EQUALSNOT";
	Constants.ASSERTOPERATION_LESS = "LESS";
	Constants.ASSERTOPERATION_LESSOREQUAL = "LESSOREQUAL";
	Constants.ASSERTOPERATION_GREATER = "GREATER";
	Constants.ASSERTOPERATION_GREATEROREQUAL = "GREATEROREQUAL";
	Constants.ASSERTOPERATION_EXISTS = "EXISTS";
	Constants.ASSERTOPERATION_EXISTSNOT = "EXISTSNOT";
	Constants.ASSERTOPERATION_CONTAINS = "CONTAINS";
	Constants.ASSERTOPERATION_CONTAINSNOT = "CONTAINSNOT";

	/**
	* array of keys for assertion property select control.
	* @type {Array}
	*/
	Constants.ASSERTOPERATIONS = [
		{key : Constants.ASSERTOPERATION_EQUALS},
		{key : Constants.ASSERTOPERATION_EQUALSNOT},
		{key : Constants.ASSERTOPERATION_LESS},
		{key : Constants.ASSERTOPERATION_LESSOREQUAL},
		{key : Constants.ASSERTOPERATION_GREATER},
		{key : Constants.ASSERTOPERATION_GREATEROREQUAL},
		{key : Constants.ASSERTOPERATION_EXISTS},
		{key : Constants.ASSERTOPERATION_EXISTSNOT},
		{key : Constants.ASSERTOPERATION_CONTAINS},
		{key : Constants.ASSERTOPERATION_CONTAINSNOT}
	];




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
