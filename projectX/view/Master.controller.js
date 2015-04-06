jQuery.sap.require("projectX.util.Formatter");
jQuery.sap.require("projectX.util.Controller");

projectX.util.Controller.extend("projectX.view.Master", {

	onInit : function() {
		//on phones, we will not have to select anything in the list so we don't need to attach to events
		if (sap.ui.Device.system.phone) {
			return;
		}

		this.getRouter().getRoute("main").attachPatternMatched(this.onRouteMatched, this);
		
		//if ?testrun=true exists in url then switch to testrun page after 1 second
		if(jQuery.sap.getUriParameters().get("testrun") === "true"){
			setTimeout($.proxy( function() {
				this.onTestRun();
			}, this), 1000);
		}
		
		if(jQuery.sap.getUriParameters().get("editproject") === "true"){
			setTimeout($.proxy( function() {
				this.onEditProject();
			}, this), 1000);
		}
	},

	onRouteMatched : function(oEvent) {

	},

	// /////////////////////////////////////////////////////////////////////////////
	// /// Event Handler
	// /////////////////////////////////////////////////////////////////////////////

	onSelect : function(oEvent) {
		// Get the list item, either from the listItem parameter or from the event's
		// source itself (will depend on the device-dependent mode).
		this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
	},

	/**
	* the user selected a project.
	* make sure the master list shows the request of this project
	*/
	onSelectProjectChange : function(oEvent){
		var oSelectedItem = oEvent.getParameter("selectedItem");
		var oBindingContext = oSelectedItem.getBindingContext();
		var oModel = this.getView().getModel();
		
		//remove the selection prior to changing the databinding
		//this will then trigger the selection of the first element
		this._removeSelectionFromList();
		
		//set the new project as selected
		oModel.setProperty("/SelectedProject", oModel.getProperty(oBindingContext.getPath()));
	},

	/**
	* after the list update finished.
	* select the first item and show the detail page for this item
	*/
	onListUpdateFinished : function() {
		//after the list updated
		var oList = this.getView().byId("list")
		var oSelectedItem = oList.getSelectedItem();
		if (oSelectedItem){
			return;
		}
		
		this._selectFirstListItem();
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
		
		//remove selection from master list
		this._removeSelectionFromList();
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
		
		//remove selection from master list
		this._removeSelectionFromList();
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

	onFileUploaderChange : function(oEvent) {
		//TODO add error hanlding. at the moment best case programming
		var aFiles = oEvent.getParameter("files");
		var oFile = aFiles[0];
		
		var oComponent = this.getComponent();
		oComponent.import(oFile);	
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
	* show the TestRun page
	*/
	onTestRun : function() {
		var bReplace = jQuery.device.is.phone ? false : true;
		this.getRouter().navTo("testrun", bReplace);
		//remove the selection from the master list to allow easy switch back
		var oList = this.getView().byId("list")
		oList.removeSelections(true);
	},
		
	/**
	* move the selected request one place up in the list.
	* the user can reorder the list
	*/
	onMoveRequestUp : function() {
		this._moveSelectedRequest(this._moveUp);
	},
	
	/**
	* move the selected request one place down in the list.
	* the user can reorder the list
	*/
	onMoveRequestDown : function() {
		
		this._moveSelectedRequest(this._moveDown);
	},
	
	

	// /////////////////////////////////////////////////////////////////////////////
	// /// Private Methods
	// /////////////////////////////////////////////////////////////////////////////

	_moveSelectedRequest : function(fMove){
		//get the selected project
		var oModel = this.getView().getModel();
		var oSelectedProject = oModel.getProperty("/SelectedProject");
		
		//get selected request
		var oList = this.getView().byId("list")
		var oSelectedItem = oList.getSelectedItem();
		
		//exit if no item is selected
		if (!oSelectedItem){
			return;
		}
		
		var oSelectedRequest = this._getRequestForListItem(oSelectedItem);
		var aRequests = oSelectedProject.removeAllRequests();
		
		var iNewPos = fMove(aRequests, oSelectedRequest);
		
		for (var i = 0; i < aRequests.length; i++) {
			oSelectedProject.addRequest(aRequests[i]);
		}
		
		//TODO restore selection
		oModel.updateBindings();	
		
		//restore the selection
		//in timeout because updatebindings triggers selection of the first item
		// setTimeout(function(){ 
				var aItems = oList.getItems();
				oList.setSelectedItem(aItems[iNewPos]);
			// }, 0);		
	},

	_moveUp : function(aArray, value, by) {
	    var index = aArray.indexOf(value),     
	        newPos = index - (by || 1);
	    
	    if(index === -1) 
	        throw new Error("Element not found in array");
	    
	    if(newPos < 0) 
	        newPos = 0;
	        
		aArray.splice(index,1);
		aArray.splice(newPos,0,value);
		return newPos;
	},

	_moveDown : function(aArray, value, by) {
	    var index = aArray.indexOf(value),     
	        newPos = index + (by || 1);
	    
	    if(index === -1) 
	        throw new Error("Element not found in array");
	    
	    if(newPos >= aArray.length) 
	        newPos = aArray.length;
	    
			aArray.splice(index, 1);
		aArray.splice(newPos,0,value);
		return newPos;
	},


	_showDetail : function(oItem) {
		var oModel = this.getView().getModel();
		var oSelectedProject = oModel.getProperty("/SelectedProject");
		var oSelectedRequest = this._getRequestForListItem(oItem);
		
		//TODO add selected projectID to navigation parameters
		// If we're on a phone, include nav in history; if not, don't.
		var bReplace = jQuery.device.is.phone ? false : true;
		this.getRouter().navTo("product", {
			requestID : oSelectedRequest.getIdentifier(),
			projectID : oSelectedProject.getIdentifier()
		}, bReplace);
	},
	
	//TODO move to helper
	_getRequestForListItem : function(oListItem) {
		var oBindingContext = oListItem.getBindingContext();
		var oModel = oBindingContext.getModel();
		var sPath = oBindingContext.getPath();
		var oSelectedRequest = oModel.getProperty(sPath);
		return oSelectedRequest;
	},
	
	_selectFirstListItem : function() {
		var oList = this.getView().byId("list")
		var aItems = oList.getItems();
		if (aItems.length) {
			oList.setSelectedItem(aItems[0], true);
			this._showDetail(aItems[0]);
		}
	},
	
	_removeSelectionFromList : function () {
		var oList = this.getView().byId("list")
		oList.removeSelections(true);
	}
	
	
});