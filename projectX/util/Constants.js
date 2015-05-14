/**
 * collection of constants functions
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/base/Object', 'sap/ui/model/odata/ODataMetadata'],
	function(jQuery, Object, ODataMetadata) {
	"use strict";

	var Constants = Object.extend("projectX.util.Constants", { metadata : {

	}});


	/////////////////////////////////////////////////////////////////////////////
	/// Public Attributes
	/////////////////////////////////////////////////////////////////////////////


	/*
	 * Constants for OData Types
	 */

	Constants.ODATATYPE_BINARY = "Edm.Binary";
	Constants.ODATATYPE_BOOLEAN = "Edm.Boolean";
	Constants.ODATATYPE_BYTE = "Edm.Byte";
	Constants.ODATATYPE_DATETIME = "Edm.DateTime";
	Constants.ODATATYPE_DECIMAL = "Edm.Decimal";
	Constants.ODATATYPE_DOUBLE = "Edm.Double";
	Constants.ODATATYPE_SINGLE = "Edm.Single";
	Constants.ODATATYPE_GUID = "Edm.Guid";
	Constants.ODATATYPE_INT16 = "Edm.Int16";
	Constants.ODATATYPE_INT32 = "Edm.Int32";
	Constants.ODATATYPE_INT64 = "Edm.Int64";
	Constants.ODATATYPE_SBYTE = "Edm.SByte";
	Constants.ODATATYPE_STRING = "Edm.String";
	Constants.ODATATYPE_TIME = "Edm.Time";
	Constants.ODATATYPE_DATETIMEOFFSET = "Edm.DateTimeOffset";

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
	 * Constants for the request header value for ACCEPT field
	 */
	Constants.REQUEST_HEADER_VALUE_APPL_ATOM_XML = "application/atom+xml";
	Constants.REQUEST_HEADER_VALUE_APPL_JSON = "application/json";

	/**
	* array of value-keys for ACCEPT field in select control.
	* @type {Array}
	*/
	Constants.REQUEST_HEADER_VALUES_ACCEPT = [
		{key : Constants.REQUEST_HEADER_VALUE_APPL_ATOM_XML},
		{key : Constants.REQUEST_HEADER_VALUE_APPL_JSON}
	];

	/*
	 * Constants for the request header value for ACCEPT-CHARSET field
	 */
	Constants.REQUEST_HEADER_VALUE_UTF_8 = "utf-8";
	Constants.REQUEST_HEADER_VALUE_ISO_8859_1 = "ISO-8859-1";

	/**
	* array of value-keys for ACCEPT field in select control.
	* @type {Array}
	*/
	Constants.REQUEST_HEADER_VALUES_ACCEPT_CHARSET = [
		{key : Constants.REQUEST_HEADER_VALUE_UTF_8},
		{key : Constants.REQUEST_HEADER_VALUE_ISO_8859_1}
	];


	/**
	 * delay between input event and triggering of action in ms. (debounce)
	 * @type {int}
	 */
	Constants.INPUTDELAY = 300;
	
	/**
	 * time to wait between attempts to autosave the current projects in ms.
	 * @type {int}
	 */
	Constants.AUTOSAVEDELAY = 1000;

	Constants.DEFAULT_PROJECT_NAME = "New Project";

	Constants.DEFAULT_PROJECT_URL = "http://services.odata.org/V2/OData/OData.svc/";


	/*EVENTS*/
	Constants.EVENTCHANNEL_SELECTEDPROJECT = "SELECTEDPROJECT";
	Constants.EVENT_SELECTEDPROJECT_CHANGED = "CHANGED";



	///////////////////////////////////////////////////////////////////////////
	/// Public Functions
  ///////////////////////////////////////////////////////////////////////////
	/**
	 * array of script examples used for adding the examples to the textarea.
	 * @type {Array}
	 */
	Constants.SCRIPTEXAMPLES = [
		{//TODO add comments; read named assertions
			text: "Breakpoint",
			script: "//use the development tools of the browser to debug the pre-request script" + "\n" +
					"debugger;"
		},{
			text: "Set Request URL",
			script: "//set a new url for this request. this can also be based on result values from the previous request" + "\n" +
					"req.url = 'http://www.EXAMPLE.com';"
		}, {
			text: "Change Request URL",
			script: "//change the url of this request. this can also be based on result values from the previous request" + "\n" +
					"req.url = req.url + '/EXAMPLE';"
		}, {
			text: "Set Request HTTP Method",
			script: "//supported http methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS" + "\n" +
					"req.httpMethod = 'GET'"
		}, {
			text: "Get Named Assertion Result",
			script: "//get the value of assertion named VARNAME from previous request" + "\n" +
					"var sVarname = prevReq.namedAssertions.VARNAME.evaluatedValue;"
		}, {
			text: "Get Named Assertion Result",
			script: "//check if assertion named VARNAME was checked successfully" + "\n" +
					"var bAssertResult = prevReq.namedAssertions.VARNAME.result;"
		}
	];


	return Constants;

}, /* bExport= */ true);
