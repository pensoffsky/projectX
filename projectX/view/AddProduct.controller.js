jQuery.sap.require("projectX.util.Project");
jQuery.sap.require("projectX.util.Request");
jQuery.sap.require("projectX.util.Controller");

projectX.util.Controller.extend("projectX.view.AddProduct", {
	
	_localProjectModel : undefined,
	_sReason : null,

	//TODO create enum for the binding targets

//initialization and routing

	onInit : function() {
		this._localProjectModel = new sap.ui.model.json.JSONModel({
			
		});
		this.getView().setModel(this._localProjectModel, "projectModel");
		
		//hook navigation event
		this.getRouter().getRoute("project").attachPatternMatched(this.onRouteMatched, this);
	},

	onRouteMatched : function(oEvent) {
		var oParameters = oEvent.getParameters();
		var iProjectID = parseInt(oParameters.arguments.projectID, 10);
		var sReason = oParameters.arguments.reason;
		this._sReason = sReason;
		
		if (sReason === "edit"){
			//user wants to edit the currently selected model
			var oModel = this.getView().getModel();
			var oSelectedProject = oModel.getProperty("/SelectedProject");
			//set data from selected project into local project model
			this._localProjectModel.setProperty("/name", oSelectedProject.getName());
			this._localProjectModel.setProperty("/baseUrl", oSelectedProject.getBaseUrl());
			//set helper values to modify the page between edit and new
			this._localProjectModel.setProperty("/reasonNew", false);
			this._localProjectModel.setProperty("/reasonEdit", true);
			this._localProjectModel.setProperty("/reason", "Edit project");
		} else/* if (sReason === "new")*/{
			//user wants to create a new project
			//clear the local project model
			this._localProjectModel.setProperty("/name", "");
			this._localProjectModel.setProperty("/baseUrl", "");
			//set helper values to modify the page between edit and new
			this._localProjectModel.setProperty("/reasonNew", true);
			this._localProjectModel.setProperty("/reasonEdit", false);
			this._localProjectModel.setProperty("/reason", "Create new project");
		}
		
		var oModel = this.getView().getModel();
	},

//event handler

	onSave : function() {
		//basic input validation
		if (!this._localProjectModel.getProperty("/name")){
			alert("name field is required");
			return;
		}
		
		this._saveProject();
		sap.ui.core.UIComponent.getRouterFor(this).backWithoutHash(this.getView());
	},
	
	onCreate : function() {
		//basic input validation
		if (!this._localProjectModel.getProperty("/name")){
			alert("name field is required");
			return;
		}
		
		this._createProject();
		sap.ui.core.UIComponent.getRouterFor(this).backWithoutHash(this.getView());
	},

	onCancel : function() {
		sap.ui.core.UIComponent.getRouterFor(this).backWithoutHash(this.getView());
	},


//private methods

	_createProject : function() {
		//create new Project object and fill in data from local project model
		var oProject = new projectX.util.Project();
		oProject.setName(this._localProjectModel.getProperty("/name"));
		oProject.setBaseUrl(this._localProjectModel.getProperty("/baseUrl"));
		
		//add test requests
		oProject.addNewRequest();
		oProject.addNewRequest();
		
		
		//push new projects to global model
		var oModel = this.getView().getModel();
		var aProjects = oModel.getProperty("/Projects");
		aProjects.push(oProject);
		oModel.setProperty("/Projects", aProjects);
		oModel.setProperty("/SelectedProject", oProject);
	},
	
	_saveProject : function() {
		//get currently selected model
		var oModel = this.getView().getModel();
		var oSelectedProject = oModel.getProperty("/SelectedProject");
		//write data from local project model back to selected project
		oSelectedProject.setName(this._localProjectModel.getProperty("/name"));
		oSelectedProject.setBaseUrl(this._localProjectModel.getProperty("/baseUrl"));
		oModel.setProperty("/SelectedProject", null);
		oModel.setProperty("/SelectedProject", oSelectedProject);
	},

});