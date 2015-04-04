// Provides control sap.m.App.
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject'],
	function(jQuery, ManagedObject) {
	"use strict";

	var Constants = ManagedObject.extend("projectX.util.Constants", { metadata : {

		properties : {
      RequestHeaderFields : {
          type : "string",
          defaultValue : [
            "Accept",
            "Accept-Charset",
            "Accept-Encoding",
            "Accept-Lanugage",
            "Accept-Datetime",
            "Authorization",
            "Cache-Control"
          ]},
      RequestHeaderFieldsExample : {
          type : "string",
          defaultValue : [
            "Accept: text/plain",
            "Accept-Charset: utf-8"
          ]}
		},
		events : {

		}
	}});

  return Constants;

}, /* bExport= */ true);
