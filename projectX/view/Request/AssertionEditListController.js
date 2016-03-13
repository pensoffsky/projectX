
sap.ui.define(['jquery.sap.global', 
				'sap/ui/base/ManagedObject', 
				'projectX/util/Assertion', 
				'projectX/util/Constants',
				'projectX/util/Helper'
				],
	function(jQuery, ManagedObject, Assertion, Constants, Helper) {
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

	AssertionEditListController.prototype.onBtnDeleteAssertion = function(oEvent) {
		var oAssertion = Helper.getBoundObjectForItem(oEvent.getSource());
		if (!oAssertion){
			return;
		}
		var oRequest =  this._localUIModel.getProperty("/request");
		oRequest.removeAssertion(oAssertion);
		this.updateBindings();
	};
	
	AssertionEditListController.prototype.onBtnExecuteAssertion = function(){
		var oRequest =  this._localUIModel.getProperty("/request");
		oRequest.resetAssertionsData();
		oRequest.checkAssertions();
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
	// /// Formatter Methods
	// /////////////////////////////////////////////////////////////////////////////
	
	AssertionEditListController.prototype.formatAssertProperty2PathEnable = function (sAssertProperty) {
		return sAssertProperty === projectX.util.Constants.ASSERTPROPERTY_JSONBODY
			|| sAssertProperty === projectX.util.Constants.ASSERTPROPERTY_XMLBODY
			|| sAssertProperty === projectX.util.Constants.ASSERTPROPERTY_SAPSTATISTICS;
	}
	
	AssertionEditListController.prototype.formatAssertProperty2PathPlaceholder = function (sAssertProperty) {
		if (sAssertProperty === projectX.util.Constants.ASSERTPROPERTY_JSONBODY) {
			return "JsonPath";
		}
		if (sAssertProperty === projectX.util.Constants.ASSERTPROPERTY_XMLBODY) {
			return "XPath";
		}
		if (sAssertProperty === projectX.util.Constants.ASSERTPROPERTY_SAPSTATISTICS) {
			return "Field";
		}
		
	}
	
	// /////////////////////////////////////////////////////////////////////////////
	// /// Private Methods
	// /////////////////////////////////////////////////////////////////////////////

	return AssertionEditListController;

}, /* bExport= */ true);