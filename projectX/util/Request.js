
// Provides control sap.m.App.
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject'],
	function(jQuery, ManagedObject) {
	"use strict";

	var Request = ManagedObject.extend("projectX.util.Request", { metadata : {
	
		properties : {
			url : {type : "string", defaultValue : null},
			name : {type : "string", defaultValue : null},
			identifier : {type : "int", defaultValue : null},
			httpMethod : {type : "string", defaultValue : "GET"},
		},
		events : {
	
		}
	}});
	
	Request.prototype.someFunction = function() {
		
		
	};

	return Request;

}, /* bExport= */ true);