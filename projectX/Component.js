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
			resourceBundle : "i18n/messageBundle.properties",
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
		// TODO check access-control request header to overcom CORS issue
		// https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
		var sDemoService = "http://services.odata.org/V2/Northwind/Northwind.svc/";
		var oProject = new projectX.util.Project({
			identifier: 0,
			name: "Northwind Demo", 
			baseUrl: sDemoService
		});
		oProject.generateBasicOdataRequests();

		// Create and set domain model to the component
		this._oModel = new sap.ui.model.json.JSONModel({
			SelectedProject : oProject,
			Projects : [oProject],
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

	/**
	 * save projects to lcoalstorage
	 */
	save : function() {
		var aProjects = this._oModel.getProperty("/Projects");
		var aSaveableObject = [];
		for (var i = 0; i < aProjects.length; i++) {
			aSaveableObject.push(aProjects[i].serialize());
		}

		var sData = JSON.stringify(aSaveableObject);
		window.localStorage.setItem("projects", sData);
	},

	/**
	 * load projects from localstorage
	 */
	load : function() {
		var sData = window.localStorage.getItem("projects");
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
	 * create a new project and add to global model.
	 * select the new project
	 */
	createNewProject : function(sName, sBaseUrl) {
		//TODO find next project id
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
	}
});
