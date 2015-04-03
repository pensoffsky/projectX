jQuery.sap.require("projectX.util.Project");
jQuery.sap.require("projectX.util.Request");
jQuery.sap.require("projectX.util.Controller");

projectX.util.Controller.extend("projectX.view.TestRun", {
	
	// /////////////////////////////////////////////////////////////////////////////
	// /// Members
	// /////////////////////////////////////////////////////////////////////////////
	
	_oLocalUIModel : null,
	_oSelectedProject : null,
	
	// /////////////////////////////////////////////////////////////////////////////
	// /// initialization and routing
	// /////////////////////////////////////////////////////////////////////////////

	onInit : function() {
		this._oLocalUIModel = new sap.ui.model.json.JSONModel({
			project : {}
		});
		this.getView().setModel(this._oLocalUIModel, "localUImodel");
		
		//hook navigation event
		this.getRouter().getRoute("testrun").attachPatternMatched(this.onRouteMatched, this);
	},

	onRouteMatched : function(oEvent) {
		// var oParameters = oEvent.getParameters();
		var oModel = this.getView().getModel();
		//get the selected project
		this._oSelectedProject = oModel.getProperty("/SelectedProject");
		this._oLocalUIModel.setProperty("/project", this._oSelectedProject);
		this._oLocalUIModel.updateBindings();
	},

	// /////////////////////////////////////////////////////////////////////////////
	// /// Event Handler
	// /////////////////////////////////////////////////////////////////////////////

	onRun : function() {
		//get the requests
		var aRequests = this._oSelectedProject.getRequests();
		if (!aRequests || aRequests.length <= 0) {
			return;
		}
		
		var that = this;
		//loop over requests and execute them
		for (var i = 0; i < aRequests.length; i++) {
			//clear old request results
			aRequests[i].resetTempData();
			//execute the request
			var oDeferred = aRequests[i].execute();
			
			//add hanlder that gets called once the request finishes
			oDeferred.always(function() {
				//update bindings so that the status will be displayed
				that.getView().getModel().updateBindings();
			});
		}
	},
	
	onClearResults : function() {
		//get the requests
		var aRequests = this._oSelectedProject.getRequests();
		if (!aRequests || aRequests.length <= 0) {
			return;
		}
		
		//loop over requests and reset the result data
		for (var i = 0; i < aRequests.length; i++) {
			//clear old request results
			aRequests[i].resetTempData();
		}
		this.getView().getModel().updateBindings();
	},
	
	// /////////////////////////////////////////////////////////////////////////////
	// /// Private Methods
	// /////////////////////////////////////////////////////////////////////////////

	

});