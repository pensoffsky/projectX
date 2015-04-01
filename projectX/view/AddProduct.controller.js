jQuery.sap.require("projectX.util.Project");
jQuery.sap.require("projectX.util.Request");

sap.ui.core.mvc.Controller.extend("projectX.view.AddProduct", {
	
	_localProjectModel : undefined,

	onInit : function() {
		this._localProjectModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(this._localProjectModel, "newProject");
	},

	saveProject : function() {
		var oProjectData = this._localProjectModel.getData();
		
		//create new Project object
		var oProject = new projectX.util.Project();
		oProject.setName(oProjectData["Name"]);
		
		//add test request
		var oRequest = new projectX.util.Request({name:"test1", url:"http://"});
		oProject.addRequest(oRequest);
		oRequest = new projectX.util.Request({name:"test2", url:"http2://"});
		oProject.addRequest(oRequest);
		
		//push new projects to global model
		var oModel = this.getView().getModel();
		var aProjects = oModel.getProperty("/Projects");
		aProjects.push(oProject);
		oModel.setProperty("/Projects", aProjects);
		oModel.setProperty("/SelectedProject", oProject);
		
		debugger
	},

	onSave : function() {
		//basic input validation
		if (!this._localProjectModel.getProperty("/Name")){
			alert("name field is required");
			return;
		}
		
		this.saveProject();
	},

	onCancel : function() {
		sap.ui.core.UIComponent.getRouterFor(this).backWithoutHash(this.getView());
	},

});