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

		Master.TABS = {
			REQUESTS : "REQUESTS",
			SEQUENCES : "SEQUENCES"
		};

		// /////////////////////////////////////////////////////////////////////////////
		// /// Initialization
		// /////////////////////////////////////////////////////////////////////////////

		Master.prototype.onInit = function() {
			//create local ui model
			this._localUIModel = new sap.ui.model.json.JSONModel();
			this._localUIModel.setData({
				visibleTab: "REQUESTS"
			});
			this.getView().setModel(this._localUIModel, "localUIModel");

			this.getRouter().getRoute("main").attachPatternMatched(this.onRouteMatched, this);



			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe(Constants.EVENTCHANNEL_SELECTEDPROJECT,
				Constants.EVENT_SELECTEDPROJECT_CHANGED,
				function(){
					//this._localUIModel.setProperty("/visibleTab", Master.TABS.REQUESTS);
					this._removeSelectionFromRequestList();
					this._removeSelectionFromSequenceList();
					var oSegmentedButton = this.getView().byId("idSegmentedButton");
					oSegmentedButton.setSelectedButton(this.getView().byId("idButtonRequests"));
					this._localUIModel.setProperty("/visibleTab", Master.TABS.REQUESTS);
			}, this);

			//if ?sequence=true exists in url then switch to sequence page after 2 seconds
			if (jQuery.sap.getUriParameters().get("sequence") === "true") {
				setTimeout(jQuery.proxy( function() {
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

			if (jQuery.sap.getUriParameters().get("editproject") === "true") {
				setTimeout(jQuery.proxy( function() {
					this.onEditProject();
				}, this), 1000);
			}

			if (jQuery.sap.getUriParameters().get("metadata") === "true") {
				setTimeout(jQuery.proxy( function() {
					this.onAddRequestMetadata();
				}, this), 1000);
			}
		},

		Master.prototype.onRouteMatched = function(oEvent) {

		};

		// /////////////////////////////////////////////////////////////////////////////
		// /// SubHeader Event Handler
		// /////////////////////////////////////////////////////////////////////////////

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

		Master.prototype.onSequencesListSelect = function() {
			var oList = this.getView().byId("idListSequences");
			var oItem = oList.getSelectedItem();
			if (!oItem) {
				this._selectFirstSequence();
				return;
			}
			var oSelectedSequence = Helper.getBoundObjectForItem(oItem);

			this.getRouter().navTo("sequence", {
				sequenceID : oSelectedSequence.getIdentifier(),
				reason : "edit"
			}, true);
			//this._removeSelectionFromRequestList();
		};

		Master.prototype.onRequestsListSelect = function() {
			var oList = this.getView().byId("idListRequests");
			var oItem = oList.getSelectedItem();
			if (!oItem) {
				this._selectFirstRequest();
				return;
			}
			var oSelectedRequest = Helper.getBoundObjectForItem(oItem);

			var oModel = this.getView().getModel();
			var oSelectedProject = oModel.getProperty("/SelectedProject");

			this.getRouter().navTo("product", {
				requestID : oSelectedRequest.getIdentifier(),
				projectID : oSelectedProject.getIdentifier()
			}, true);
		};

		Master.prototype._filterList = function(sQuery, oList){
			// add filter for search
			var aFilters = [];

			if (sQuery && sQuery.length > 0) {
				var filter = new sap.ui.model.Filter("mProperties/name",
					sap.ui.model.FilterOperator.Contains,
					sQuery);
				aFilters.push(filter);
			}

			// update list binding
			var binding = oList.getBinding("items");
			binding.filter(aFilters, "Application");
		};

		Master.prototype.onRequestSearch = function(oEvent) {
			var sQuery = oEvent.getSource().getValue();
			this._filterList(sQuery, this.getView().byId("idListRequests"));
		};

		Master.prototype.onSequenceSearch = function(oEvent) {
			var sQuery = oEvent.getSource().getValue();
			this._filterList(sQuery, this.getView().byId("idListSequences"));
		};


		Master.prototype.onBtnDuplicateRequestPress = function(oEvent) {
			var oRequest = Helper.getBoundObjectForItem(oEvent.getSource());
			var oComponent = this.getComponent();
			oComponent.duplicateRequest(oRequest);
		};

		Master.prototype.onBtnDeleteRequestPress = function(oEvent) {
			var oRequest = Helper.getBoundObjectForItem(oEvent.getSource());
			var oComponent = this.getComponent();
			oComponent.deleteRequest(oRequest);
			this._selectFirstRequest();
		};
		
		
		Master.prototype.onBtnDuplicateSequencePress = function(oEvent) {
			//TODO implement me
			sap.m.MessageToast.show("TODO implement me");
		};

		Master.prototype.onBtnDeleteSequencePress = function(oEvent) {
			var oSequence = Helper.getBoundObjectForItem(oEvent.getSource());
			var oComponent = this.getComponent();
			oComponent.deleteSequence(oSequence);
			this._selectFirstSequence();
		};


		// /////////////////////////////////////////////////////////////////////////////
		// /// Segmented Button Event Handler
		// /////////////////////////////////////////////////////////////////////////////

		Master.prototype.onSegmentedButtonSelect = function(oEvent){
			var sSelectedId = oEvent.getParameter("id");
			switch (sSelectedId) {
				case this.createId("idButtonRequests"):
					this._localUIModel.setProperty("/visibleTab", Master.TABS.REQUESTS);
					this.onRequestsListSelect();
					break;
				case this.createId("idButtonSequences"):
					this._localUIModel.setProperty("/visibleTab", Master.TABS.SEQUENCES);
					this.onSequencesListSelect();
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
			if (this._localUIModel.getProperty("/visibleTab") === Master.TABS.REQUESTS) {
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
			if (this._localUIModel.getProperty("/visibleTab") === Master.TABS.REQUESTS) {
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

		Master.prototype._removeSelectionFromRequestList = function () {
			var oList = this.getView().byId("idListRequests");
			oList.removeSelections(true);
		};

		Master.prototype._removeSelectionFromSequenceList = function () {
			var oList = this.getView().byId("idListSequences");
			oList.removeSelections(true);
		};

		Master.prototype._selectFirstRequest = function () {
			var bItemSelected = this._selectFirstItem("idListRequests", "");
			if (bItemSelected === true) {
				this.onRequestsListSelect();
			} else {
				//TODO detail page to "NOT FOUND"
			}
		};

		Master.prototype._selectFirstSequence = function () {
			var bItemSelected = this._selectFirstItem("idListSequences");
			if (bItemSelected === true) {
				this.onSequencesListSelect();
			} else {
				//TODO detail page to "NOT FOUND"
			}
		};

		Master.prototype._selectFirstItem = function (sListId) {
			var oList = this.getView().byId(sListId);
			var aItems = oList.getItems();

			if (aItems.length) {
				oList.setSelectedItem(aItems[0], true);
				return true;
			}

			return false;
		};

		return Master;

	}, /* bExport= */ true);
