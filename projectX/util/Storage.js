/**
 * collection of storage functions
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/base/Object', 'projectX/util/Project'],
	function(jQuery, Object, Project) {
	"use strict";

	var Storage = Object.extend("projectX.util.Storage", { metadata : {
	
	}});
	
	// /////////////////////////////////////////////////////////////////////////////
	// /// Static Public Functions
	// /////////////////////////////////////////////////////////////////////////////
	
	Storage.createJsonString = function(aProjects) {
		var aSaveableObject = [];

		if (!aProjects || aProjects.length <= 0) {
			return;
		}

		for (var i = 0; i < aProjects.length; i++) {
			aSaveableObject.push(aProjects[i].serialize());
		}
		//create json string indented with 4 spaces
		var sData = JSON.stringify(aSaveableObject, null, 2);
		return sData;
	};
	
	
	Storage.parseAndLoadProjects = function(sData) {
		var aLoadedProjects = JSON.parse(sData);
		var aProjects = [];

		if (!aLoadedProjects) {
			return;
		}

		for (var i = 0; i < aLoadedProjects.length; i++) {
			var oProject = new Project(aLoadedProjects[i]);
			aProjects.push(oProject);
		}
		
		return aProjects;
	};

	return Storage;

}, /* bExport= */ true);