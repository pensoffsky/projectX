
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject', 'projectX/util/Assertion'],
	function(jQuery, ManagedObject, Assertion) {
	"use strict";

	var AssertionEditListController = ManagedObject.extend("projectX.util.AssertionEditListController", { metadata : {
	
		properties : {
			view : {type : "object", defaultValue : null}
			},
		events : {
	
		}
	}});
	
	
	// /////////////////////////////////////////////////////////////////////////////
	// /// Event Handler
	// /////////////////////////////////////////////////////////////////////////////
	
	/**
	 * create a new assertion and add it to the local ui model.
	 */
	AssertionEditListController.prototype.onBtnAddAssertion = function() {
		var sProperty = Assertion.prototype.assertProperties.STATUS;
		var sOperation = Assertion.prototype.assertOperations.EQUALS; 
		var oAssertion = new Assertion();
		oAssertion.setAssertProperty(sProperty);
		oAssertion.setOperation(sOperation);
		oAssertion.setExpected("200");
		
		var aAssertions =  this._localUIModel.getProperty("/assertions");
		aAssertions.push(oAssertion);
		this._localUIModel.setProperty("/assertions", aAssertions);
	};
	
	AssertionEditListController.prototype.onBtnDeleteAssertions = function() {
		// debugger;
		var aSelectedItems = this._oTable.getSelectedItems();
		if (!aSelectedItems){
			return;
		}
		
		var aAssertions =  this._localUIModel.getProperty("/assertions");
		for (var i = 0; i < aSelectedItems.length; i++) {
			var oAssertion = this._getBoundObjectForItem(aSelectedItems[i]);
			//remove this assertion from array
			aAssertions.splice(aAssertions.indexOf(oAssertion), 1);
		}
		this._localUIModel.setProperty("/assertions", aAssertions);
		this._oTable.removeSelections(true);
		
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
			assertions: []
		});
		this.getView().setModel(this._localUIModel);
		this._oTable = sap.ui.core.Fragment.byId(sIdPrefix, "idTableAssertions");
	};
	
	/**
	 * copy assertions and set to local ui model for editing
	 * @param {object} oSelectedRequest the currently selected request
	 */
	AssertionEditListController.prototype.setSelectedRequest = function(oSelectedRequest) {
		//TODO use array of assertions as input?
		
		var aAssertions = oSelectedRequest.getAssertions();
		//create a deep copy of the assertions because 
		//we do not want to edit the original data
		var aCopyAssertions = jQuery.extend(true, [], aAssertions);
		//copy assertions from request to local ui model
		this._localUIModel.setProperty("/assertions", aCopyAssertions);
	};

	/**
	 * @return {array} returns the edited assertions from the local ui model
	 */
	AssertionEditListController.prototype.getAssertionsCopy = function() {
		var aAssertions =  this._localUIModel.getProperty("/assertions");
		var aCopyAssertions = jQuery.extend(true, [], aAssertions);
		return aCopyAssertions;
	};
	
	AssertionEditListController.prototype.getAssertions = function() {
		var aAssertions =  this._localUIModel.getProperty("/assertions");
		return aAssertions;
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

//TODO implement save of assertions
//TODO create new assertions
//TODO delete assertions
//TODO edit assertion