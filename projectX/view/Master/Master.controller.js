/**
 * collection of formatter functions for bindings
 */
sap.ui.define(['jquery.sap.global', 'projectX/util/Controller', 'projectX/util/Constants', 'projectX/util/Formatter', 'projectX/util/Helper'],
	function(jQuery, Controller, Constants, Formatter, Helper) {
		"use strict";

		var Master = Controller.extend("projectX.view.Master.Master", {
			metadata: {}
		});


		// /////////////////////////////////////////////////////////////////////////////
		// /// Members
		// /////////////////////////////////////////////////////////////////////////////

		Master.prototype._localUIModel = null;

		/**
		 * the paths for the local UI model available for binding.
		 */
		Master.LOCALPATHS = {
			REQUESTS_VISIBLE : "/requestsVisible",
			SEQUENCES_VISIBLE : "/sequencesVisible"
		};

		// /////////////////////////////////////////////////////////////////////////////
		// /// Initialization
		// /////////////////////////////////////////////////////////////////////////////
		
		Master.prototype.onInit = function() {
			//create local ui model
			this._localUIModel = new sap.ui.model.json.JSONModel();
			this._localUIModel.setData({
				requestsVisible: true,
				sequencesVisible: false
			});
			this.getView().setModel(this._localUIModel, "localUIModel");

			this.getRouter().getRoute("main").attachPatternMatched(this.onRouteMatched, this);
			
			//if ?sequence=true exists in url then switch to sequence page after 2 seconds
			if(jQuery.sap.getUriParameters().get("sequence") === "true"){
				setTimeout($.proxy( function() {
					var oList = this.getView().byId("idListSequences")
					var aItems = oList.getItems();
					if (aItems.length) {
						oList.setSelectedItem(aItems[0], true);
						var oSelectedSequence = Helper.getBoundObjectForItem(aItems[0]);
						this.getRouter().navTo("sequence", {
							sequenceID : oSelectedSequence.getIdentifier(),
							reason : "edit"
						}, true);
						this._removeSelectionFromRequestList();
					}
					
				}, this), 2000);
			}
			
			if(jQuery.sap.getUriParameters().get("editproject") === "true"){
				setTimeout($.proxy( function() {
					this.onEditProject();
				}, this), 1000);
			}
			
			if(jQuery.sap.getUriParameters().get("metadata") === "true"){
				setTimeout($.proxy( function() {
					this.onAddRequestMetadata();
				}, this), 1000);
			}
		},

		Master.prototype.onRouteMatched = function(oEvent) {
			
		};
		
		// /////////////////////////////////////////////////////////////////////////////
		// /// Project Event Handler
		// /////////////////////////////////////////////////////////////////////////////

		/**
		* the user selected a project.
		* make sure the master list shows the request of this project
		*/
		Master.prototype.onSelectProjectChange = function(oEvent){
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var oBindingContext = oSelectedItem.getBindingContext();
			var oModel = this.getView().getModel();
			
			//remove the selection prior to changing the databinding
			//this will then trigger the selection of the first request element
			this._removeSelectionFromRequestList();
			this._removeSelectionFromSequenceList();
			//TODO also switch to requests tab here
			
			//set the new project as selected
			oModel.setProperty("/SelectedProject", oModel.getProperty(oBindingContext.getPath()));
		};

		

		/**
		* the user wants to add a new project.
		* navigate to the new project screen.
		*/
		Master.prototype.onAddNewProject = function() {
			this.getRouter().navTo("project", {
				projectID : 0,
				reason : "new"
			}, true);
			
			//remove selection from request and sequences list
			this._removeSelectionFromRequestList();
			this._removeSelectionFromSequenceList();
		};

		Master.prototype.onEditProject = function() {
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
			
			//remove selection from request and sequences list
			this._removeSelectionFromRequestList();
			this._removeSelectionFromSequenceList();
		};

		// /////////////////////////////////////////////////////////////////////////////
		// /// SubHeader Event Handler
		// /////////////////////////////////////////////////////////////////////////////

		Master.prototype.onLoad = function() {
			var oComponent = this.getComponent();
			oComponent.load();
		};

		Master.prototype.onSave = function() {
			var oComponent = this.getComponent();
			oComponent.save();
		};

		Master.prototype.onExport = function() {
			var oComponent = this.getComponent();
			oComponent.export();
		};

		Master.prototype.onFileUploaderChange = function(oEvent) {
			//TODO add error hanlding. at the moment best case programming
			var aFiles = oEvent.getParameter("files");
			var oFile = aFiles[0];
			
			var oComponent = this.getComponent();
			oComponent.import(oFile);	
		};

		// /////////////////////////////////////////////////////////////////////////////
		// /// List Event Handler
		// /////////////////////////////////////////////////////////////////////////////

		Master.prototype.onSequencesListSelect = function(oEvent) {
			var oItem = oEvent.getParameter("listItem") || oEvent.getSource();
			var oSelectedSequence = Helper.getBoundObjectForItem(oItem);
			
			this.getRouter().navTo("sequence", {
				sequenceID : oSelectedSequence.getIdentifier(),
				reason : "edit"
			}, true);
			this._removeSelectionFromRequestList();
		};

		Master.prototype.onRequestsListSelect = function(oEvent) {
			// Get the list item, either from the listItem parameter or from the event's
			// source itself (will depend on the device-dependent mode).
			this._showSelectedRequest(oEvent.getParameter("listItem") || oEvent.getSource());
			this._removeSelectionFromSequenceList();
		};
		
		/**
		* after the list update finished.
		* select the first item and show the detail page for this item
		*/
		Master.prototype.onListUpdateFinished = function() {
			//after the list updated
			var oList = this.getView().byId("idListRequests")
			var oSelectedItem = oList.getSelectedItem();
			if (oSelectedItem){
				return;
			}
			
			this._selectFirstRequest();
		};

		// /////////////////////////////////////////////////////////////////////////////
		// /// Segmented Button Event Handler
		// /////////////////////////////////////////////////////////////////////////////

		Master.prototype.onSegmentedButtonSelect = function(oEvent){
			var sSelectedId = oEvent.getParameter("id");
			switch (sSelectedId) {
				case this.createId("idButtonRequests"):
					this._localUIModel.setProperty("/requestsVisible", true);
					this._localUIModel.setProperty("/sequencesVisible", false);
					break;
				case this.createId("idButtonSequences"):
					this._localUIModel.setProperty("/requestsVisible", false);
					this._localUIModel.setProperty("/sequencesVisible", true);
					break;
			default:
				console.log("problem with segmented button on master page");
			}
		};

		// /////////////////////////////////////////////////////////////////////////////
		// /// Footer Event Handler
		// /////////////////////////////////////////////////////////////////////////////

		/**
		* add a new request to the currently selected project 
		*/
		Master.prototype.onAddRequest = function() {
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
		};


		/**
		* show the odata service metadata page
		* to let the user add a request based on odata metadata information.
		*/
		Master.prototype.onAddRequestMetadata = function() {
			//get the model
			var oModel = this.getView().getModel();
			//get the selected project
			var oSelectedProject = oModel.getProperty("/SelectedProject");
			var iProjectID = oSelectedProject.getIdentifier();
			this.getRouter().navTo("metadata", {	
				projectID : iProjectID
			}, true);
			
			this._removeSelectionFromRequestList();
			this._removeSelectionFromSequenceList();
		};
		
		
		Master.prototype.onAddNewSequence = function() {
			var oModel = this.getView().getModel();
			//get the selected project
			var oSelectedProject = oModel.getProperty("/SelectedProject");
			if (!oSelectedProject) {
				return;
			}
			
			var oSequence = oSelectedProject.addNewSequence();
			oModel.updateBindings();
			//select the newly created sequence
			this.getRouter().navTo("sequence", {
				sequenceID : oSequence.getIdentifier(),
				reason : "edit"
			}, true);
		};		
		
		/**
		* move the selected request one place up in the list.
		* the user can reorder the list
		*/
		Master.prototype.onMoveRequestUp = function() {
			if (this._localUIModel.getProperty("/requestsVisible")) {
				this._moveSelectedListItem(Helper.moveArrayElementUp, 
				function(oProject){ return oProject.removeAllRequests(); },
				function(oProject, oRequest){ oProject.addRequest(oRequest); },
				"idListRequests");
			} else {
				this._moveSelectedListItem(Helper.moveArrayElementUp,
					function(oProject){ return oProject.removeAllSequences(); },
					function(oProject, oSequence){ oProject.addSequence(oSequence); },
					"idListSequences");
			}
		};

		/**
		* move the selected request one place down in the list.
		* the user can reorder the list
		*/
		Master.prototype.onMoveRequestDown = function() {
			if (this._localUIModel.getProperty("/requestsVisible")) {
				this._moveSelectedListItem(Helper.moveArrayElementDown,
					function(oProject){ return oProject.removeAllRequests(); },
					function(oProject, oRequest){ oProject.addRequest(oRequest); },
					"idListRequests");	
			} else {
				this._moveSelectedListItem(Helper.moveArrayElementDown,
					function(oProject){ return oProject.removeAllSequences(); },
					function(oProject, oSequence){ oProject.addSequence(oSequence); },
					"idListSequences");
			}
			
		};

		// /////////////////////////////////////////////////////////////////////////////
		// /// Private Methods
		// /////////////////////////////////////////////////////////////////////////////

		Master.prototype._moveSelectedListItem = function(fMove, fRemoveAllAggregation, fAddObject, sListId){
			//get the selected project
			var oModel = this.getView().getModel();
			var oSelectedProject = oModel.getProperty("/SelectedProject");
			
			//get selected request
			var oList = this.getView().byId(sListId);
			var oSelectedItem = oList.getSelectedItem();
			
			//exit if no item is selected
			if (!oSelectedItem){
				return;
			}
			
			var oSelectedObject = Helper.getBoundObjectForItem(oSelectedItem);
			// var aRequests = oSelectedProject.removeAllRequests();
			var aArray = fRemoveAllAggregation(oSelectedProject);
			
			var iNewPos = fMove(aArray, oSelectedObject);
			
			for (var i = 0; i < aArray.length; i++) {
				fAddObject(oSelectedProject, aArray[i]);
			}
			
			oModel.updateBindings();	
			
			//restore the selection
			var aItems = oList.getItems();
			oList.setSelectedItem(aItems[iNewPos]);
		};

		Master.prototype._showSelectedRequest = function(oItem) {
			var oModel = this.getView().getModel();
			var oSelectedProject = oModel.getProperty("/SelectedProject");
			var oSelectedRequest = Helper.getBoundObjectForItem(oItem);
			
			this.getRouter().navTo("product", {
				requestID : oSelectedRequest.getIdentifier(),
				projectID : oSelectedProject.getIdentifier()
			}, true);
		};

		Master.prototype._selectFirstRequest = function() {
			var oList = this.getView().byId("idListRequests")
			var aItems = oList.getItems();
			if (aItems.length) {
				oList.setSelectedItem(aItems[0], true);
				this._showSelectedRequest(aItems[0]);
			}
		};

		Master.prototype._removeSelectionFromRequestList = function () {
			var oList = this.getView().byId("idListRequests")
			oList.removeSelections(true);
		};
		
		Master.prototype._removeSelectionFromSequenceList = function () {
			var oList = this.getView().byId("idListSequences")
			oList.removeSelections(true);
		};

		return Master;

	}, /* bExport= */ true);
