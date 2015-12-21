jQuery.sap.declare("projectX.view.ResponseBody.ResponseBody");
jQuery.sap.require("projectX.util.Project");
jQuery.sap.require("projectX.util.Request");
jQuery.sap.require("projectX.util.Controller");
jQuery.sap.require("projectX.util.Helper");

projectX.util.Controller.extend("projectX.view.ResponseBody.ResponseBody", {

	_localUIModel: undefined,
	
	_fCloseDialog : undefined,

	onInit: function() {
		this._localUIModel = new sap.ui.model.json.JSONModel({
			sResponseBody : ""
		});

		var oBindingContainer = this.getView().byId("idBindingContainer");
		oBindingContainer.setModel(this._localUIModel);
	},

	setup: function(responseBodyFormatted, responseBodyDisplayMode, fCloseDialog) {
		this._localUIModel.setProperty("/responseBodyFormatted", responseBodyFormatted);
		this._localUIModel.setProperty("/responseBodyDisplayMode", responseBodyDisplayMode);
		var oEditor = this.getView().byId("idEditorResponseBody");
		oEditor.rerender();
		this._fCloseDialog = fCloseDialog;
	},

	// /////////////////////////////////////////////////////////////////////////////
	// /// event handler
	// /////////////////////////////////////////////////////////////////////////////

	onCloseDialog: function () {
		this._fCloseDialog();
	}

});