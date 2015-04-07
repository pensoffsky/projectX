jQuery.sap.require("projectX.util.Project");
jQuery.sap.require("projectX.util.Request");
jQuery.sap.require("projectX.util.Controller");
jQuery.sap.require("projectX.util.Formatter");

projectX.util.Controller.extend("projectX.view.TestRun", {
	
	// /////////////////////////////////////////////////////////////////////////////
	// /// Members
	// /////////////////////////////////////////////////////////////////////////////
	
	_oLocalUIModel : null,
	_oSelectedProject : null,
	_bAbortSequence : false,
	
	// /////////////////////////////////////////////////////////////////////////////
	// /// initialization and routing
	// /////////////////////////////////////////////////////////////////////////////

	onInit : function() {
		this._oLocalUIModel = new sap.ui.model.json.JSONModel({
			project : {},
			testRunning : false,
			testNotRunning : true
		});
		this.getView().setModel(this._oLocalUIModel, "localUIModel");
		
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

	/**
	 * execute all requests in parallel.
	 * clears out the last requests.
	 */
	onRun : function() {
		var that = this;
		//get the requests
		var aRequests = this._oSelectedProject.getRequests();
		if (!aRequests || aRequests.length <= 0) {
			return;
		}
		
		//clear existing results
		this.onClearResults();
		
		//create function that executes the request and 
		//triggers assetion check und update binding when request finnishes.
		//done in this way to have the ref to oRequest inside the oDeferred fct.
		var fExecuteRequest = function(oRequest) {
			var oDeferred = oRequest.execute();
			
			//add hanlder that gets called once the request finishes
			oDeferred.always(function() {
				oRequest.checkAssertions();
				//update bindings so that the status will be displayed
				that.getView().getModel().updateBindings();
			});
		};
		
		//loop over requests and execute them
		for (var i = 0; i < aRequests.length; i++) {
			//execute the request
			var oRequest = aRequests[i];
			fExecuteRequest(oRequest);
		}
	},
	
	/**
	 * execute the first request. when it finished than execute the next request.
	 * can be aborted by the user. (see onStopSequence function)
	 */
	onRunSequence : function() {
		//get the requests
		var aRequests = this._oSelectedProject.getRequests();
		if (!aRequests || aRequests.length <= 0) {
			return;
		}
		
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
			that.getView().getModel().updateBindings(false);
			
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
		this._oLocalUIModel.setProperty("/testRunning", bIsRunning);
		this._oLocalUIModel.setProperty("/testNotRunning", !bIsRunning);
	},
	
	_getRunning : function() {
		return this._oLocalUIModel.getProperty("/testRunning");
	}

});