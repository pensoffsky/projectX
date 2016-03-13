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
	'projectX/util/Request',
	'projectX/util/AceEditor'

	],
	function(jQuery,
			Controller,
			Formatter,
			Constants,
			AssertionEditListController,
			RequestHeaderEditListController,
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
				TESTSCRIPT_EXAMPLES: Constants.TESTSCRIPTEXAMPLES,
				HTTP_METHODS: Constants.HTTP_METHODS,
				responseBodyDisplayMode : "text",
				responseBodyFormatted : "",
				isHugeResponseBody : false
			});
			//set the local ui model to the view
			//use a name when addressing the local ui model from xml
			this.getView().setModel(this._localUIModel, "localUIModel");

			/////////////////////////////////////////////////////////////////////
			//create Assertion fragment controller
			/////////////////////////////////////////////////////////////////////
			this._oAssertionEditController = new AssertionEditListController();
			this._oAssertionEditController.attachChange(function onChange() {
				this._localUIModel.updateBindings();
			}, this);
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
			// this._oMetadataTypesController = new MetadataTypesController();
			// this._oMetadataTypesController.onInit(this.createId("Metadata"));
			// var oMetadataTypes = this.getView().byId("idVBoxMetadataTypesPlaceholder");
			// oMetadataTypes.addItem(this._oMetadataTypesController.getView());

			/////////////////////////////////////////////////////////////////////
			//hook navigation event
			/////////////////////////////////////////////////////////////////////
			this._hookRoutingEvent();
			
		};
		
		Request.prototype._hookRoutingEvent = function() {
			try {
				this.getRouter().getRoute("product").attachMatched(this.onRouteMatched, this);		
			} catch (e) {
				jQuery.sap.log.error("Request.prototype._hookRoutingEvent: could not hook routing event");
			}
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

			this._oAssertionEditController.setSelectedRequest(this._oRequest);
			this._oRequestHeaderEditController.setSelectedRequest(this._oRequest);

			//load response body format from the request and set to segmented button and ace editor
			var sMode = this._oRequest.getResponseBodyFormat();
			this._setResponseBodyButtonMode(sMode);
			this._localUIModel.setProperty("/responseBodyDisplayMode", sMode);
			this._prettyPrintResponseBody(this._oRequest.getResponseBody(), sMode, false);
		};

		Request.prototype.onBeforeShow = function() {
			var that = this;
			this.getComponent().setKeyboardShortcutExecuteRequest(function(){
				if (that._oRequest && that._oRequest.getRequestIsRunning()) {
					//the request is already running, do not send
					return;
				}
				sap.m.MessageToast.show("Sending request ...", {
					animationDuration: 100,
				    duration: 300
				});
				that.onBtnSendPress();
			});
		};

		Request.prototype.onBeforeHide = function() {
			this.getComponent().setKeyboardShortcutExecuteRequest(null);
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
			this._localUIModel.setProperty("/isHugeResponseBody", false);
			this._localUIModel.updateBindings();
			this._oAssertionEditController.updateBindings();

			var oDeferred = oRequest.execute(this._oProject, undefined /*prevRequest*/, {}/*seqStorage*/);
			this._localUIModel.updateBindings();
			var that = this;
			oDeferred.always(function(){
				oRequest.checkAssertions();
				that._prettyPrintResponseBody(that._oRequest.getResponseBody(),
					that._localUIModel.getProperty("/responseBodyDisplayMode"),
					false);
				that._localUIModel.updateBindings();
				that._oAssertionEditController.updateBindings();
			});
			oDeferred.fail(function(vError){
				var sErrorMessage = "error sending request";
				if (vError && vError.statusText) {
					sErrorMessage = vError.statusText;
				} else if (typeof vError === 'string') {
					sErrorMessage = vError;
				}
				sap.m.MessageToast.show(sErrorMessage, {
				    duration: 2000
				});
			});

		};
		
		Request.prototype.onAbortRequest = function() {
			var oRequest = this._oRequest;
			oRequest.abortRequest();
			this._localUIModel.updateBindings();
		};

		// /////////////////////////////////////////////////////////////////////////////
		// /// Event Handler
		// /////////////////////////////////////////////////////////////////////////////

		Request.prototype.onCBPrefixSelected = function(oEvent) {
			var bSelected = this._localUIModel.getProperty("/request/mProperties/useProjectPrefixUrl");
			var sUrl = this._oRequest.getUrl();
			var sPrefixUrl = this._oProject.getPrefixUrl();
			if (bSelected){
				//check if the url starts with the prefix url and if so then remove it
				if (sUrl && sUrl.length > 0 && sUrl.indexOf(sPrefixUrl) === 0) {
					sUrl = sUrl.substring(sPrefixUrl.length);
				}
			} else {
				sUrl = sPrefixUrl + sUrl;
			}
			this._oRequest.setUrl(sUrl);
			this._localUIModel.updateBindings();
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

		Request.prototype.onButtonTestScriptExamples = function(oEvent) {
			var oButton = oEvent.getSource();
			var oMenu = this.getView().byId("idMenuTestScriptExamples");
			var eDock = sap.ui.core.Popup.Dock;
			oMenu.open(false, oButton, eDock.BeginTop, eDock.BeginBottom, oButton);
		};

		Request.prototype.onMenuItemTestScriptExampleSelected = function(oEvent) {
			var oItem = oEvent.getParameter("item");
			var oScriptExample = oItem.getBindingContext("localUIModel").getObject();
			var sScript = this._oRequest.getTestScriptCode();
			sScript += "\n" + oScriptExample.script;
			this._oRequest.setTestScriptCode(sScript);
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

		/**
		 * called from the name input control when the name changes.
		 * after a delay triggers the updating of the master list to show the new name.
		 */
		Request.prototype.onHttpMethodChange = function() {
			this.triggerWithInputDelay(function() {
				this.updateMasterList();
			});
		};

		Request.prototype.onPanelPrescriptExpand = function() {
			var oScriptEditor = this.getView().byId("superEditor");
			oScriptEditor.rerender();
		};

		Request.prototype.onPanelTestExpand = function() {
			var oScriptEditor = this.getView().byId("superEditorTestScript");
			oScriptEditor.rerender();
		};

		Request.prototype.onPanelRequestBodyExpand = function() {
			var oEditor = this.getView().byId("superEditorRequestBody");
			oEditor.rerender();
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
			this._oRequest.setResponseBodyFormat(sMode); //save the tab to the request
			this._prettyPrintResponseBody(this._oRequest.getResponseBody(), sMode, false);
			this._localUIModel.setProperty("/responseBodyDisplayMode", sMode);
		};
		
		Request.prototype.onBtnExecuteTestScript = function(){
			this._oRequest._runTestScript();
			this._localUIModel.updateBindings();
		};
		
		Request.prototype.onBtnClearPress = function(){
			this._oRequest.resetTempData();
			this._localUIModel.setProperty("/responseBodyFormatted", "");
			this._localUIModel.setProperty("/isHugeResponseBody", false);
			this._localUIModel.updateBindings();
		};
		
		Request.prototype.onGrowResponseBody = function(){
			var oEditor = this.getView().byId("idEditorResponseBody");
			oEditor.increaseHeight();
		};
		
		Request.prototype.onShrinkResponseBody = function(){
			var oEditor = this.getView().byId("idEditorResponseBody");
			oEditor.decreaseHeight();
		};
		
		Request.prototype.onFullscreenResponseBody = function(){
			var oView = sap.ui.xmlview("projectX.view.ResponseBody.ResponseBody");
			var dialog = new sap.m.Dialog({
					stretch: true,
					showHeader: false,
					content: oView,
					afterClose: function() {
						dialog.destroy();
					}
				});

			var fCloseDialog = function () {
				dialog.close();
			}
			//to get access to the global model
			this.getView().addDependent(dialog);
			dialog.open();
			oView.getController().setup(
				this._localUIModel.getProperty("/responseBodyFormatted"),
				this._localUIModel.getProperty("/responseBodyDisplayMode"),
				fCloseDialog
				);
		};
		
		Request.prototype.onExportRequest = function () {			
			var sSerializedReq = JSON.stringify(this._oRequest.serialize(),null, 2);
			this.showPrompt("Copy to clipboard: Ctrl+C, ESC", sSerializedReq);			
		};
		
		Request.prototype.onShowHugeResponseBody = function () {
			this._localUIModel.setProperty("/isHugeResponseBody", false);
			var sResponseBodyDisplayMode = this._localUIModel.getProperty("/responseBodyDisplayMode");
			this._prettyPrintResponseBody(this._oRequest.getResponseBody(), 
				sResponseBodyDisplayMode, 
				true);
		};

		// /////////////////////////////////////////////////////////////////////////////
		// /// Private Functions
		// /////////////////////////////////////////////////////////////////////////////

		Request.prototype._setResponseBodyButtonMode = function(sMode) {
			var sButtonId;
			switch (sMode) {
				case "xml":
					sButtonId = "idButtonResponseXML";
					break;
				case "json":
					sButtonId = "idButtonResponseJSON";
					break;
				case "html":
					sButtonId = "idButtonResponseHTML";
					break;
				case "text":
					sButtonId = "idButtonResponseRAW";
					break;
			default:
			}
			//activate the corresponding button
			var oSegmentedButton = this.byId("idButtonResponseFormat");
			oSegmentedButton.setSelectedButton(this.byId(sButtonId));
		};

		/**
		 * the responseBody from the executed request is formatted with vkbeautify
		 * depending on the selected mode. 
		 * if the result is too large it is truncated and the "truncation flag"
		 * in the localUIModel is set to true.
		 * @param  {string} sResponseBody         the responseBody from the executed request
		 * @param  {string} sMode                 the mode used with vkbeautify ("xml" or "json" or "")
		 * @param  {boolean} bSkipTruncation	  true means no truncation takes place
		 */
		Request.prototype._prettyPrintResponseBody = function(sResponseBody, sMode, bSkipTruncation) {
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
				jQuery.sap.log.info("_prettyPrintResponseBody: failed to format with mode: " + sMode);
			}
			
			if (!bSkipTruncation 
				&& sResponseBody.length > Constants.REQUEST_RESPONSEBODY_LENGTH_LIMIT) {
				this._localUIModel.setProperty("/isHugeResponseBody", true);
				sResponseBody = sResponseBody.substr(0 ,Constants.REQUEST_RESPONSEBODY_LENGTH_TRUNCATED);
			} else {
				this._localUIModel.setProperty("/isHugeResponseBody", false);
			}

			this._localUIModel.setProperty("/responseBodyFormatted", sResponseBody);
		};

		return Request;

	}, /* bExport= */ true);
