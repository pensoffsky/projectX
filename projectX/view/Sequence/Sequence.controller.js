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
		this._localUIModel = new sap.ui.model.json.JSONModel();
		this._localUIModel.setData({
			configVisible: true,
			testVisible: false,
			testRunning : false,
			testNotRunning : true
		});
		this.getView().setModel(this._localUIModel, "localUIModel");
		
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
			this._localUIModel.setProperty("/sequence", this._oSequence);
			//set helper values to modify the page between edit and new
			this._localUIModel.setProperty("/reasonNew", false);
			this._localUIModel.setProperty("/reasonEdit", true);
			this._localUIModel.setProperty("/reason", "Edit sequence");
			
			//get requests for requestIds and set to local ui model
			var aSelectedRequests = this._oSequence.getRequestIds().map(function(iId){
				return oSelectedProject.getRequestByIdentifier(iId);
			});
			this._localUIModel.setProperty("/selectedRequests", aSelectedRequests);
		} else/* if (sReason === "new")*/{
			this._oSequence = new projectX.util.Sequence({
				name : "new sequence"
			});
			//user wants to create a new sequence
			//clear the local project model
			this._localUIModel.setProperty("/sequence", this._oSequence);
			//set helper values to modify the page between edit and new
			this._localUIModel.setProperty("/reasonNew", true);
			this._localUIModel.setProperty("/reasonEdit", false);
			this._localUIModel.setProperty("/reason", "Create new sequence");
			this._localUIModel.setProperty("/selectedRequests",[]);
		}
		
		//add list of requests to local ui model
		this._localUIModel.setProperty("/requests", oSelectedProject.getRequests());
	},

	// /////////////////////////////////////////////////////////////////////////////
	// /// event handler
	// /////////////////////////////////////////////////////////////////////////////

	onSegmentedButtonSelect : function(oEvent){
		var sSelectedId = oEvent.getParameter("id");
		switch (sSelectedId) {
			case this.createId("idButtonConfig"):
				this._localUIModel.setProperty("/configVisible", true);
				this._localUIModel.setProperty("/testVisible", false);
				break;
			case this.createId("idButtonTest"):
				this._localUIModel.setProperty("/configVisible", false);
				this._localUIModel.setProperty("/testVisible", true);
				break;
		default:
			console.log("problem with segmented button on sequence page");
		}
	},

	onSave : function() {
		//basic input validation
		if (!this._oSequence.getName()){
			alert("name field is required");
			return;
		}
		
		this._oOriginalSequence.setName(this._oSequence.getName());
		var aRequests = this._localUIModel.getProperty("/selectedRequests");
		this._oOriginalSequence.addRequestIds(aRequests);
		this._localUIModel.updateBindings();
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
		var aSelectedRequests = this._localUIModel.getProperty("/selectedRequests");
		aSelectedRequests.push(oRequest);
		this._localUIModel.setProperty("/selectedRequests",aSelectedRequests);
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
		var aSelectedRequests =  this._localUIModel.getProperty("/selectedRequests");
		aSelectedRequests.splice(aSelectedRequests.indexOf(oRequest), 1);
		this._localUIModel.setProperty("/selectedRequests",aSelectedRequests);
		this._oTable.removeSelections(true);
	},

	/**
	* execute the first request. when it finished than execute the next request.
	* can be aborted by the user. (see onStopSequence function)
	*/
	onRunSequence : function() {
		//get the requests
		var aRequests = this._localUIModel.getProperty("/selectedRequests");
		if (!aRequests || aRequests.length <= 0) {
			return;
		}
		//TODO create deep copy of single requests
		//maybe on entering the screen
		
		//clear existing results
		this.onClearResults();
		
		this._setRunning(true);
		this._executeRequests(0, aRequests);
	},

	/**
	* stop the currently running sequence.
	* works only when sequence was started with onRunSequence function.
	*/
	onStopSequence : function() {
		if (this._getRunning()) {
			this._bAbortSequence = true;
		}
	},
	
	/**
	* loop over the requests and clear out the result data from the last test run.
	*/
	onClearResults : function() {
		//get the requests
		var aRequests = this._localUIModel.getProperty("/selectedRequests");
		if (!aRequests || aRequests.length <= 0) {
			return;
		}
		
		//loop over requests and reset the result data
		for (var i = 0; i < aRequests.length; i++) {
			//clear old request results
			aRequests[i].resetTempData();
		}
		this._localUIModel.updateBindings();
	},
	
	/**
	* the user clicked on the title of a specific request.
	*/
	onRequestNamePress : function (oEvent) {
		//TODO what logic to implement here?
		//navigate to the request?
		//show details for the request?
		//show the result of the assertions (not yet implemented)
		var oParameters = oEvent.getParameters();
		// var oItem = this.getView().byId(sId);
		var oObjectHeader = oEvent.getSource();
		var oColumnListItem = oObjectHeader.getParent(); //the columListItem control
		oColumnListItem.toggleStyleClass("columnListItemExpanded");
	},
	
	// /////////////////////////////////////////////////////////////////////////////
	// /// Private Methods
	// /////////////////////////////////////////////////////////////////////////////

	/**
	* use recursion to go through the request and execute them one by one.
	* @param  {int} iIndex    the index of the request to execute next
	* @param  {array} aRequests array of all requests to execute one after another
	*/
	_executeRequests : function(iIndex, aRequests) {
		var that = this;		
		if (aRequests.length <= iIndex){
			//abort
			this._setRunning(false);
			return;
		}
		
		//execute the request
		var oRequest = aRequests[iIndex];
		var oDeferred = oRequest.execute();
		//add hanlder that gets called once the request finishes
		oDeferred.always(function() {
			oRequest.checkAssertions();
			//update bindings so that the status will be displayed
			that._localUIModel.updateBindings(false);
			
			if (that._bAbortSequence === true){
				that._bAbortSequence = false;
				that._setRunning(false);
				return;
			}
			
			that._executeRequests(iIndex + 1, aRequests);
			//TODO add positiliy to abort on failure
		});		
	},

	/**
	* set the ui bindings to "test is running" or "test is not running".
	* used to change visibilites on the UI.
	* @param {boolean} bIsRunning state of test running
	*/
	_setRunning : function(bIsRunning) {
		this._localUIModel.setProperty("/testRunning", bIsRunning);
		this._localUIModel.setProperty("/testNotRunning", !bIsRunning);
	},
	
	_getRunning : function() {
		return this._localUIModel.getProperty("/testRunning");
	}
	

});