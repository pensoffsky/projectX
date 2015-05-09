/**
 * TODO add description of file
 */
sap.ui.define([
	'jquery.sap.global', 
	'projectX/util/Controller',
	'projectX/util/Formatter',
	'projectX/util/Constants',
	'projectX/view/Request/AssertionEditListController',
	'projectX/view/Request/RequestHeaderEditListController',
	'projectX/view/Metadata/MetadataTypesController',
	'projectX/util/Request',
	'projectX/util/AceEditor'
	
	],
	function(jQuery, 
			Controller, 
			Formatter, 
			Constants, 
			AssertionEditListController,
			RequestHeaderEditListController,
			MetadataTypesController,
			RequestObject,
			AceEditor
			) {
		"use strict";

		var Request = Controller.extend("projectX.view.Request.Request", {
			metadata: {}
		});


		// /////////////////////////////////////////////////////////////////////////////
		// /// Members
		// /////////////////////////////////////////////////////////////////////////////
		
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
				project: null,
				SCRIPT_EXAMPLES: Constants.SCRIPTEXAMPLES,
				HTTP_METHODS: Constants.HTTP_METHODS,
				responseBodyDisplayMode : "text",
				responseBodyFormatted : ""
			});
			//set the local ui model to the view
			//use a name when addressing the local ui model from xml
			this.getView().setModel(this._localUIModel, "localUIModel");

			var that = this;
			this.getView().byId("idTextAreaUrl").onsapentermodifiers =  function(oEvent, a ,b){
				if (oEvent.metaKey === true) {
					that.onBtnSendPress();
				}
			};

			/////////////////////////////////////////////////////////////////////
			//create Assertion fragment controller
			/////////////////////////////////////////////////////////////////////
			this._oAssertionEditController = new AssertionEditListController();
			//create fragment view
			var oAssertionEditFragment = sap.ui.xmlfragment(this.createId("Assertions"), "projectX.view.Request.AssertionEditList", this._oAssertionEditController);
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
			var oRequestHeaderEditFragment = sap.ui.xmlfragment(this.createId("RequestHeaders"), "projectX.view.Request.RequestHeaderEditList", this._oRequestHeaderEditController);
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
			this._oRequest = null;
			this._oProject = null;
			
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
			
			this._oRequest = oRequest;
			this._oProject = oSelectedProject;
			this._localUIModel.setProperty("/request", this._oRequest);
			this._localUIModel.setProperty("/project", oSelectedProject);
			this._prettyPrintResponseBody(this._localUIModel.getProperty("/responseBodyDisplayMode"));
			
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
			this._localUIModel.setProperty("/responseBodyFormatted", "");
			this._localUIModel.updateBindings();
			this._oAssertionEditController.updateBindings();
			
			var oDeferred = oRequest.execute(this._oProject);
			var that = this;
			oDeferred.always(function(){
				oRequest.checkAssertions();
				that._prettyPrintResponseBody(that._localUIModel.getProperty("/responseBodyDisplayMode"));
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
			oSelectedProject.removeRequest(this._oRequest);
			oModel.updateBindings();
			//TODO check navigation after delete		
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
		
		/**
		 * called from the name input control when the name changes.
		 * after a delay triggers the updating of the master list to show the new name.
		 */
		Request.prototype.onNameChanged = function() {	
			this.triggerWithInputDelay(function() {
				this.updateMasterList();
			});
		};
		
		Request.prototype.onPanelPrescriptExpand = function() {	
			var oScriptEditor = this.getView().byId("superEditor");
			oScriptEditor.rerender();
		};
		
		Request.prototype.onResponseBodyFormat  = function(oEvent){
			var sSelectedId = oEvent.getParameter("id");
			var sMode = "text";
			switch (sSelectedId) {
				case this.createId("idButtonResponseXML"):
					sMode = "xml";
					break;
				case this.createId("idButtonResponseJSON"):
					sMode = "json";
					break;
				case this.createId("idButtonResponseHTML"):
					sMode = "html";
					break;
				case this.createId("idButtonResponseRAW"):
					sMode = "text";
					break;
			default:
				console.log("problem with response body format segmented button on detail page");
			}
			
			this._prettyPrintResponseBody(sMode);
			this._localUIModel.setProperty("/responseBodyDisplayMode", sMode);
		};
		
		// /////////////////////////////////////////////////////////////////////////////
		// /// Private Functions
		// /////////////////////////////////////////////////////////////////////////////

		Request.prototype._prettyPrintResponseBody = function(sMode) {
			var sResponseBody = this._oRequest.getResponseBody();
			
			try {
				switch (sMode) {
					case "xml":
						sResponseBody = vkbeautify.xml(sResponseBody);
						break;
					case "json":
						sResponseBody = vkbeautify.json(sResponseBody);
						break;
					default:
				}
			} catch (e) {
				console.log("_prettyPrintResponseBody: " + e);
			}
			
			this._localUIModel.setProperty("/responseBodyFormatted", sResponseBody);
		};

		return Request;

	}, /* bExport= */ true);

