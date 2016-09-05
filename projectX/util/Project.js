// Provides control sap.m.App.
sap.ui.define(['jquery.sap.global', 'projectX/util/MyManagedObject', 'projectX/util/Assertion', 'projectX/util/Sequence'],
	function(jQuery, MyManagedObject, Assertion, Sequence) {
	"use strict";

	var Project = MyManagedObject.extend("projectX.util.Project", {
		constructor : function (oData) {
			MyManagedObject.apply(this, arguments);
		},
		metadata : {
			properties : {
				identifier : {type : "int", defaultValue : null},
				name : {type : "string", defaultValue : null},
				prefixUrl : {type : "string", defaultValue : null},
				username : {type : "string", defaultValue : null},
				password : {type : "string", defaultValue : null},
				useBasicAuthentication : {type : "boolean", defaultValue : null},
				csrfTokenUrl : {type : "string", defaultValue : null},
				baseVersionSha : {type : "string", defaultValue : null},
				useGithub : {type : "boolean", defaultValue : null},
				githubUrl : {type : "string", defaultValue : null},
				githubUser : {type : "string", defaultValue : null},
				githubPassword : {type : "string", defaultValue : null},
				githubRepository : {type : "string", defaultValue : null},
				githubFileName : {type : "string", defaultValue : null},
				githubUserRepository : {type : "string", defaultValue : null}
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
			uuid: projectX.util.Request.generateUuid(),
			name: sName,
			url: sUrl,
			httpMethod: sHttpMethod
			}
		);
		
		if (this.getPrefixUrl()) {
			oRequest.setUseProjectPrefixUrl(true);
			oRequest.setUrl("");
		}
		
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
			name: "New Sequence"
			}
		);
		this.addSequence(oSequence);
		return oSequence;
	};

	/**
	 * create a copy of the given request and add it to the requests.
	 * @param {object} oRequest request object
	 * @param {string} sNameSuffix the string that is added as suffix to the name of the request
	*/
	Project.prototype.addCopyOfRequest = function(oRequest, sNameSuffix) {
		var iNewID = this._getNextId();
		var oNewRequest = new projectX.util.Request(oRequest.serialize());
		oNewRequest.setIdentifier(iNewID);
		oNewRequest.setUuid(projectX.util.Request.generateUuid());
		oNewRequest.setName(oNewRequest.getName() + sNameSuffix);
		this.addRequest(oNewRequest);
		return oNewRequest;
	};

	/**
	 * create a copy of the given sequence and add it to the sequences.
	 * @param {object} oSequence sequence object
	*/
	Project.prototype.addCopyOfSequence = function(oSequence) {
		var iNewSequenceID = this.getNextSequenceId();
		var oNewSequence = new projectX.util.Sequence(oSequence.serialize());
		oNewSequence.setIdentifier(iNewSequenceID);
		oNewSequence.setName(oNewSequence.getName() + " (copy)");
		this.addSequence(oNewSequence);
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
	
	Project.prototype.getRequestByUuid = function(sUuid) {
		var aRequests = this.getRequests();

		for (var i = 0; i < aRequests.length; i++) {
			if (aRequests[i].getUuid() === sUuid){
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
		oProject.prefixUrl = this.getPrefixUrl();
		oProject.username = this.getUsername();
		oProject.password = this.getPassword();
		oProject.useBasicAuthentication = this.getUseBasicAuthentication();
		oProject.csrfTokenUrl = this.getCsrfTokenUrl();
		oProject.baseVersionSha = this.getBaseVersionSha();
		oProject.useGithub = this.getUseGithub();
		oProject.githubUrl = this.getGithubUrl();
		/*oProject.githubUser = this.getGithubUser();
		oProject.githubPassword = this.getGithubPassword();*/
		oProject.githubRepository = this.getGithubRepository();
		oProject.githubFileName = this.getGithubFileName();
		oProject.githubUserRepository = this.getGithubUserRepository();

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

	Project.prototype.generateEmptyRequest = function(sUrl) {
		this.addNewRequest( "New Request", sUrl);
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

	
	Project.prototype.merge = function(gitRepo, mergeCallback) {
	
		var that = this;
		this.setBaseVersionSha("bbcd591613847bb122daa49ef045352ace79a3ce");
		
		var oSelectedProject =	this.serialize();
		
		var options = {
						path : oSelectedProject.githubFileName
		};

		var aGettingListOfCommits = gitRepo.listCommits(options);

		var oGettingSingleCommit = aGettingListOfCommits.then(function(temp){
				
				if (!oSelectedProject.baseVersionSha){
					var sBaseProjSha = temp.data[0].sha;
					return gitRepo.getSingleCommit(sBaseProjSha,function(error,response){
					});
				} else {
					return gitRepo.getSingleCommit(oSelectedProject.baseVersionSha,function(error,response){
					});
				}
			});
		
		var oGettingFile = oGettingSingleCommit.then(function(commit){
				var fileName = commit.data.files[0].filename;
				var sBaseProjSha = commit.data.sha;
				return gitRepo.getContents(sBaseProjSha, fileName, true);
		});

		var oGettingFileBaseVersion = oGettingFile.then(function(oBaseVersion){
				return oBaseVersion;
		});
		
		
		//getting last remote project
		var oGettingRecentCommit = aGettingListOfCommits.then(function(temp){
					var sBaseProjSha = temp.data[0].sha;
					return gitRepo.getSingleCommit(sBaseProjSha,function(error,response){
					});
			});
		var oGettingRecentFile = oGettingRecentCommit.then(function(commit){
				var fileName = commit.data.files[0].filename;
				return gitRepo.getContents("master", fileName, true);
		});

		var oGettingFileRecentVersion = oGettingRecentFile.then(function(oBaseVersion){
				return oBaseVersion;
		});
		
		Promise.all([aGettingListOfCommits, oGettingSingleCommit, oGettingFile, oGettingFileBaseVersion, oGettingFileRecentVersion]).then(function(results) {
				var aListOfCommits = results[0];
				var oSingleCommit = results[1];
				var oFile = results[2];
				var oFileBaseVersion = results[3];
				var oRemoteProject = results[4];
				
				//oFileBaseVersion.data[0].baseVersionSha = oSingleCommit.data.sha;
				
				
				var aBaseRequests = oFileBaseVersion.data[0].requests;
				
				var aLocalRequests = oSelectedProject.requests;
				
				var aRemoteRequests = oRemoteProject.data[0].requests;
				
				var aMergedRequests = that.mergeLogic(aBaseRequests, aLocalRequests, aRemoteRequests)
				
				debugger;
				
				that.removeAllRequests();
				for (var i = 0; i < aMergedRequests.length; i++) {
					var oRequest = new projectX.util.Request(aMergedRequests[i]);
					that.addRequest(oRequest);
				}
				
				//that.mAggregations.requests = aMergedRequests;
				mergeCallback(that);
				
		});
	};
	
	Project.prototype.mergeBlaBlub
	
	
	Project.prototype.mergeLogic = function (aBaseRequests, aLocalRequests, aRemoteRequests) {
		var aComparedLocalRequests = [];
		var aComparedRemoteRequests = [];
		
		var aMergedRequests  = [];
		
		var oProject = new projectX.util.Project();
		
		// Split the request by comparing it with the base version given, into 'unchanged', 'changed' and 'added'
		aComparedLocalRequests = oProject.compareRequests(aLocalRequests, aBaseRequests);
		aComparedRemoteRequests = oProject.compareRequests(aRemoteRequests, aBaseRequests);
		
		// Compare local unchanged array with the remote object
		for (var i = 0; i < aComparedLocalRequests.unchanged.length; i++) {
			
			var aCheckLocalUnchanged = aComparedRemoteRequests.unchanged.filter(function(object) { return object.uuid === aComparedLocalRequests.unchanged[i].uuid; });
			var aCheckLocalChanged = aComparedRemoteRequests.changed.filter(function(object) { return object.uuid === aComparedLocalRequests.unchanged[i].uuid; });
			// var aCheckLocalRemoved = aComparedRemoteRequests.added.filter(function(object) { return object.uuid === aComparedLocalRequests.unchanged[i].uuid; });
			 
			if (aCheckLocalUnchanged[0] !== undefined) {
				var sTempUnchanged = JSON.stringify(aCheckLocalUnchanged[0]);
				var sComparedLocalUnchangedRequests = JSON.stringify(aComparedLocalRequests.unchanged[i]);
				if (sTempUnchanged === sComparedLocalUnchangedRequests) {
					aMergedRequests.push(aComparedLocalRequests.unchanged[i]);
				}
			} else if (aCheckLocalChanged[0] !== undefined) {
				aMergedRequests.push(aCheckLocalChanged[0]);
			} 
		}
		
		// Compare local changed array with the remote object
		for (var j = 0; j < aComparedLocalRequests.changed.length; j++) {
			
			var aCheckRemoteUnchanged = aComparedRemoteRequests.unchanged.filter(function(object) { return object.uuid === aComparedLocalRequests.changed[j].uuid; });
			var aCheckRemoteChanged = aComparedRemoteRequests.changed.filter(function(object) { return object.uuid === aComparedLocalRequests.changed[j].uuid; });
			 
			if (aCheckRemoteUnchanged[0] !== undefined) {
				aMergedRequests.push(aComparedLocalRequests.changed[j]);
			} else if (aCheckRemoteChanged[0] !== undefined) {
				aMergedRequests.push(aCheckRemoteChanged[0]);
				aMergedRequests.push(aComparedLocalRequests.changed[j]);
			}
		}
		// Push the 'added' requests from the REMOTE project into the final array
		for (var k = 0; k < aComparedRemoteRequests.added.length; k++) {
			aMergedRequests.push(aComparedRemoteRequests.added[k]);
		}
		// Push the 'added' requests from the LOCAL project into the final array		
		for (var h = 0; h < aComparedLocalRequests.added.length; h++) {
			aMergedRequests.push(aComparedLocalRequests.added[h]);
		}
		
		return aMergedRequests;
	};
	
	Project.prototype.compareRequests = function (aLocalRequests, aBaseRequests) {
		
		var aLocalChangedRequests = [];
		var aLocalNewRequests = [];
		var aLocalUnchangedRequests = [];
		for (var h = 0; h < aLocalRequests.length; h++) {
			aLocalNewRequests.push(aLocalRequests[h]);
		}
		
		function newRequestHelper (sLocalRequestUuid, aLocalNewRequests){
			for (var k = aLocalNewRequests.length - 1; k >= 0; k--) {
						    if (aLocalNewRequests[k].uuid == sLocalRequestUuid){
						    aLocalNewRequests.splice(k,1);
						    } 
						}
		};
		for (var i = 0; i < aLocalRequests.length; i++) {
			
			var temp = aBaseRequests.filter(function(object) { return object.uuid === aLocalRequests[i].uuid; });
			
			var sTemp = JSON.stringify(temp[0]);
			var sLocalRequests = JSON.stringify(aLocalRequests[i]);
			var tmp = aLocalRequests[i].uuid;
			
			if (temp[0] !== undefined){
				if (temp !== null && temp[0].uuid === aLocalRequests[i].uuid && sTemp === sLocalRequests){
					aLocalUnchangedRequests.push(aLocalRequests[i]);
					newRequestHelper(tmp, aLocalNewRequests);
					continue;
				} else if (temp !== null && temp[0].uuid === aLocalRequests[i].uuid && sTemp !== sLocalRequests){
					aLocalChangedRequests.push(aLocalRequests[i]);
					newRequestHelper(tmp, aLocalNewRequests);
				} else {
					newRequestHelper(tmp, aLocalNewRequests);
				}
			}
		}
		var result = {
			changed : aLocalChangedRequests,
			added : aLocalNewRequests,
			unchanged : aLocalUnchangedRequests
			};
			
		return result;
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