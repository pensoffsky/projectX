jQuery.sap.require("projectX.util.Formatter");
jQuery.sap.require("projectX.util.Controller");

projectX.util.Controller.extend("projectX.view.Master", {

	onInit : function() {
		//on phones, we will not have to select anything in the list so we don't need to attach to events
		if (sap.ui.Device.system.phone) {
			return;
		}

		this.getRouter().getRoute("main").attachPatternMatched(this.onRouteMatched, this);
	},

	onRouteMatched : function(oEvent) {

	},

	onSelect : function(oEvent) {
		// Get the list item, either from the listItem parameter or from the event's
		// source itself (will depend on the device-dependent mode).
		this.showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
	},

	showDetail : function(oItem) {
		var oBindingContext = oItem.getBindingContext();
        var oModel = oBindingContext.getModel();
        var sPath = oBindingContext.getPath();
        var oSelectedRequest = oModel.getProperty(sPath);
		var oSelectedProject = oModel.getProperty("/SelectedProject");
		
		//TODO add selected projectID to navigation parameters
		// If we're on a phone, include nav in history; if not, don't.
		var bReplace = jQuery.device.is.phone ? false : true;
		this.getRouter().navTo("product", {
			requestID : oSelectedRequest.getIdentifier(),
			projectID : oSelectedProject.getIdentifier(),
		}, bReplace);
	},
	
	/**
	 * after the list update finished.
	 * select the first item and show the detail page for this item
	 */
	onListUpdateFinished : function() {
		//after the list updated
		var oList = this.getView().byId("list")
		var aItems = oList.getItems();
		if (aItems.length) {
			oList.setSelectedItem(aItems[0], true);
			this.showDetail(aItems[0]);
		}
	},

	/**
	 * the user wants to add a new project.
	 * navigate to the new project screen.
	 */
	onAddNewProject : function() {
		this.getRouter().navTo("project", {
			projectID : 0,
			reason : "new"
		}, true);
	},
	
	onEditProject : function() {
		//get the model
		var oModel = this.getView().getModel();
		//get the selected project
		var oSelectedProject = oModel.getProperty("/SelectedProject");
		if (!oSelectedProject) {
			return;
		}
		var iProjectID = oSelectedProject.getIdentifier();
		this.getRouter().navTo("project", {
			projectID : iProjectID,
			reason : "edit"
		}, true);
	},
	
	onLoad : function() {
		var oComponent = this.getComponent();
		oComponent.load();
	},
	
	onSave : function() {
		var oComponent = this.getComponent();
		oComponent.save();
	},
	
	onExport : function() {
		var oComponent = this.getComponent();
		oComponent.export();
	},
	
	/**
	 * add a new request to the currently selected project 
	 */
	onAddRequest : function() {
		//get the model
		var oModel = this.getView().getModel();
		//get the selected project
		var oSelectedProject = oModel.getProperty("/SelectedProject");
		if (!oSelectedProject) {
			return;
		}
		
		oSelectedProject.addNewRequest();
		oModel.updateBindings();
		//TODO select the newly created request
	},
	
	/**
	 * the user selected a project.
	 * make sure the master list shows the request of this project
	 */
	onSelectProjectChange : function(oEvent){
		var oSelectedItem = oEvent.getParameter("selectedItem");
		var oBindingContext = oSelectedItem.getBindingContext();
		var oModel = this.getView().getModel();
		oModel.setProperty("/SelectedProject", oModel.getProperty(oBindingContext.getPath()));
	}

});