
// Provides control sap.m.App.
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject'],
	function(jQuery, ManagedObject) {
	"use strict";

	var Project = ManagedObject.extend("projectX.util.Project", { metadata : {
	
		properties : {
			name : {type : "string", defaultValue : null},
		},
		events : {
	
		}
	}});
	
	Project.prototype.someFunction = function() {
		
		
	};

	return Project;

}, /* bExport= */ true);