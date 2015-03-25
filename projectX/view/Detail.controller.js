jQuery.sap.require("projectX.util.Formatter");
jQuery.sap.require("projectX.util.Controller");

projectX.util.Controller.extend("projectX.view.Detail", {


	onInit: function() {
		this._localUIModel = new sap.ui.model.json.JSONModel();
		this._localUIModel.setData({
			url: "http://localhost:3002",
			TODO2: "Pan",
			Response: {},
			
		});
		this.getView().setModel(this._localUIModel);

		if (sap.ui.Device.system.phone) {
			//don't wait for the master on a phone
		}
		this.getRouter().getRoute("product").attachMatched(this.onRouteMatched, this);
	},

	onRouteMatched: function(oEvent) {
		var oParameters = oEvent.getParameters();

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
			console.log("ajax done");
			that.showResponse(jqXHR);
			
		});

		oDeferred.fail(function(jqXHR, textStatus, errorThrown) {
			console.log("ajax fail");
			that.showResponse(jqXHR);
		});
	},

	showResponse: function(jqXHR) {
		this._localUIModel.setProperty("/Response/data", jqXHR.responseText);
		this._localUIModel.setProperty("/Response/responseHeader", jqXHR.getAllResponseHeaders());
	}

});