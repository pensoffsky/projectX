
// Provides control sap.m.App.
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject'],
	function(jQuery, ManagedObject) {
	"use strict";

	var Project = ManagedObject.extend("projectX.util.Project", { metadata : {
	
		properties : {
			name : {type : "string", defaultValue : null},
		},
		events : {
			
		},
		aggregations : {
			requests : {type : "projectX.util.Request", multiple : true},
		}
	}});
	
	/**
	 * create a new request.
	 * calculate a new id for the request. (highest id + 1)
	 * add it to the project.
	 */
	Project.prototype.addNewRequest = function() {
		var aRequests = this.getRequests();
		
		var iHighestID = 0;
		for (var i = 0; i < aRequests.length; i++) {
			iHighestID = Math.max(aRequests[i].getIdentifier(), iHighestID);
		}
		var iNewID = iHighestID + 1;
		
		var oRequest = new projectX.util.Request(
			{identifier: iNewID, name:"New Request", url:"http://"}
			);
		this.addRequest(oRequest);
	};
	
	Project.prototype.getRequestByIdentifier = function(iIdentifier) {
		var aRequests = this.getRequests();
		
		for (var i = 0; i < aRequests.length; i++) {
			if (aRequests[i].getIdentifier() === iIdentifier){
				return aRequests[i];
			}
		}
		return null;
	};
	
	Project.prototype.serialize = function(iIdentifier) {
		var oProject = this.mProperties;
		var aSerializedRequests = [];
		var aRequests = this.getRequests();
		for (var i = 0; i < aRequests.length; i++) {
			aSerializedRequests.push(aRequests[i].serialize());
		}	
		oProject.requests = aSerializedRequests;
		return oProject;
	};
	
	//TODO function to remove a request
	//TODO function to create a storeable json object for persistance

	return Project;

}, /* bExport= */ true);