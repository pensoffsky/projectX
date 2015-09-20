
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject', 'projectX/util/Assertion', 'projectX/util/Constants'],
	function(jQuery, ManagedObject, Assertion, Constants) {
	"use strict";

	var AssertionEditListController = ManagedObject.extend("projectX.view.Request.AssertionEditListController", { metadata : {

		properties : {
			view : {type : "object", defaultValue : null}
			},
		events : {

		}
	}});

	// /////////////////////////////////////////////////////////////////////////////
	// /// Constructor & Initialization
	// /////////////////////////////////////////////////////////////////////////////

	AssertionEditListController.prototype.constructor = function(s) {
		ManagedObject.apply(this, arguments);

	};

	// /////////////////////////////////////////////////////////////////////////////
	// /// Event Handler
	// /////////////////////////////////////////////////////////////////////////////

	/**
	 * create a new assertion and add it to the local ui model and the request.
	 */
	AssertionEditListController.prototype.onBtnAddAssertion = function() {
		var oAssertion = Assertion.createDefaultAssertion();
		var oRequest =  this._localUIModel.getProperty("/request");
		oRequest.addAssertion(oAssertion);
		this.updateBindings();
	};

	AssertionEditListController.prototype.onBtnDeleteAssertions = function() {
		// debugger;
		var aSelectedItems = this._oTable.getSelectedItems();
		if (!aSelectedItems){
			return;
		}

		var oRequest =  this._localUIModel.getProperty("/request");
		for (var i = 0; i < aSelectedItems.length; i++) {
			var oAssertion = this._getBoundObjectForItem(aSelectedItems[i]);
			//remove this assertion from array
			oRequest.removeAssertion(oAssertion);
		}
		this._oTable.removeSelections(true);
		this.updateBindings();
	};

	// /////////////////////////////////////////////////////////////////////////////
	// /// Public Methods
	// /////////////////////////////////////////////////////////////////////////////

	/**
	 * create the local ui model that is used as binding target.
	 * this way we do not have any dependency to the page that includes the fragment
	 */
	AssertionEditListController.prototype.onInit = function(sIdPrefix) {
		this._localUIModel = new sap.ui.model.json.JSONModel();
		this._localUIModel.setData({
			request: null,
			ASSERTPROPERTIES: Constants.ASSERTPROPERTIES, //for assert property select control
			ASSERTOPERATIONS: Constants.ASSERTOPERATIONS //for assert operation select control
		});
		this.getView().setModel(this._localUIModel);
		this._oTable = sap.ui.core.Fragment.byId(sIdPrefix, "idTableAssertions");
	};

	/**
	 * set the request to the local ui model for binding
	 * @param {object} oRequest the currently selected request
	 */
	AssertionEditListController.prototype.setSelectedRequest = function(oRequest) {
		this._localUIModel.setProperty("/request", oRequest);
	};

	AssertionEditListController.prototype.updateBindings = function() {
		this._localUIModel.updateBindings();
	};

	// /////////////////////////////////////////////////////////////////////////////
	// /// Private Methods
	// /////////////////////////////////////////////////////////////////////////////

	//TODO move to helper
	AssertionEditListController.prototype._getBoundObjectForItem = function(oListItem) {
		var oBindingContext = oListItem.getBindingContext();
		var oModel = oBindingContext.getModel();
		var sPath = oBindingContext.getPath();
		var oboundObject = oModel.getProperty(sPath);
		return oboundObject;
	};

	return AssertionEditListController;

}, /* bExport= */ true);
