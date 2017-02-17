jQuery.sap.require("projectX.util.Project");
jQuery.sap.require("projectX.util.Request");
jQuery.sap.require("projectX.util.Controller");
jQuery.sap.require("projectX.util.Helper");

projectX.util.Controller.extend("projectX.view.GitHubDialog.GitHubDialog", {

	_localUIModel : undefined,
	_oProject : null,

	//TODO create enum for the binding targets

//initialization and routing

	onInit : function() {
		this._localUIModel = new sap.ui.model.json.JSONModel({
			project: null,
			odataServiceCheckRes : ""
		});
		//set the local ui model to the view
		//use a name when addressing the local ui model from xml
		this.getView().setModel(this._localUIModel, "localUIModel");

		//hook navigation event
		//this.getRouter().getRoute("project").attachPatternMatched(this.onRouteMatched, this);
	},

	onRouteMatched : function(oEvent) {
		this._oProject =  null;

		//var oParameters = oEvent.getParameters();
		//var iProjectID = parseInt(oParameters.arguments.projectID, 10);
		var oModel = this.getView().getModel();
		var oSelectedProject = oModel.getProperty("/SelectedProject");
		if (!oSelectedProject) {
			return;
		}

		this._oProject = oSelectedProject;
		this._localUIModel.setProperty("/project", oSelectedProject);
	},

	// /////////////////////////////////////////////////////////////////////////////
	// /// event handler
	// /////////////////////////////////////////////////////////////////////////////
	
	/**
	* called from the name input control when the name changes.
	* after a delay triggers the updating of the master list to show the new name.
	*/
	onNameChanged : function() {
		this.triggerWithInputDelay(function() {
			this.updateMasterList();
		});
	},
	
	onExit : function() {
		this.getView().getModel().updateBindings(true);
	},

	// /////////////////////////////////////////////////////////////////////////////
	// /// private methods
	// /////////////////////////////////////////////////////////////////////////////

	_saveProject : function() {
		//get currently selected model
		var oModel = this.getView().getModel();
		var oSelectedProject = oModel.getProperty("/SelectedProject");
		//write data from local project model back to selected project
		oSelectedProject.setName(this._localUIModel.getProperty("/name"));
		// oSelectedProject.setBaseUrl(this._localUIModel.getProperty("/baseUrl"));
		//TODO check if this is needed
		oModel.setProperty("/SelectedProject", null);
		oModel.setProperty("/SelectedProject", oSelectedProject);
	},

});