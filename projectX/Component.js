jQuery.sap.declare("projectX.Component");
jQuery.sap.require("projectX.MyRouter");
jQuery.sap.require("projectX.util.Project");
jQuery.sap.require("projectX.util.Request");
jQuery.sap.require("projectX.util.Constants");
jQuery.sap.require("projectX.util.Storage");

sap.ui.core.UIComponent.extend("projectX.Component", {
	metadata : {
		name : "sisyphus",
		version : "0.0.1",
		includes : [],
		dependencies : {
			libs : ["sap.m", "sap.ui.layout"],
			components : []
		},

		rootView : "projectX.view.App",

		config : {
			resourceBundle : "i18n/messageBundle.properties"
		},

		routing : {
			config : {
				routerClass : projectX.MyRouter,
				viewType : "XML",
				viewPath : "projectX.view",
				targetAggregation : "detailPages",
				clearTarget : false
			},
			routes : [
				{
					pattern : "",
					name : "main",
					view : "Master.Master",
					targetAggregation : "masterPages",
					targetControl : "idAppControl",
					subroutes : [
						{
							pattern : "project/{projectID}/request/{requestID}",
							name : "request",
							view : "Request.Request",
							transition : "show"
						},
						{
							pattern : "project/{projectID}/sequence/{sequenceID}",
							name : "sequence",
							view : "Sequence.Sequence",
							transition : "show"
						},
						{
							pattern : "notfound",
							name : "notfound",
							view : "NotFound",
							transition : "show"
						}
					]
				},
				{
					name : "catchallMaster",
					view : "Master.Master",
					targetAggregation : "masterPages",
					targetControl : "idAppControl",
					subroutes : [
						{
							pattern : ":all*:",
							name : "catchallDetail",
							view : "NotFound",
							transition : "show"
						}
					]
				}
			]
		}
	},

//TODO this method is to long!
	init : function() {
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		var mConfig = this.getMetadata().getConfig();

		// always use absolute paths relative to our own component
		// (relative paths will fail if running in the Fiori Launchpad)
		var oRootPath = jQuery.sap.getModulePath("projectX");

		// set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : [oRootPath, mConfig.resourceBundle].join("/")
		});
		this.setModel(i18nModel, "i18n");

		//create initial project
		var oProject = new projectX.util.Project({
			identifier: 0,
			name: "My nice project"
		});
		oProject.generateEmptyRequest("http://httpbin.org/ip");

		// create and set domain model to the component
		this._oModel = new sap.ui.model.json.JSONModel({
			SelectedProject : oProject,
			Projects : [oProject]
		});
		this.setModel(this._oModel);

		//check if is running in opa5 mode. this disables load and save of projects
		var bOpaTestMode = jQuery.sap.getUriParameters().get("opaTest") === "true";

		//attempt to automatically load from webstorage
		if (!bOpaTestMode) {
			this.load();
		}
		
		// set device model
		var oDeviceModel = new sap.ui.model.json.JSONModel({
			isTouch : sap.ui.Device.support.touch,
			isNoTouch : !sap.ui.Device.support.touch,
			isPhone : sap.ui.Device.system.phone,
			isNoPhone : !sap.ui.Device.system.phone,
			listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
			listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
		});
		oDeviceModel.setDefaultBindingMode("OneWay");
		this.setModel(oDeviceModel, "device");

		//TODO do we really need this?
		// set application contants
		var oConstants = new projectX.util.Constants();

		var oAppConstants = new sap.ui.model.json.JSONModel({
			Constants : oConstants
		});
		oAppConstants.setDefaultBindingMode("OneWay");
		this.setModel(oAppConstants, "constants");

		if (!bOpaTestMode) {
			this.initAutoSave();
		}

		var that = this;
		//add global keyboard hooks
		jQuery(document).keyup(function(evt){
			//check for F7 key -> execute request or run sequence depending on current screen
		   if (evt.keyCode == 118) {// && (evt.ctrlKey)){
			   evt.preventDefault();
				if (that._fKeyboardShortcutExecuteRequest
					&& typeof that._fKeyboardShortcutExecuteRequest === "function"){
					that._fKeyboardShortcutExecuteRequest();
				}
		   }
		});

		this.getRouter().initialize();
	},

	initAutoSave : function () {
		jQuery.sap.intervalCall(projectX.util.Constants.AUTOSAVEDELAY, this, function(){
			this._autoSave();
		});
	},

	// /////////////////////////////////////////////////////////////////////////////
	// /// Members
	// /////////////////////////////////////////////////////////////////////////////

	/**
	 * the serialized projects array that was stored to the webstorage.
	 * used to compare if some data has changed and the changes have to be persisted.
	 * @type {string}
	 */
	_sLastSavedData : null,

	/**
	 * function that is called when the global keyboard shortcut to send the current request
	 * was executed.
	 * @type {function}
	 */
	_fKeyboardShortcutExecuteRequest : null,

	// /////////////////////////////////////////////////////////////////////////////
	// /// Public Functions
	// /////////////////////////////////////////////////////////////////////////////

	/**
	 * get called from the request screens and sets a function that
	 * will execute the currently selected request.
	 * @param  {function} fFunction function that will be triggered when the user hits
	 * the global "execute request" keyboard shortcut
	 */
	setKeyboardShortcutExecuteRequest : function(fFunction) {
		this._fKeyboardShortcutExecuteRequest = fFunction;
	},

	/**
	 * load projects from localstorage
	 */
	load : function() {
		var sData = window.localStorage.getItem("projects");
		this._parseAndLoadProjects(sData, true);
	},

	/**
	 * Create json file and prepare it for download.
	 * lets the user donwload the current config in a file which he then can
	 * save on disk.
	 *
	 * @param {array} aProjects Array of projects which will be writtern to file
	 * @public
	 */
	export : function(aProjects) {
		var sData = projectX.util.Storage.createJsonString(aProjects);
		var pom = document.createElement('a');
		var sFileName = "projectX";
		for (var i = 0; i < aProjects.length; i++) {
			sFileName +=  "-" + aProjects[i].getName();
		}
		sFileName += ".json";
		pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(sData));
		pom.setAttribute('download', sFileName);
		pom.style.display = 'none';
		document.body.appendChild(pom);
		pom.click();
		document.body.removeChild(pom);
	},

	/**
	 * open a config file from disk and load the projects.
	 * same as load function but from disk and not from local storage
	 */
	import : function(oFile) {
		//create filereader
		var oFileReader = new FileReader();
		var that = this;
		oFileReader.onload = function(e) {
		    // e.target.result should contain the text
			var sData = e.target.result;
			that._parseAndLoadProjects(sData, false);
		};
		oFileReader.readAsText(oFile);
	},
	
	createGitHubJson : function (aProject){
		var sData = projectX.util.Storage.createJsonString(aProject);
		var sFileName = "projectX";
		for (var i = 0; i < aProject.length; i++) {
			sFileName +=  "-" + aProject[i].getName();
		}
		sFileName += ".json";
		return sData;
	},

	getProjects : function() {
		return this._oModel.getProperty("/Projects");
	},
	
	getSelectedProject : function() {
		return this._oModel.getProperty("/SelectedProject");
	},

	/**
	 * iterates over all loaded projects. finds the highest id.
	 * adds 1 to the id and returns it.
	 * @return {int} returns an id which is not yet used by a project
	 */
	_getNextProjectId : function (aProjects) {
		var iHighestID = 0;
		for (var i = 0; i < aProjects.length; i++) {
			iHighestID = Math.max(aProjects[i].getIdentifier(), iHighestID);
		}
		var iNewID = iHighestID + 1;
		return iNewID;
	},

	/**
	 * create a new project and add to global model.
	 * select the new project.
	 * @return {object} the newly created project
	 */
	createNewProject : function() {
		var aProjects = this._oModel.getProperty("/Projects");
		var iNewID = this._getNextProjectId(aProjects);

		//create new Project object and fill in data from local project model
		var oProject = new projectX.util.Project({
			identifier: iNewID,
			name: projectX.util.Constants.DEFAULT_PROJECT_NAME,
			baseUrl: projectX.util.Constants.DEFAULT_PROJECT_URL
		});

		//add test requests
		oProject.addNewRequest();
		oProject.addNewRequest();

		//push new projects to global model
		aProjects.push(oProject);
		this._oModel.setProperty("/Projects", aProjects);
		this._oModel.setProperty("/SelectedProject", oProject);
		this._fireSelectedProjectChanged();
		return oProject;
	},

	/**
	* finds the project with the given identifier and sets it as the selected project.
	* @param {string} sIdentifier id of the project to select
	*/
	setSelectedProject : function(sIdentifier) {
		var aProjects = this._oModel.getProperty("/Projects");
		var oProject = null;
		for (var i = 0; i < aProjects.length; i++) {
			if (aProjects[i].getIdentifier() == sIdentifier) {
				oProject = aProjects[i];
			}
		}
		this._oModel.setProperty("/SelectedProject", oProject);
		this._fireSelectedProjectChanged();
	},

	deletedProject : function(sIdentifier) {
		var aProjects = this._oModel.getProperty("/Projects");
		var oProject = null;
		for (var i = 0; i < aProjects.length; i++) {
			if (aProjects[i].getIdentifier() == sIdentifier) {
				oProject = aProjects[i];
			}
		}
		aProjects.splice(aProjects.indexOf(oProject), 1);
		this._oModel.setProperty("/Projects", aProjects);
	},

	/**
	 * duplicate this request and add it to the currently selected project.
	 * @param {object} oRequest request to duplicate
	 */
	duplicateRequest : function(oRequest) {
		var oSelectedProject = this._oModel.getProperty("/SelectedProject");
		var oNewRequest = oSelectedProject.addCopyOfRequest(oRequest, " (copy)");
		this._oModel.updateBindings();
		return oNewRequest;
	},

	/**
	 * delete this request from the currently selected project.
	 * @param {object} oRequest request to delete
	 */
	deleteRequest : function(oRequest) {
		var oSelectedProject = this._oModel.getProperty("/SelectedProject");
		oSelectedProject.removeRequest(oRequest);
		this._oModel.updateBindings();
	},

	/**
	 * duplicate this sequence and add it to the currently selected project.
	 * @param {object} oSequence sequence to duplicate
	 */
	duplicateSequence : function(oSequence) {
		var oSelectedProject = this._oModel.getProperty("/SelectedProject");
		oSelectedProject.addCopyOfSequence(oSequence);
		this._oModel.updateBindings();
	},

	/**
	* delete this sequence from the currently selected project.
	* @param {object} oSequence sequence to delete
	*/
	deleteSequence : function(oSequence) {
		var oSelectedProject = this._oModel.getProperty("/SelectedProject");
		oSelectedProject.removeSequence(oSequence);
		this._oModel.updateBindings();
	},


	// /////////////////////////////////////////////////////////////////////////////
	// /// Private Functions
	// /////////////////////////////////////////////////////////////////////////////

	_fireSelectedProjectChanged : function () {
		var oEventBus = sap.ui.getCore().getEventBus();
		var sChannel = projectX.util.Constants.EVENTCHANNEL_SELECTEDPROJECT;
		var sEvent = projectX.util.Constants.EVENT_SELECTEDPROJECT_CHANGED;
		oEventBus.publish(sChannel, sEvent, {});
	},

	/**
	* save projects to lcoalstorage
	*/
	_autoSave : function() {
		var aProjects = this._oModel.getProperty("/Projects");
		var sData = projectX.util.Storage.createJsonString(aProjects);

		if (this._sLastSavedData === sData) {
			//console.log("no data changed");
			return;
		}

		//compare sData with last saved data
		window.localStorage.setItem("projects", sData);
		this._sLastSavedData = sData;
		//console.log("saved");
	},

	_parseAndLoadProjects : function(sData, bClearProjects) {		
		var aProjects = this._oModel.getProperty("/Projects");
		var aLoadedProjects = projectX.util.Storage.parseAndLoadProjects(sData);
		if (!aLoadedProjects || aLoadedProjects.length <= 0) {
			return;
		}		
		//check if we want to remove the previous projects
		if (bClearProjects){
			aProjects = aLoadedProjects;
		} else {
			//create new ids for loaded projects
			for (var i = 0; i < aLoadedProjects.length; i++) {
				var iNextId = this._getNextProjectId(aProjects);
				aLoadedProjects[i].setIdentifier(iNextId);
				aProjects.push(aLoadedProjects[i]);
			}
		}
		
		
		

		this._oModel.setProperty("/Projects", aProjects);
		this._oModel.setProperty("/SelectedProject", aProjects[0]);
		this._fireSelectedProjectChanged();
	}

});