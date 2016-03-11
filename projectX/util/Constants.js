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
     * Constants for truncation of responseBody on request Screen
	 */
	/**
	 * the length of the response body that triggers the truncation
	 * @type {integer}
	 */
	Constants.REQUEST_RESPONSEBODY_LENGTH_LIMIT = 1000 * 1000;
	/**
	 * the length of the response body gets truncated to
	 * @type {integer}
	 */
	Constants.REQUEST_RESPONSEBODY_LENGTH_TRUNCATED = 10 * 1000;

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
	Constants.ASSERTPROPERTY_SAPSTATISTICS = "SAPSTATISTICS";

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
		{key : Constants.ASSERTPROPERTY_RESPONSETIME},
		{key : Constants.ASSERTPROPERTY_SAPSTATISTICS}
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
	 * Constants for the HTTP method used in CSS file
	 */
	Constants.CSS_HTTP_METHOD_GET = "get";
	Constants.CSS_HTTP_METHOD_POST = "post";
	Constants.CSS_HTTP_METHOD_PUT = "put";
	Constants.CSS_HTTP_METHOD_PATCH = "patch";
	Constants.CSS_HTTP_METHOD_DELETE = "delete";
	Constants.CSS_HTTP_METHOD_HEAD = "head";
	Constants.CSS_HTTP_METHOD_OPTIONS = "options";
	Constants.CSS_HTTP_METHOD_CONNECT = "connect";
	Constants.CSS_HTTP_METHOD_TRACE = "trace";


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
	Constants.REQUEST_HEADER_FIELD_CONTENT_TYPE = "Content-Type";
	Constants.REQUEST_HEADER_FIELD_SAP_STATISTICS = "sap-statistics";
	Constants.REQUEST_HEADER_FIELD_SAPGW_STATISTICS = "sapgw-statistics";
	Constants.REQUEST_HEADER_FIELD_USER_AGENT = "User-Agent";

	/**
	* array of keys for request header field name select control.
	* @type {Array}
	*/
	Constants.REQUEST_HEADER_FIELDS = [
		{key : Constants.REQUEST_HEADER_FIELD_ACCEPT},
		{key : Constants.REQUEST_HEADER_FIELD_ACCEPT_CHARSET},
		{key : Constants.REQUEST_HEADER_FIELD_ACCEPT_ENCODING},
		{key : Constants.REQUEST_HEADER_FIELD_ACCEPT_LANGUAGE},
		{key : Constants.REQUEST_HEADER_FIELD_CONTENT_TYPE},
		{key : Constants.REQUEST_HEADER_FIELD_SAP_STATISTICS},
		{key : Constants.REQUEST_HEADER_FIELD_SAPGW_STATISTICS},
		{key : Constants.REQUEST_HEADER_FIELD_USER_AGENT}
	];

	/*
	 * Constants for the request header value for ACCEPT field
	 */
	Constants.REQUEST_HEADER_VALUE_APPL_ATOM_XML = "application/atom+xml";
	Constants.REQUEST_HEADER_VALUE_APPL_JSON = "application/json";

	Constants.REQUEST_HEADER_VALUE_MULTIPART_MIXED_BOUNDARY = "multipart/mixed; boundary=batch";

	/**
	* array of value-keys for ACCEPT field in control.
	* @type {Array}
	*/
	Constants.REQUEST_HEADER_VALUES_ACCEPT = [
		{key : Constants.REQUEST_HEADER_VALUE_APPL_ATOM_XML},
		{key : Constants.REQUEST_HEADER_VALUE_APPL_JSON}
	];

	/**
	* array of value-keys for CONTENT-TYPE field in control.
	* @type {Array}
	*/
	Constants.REQUEST_HEADER_VALUES_CONTENT_TYPE = [
		{key : Constants.REQUEST_HEADER_VALUE_APPL_ATOM_XML},
		{key : Constants.REQUEST_HEADER_VALUE_APPL_JSON}
	];

	/**
	* array of value-keys for SAPGW-STATISTICS field in control.
	* @type {Array}
	*/
	Constants.REQUEST_HEADER_VALUES_SAP_STATISTICS = [
		{key : "true"},
		{key : "false"}
	];

	/**
	* array of value-keys for SAP-STATISTICS field in control.
	* @type {Array}
	*/
	Constants.REQUEST_HEADER_VALUES_SAPGW_STATISTICS = [
		{key : "true"},
		{key : "false"}
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

	/*
	 * Constants for the request header value for ACCEPT-ENCODING field
	 */
	Constants.REQUEST_HEADER_VALUE_COMPRESS = "compress";
	Constants.REQUEST_HEADER_VALUE_DEFLATE = "deflate";
	Constants.REQUEST_HEADER_VALUE_EXI = "exi";
	Constants.REQUEST_HEADER_VALUE_GZIP = "gzip";
	Constants.REQUEST_HEADER_VALUE_IDENTITY = "identity";
	Constants.REQUEST_HEADER_VALUE_PACK200_GZIP = "pack200-gzip";

	/**
	* array of value-keys for ACCEPT-ENCODING field in select control.
	* @type {Array}
	*/
	Constants.REQUEST_HEADER_VALUES_ACCEPT_ENCODING = [
		{key : Constants.REQUEST_HEADER_VALUE_COMPRESS},
		{key : Constants.REQUEST_HEADER_VALUE_DEFLATE},
		{key : Constants.REQUEST_HEADER_VALUE_EXI},
		{key : Constants.REQUEST_HEADER_VALUE_GZIP},
		{key : Constants.REQUEST_HEADER_VALUE_IDENTITY},
		{key : Constants.REQUEST_HEADER_VALUE_PACK200_GZIP}
	];

	/*
	 * Constants for the request header value for ACCEPT-LANGUAGE field
	 */
	Constants.REQUEST_HEADER_VALUE_CH = "CH";
	Constants.REQUEST_HEADER_VALUE_DE = "DE";
	Constants.REQUEST_HEADER_VALUE_EN = "EN";
	Constants.REQUEST_HEADER_VALUE_FR = "FR";

	/**
	* array of value-keys for ACCEPT-LANGUAGE field in select control.
	* @type {Array}
	*/
	Constants.REQUEST_HEADER_VALUES_ACCEPT_LANGUAGE = [
		{key : Constants.REQUEST_HEADER_VALUE_CH},
		{key : Constants.REQUEST_HEADER_VALUE_DE},
		{key : Constants.REQUEST_HEADER_VALUE_EN},
		{key : Constants.REQUEST_HEADER_VALUE_FR}
	];

	/*
	 * Constants for the request header value for ACCEPT-LANGUAGE field
	 */
	Constants.REQUEST_HEADER_VALUE_USER_AGENT_IPAD = "Mozilla/5.0 (iPad; U; CPU OS 3_2_1 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Mobile/7B405";
	Constants.REQUEST_HEADER_VALUE_USER_AGENT_SAFARI = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A";
	Constants.REQUEST_HEADER_VALUE_USER_AGENT_IE11 = "Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.3; Trident/7.0;  rv:11.0) like Gecko";

	/**
	* array of value-keys for ACCEPT-LANGUAGE field in select control.
	* @type {Array}
	*/
	Constants.REQUEST_HEADER_VALUES_USER_AGENT = [
		{key : Constants.REQUEST_HEADER_VALUE_USER_AGENT_IPAD},
		{key : Constants.REQUEST_HEADER_VALUE_USER_AGENT_SAFARI},
		{key : Constants.REQUEST_HEADER_VALUE_USER_AGENT_IE11}
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
	Constants.REQUESTHEADEREXAMPLES = [
		{
			text: "SAP Gateway statistics",
			field: "sap-statistics",
			value: true,
			available: "SAP Gateway 2.0 Service Pack 08"
		},{
			text: "Accept JSON",
			field: Constants.REQUEST_HEADER_FIELD_ACCEPT,
			value: Constants.REQUEST_HEADER_VALUE_APPL_JSON
		}, {
			text: "Accept XML",
			field: Constants.REQUEST_HEADER_FIELD_ACCEPT,
			value: Constants.REQUEST_HEADER_VALUE_APPL_ATOM_XML
		},{
			text: "Post Content-Type: JSON",
			field: Constants.REQUEST_HEADER_FIELD_CONTENT_TYPE,
			value: Constants.REQUEST_HEADER_VALUE_APPL_JSON
		}, {
			text: "Post Content-Type; XML",
			field: Constants.REQUEST_HEADER_FIELD_CONTENT_TYPE,
			value: Constants.REQUEST_HEADER_VALUE_APPL_ATOM_XML
		}, {
			text: "Post Content-Type; multipart/mixed; boundary=batch",
			field: Constants.REQUEST_HEADER_FIELD_CONTENT_TYPE,
			value: Constants.REQUEST_HEADER_VALUE_MULTIPART_MIXED_BOUNDARY
		}
	];
	/**
	 * array of script examples used for adding the examples to the textarea.
	 * @type {Array}
	 */
	Constants.SCRIPTEXAMPLES = [
		{
			text: "HELP",
			script: "//This script is executed before the request is executed." + "\n" +
					"//available objects:" + "\n" +
					"//seqStorage = object which can be used to store and retrieve values during a session" + "\n" +
					"//req = object which holds data that will be used when the request is sent" + "\n" +
					"//req.httpMethod = used http method" + "\n" +
					"//req.requestBody = the payload that will be sent with the request" + "\n" +
					"//req.url = the url of the request" + "\n" +
					"//prevReq = the previous request of the sequence" + "\n" +
					"//TOOD document members of prevReq"
		},{
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
			text: "Get value from sequence storage",
			script: "//" + "\n" +
					"var variable1 = seqStorage.VARNAME;"
		}
	];

	/**
	 * array of script examples used for adding the examples to the javascript test script text area.
	 * @type {Array}
	 */
	Constants.TESTSCRIPTEXAMPLES = [
		{
			text: "HELP",
			script: "//This script is executed after the request finished." + "\n" +
					"//available objects:" + "\n" +
					"//seqStorage = object which can be used to store and retrieve values during a session" + "\n" +
					"//req = object which holds the results of the executed request" + "\n" +
					"//req.httpMethod = used http method" + "\n" +
					"//req.requestBody = the payload that was sent with the request" + "\n" +
					"//req.responseBody = the response returned by the request" + "\n" +
					"//req.responseHeaders = the headers returned by the request" + "\n" +
					"//req.responseTime = the time in ms the request took" + "\n" +
					"//req.status = the HTTP status the request returned" + "\n" +
					"//req.url = the url of the request"
		},
		{
			text: "Breakpoint",
			script: "//use the development tools of the browser to debug the script" + "\n" +
					"debugger;"
		},{
			text: "Basic tests",
			script: "//the first test is always false, the second test is always true" + "\n" +
					"test('name of test 1', false);" + "\n" +
					"test('name of test 2', true);"
		},{
			text: "Test requestBody",
			script: "//TODO " + "\n" +
					"test('name of test 1', req.responseBody.length > 0);"
		}, {
			text: "Get value from sequence storage",
			script: "//" + "\n" +
					"var variable1 = seqStorage.VARNAME;"
		}
	];

	/**
	 * array of script examples used for adding the examples to the javascript pre sequence script text area.
	 * @type {Array}
	 */
	Constants.PRE_SEQUENCE_SCRIPT_EXAMPLES = [
		{
			text: "Breakpoint",
			script: "//use the development tools of the browser to debug the pre-request script" + "\n" +
					"debugger;"
		}, {
			text: "Add string to sequence storage object",
			script: "//Adds a string to the sequence storage object which is accessible by all requests in this sequence" + "\n" +
					"seqStorage.VARNAMESTRING = 'some string';"
		}, {
			text: "Add object to sequence storage object",
			script: "//Adds an object to the sequence storage object which is accessible by all requests in this sequence" + "\n" +
					"seqStorage.VARNAMEOBJECT = {"  + "\n" +
					"  STRING1 : 'string1',"  + "\n" +
					"  VALUE2 : 4"  + "\n" +
					"};"
		}
	];


	return Constants;

}, /* bExport= */ true);
