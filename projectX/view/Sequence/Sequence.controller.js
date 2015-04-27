jQuery.sap.require("projectX.util.Project");
jQuery.sap.require("projectX.util.Request");
jQuery.sap.require("projectX.util.Controller");
jQuery.sap.require("projectX.util.Helper");



projectX.util.Controller.extend("projectX.view.Sequence.Sequence", {
	
	_localProjectModel : undefined,
	_sReason : null,
	_oSequence : null,
	_oOriginalSequence : null,

	//TODO create enum for the binding targets

	// /////////////////////////////////////////////////////////////////////////////
	// /// initialization and routing
	// /////////////////////////////////////////////////////////////////////////////

	onInit : function() {
		this._localProjectModel = new sap.ui.model.json.JSONModel({
			
		});
		this.getView().setModel(this._localProjectModel, "localUIModel");
		
		//hook navigation event
		this.getRouter().getRoute("sequence").attachPatternMatched(this.onRouteMatched, this);
	},

	onRouteMatched : function(oEvent) {
		var oParameters = oEvent.getParameters();
		var iSequenceId = parseInt(oParameters.arguments.sequenceID, 10);
		var sReason = oParameters.arguments.reason;
		this._sReason = sReason;
		var oModel = this.getView().getModel();
		var oSelectedProject = oModel.getProperty("/SelectedProject");
		
		if (sReason === "edit"){
			//user wants to edit the currently selected model	
			var oSelectedSequence = oSelectedProject.getSequenceByIdentifier(iSequenceId);
			this._oOriginalSequence = oSelectedSequence;
			this._oSequence = jQuery.extend(true, [], oSelectedSequence);
			//set data from selected sequence into local project model
			this._localProjectModel.setProperty("/sequence", this._oSequence);
			//set helper values to modify the page between edit and new
			this._localProjectModel.setProperty("/reasonNew", false);
			this._localProjectModel.setProperty("/reasonEdit", true);
			this._localProjectModel.setProperty("/reason", "Edit sequence");
			
			//get requests for requestIds and set to local ui model
			var aSelectedRequests = this._oSequence.getRequestIds().map(function(iId){
				return oSelectedProject.getRequestByIdentifier(iId);
			});
			this._localProjectModel.setProperty("/selectedRequests", aSelectedRequests);
		} else/* if (sReason === "new")*/{
			this._oSequence = new projectX.util.Sequence({
				name : "new sequence"
			});
			//user wants to create a new sequence
			//clear the local project model
			this._localProjectModel.setProperty("/sequence", this._oSequence);
			//set helper values to modify the page between edit and new
			this._localProjectModel.setProperty("/reasonNew", true);
			this._localProjectModel.setProperty("/reasonEdit", false);
			this._localProjectModel.setProperty("/reason", "Create new sequence");
			this._localProjectModel.setProperty("/selectedRequests",[]);
		}
		
		//add list of requests to local ui model
		this._localProjectModel.setProperty("/requests", oSelectedProject.getRequests());
	},

	// /////////////////////////////////////////////////////////////////////////////
	// /// event handler
	// /////////////////////////////////////////////////////////////////////////////

	onSave : function() {
		//basic input validation
		if (!this._oSequence.getName()){
			alert("name field is required");
			return;
		}
		
		this._oOriginalSequence.setName(this._oSequence.getName());
		var aRequests = this._localProjectModel.getProperty("/selectedRequests");
		this._oOriginalSequence.addRequestIds(aRequests);
		var oModel = this.getView().getModel();
		oModel.updateBindings();
	},
	
	onCreate : function() {
		//basic input validation
		if (!this._oSequence.getName()){
			alert("name field is required");
			return;
		}
		
		//get id for sequence. set sequence to project
		var oModel = this.getView().getModel();
		var oSelectedProject = oModel.getProperty("/SelectedProject");
		var iSequenceId = oSelectedProject.getNextSequenceId();
		this._oSequence.setIdentifier(iSequenceId);
		oSelectedProject.addSequence(this._oSequence);
		oModel.updateBindings();
		//nav back
		sap.ui.core.UIComponent.getRouterFor(this).backWithoutHash(this.getView());
	},
	
	/**
	 * move selected request from request list to selected requests.
	 */
	onButtonRight : function() {
		var oRequestList = this.getView().byId("idListRequests");
		var oSelectedItem = oRequestList.getSelectedItem();
		if (!oSelectedItem){
			return;
		}
		
		var oRequest = oSelectedItem.getBindingContext("localUIModel").getObject();
		var aSelectedRequests = this._localProjectModel.getProperty("/selectedRequests");
		aSelectedRequests.push(oRequest);
		this._localProjectModel.setProperty("/selectedRequests",aSelectedRequests);
	},
	
	/**
	 * remove selected request from the right list of selected requests.
	 */
	onButtonLeft : function() {
		var oSelectedRequestList = this.getView().byId("idListSelectedRequests");
		var oSelectedItem = oSelectedRequestList.getSelectedItem();
		if (!oSelectedItem){
			return;
		}
		
		var oRequest = oSelectedItem.getBindingContext("localUIModel").getObject();
		var aSelectedRequests =  this._localProjectModel.getProperty("/selectedRequests");
		aSelectedRequests.splice(aSelectedRequests.indexOf(oRequest), 1);
		this._localProjectModel.setProperty("/selectedRequests",aSelectedRequests);
		this._oTable.removeSelections(true);
	},

	// /////////////////////////////////////////////////////////////////////////////
	// /// private methods
	// /////////////////////////////////////////////////////////////////////////////
	
	

});