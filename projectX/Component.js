jQuery.sap.declare("projectX.Component");
jQuery.sap.require("projectX.MyRouter");
jQuery.sap.require("projectX.util.Project");
jQuery.sap.require("projectX.util.Request");

sap.ui.core.UIComponent.extend("projectX.Component", {
	metadata : {
		name : "TDG Demo App",
		version : "1.0",
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
					view : "Master",
					targetAggregation : "masterPages",
					targetControl : "idAppControl",
					subroutes : [
						{
							pattern : "product/{projectID}/{requestID}/:tab:",
							name : "product",
							view : "Detail"
						},
						{
							pattern : "project/{projectID}/:reason:",
							name : "project",
							view : "AddProduct"
						},
						{
							pattern : "testrun",
							name : "testrun",
							view : "TestRun"
						}
					]
				},
				{
					name : "catchallMaster",
					view : "Master",
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

		//create test project
		var sLocalServer = "http://localhost:3000";
		var sDemoApiPrefix = "/odata_org";
		var sDemoService = sLocalServer + sDemoApiPrefix + "/V2/Northwind/Northwind.svc/";

		var oProject = new projectX.util.Project({
			identifier: 0,
			name: "Northwind Demo",
			baseUrl: sDemoService
		});

		oProject.generateBasicOdataRequests();

		// Create and set domain model to the component
		this._oModel = new sap.ui.model.json.JSONModel({
			SelectedProject : oProject,
			Projects : [oProject]
		});
		this.setModel(this._oModel);

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

		this.getRouter().initialize();
	},

	_createJsonString : function() {
		var aProjects = this._oModel.getProperty("/Projects");
		var aSaveableObject = [];
		for (var i = 0; i < aProjects.length; i++) {
			aSaveableObject.push(aProjects[i].serialize());
		}
		//create json string indented with 4 spaces
		var sData = JSON.stringify(aSaveableObject, null, 2);
		return sData;
	},

	_parseAndLoadProjects : function(sData) {
		var aLoadedProjects = JSON.parse(sData);
		var aProjects = [];
		for (var i = 0; i < aLoadedProjects.length; i++) {
			var oProject = new projectX.util.Project(aLoadedProjects[i]);
			aProjects.push(oProject);
		}

		if (!aProjects || aProjects.length <= 0) {
			return;
		}

		this._oModel.setProperty("/Projects", aProjects);
		this._oModel.setProperty("/SelectedProject", aProjects[0]);
		this._oModel.updateBindings();
	},

	/**
	 * save projects to lcoalstorage
	 */
	save : function() {
		var sData = this._createJsonString();
		window.localStorage.setItem("projects", sData);
	},

	/**
	 * load projects from localstorage
	 */
	load : function() {
		var sData = window.localStorage.getItem("projects");
		this._parseAndLoadProjects(sData);
	},
	
	/**
	 * create json file and prepare it for download.
	 * lets the user donwload the current config in a file which he then can
	 * save on disk.
	 */
	export : function() {
		var sData = this._createJsonString();
		var pom = document.createElement('a');
		pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(sData));
		pom.setAttribute('download', "projectX.config");
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
			that._parseAndLoadProjects(sData);
			
		};
		oFileReader.readAsText(oFile);
	},

	/**
	 * create a new project and add to global model.
	 * select the new project
	 */
	createNewProject : function(sName, sBaseUrl) {
		var aProjects = this._oModel.getProperty("/Projects");
		var iHighestID = 0;
		for (var i = 0; i < aProjects.length; i++) {
			iHighestID = Math.max(aProjects[i].getIdentifier(), iHighestID);
		}
		var iNewID = iHighestID + 1;

		//create new Project object and fill in data from local project model
		var oProject = new projectX.util.Project({
			identifier: iNewID,
			name: sName,
			baseUrl: sBaseUrl
		});

		//add test requests
		oProject.addNewRequest();
		oProject.addNewRequest();

		//push new projects to global model
		aProjects.push(oProject);
		this._oModel.setProperty("/Projects", aProjects);
		this._oModel.setProperty("/SelectedProject", oProject);
	},
	
	/**
	 * duplicate this request and add it to the currently selected project.
	 * @param {object} oRequest request to duplicate
	 */
	duplicateRequest : function(oRequest) {
		var oSelectedProject = this._oModel.getProperty("/SelectedProject");
		oSelectedProject.addCopyOfRequest(oRequest);
		this._oModel.updateBindings();
	}
	
});
