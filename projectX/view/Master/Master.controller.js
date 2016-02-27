/**
 * collection of formatter functions for bindings
 */
sap.ui.define(['jquery.sap.global',
				'sap/m/MessageBox',
				'projectX/util/Controller',
				'projectX/util/Constants',
				'projectX/util/Formatter',
				'projectX/util/Helper',
				'projectX/util/Assertion',
				'sap/m/GroupHeaderListItem'],
	function(jQuery, MessageBox, Controller, Constants, Formatter, Helper, Assertion, GroupHeaderListItem) {
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
					this._selectFirstRequest();
			}, this);

			//if ?sequence=true exists in url then switch to sequence page after 2 seconds
			if (jQuery.sap.getUriParameters().get("sequence") === "true") {
				setTimeout(jQuery.proxy( function() {
					var oList = this.getView().byId("idListSequences");
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

			this.getRouter().getRoute("product").attachMatched(function(oEvent){

				//TODO how to prevent double selection if navigation happend from inside master controller
				var oParameters = oEvent.getParameters();
				var iRequestId = parseInt(oParameters.arguments.requestID, 10);
				var oSegmentedButton = this.getView().byId("idSegmentedButton");
				oSegmentedButton.setSelectedButton(this.getView().byId("idButtonRequests"));
				this._localUIModel.setProperty("/visibleTab", Master.TABS.REQUESTS);
				this._selectRequestByReqId("idListRequests", iRequestId);
			}, this);
		};

		Master.prototype.onBeforeShow = function() {
			var oListSequences = this.getView().byId("idListSequences");
			var oListRequests = this.getView().byId("idListRequests");
			
			//attach event that scrolls the currently selected element into view after 
			//the list update finished
			oListRequests.attachEvent("updateFinished", function(){
				Helper.scrollSelectedItemOfListIntoView(oListRequests);
			});
			oListSequences.attachEvent("updateFinished", function(){
				Helper.scrollSelectedItemOfListIntoView(oListSequences);
			});
			
			var oSorterName = new sap.ui.model.Sorter("mProperties/name", false);
			oListSequences.getBinding("items").sort(oSorterName);
			
			var oSorterGroupName = new sap.ui.model.Sorter("mProperties/groupName", false, true);
			oListRequests.getBinding("items").sort([oSorterGroupName, oSorterName]);
		};

		Master.prototype.onRouteMatched = function(oEvent) {

		};

		// /////////////////////////////////////////////////////////////////////////////
		// /// List Event Handler
		// /////////////////////////////////////////////////////////////////////////////

		/**
		 * @param  {object} oGroup group info
		 * @return {sap.m.GroupHeaderListItem} returns the GroupHeaderListItem that is used to group the requests.
		 */
		Master.prototype.getRequestGroupHeader = function(oGroup) {
			var sTitle = oGroup.key;
			if (!sTitle) {
				sTitle = "--NO GROUP--";
			}
			
			return new GroupHeaderListItem( {
				title: sTitle,
				upperCase: false
			} );
		};

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
			this.navToRequest(oSelectedRequest.getIdentifier(), oSelectedProject.getIdentifier());
		};

		Master.prototype._filterList = function(sQuery, oList){
			Helper.addFilterToListBinding(sap.ui.model.Filter,
				oList.getBinding("items"),
				sap.ui.model.FilterOperator.Contains,
				"mProperties/name",
				sQuery
			);
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
			var oNewRequest = oComponent.duplicateRequest(oRequest);
			this._selectRequestByReqId("idListRequests", oNewRequest.getIdentifier());
		};

		Master.prototype.onBtnDeleteRequestPress = function(oEvent) {
			var oRequest = Helper.getBoundObjectForItem(oEvent.getSource());
			var oComponent = this.getComponent();
			// callback function for delete current entry
			var that = this;
			var fDeleteEntry = function() {
				oComponent.deleteRequest(oRequest);
				that._selectFirstRequest();
			};

			// call message box to confirm deletion
			this._confirmDeletion(fDeleteEntry);

		};

		Master.prototype.onBtnDuplicateSequencePress = function(oEvent) {
			var oSequence = Helper.getBoundObjectForItem(oEvent.getSource());
			var oComponent = this.getComponent();
			oComponent.duplicateSequence(oSequence);
		};

		Master.prototype.onBtnDeleteSequencePress = function(oEvent) {
			var oSequence = Helper.getBoundObjectForItem(oEvent.getSource());
			var oComponent = this.getComponent();

			// callback function for delete current entry
			var that = this;
			var fDeleteEntry = function() {
				oComponent.deleteSequence(oSequence);
				that._selectFirstSequence();
			};

			// call message box to confirm deletion
			this._confirmDeletion(fDeleteEntry);

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
				jQuery.sap.log.error("problem with segmented button on master page");
			}
		};

		// /////////////////////////////////////////////////////////////////////////////
		// /// Toolbar Event Handler
		// /////////////////////////////////////////////////////////////////////////////

		/**
		* add a new request to the currently selected project
		*/
		Master.prototype.onAddRequest = function() {
			//get the model
			var oComponent = this.getComponent();
			var oModel = this.getView().getModel();
			//get the selected project
			var oSelectedProject = oComponent.getSelectedProject();
			if (!oSelectedProject) {
				return;
			}

			var oNewRequest = oSelectedProject.addNewRequest();
			oNewRequest.addAssertion(Assertion.createDefaultAssertion());
			oModel.updateBindings();
			var aRequests = oSelectedProject.getRequests();
			if (aRequests.length === 1){
				//the user added the first request. Select this request.
				this._selectFirstRequest();
			} else {
				this._selectRequestByReqId("idListRequests", oNewRequest.getIdentifier());
			}
		};


		/**
		* show the odata service metadata page
		* to let the user add a request based on odata metadata information.
		*/
		Master.prototype.onAddRequestMetadata = function() {
			this._showODataRequestDialog();
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

		Master.prototype.onImportRequest = function () {						
			var oModel = this.getView().getModel();
			//get the selected project
			var oSelectedProject = this.getCurrentProject();
			if (!oSelectedProject) {
				return;
			}		
			var that = this;
			this.showPrompt("Paste serialized request from clipboard: Ctrl+V", "", function(sValue) {
				try {
					var oDesirializedRequest = JSON.parse(sValue);
					var oNewRequest = new projectX.util.Request(oDesirializedRequest);	
					
					var oAddedRequest = oSelectedProject.addCopyOfRequest(oNewRequest, " (imported)");			
					oModel.updateBindings();
					var aRequests = oSelectedProject.getRequests();
					if (aRequests.length === 1){
						//the user added the first request. Select this request.
						that._selectFirstRequest();
					} else {
						that._selectRequestByReqId("idListRequests", oAddedRequest.getIdentifier());
					}
				} catch (e) {				
					that.showErrorMessage("request could not be imported");
				}
			});
		};

		// /////////////////////////////////////////////////////////////////////////////
		// /// Private Methods
		// /////////////////////////////////////////////////////////////////////////////

		Master.prototype._removeSelectionFromRequestList = function () {
			var oList = this.getView().byId("idListRequests");
			oList.removeSelections(true);
		};

		Master.prototype._removeSelectionFromSequenceList = function () {
			var oList = this.getView().byId("idListSequences");
			oList.removeSelections(true);
		};
		/**
		 * show a message box where the user can confirm deletion
		 * @param {function} fDeleteEntry	delete list entry
		 */
		 Master.prototype._confirmDeletion = function(fDeleteEntry) {
			 MessageBox.show("Do you really want to delete this entry?", {
					 icon : MessageBox.Icon.WARNING,
					 title : "Confirmation",
					 actions : [MessageBox.Action.YES, MessageBox.Action.NO],
					 initialFocus : MessageBox.Action.NO,
					 onClose : function(oAction) {
						 if (oAction === MessageBox.Action.YES) {
							 fDeleteEntry();
						 } else if (oAction === MessageBox.Action.NO) {
							 // MessageBox will be closed with button NO
						 } else {
							 // do nothing. user canceled his action via escape key or something similar
						 }
					 }

			 });
		 };

		Master.prototype._selectFirstRequest = function () {
			var bItemSelected = this._selectFirstItem("idListRequests");
			if (bItemSelected === true) {
				this.onRequestsListSelect();
			} else {
				this.navToRequestNotFound();
			}
		};

		Master.prototype._selectFirstSequence = function () {
			var bItemSelected = this._selectFirstItem("idListSequences");
			if (bItemSelected === true) {
				this.onSequencesListSelect();
			} else {
				this.navToRequestNotFound();
			}
		};

		Master.prototype._selectFirstItem = function (sListId) {
			var oList = this.getView().byId(sListId);
			var aItems = oList.getItems();

			for (var i = 0; i < aItems.length; i++) {
				//check that we not try to select the request group list item
				var oBoundItem = Helper.getBoundObjectForItem(aItems[i]);
				if (oBoundItem){
					oList.setSelectedItem(aItems[i], true);
					return true;
				}
			}

			return false;
		};

		//TODO make this generic
		/**
		 * set the listitem that represents the given requestID
		 * @param  {string} sListId		id of the list
		 * @param  {int} iRequestId		id of the request to select
		 * @return {boolean}            true if item was selected, false if no item was selected
		 */
		Master.prototype._selectRequestByReqId = function (sListId, iRequestId) {
			//TODO this is ugly to iterate over all items, FIX ME, why did i do this?
			var oList = this.getView().byId(sListId);
			var aItems = oList.getItems();
			var oSelectedRequest = oList.getSelectedItem();

			for (var i = 0; i < aItems.length; i++) {
				var oRequest = Helper.getBoundObjectForItem(aItems[i]);
				if (oRequest && oRequest.getIdentifier() === iRequestId){
					if (oSelectedRequest === aItems[i]){
						//the request is already selected, no need
						//to remove all selections and select again
						return true;
					}
					this._removeSelectionFromRequestList();
					this._removeSelectionFromSequenceList();
					oList.setSelectedItem(aItems[i], true);
					this.onRequestsListSelect();
					return true;
				}
			}

			return false;
		};


		Master.prototype._showODataRequestDialog = function(oEvent) {
			var oView = sap.ui.xmlview("projectX.view.Metadata.MetadataRequest");
			var dialog = new sap.m.Dialog({
					title: 'Add new request based on OData metadata',
					contentWidth: "80%",
					contentHeight: "90%",
					content: oView,
					beginButton: new sap.m.Button({
						text: 'Close',
						press: function () {
							dialog.close();
						}
					}),
					afterClose: function() {
						dialog.destroy();
					}
				});

				//to get access to the global model
				this.getView().addDependent(dialog);
				dialog.open();
			oView.getController().onRouteMatched();
		};

		return Master;

	}, /* bExport= */ true);
