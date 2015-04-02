jQuery.sap.require("projectX.util.Formatter");
jQuery.sap.require("projectX.util.Controller");

projectX.util.Controller.extend("projectX.view.Detail", {

	_selectedRequest : null,

	onInit: function() {
		this._localUIModel = new sap.ui.model.json.JSONModel();
		this._localUIModel.setData({
			url: "http://localhost:3002",
			TODO2: "Pan",
			Request: {},
			Response: {},
			name: "",
			httpMethod: "GET"
		});
		//set the local ui model to the view
		//use a name when addressing the local ui model from xml
		this.getView().setModel(this._localUIModel, "localUIModel");

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

		//TODO bind view to /SelectedProject/aAggregations/requests/[index]
	},

	onNavBack: function() {
		// This is only relevant when running on phone devices
		this.getRouter().myNavBack("main");
	},

	onBtnSendPress: function() {
		var sUrl = this._localUIModel.getProperty("/url");
		var sHttpMethod = this._localUIModel.getProperty("/httpMethod");

		var oDeferred = jQuery.ajax({
			method: sHttpMethod,
			url: sUrl
		});

		var that = this;
		oDeferred.done(function(data, textStatus, jqXHR) {
			that.showResponse(jqXHR);

		});

		oDeferred.fail(function(jqXHR, textStatus, errorThrown) {
			that.showResponse(jqXHR);
		});
	},

	showResponse: function(jqXHR) {
		this._localUIModel.setProperty("/Response/header", jqXHR.getAllResponseHeaders());
		this._localUIModel.setProperty("/Response/body", jqXHR.responseText);
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
		var oModel = this.getView().getModel();
		oModel.updateBindings();
	}

});
