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

//initialization and routing

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
		
		if (sReason === "edit"){
			//user wants to edit the currently selected model
			var oModel = this.getView().getModel();
			var oSelectedProject = oModel.getProperty("/SelectedProject");
			
			//TODO deep copy
			var oSelectedSequence = oSelectedProject.getSequenceByIdentifier(iSequenceId);
			this._oOriginalSequence = oSelectedSequence;
			this._oSequence = jQuery.extend(true, [], oSelectedSequence);
			//set data from selected sequence into local project model
			this._localProjectModel.setProperty("/sequence", this._oSequence);
			//set helper values to modify the page between edit and new
			this._localProjectModel.setProperty("/reasonNew", false);
			this._localProjectModel.setProperty("/reasonEdit", true);
			this._localProjectModel.setProperty("/reason", "Edit sequence");
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
		}
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
	

	// /////////////////////////////////////////////////////////////////////////////
	// /// private methods
	// /////////////////////////////////////////////////////////////////////////////
	
	

});