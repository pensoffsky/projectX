
// Provides control sap.m.App.
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject', 'projectX/util/Assertion', 'projectX/util/Sequence'],
	function(jQuery, ManagedObject, Assertion, Sequence) {
	"use strict";

	var Project = ManagedObject.extend("projectX.util.Project", { 
		constructor : function (oData) {
			ManagedObject.apply(this, arguments);
		},
		metadata : {
			properties : {
				identifier : {type : "int", defaultValue : null},
				name : {type : "string", defaultValue : null},
				baseUrl : {type : "string", defaultValue : null},
				prefixUrl : {type : "string", defaultValue : null}
			},
			events : {

			},
			aggregations : {
				requests : {type : "projectX.util.Request", multiple : true},
				sequences : {type : "projectX.util.Sequence", multiple : true},
				prefixUrls : {type : "projectX.util.PrefixUrl", multiple : true}
			}
		}
	});

	// /////////////////////////////////////////////////////////////////////////////
	// /// public functions
	// /////////////////////////////////////////////////////////////////////////////
	
	/**
	 * create a new request.
	 * calculate a new id for the request. (highest id + 1)
	 * add it to the project.
	 */
	Project.prototype.addNewRequest = function(sName, sUrl, sHttpMethod) {
		sUrl = sUrl || "http://localhost:3000";
		sName = sName || "New request";
		sHttpMethod = sHttpMethod || "GET";
		
		

		var iNewID = this._getNextId();

		var oRequest = new projectX.util.Request({
			identifier: iNewID,
			name: sName,
			url: sUrl,
			httpMethod: sHttpMethod
			}
		);
		this.addRequest(oRequest);
		return oRequest;
	};

	/**
	 * create a new sequence.
	 * calculate a new id for the sequence. (highest id + 1)
	 * add it to the project.
	 */
	Project.prototype.addNewSequence = function() {

		var iNewID = this.getNextSequenceId();

		var oSequence = new Sequence({
			identifier: iNewID,
			name: "new sequence"
			}
		);
		this.addSequence(oSequence);
		return oSequence;
	};

	/**
	 * create a copy of the given request and add it to the requests.
	*/
	Project.prototype.addCopyOfRequest = function(oRequest) {
		var iNewID = this._getNextId();
		var oNewRequest = new projectX.util.Request(oRequest.serialize());
		oNewRequest.setIdentifier(iNewID);
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

	Project.prototype.getSequenceByIdentifier = function(iIdentifier) {
		var aSequences = this.getSequences();

		for (var i = 0; i < aSequences.length; i++) {
			if (aSequences[i].getIdentifier() === iIdentifier){
				return aSequences[i];
			}
		}
		return null;
	};

	Project.prototype.serialize = function(iIdentifier) {
		var oProject = {};
		oProject.identifier = this.getIdentifier();
		oProject.name = this.getName();
		oProject.baseUrl = this.getBaseUrl();
		oProject.prefixUrl = this.getPrefixUrl();

		var aSerializedRequests = [];
		var aRequests = this.getRequests();
		for (var i = 0; i < aRequests.length; i++) {
			aSerializedRequests.push(aRequests[i].serialize());
		}
		oProject.requests = aSerializedRequests;

		var aSerializedSequences = [];
		var aSequences = this.getSequences();
		for (var i = 0; i < aSequences.length; i++) {
			aSerializedSequences.push(aSequences[i].serialize());
		}
		oProject.sequences = aSerializedSequences;

		var aSerializedPrefixUrls = [];
		var aPrefixUrls = this.getPrefixUrls();
		for (var i = 0; i < aPrefixUrls.length; i++) {
			aSerializedPrefixUrls.push(aPrefixUrls[i].serialize());
		}
		oProject.prefixUrls = aSerializedPrefixUrls;

		return oProject;
	};

	Project.prototype.generateBasicOdataRequests = function() {
		this.addNewRequest( "Service Document", this.getBaseUrl() );
		this.addNewRequest( "Metadata Document", this.getBaseUrl() + "$metadata" );
	};

	Project.prototype.getNextSequenceId = function() {
		var aSequences = this.getSequences();
		var iHighestID = 0;
		for (var i = 0; i < aSequences.length; i++) {
			iHighestID = Math.max(aSequences[i].getIdentifier(), iHighestID);
		}
		var iNewID = iHighestID + 1;
		return iNewID;
	};

	// /////////////////////////////////////////////////////////////////////////////
	// /// private functions
	// /////////////////////////////////////////////////////////////////////////////

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
