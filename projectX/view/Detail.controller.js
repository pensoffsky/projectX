jQuery.sap.require("projectX.util.Constants");
jQuery.sap.require("projectX.util.Formatter");
jQuery.sap.require("projectX.util.Controller");
jQuery.sap.require("projectX.view.AssertionEditListController");
jQuery.sap.require("projectX.view.RequestHeaderEditListController");
jQuery.sap.require("projectX.view.Metadata.MetadataTypesController");

projectX.util.Controller.extend("projectX.view.Detail", {

	_selectedRequest : null,

	onInit: function() {

		this._oConstants = new projectX.util.Constants();

		this._localUIModel = new sap.ui.model.json.JSONModel();
		this._localUIModel.setData({
			url: "http://localhost:3000",
			TODO2: "Pan",
			Request: {},
			Response: {},
			name: "",
			scriptCode: "",
			httpMethod: "GET",
			requestVisible: true,
			assertionsVisible: false,
			metadataVisible: false,
			scriptExamples: projectX.util.Constants.SCRIPTEXAMPLES
		});

		this._localUIModel.setProperty("/V_HTTP_METHOD", this._oConstants.HTTP_METHODS);
		//set the local ui model to the view
		//use a name when addressing the local ui model from xml
		this.getView().setModel(this._localUIModel, "localUIModel");

		this.getView().setModel(this._localUIModel._oConstants, "Constants");



		/////////////////////////////////////////////////////////////////////
		//create Assertion fragment controller
		/////////////////////////////////////////////////////////////////////
		this._oAssertionEditController = new projectX.util.AssertionEditListController();
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
		this._oRequestHeaderEditController = new projectX.util.RequestHeaderEditListController();
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
		this._oMetadataTypesController = new projectX.view.Metadata.MetadataTypesController();
		this._oMetadataTypesController.onInit(this.createId("Metadata"));
		var oMetadataTypes = this.getView().byId("idVBoxMetadataTypesPlaceholder");
		oMetadataTypes.addItem(this._oMetadataTypesController.getView());

		/////////////////////////////////////////////////////////////////////
		//hook navigation event
		/////////////////////////////////////////////////////////////////////
		this.getRouter().getRoute("product").attachMatched(this.onRouteMatched, this);
	},

	onRouteMatched: function(oEvent) {
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

		this._oMetadataTypesController.setServiceUrl(oSelectedProject.getBaseUrl());

		this._selectedRequest = oRequest;
		this._localUIModel.setProperty("/name", oRequest.getName());
		this._localUIModel.setProperty("/scriptCode", oRequest.getScriptCode());
		this._localUIModel.setProperty("/url", oRequest.getUrl());
		this._localUIModel.setProperty("/httpMethod", oRequest.getHttpMethod());

		this._oAssertionEditController.setSelectedRequest(this._selectedRequest);
		this._oRequestHeaderEditController.setSelectedRequest(this._selectedRequest);

		//TODO bind view to /SelectedProject/aAggregations/requests/[index]
	},

	onNavBack: function() {
		// This is only relevant when running on phone devices
		this.getRouter().myNavBack("main");
	},

	/**
	 * called when the user clicks the "send request" button.
	 * clear the result form all assertions.
	 * build up the request and execute it.
	 * evaluate assertions.
	 */
	onBtnSendPress: function() {
		var sUrl = this._localUIModel.getProperty("/url");
		var sHttpMethod = this._localUIModel.getProperty("/httpMethod");

		//reset assertions
		this._resetAssertionResults(this._oAssertionEditController.getAssertions());

		var oStartTime = new Date();
		var oDeferred = jQuery.ajax({
			method: sHttpMethod,
			url: sUrl
		});

		var that = this;
		oDeferred.done(function(data, textStatus, jqXHR) {
			var iResponseTime = new Date() - oStartTime;
			that._handleResponse(jqXHR, iResponseTime);

		});

		oDeferred.fail(function(jqXHR, textStatus, errorThrown) {
			var iResponseTime = new Date() - oStartTime;
			that._handleResponse(jqXHR, iResponseTime);
		});
	},

	_handleResponse: function(jqXHR, iResponseTime) {
		this._localUIModel.setProperty("/Response/Header", jqXHR.getAllResponseHeaders());
		this._localUIModel.setProperty("/Response/Body", jqXHR.responseText);

		//run the assertions
		var aAssertions = this._oAssertionEditController.getAssertions();
		for (var i = 0; i < aAssertions.length; i++) {
			aAssertions[i].assert(jqXHR.status, jqXHR.responseText, jqXHR.getAllResponseHeaders(), iResponseTime);
		}
		this._oAssertionEditController.updateBindings();
	},
	
	_resetAssertionResults: function(aAssertions){
		for (var i = 0; i < aAssertions.length; i++) {
			aAssertions[i].resetTempData();
		}
		this._oAssertionEditController.updateBindings();
	},

	// /////////////////////////////////////////////////////////////////////////////
	// /// Event Handler
	// /////////////////////////////////////////////////////////////////////////////

	onSegmentedButtonSelect : function(oEvent){
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
	},

	onBtnDeletePress: function() {
		var oModel = this.getView().getModel();
		var oSelectedProject = oModel.getProperty("/SelectedProject");
		oSelectedProject.removeRequest(this._selectedRequest);
		oModel.updateBindings();
	},

	onBtnSavePress: function() {
		//write localui data to model
		var oData = this._localUIModel.getData();
		this._selectedRequest.setName(oData.name);
		this._selectedRequest.setScriptCode(oData.scriptCode);
		this._selectedRequest.setUrl(oData.url);
		this._selectedRequest.setHttpMethod(oData.httpMethod);

		//set the edited assertions to the selected request
		var aAssertions = this._oAssertionEditController.getAssertionsCopy();
		this._selectedRequest.removeAllAssertions();
		for (var i = 0; i < aAssertions.length; i++) {
			this._selectedRequest.addAssertion(aAssertions[i]);
		}

		// //set the edited request headers to the selected request
		// var aAssertions = this._oAssertionEditController.getAssertionsCopy();
		// this._selectedRequest.removeAllAssertions();
		// for (var i = 0; i < aAssertions.length; i++) {
		// 	this._selectedRequest.addAssertion(aAssertions[i]);
		// }

		//update bindings to show e.g. an updated name of the request in master list
		var oModel = this.getView().getModel();
		oModel.updateBindings();
	},

	/**
	 * duplicate the currently selected request.
	 */
	onBtnDuplicatePress: function(){
		var oComponent = this.getComponent();
		oComponent.duplicateRequest(this._selectedRequest);
	},
	
	onButtonScriptExamples : function(oEvent) {
		var oButton = oEvent.getSource();
		var oMenu = this.getView().byId("idMenuScriptExamples");
	    var eDock = sap.ui.core.Popup.Dock;
		oMenu.open(false, oButton, eDock.BeginTop, eDock.BeginBottom, oButton);
	},
	
	onMenuItemScriptExampleSelected : function(oEvent) {
		var oItem = oEvent.getParameter("item");
		var oScriptExample = oItem.getBindingContext("localUIModel").getObject();
		var sScript = this._localUIModel.getProperty("/scriptCode");
		sScript += "\n" + oScriptExample.script; 
		this._localUIModel.setProperty("/scriptCode", sScript);
	}

});
