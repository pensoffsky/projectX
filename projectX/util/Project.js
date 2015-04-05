
// Provides control sap.m.App.
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject', 'projectX/util/Assertion'],
	function(jQuery, ManagedObject, Assertion) {
	"use strict";

	var Project = ManagedObject.extend("projectX.util.Project", { metadata : {

		properties : {
			identifier : {type : "int", defaultValue : null},
			name : {type : "string", defaultValue : null},
			baseUrl : {type : "string", defaultValue : null},
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
	Project.prototype.addNewRequest = function(sName, sUrl) {
		sUrl = (!!sUrl) ? sUrl : "http://localhost:3000";
		sName = (!!sName) ? sName : "New request";
		
		var iNewID = this._getNextId();

		var oRequest = new projectX.util.Request({	
			identifier: iNewID,	
			name: sName,	
			url: sUrl 
			}
		);
		this.addRequest(oRequest);
	};
	
	/**
	 * create a copy of the given request and add it to the requests.
	*/
	Project.prototype.addCopyOfRequest = function(oRequest) {
		var iNewID = this._getNextId();
		var oNewRequest = new projectX.util.Request({
				identifier: iNewID,	
				name: oRequest.getName(),
				url: oRequest.getUrl(),
				httpMethod: oRequest.getHttpMethod(),
				assertions: oRequest.getAssertions()
				}
			);
		this.addRequest(oNewRequest);
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

	Project.prototype.generateBasicOdataRequests = function() {
		this.addNewRequest( "Service Document", this.getBaseUrl() );
		this.addNewRequest( "Metadata Document", this.getBaseUrl() + "$metadata" );
	};
	
	Project.prototype._getNextId = function() {
		var aRequests = this.getRequests();
		var iHighestID = 0;
		for (var i = 0; i < aRequests.length; i++) {
			iHighestID = Math.max(aRequests[i].getIdentifier(), iHighestID);
		}
		var iNewID = iHighestID + 1;
		return iNewID;
	};

	return Project;

}, /* bExport= */ true);
