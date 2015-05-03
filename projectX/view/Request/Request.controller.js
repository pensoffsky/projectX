/**
 * TODO add description of file
 */
sap.ui.define([
	'jquery.sap.global', 
	'projectX/util/Controller',
	'projectX/util/Formatter',
	'projectX/util/Constants',
	'projectX/view/AssertionEditListController',
	'projectX/view/RequestHeaderEditListController',
	'projectX/view/Metadata/MetadataTypesController',
	'projectX/util/Request'
	],
	function(jQuery, 
			Controller, 
			Formatter, 
			Constants, 
			AssertionEditListController,
			RequestHeaderEditListController,
			MetadataTypesController,
			RequestObject
			) {
		"use strict";

		var Request = Controller.extend("projectX.view.Request.Request", {
			metadata: {}
		});


		// /////////////////////////////////////////////////////////////////////////////
		// /// Members
		// /////////////////////////////////////////////////////////////////////////////

		/**
		 * ref to the original request the user updates when he clicks save.
		 * @type {object}
		 */
		Request.prototype._oOriginalRequest = null;
		
		/**
		 * copy of the request used to temporary store the changes from the user 
		 * until save or discard.
		 * @type {object}
		 */
		Request.prototype._oRequest = null;

		// /////////////////////////////////////////////////////////////////////////////
		// /// Initialization
		// /////////////////////////////////////////////////////////////////////////////

		Request.prototype.onInit = function() {

			// this._oConstants = new Constants();

			this._localUIModel = new sap.ui.model.json.JSONModel();
			this._localUIModel.setData({
				request: null,
				requestVisible: true,
				assertionsVisible: false,
				metadataVisible: false,
				SCRIPT_EXAMPLES: Constants.SCRIPTEXAMPLES,
				HTTP_METHODS: Constants.HTTP_METHODS
			});
			//set the local ui model to the view
			//use a name when addressing the local ui model from xml
			this.getView().setModel(this._localUIModel, "localUIModel");


			/////////////////////////////////////////////////////////////////////
			//create Assertion fragment controller
			/////////////////////////////////////////////////////////////////////
			this._oAssertionEditController = new AssertionEditListController();
			//create fragment view
			var oAssertionEditFragment = sap.ui.xmlfragment(this.createId("Assertions"), "projectX.view.AssertionEditList", this._oAssertionEditController);
			//set fragment view to fragment controller
			this._oAssertionEditController.setView(oAssertionEditFragment);
			//add fragment view to page
			var oAssertionContainer = this.getView().byId("idVBoxAssertionPlaceholder");
			oAssertionContainer.addItem(oAssertionEditFragment);
			//initialize the fragement controller
			this._oAssertionEditController.onInit(this.createId("Assertions"));

			/////////////////////////////////////////////////////////////////////
			//create requestHeader fragment controller
			/////////////////////////////////////////////////////////////////////
			this._oRequestHeaderEditController = new RequestHeaderEditListController();
			// //create fragment view
			var oRequestHeaderEditFragment = sap.ui.xmlfragment(this.createId("RequestHeaders"), "projectX.view.RequestHeaderEditList", this._oRequestHeaderEditController);
			//set fragment view to fragment controller
			this._oRequestHeaderEditController.setView(oRequestHeaderEditFragment);
			//add fragment view to page
			var oRequestHeaderContainer = this.getView().byId("idVBoxRequestHeaderPlaceholder");
			oRequestHeaderContainer.addItem(oRequestHeaderEditFragment);
			//initialize the fragement controller
			this._oRequestHeaderEditController.onInit(this.createId("RequestHeaders"));
			
			
			/////////////////////////////////////////////////////////////////////
			//create MetaData fragment controller
			/////////////////////////////////////////////////////////////////////
			//create Metadata fragment controller and set fragment to view placeholder
			this._oMetadataTypesController = new MetadataTypesController();
			this._oMetadataTypesController.onInit(this.createId("Metadata"));
			var oMetadataTypes = this.getView().byId("idVBoxMetadataTypesPlaceholder");
			oMetadataTypes.addItem(this._oMetadataTypesController.getView());

			/////////////////////////////////////////////////////////////////////
			//hook navigation event
			/////////////////////////////////////////////////////////////////////
			this.getRouter().getRoute("product").attachMatched(this.onRouteMatched, this);
		};

		Request.prototype.onRouteMatched = function(oEvent) {
			this._oOriginalRequest = null;
			this._oRequest = null;
			
			var oParameters = oEvent.getParameters();
			var iRequestID = parseInt(oParameters.arguments.requestID, 10);
			var oModel = this.getView().getModel();
			var oSelectedProject = oModel.getProperty("/SelectedProject");
			if (!oSelectedProject) {
				return;
			}

			var oRequest = oSelectedProject.getRequestByIdentifier(iRequestID);
			if (!oRequest) {
				return;
			}
			
			this._oOriginalRequest = oRequest;
			//create a copy of the request to edit and test on this screen.
			//somehow jquery extend does not create a deep copy 
			this._oRequest = new RequestObject(this._oOriginalRequest.serialize());
			this._localUIModel.setProperty("/request", this._oRequest);
			
			this._oMetadataTypesController.setServiceUrl(oSelectedProject.getBaseUrl());
				
			this._oAssertionEditController.setSelectedRequest(this._oRequest);
		};

		// /////////////////////////////////////////////////////////////////////////////
		// /// Request Sending
		// /////////////////////////////////////////////////////////////////////////////

		/**
		* called when the user clicks the "send request" button.
		* clear the result form all assertions.
		* build up the request and execute it.
		* evaluate assertions.
		*/
		Request.prototype.onBtnSendPress = function() {
			
			var oRequest = this._oRequest;
			oRequest.resetTempData();
			this._localUIModel.updateBindings();
			
			var oDeferred = oRequest.execute();
			var that = this;
			oDeferred.always(function(){
				oRequest.checkAssertions();
				that._localUIModel.updateBindings();
				that._oAssertionEditController.updateBindings();
			});
			
		};

		// /////////////////////////////////////////////////////////////////////////////
		// /// Event Handler
		// /////////////////////////////////////////////////////////////////////////////
		
		/**
		 * tab control implementation using a segmented button and scrollviews
		 * @param {object} oEvent event object
		 */
		Request.prototype.onSegmentedButtonSelect  = function(oEvent){
			var sSelectedId = oEvent.getParameter("id");
			switch (sSelectedId) {
				case this.createId("idButtonRequest"):
					this._localUIModel.setProperty("/requestVisible", true);
					this._localUIModel.setProperty("/assertionsVisible", false);
					this._localUIModel.setProperty("/metadataVisible", false);
					break;
				case this.createId("idButtonAssertions"):
					this._localUIModel.setProperty("/requestVisible", false);
					this._localUIModel.setProperty("/assertionsVisible", true);
					this._localUIModel.setProperty("/metadataVisible", false);
					break;
				case this.createId("idButtonMetadata"):
					this._localUIModel.setProperty("/requestVisible", false);
					this._localUIModel.setProperty("/assertionsVisible", false);
					this._localUIModel.setProperty("/metadataVisible", true);
					break;
			default:
				console.log("problem with segmented button on detail page");
			}
		};

		Request.prototype.onBtnDeletePress = function() {
			var oModel = this.getView().getModel();
			var oSelectedProject = oModel.getProperty("/SelectedProject");
			oSelectedProject.removeRequest(this._oOriginalRequest);
			oModel.updateBindings();
			//TODO check navigation after delete
		};

		Request.prototype.onBtnSavePress = function() {
			
			this._oOriginalRequest.setDataFromRequest(this._oRequest);
						
			//update bindings to show e.g. an updated name of the request in master list
			var oModel = this.getView().getModel();
			oModel.updateBindings();
		};

		/**
		* duplicate the currently selected request.
		*/
		Request.prototype.onBtnDuplicatePress = function() {
			var oComponent = this.getComponent();
			oComponent.duplicateRequest(this._oOriginalRequest);
		};

		Request.prototype.onButtonScriptExamples = function(oEvent) {
			var oButton = oEvent.getSource();
			var oMenu = this.getView().byId("idMenuScriptExamples");
			var eDock = sap.ui.core.Popup.Dock;
			oMenu.open(false, oButton, eDock.BeginTop, eDock.BeginBottom, oButton);
		};

		Request.prototype.onMenuItemScriptExampleSelected = function(oEvent) {
			var oItem = oEvent.getParameter("item");
			var oScriptExample = oItem.getBindingContext("localUIModel").getObject();
			var sScript = this._oRequest.getScriptCode();
			sScript += "\n" + oScriptExample.script; 
			this._oRequest.setScriptCode(sScript);
			this._localUIModel.updateBindings();
		};

		return Request;

	}, /* bExport= */ true);

