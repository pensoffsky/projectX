jQuery.sap.require("projectX.util.Constants");
jQuery.sap.require("projectX.util.Formatter");
jQuery.sap.require("projectX.util.Controller");
jQuery.sap.require("projectX.view.AssertionEditListController");

projectX.util.Controller.extend("projectX.view.Detail", {

	_selectedRequest : null,

	onInit: function() {

		// var oConstants = new projectX.util.Constants();

		this._localUIModel = new sap.ui.model.json.JSONModel();
		this._localUIModel.setData({
			url: "http://localhost:3000",
			TODO2: "Pan",
			Request: {},
			Response: {},
			name: "",
			httpMethod: "GET"
		});
		//set the local ui model to the view
		//use a name when addressing the local ui model from xml
		this.getView().setModel(this._localUIModel, "localUIModel");

		//create fragment controller
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

		//hook navigation event
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

		this._selectedRequest = oRequest;
		this._localUIModel.setProperty("/name", oRequest.getName());
		this._localUIModel.setProperty("/url", oRequest.getUrl());
		this._localUIModel.setProperty("/httpMethod", oRequest.getHttpMethod());

		this._oAssertionEditController.setSelectedRequest(this._selectedRequest);

		//TODO bind view to /SelectedProject/aAggregations/requests/[index]
	},

	onNavBack: function() {
		// This is only relevant when running on phone devices
		this.getRouter().myNavBack("main");
	},

	onBtnSendPress: function() {
		var sUrl = this._localUIModel.getProperty("/url");
		var sHttpMethod = this._localUIModel.getProperty("/httpMethod");

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

	// /////////////////////////////////////////////////////////////////////////////
	// /// Event Handler
	// /////////////////////////////////////////////////////////////////////////////

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
		this._selectedRequest.setUrl(oData.url);
		this._selectedRequest.setHttpMethod(oData.httpMethod);

		//set the edited assertions to the selected request
		var aAssertions = this._oAssertionEditController.getAssertionsCopy();
		this._selectedRequest.removeAllAssertions();
		for (var i = 0; i < aAssertions.length; i++) {
			this._selectedRequest.addAssertion(aAssertions[i]);
		}

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
	}

});
