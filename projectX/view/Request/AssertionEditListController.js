
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
			change : {}
		}
	}});

	// /////////////////////////////////////////////////////////////////////////////
	// /// Constructor & Initialization
	// /////////////////////////////////////////////////////////////////////////////

	AssertionEditListController.prototype.constructor = function(s) {
		ManagedObject.apply(this, arguments);

	};
	
	/**
	 * factory method to create the assertionEditListController
	 * @param  {function} fOnChange  method that is attached to the change event
	 * @param  {string} sId        id for the assertionEditlist fragment
	 * @param  {object} oContainer the control in which the view is added
	 * @return {object}            the instantiated controller
	 */
	AssertionEditListController.create = function(fOnChange, sId, oContainer) {
		var oController;
		oController = new AssertionEditListController();
		oController.attachChange(fOnChange);
		//create fragment view
		var oFragment = sap.ui.xmlfragment(sId,
			"projectX.view.Request.AssertionEditList", 
			oController);
		//set fragment view to fragment controller
		oController.setView(oFragment);
		//add fragment view to page		
		oContainer.addItem(oFragment);
		//initialize the fragement controller
		oController.onInit(sId);
		return oController;
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
		this.updateBindings(true);
	};

	AssertionEditListController.prototype.onBtnDeleteAssertion = function(oEvent) {
		var oAssertion = Helper.getBoundObjectForItem(oEvent.getSource());
		if (!oAssertion){
			return;
		}
		var oRequest =  this._localUIModel.getProperty("/request");
		oRequest.removeAssertion(oAssertion);
		this.updateBindings(true);
	};
	
	AssertionEditListController.prototype.onBtnExecuteAssertion = function(){
		var oRequest =  this._localUIModel.getProperty("/request");
		oRequest.resetAssertionsData();
		oRequest.checkAssertions();
		this.updateBindings(true);
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

	AssertionEditListController.prototype.updateBindings = function(bFireChangeEvent) {
		this._localUIModel.updateBindings();
		if (bFireChangeEvent) {
			//make sure the controller this is embedded in is notified
			//that something changed and to update accordingly
			this.fireChange();
		}
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