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

	
	Project.prototype.merge = function(gitRepo, bMergeAbort, mergeCallback, mergeCallbackError) {
	
	//TODO split function into parts for testing
	
		var that = this;
		// this.setBaseVersionSha("2e48dabe74a0b17be95b861d119f48d749db71dc");
		var bImportProject = false;
		var oSelectedProject =	this.serialize();
		var sBaseProjSha = null;
		var bMergeAbortTemp = bMergeAbort;
		var options = {
						path : oSelectedProject.githubFileName
		};

		var aGettingListOfCommits = gitRepo.listCommits(options);

		var oGettingSingleCommit = aGettingListOfCommits.then(function(temp){
				
				if (!oSelectedProject.baseVersionSha){
					bImportProject = true;
					sBaseProjSha = temp.data[0].sha;
					that.setBaseVersionSha(sBaseProjSha);
					return gitRepo.getSingleCommit(sBaseProjSha,function(error,response){
					});
				} else if (oSelectedProject.baseVersionSha === temp.data[0].sha) {
					//Sha of both, the local version and the most recent remote version are the same
					if(!bMergeAbortTemp){
							return gitRepo.getSingleCommit(oSelectedProject.baseVersionSha,function(error,response){
						});	
					}
				} else {
					return gitRepo.getSingleCommit(oSelectedProject.baseVersionSha,function(error,response){
					});
				}
			}).catch(function(err){
				return;
			});
		
		var oGettingFile = oGettingSingleCommit.then(function(commit){
			if (typeof commit !== "undefined") {
				var fileName = commit.data.files[0].filename;
				var sBaseProjSha = commit.data.sha;
				return gitRepo.getContents(sBaseProjSha, fileName, true);
			}
		}).catch(function(err){
			return;
		});

		var oGettingFileBaseVersion = oGettingFile.then(function(oBaseVersion){
				return oBaseVersion;
		}).catch(function(err){
			return;
		});
		
		
		//getting last remote project
		var oGettingRecentCommit = aGettingListOfCommits.then(function(temp){
					sBaseProjSha = temp.data[0].sha;
					return gitRepo.getSingleCommit(sBaseProjSha,function(error,response){
					});
		}).catch(function(err){
			return;
		});
		var oGettingRecentFile = oGettingRecentCommit.then(function(commit){
				var fileName = commit.data.files[0].filename;
				return gitRepo.getContents("master", fileName, true);
		}).catch(function(err){
			return;
		});

		var oGettingFileRecentVersion = oGettingRecentFile.then(function(oBaseVersion){
				return oBaseVersion;
		}).catch(function(err){
			return;
		});
		
		Promise.all([oGettingFileBaseVersion, oGettingFileRecentVersion]).then(function(results) {
			if (typeof results[0] !== "undefined" && typeof results[1] !== "undefined") {
				if (!bImportProject) {
					that.executeMergeLogic(results);
					that.setBaseVersionSha(sBaseProjSha);
					mergeCallback(that);
				} else if (bImportProject){
					that.importGitHubProject(results);
					that.setBaseVersionSha(sBaseProjSha);
					mergeCallback(that);
				}
			} else if (typeof results[0] === "undefined" || typeof results[1] === "undefined") {
					mergeCallbackError();
			}
		});
	};
	
	Project.prototype.getGitHubInformations = function (gitRepo) {
		// TODO extract the whole GitHub execution into this function for simple testing
		
	};
	
	Project.prototype.importGitHubProject = function (aPromiseResult) {
			var oSelectedProject =	this.serialize();
			var oFileBaseVersion = aPromiseResult[0];
			var oRemoteProject = aPromiseResult[1];
			
			var aMergedRequests = oRemoteProject.data[0].requests;
			var aLocalRequests = this.getRequests();
			
			for (var i = 0; i < aLocalRequests.length; i++) {
				this.mAggregations.requests[i].mProperties.identifier = i;
			}
			
			for (var j = 0; j < aMergedRequests.length; j++) {
				aMergedRequests[j].identifier = aLocalRequests.length + j;
				var aCheckIfAlreadyExisting = aLocalRequests.filter(function(object) { return object.mProperties.uuid === aMergedRequests[j].uuid; });
				if (aCheckIfAlreadyExisting.length !== 0) {
					aMergedRequests[j].uuid = "" + Date.now() + uuid.v4();
					aMergedRequests[j].name += " (NEW)";
					var oRequestNew = new projectX.util.Request(aMergedRequests[j]);
					this.addRequest(oRequestNew);
				} else {
					var oRequest = new projectX.util.Request(aMergedRequests[j]);
					this.addRequest(oRequest);
				}
			}
			return this;
		
	};
	
	Project.prototype.executeMergeLogic = function (aPromiseResult) {
		
			var oSelectedProject =	this.serialize();
			var oFileBaseVersion = aPromiseResult[0];
			var oRemoteProject = aPromiseResult[1];
			
			//oFileBaseVersion.data[0].baseVersionSha = oSingleCommit.data.sha;
			
			
			var aBaseRequests = oFileBaseVersion.data[0].requests;
			
			var aLocalRequests = oSelectedProject.requests;
			
			var aRemoteRequests = oRemoteProject.data[0].requests;
			
			var aMergedRequests = this.mergeLogic(aBaseRequests, aLocalRequests, aRemoteRequests);
			
			this.removeAllRequests();
			for (var i = 0; i < aMergedRequests.length; i++) {
				var oRequest = new projectX.util.Request(aMergedRequests[i]);
				this.addRequest(oRequest);
			}
			return this;
			//this.mAggregations.requests = aMergedRequests;
	};
	
	
	Project.prototype.mergeLogic = function (aBaseRequests, aLocalRequests, aRemoteRequests) {
		var aComparedLocalRequests = [];
		var aComparedRemoteRequests = [];
		
		var aMergedRequests  = [];
		
		var oProject = new projectX.util.Project();
		
		aBaseRequests.forEach(function(element, index, array){delete array[index].identifier; });
		aLocalRequests.forEach(function(element, index, array){delete array[index].identifier; });
		aRemoteRequests.forEach(function(element, index, array){delete array[index].identifier; });
		
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
			}
			 
			if (aCheckRemoteChanged[0] !== undefined) {
				aMergedRequests.push(aCheckRemoteChanged[0]);
				
				var sTempRemote = JSON.stringify(aCheckRemoteChanged[0]);
				var sTempLocal = JSON.stringify(aComparedLocalRequests.changed[j]);
				
				if (sTempRemote !== sTempLocal){
					aComparedLocalRequests.changed[j].uuid = "" + Date.now() + uuid.v4();
					aComparedLocalRequests.changed[j].name += " (NEW)";
					aMergedRequests.push(aComparedLocalRequests.changed[j]);
				}
			}
		}
		// Push the 'added' requests from the REMOTE project into the final array
		for (var k = 0; k < aComparedRemoteRequests.added.length; k++) {
			
			var aCheckIfAlreadyMerged = aMergedRequests.filter(function(object) { return object.uuid === aComparedRemoteRequests.added[k].uuid; });
			if(!aCheckIfAlreadyMerged[0]){
				aMergedRequests.push(aComparedRemoteRequests.added[k]);
			}	
		}
		// Push the 'added' requests from the LOCAL project into the final array		
		for (var h = 0; h < aComparedLocalRequests.added.length; h++) {
			var aCheckIfAlreadyMerged = aMergedRequests.filter(function(object) { return object.uuid === aComparedLocalRequests.added[h].uuid; });
			if(!aCheckIfAlreadyMerged[0]){
				aMergedRequests.push(aComparedLocalRequests.added[h]);
			}
		}
		
		// defining new identifier in case there are duplicates because of the merge
		for (var l = 0; l < aMergedRequests.length; l++) {
			aMergedRequests[l].identifier = l + 1;
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