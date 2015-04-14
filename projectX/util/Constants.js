/**
 * collection of constants functions
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/base/Object', 'sap/ui/model/odata/ODataMetadata'],
	function(jQuery, Object, ODataMetadata) {
	"use strict";

	var Constants = Object.extend("projectX.util.Constants", { metadata : {

	}});


		// /////////////////////////////////////////////////////////////////////////////
		// /// Public Attributes
		// /////////////////////////////////////////////////////////////////////////////

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


	/*
	 * Constants for the HTTP method
	 */
	Constants.HTTP_METHOD_GET = "GET";
	Constants.HTTP_METHOD_POST = "POST";
	Constants.HTTP_METHOD_PUT = "PUT";
	Constants.HTTP_METHOD_PATCH = "PATCH";
	Constants.HTTP_METHOD_DELETE = "DELETE";
	Constants.HTTP_METHOD_HEAD = "HEAD";
	Constants.HTTP_METHOD_OPTIONS = "OPTIONS";
	Constants.HTTP_METHOD_CONNECT = "CONNECT";
	Constants.HTTP_METHOD_TRACE = "TRACE";

	/**
	* array of keys for http methods select control.
	* @type {Array}
	*/
	Constants.HTTP_METHODS = [
		{key : Constants.HTTP_METHOD_GET},
		{key : Constants.HTTP_METHOD_POST},
		{key : Constants.HTTP_METHOD_PUT},
		{key : Constants.HTTP_METHOD_PATCH},
		{key : Constants.HTTP_METHOD_DELETE},
		{key : Constants.HTTP_METHOD_HEAD},
		{key : Constants.HTTP_METHOD_OPTIONS}
		// {key : Constants.HTTP_METHOD_CONNECT},
		// {key : Constants.HTTP_METHOD_TRACE}
	];

	/*
	 * Constants for the request header field
	 */
	Constants.REQUEST_HEADER_FIELD_ACCEPT = "Accept";
	Constants.REQUEST_HEADER_FIELD_ACCEPT_CHARSET = "Accept-Charset";
	Constants.REQUEST_HEADER_FIELD_ACCEPT_ENCODING = "Accept-Encoding";
	Constants.REQUEST_HEADER_FIELD_ACCEPT_LANGUAGE = "Accept-Lanugage";
	Constants.REQUEST_HEADER_FIELD_ACCEPT_DATETIME = "Accept-Datetime";
	Constants.REQUEST_HEADER_FIELD_ACCEPT_AUTHORIZATION = "Authorization";
	Constants.REQUEST_HEADER_FIELD_CACHE_CONTROL = "Cache-Control";

	/**
	* array of keys for request header field name select control.
	* @type {Array}
	*/
	Constants.REQUEST_HEADER_FIELDS = [
		{key : Constants.REQUEST_HEADER_FIELD_ACCEPT},
		{key : Constants.REQUEST_HEADER_FIELD_ACCEPT_CHARSET},
		{key : Constants.REQUEST_HEADER_FIELD_ACCEPT_ENCODING},
		{key : Constants.REQUEST_HEADER_FIELD_ACCEPT_LANGUAGE},
		{key : Constants.REQUEST_HEADER_FIELD_ACCEPT_DATETIME},
		{key : Constants.REQUEST_HEADER_FIELD_ACCEPT_AUTHORIZATION},
		{key : Constants.REQUEST_HEADER_FIELD_CACHE_CONTROL}
	];

	/*
	 * Constants for the request header value
	 */
	Constants.REQUEST_HEADER_VALUE_APPL_ATOM_XML = "application/atom+xml";
	Constants.REQUEST_HEADER_VALUE_APPL_JSON = "application/json";

	/**
	* array of keys for request header field value select control.
	* @type {Array}
	*/
	Constants.REQUEST_HEADER_VALUES = [
		{key : Constants.REQUEST_HEADER_VALUE_APPL_ATOM_XML},
		{key : Constants.REQUEST_HEADER_VALUE_APPL_JSON}
	];

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
