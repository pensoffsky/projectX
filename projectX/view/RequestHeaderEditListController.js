
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject', 'projectX/util/RequestHeader', 'projectX/util/Constants'],
	function(jQuery, ManagedObject, RequestHeader, Constants) {
	"use strict";

	var RequestHeaderEditListController = ManagedObject.extend("projectX.util.RequestHeaderEditListController", { metadata : {

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
	 * create a new requestHeader and add it to the local ui model.
	 */
	RequestHeaderEditListController.prototype.onBtnAddRequestHeader = function() {
		var oRequestHeader = new RequestHeader();
		oRequestHeader.setFieldName(Constants.REQUEST_HEADER_FIELD_ACCEPT);
		oRequestHeader.setFieldValue(Constants.REQUEST_HEADER_VALUE_APPL_JSON);

		var aRequestHeaders =  this._localUIModel.getProperty("/requestHeaders");
		aRequestHeaders.push(oRequestHeader);
		this._localUIModel.setProperty("/requestHeaders", aRequestHeaders);
	};

	RequestHeaderEditListController.prototype.onBtnDeleteRequestHeaders = function() {
		// debugger;
		var aSelectedItems = this._oTable.getSelectedItems();
		if (!aSelectedItems){
			return;
		}

		var aRequestHeaders =  this._localUIModel.getProperty("/requestHeaders");
		for (var i = 0; i < aSelectedItems.length; i++) {
			var oRequestHeader = this._getBoundObjectForItem(aSelectedItems[i]);
			//remove this requestHeader from array
			aRequestHeaders.splice(aRequestHeaders.indexOf(oRequestHeader), 1);
		}
		this._localUIModel.setProperty("/requestHeaders", aRequestHeaders);
		this._oTable.removeSelections(true);

	};

	/////////////////////////////////////////////////////////////////////////////
	/// Public Methods
	/////////////////////////////////////////////////////////////////////////////

	/**
	 * create the local ui model that is used as binding target.
	 * this way we do not have any dependency to the page that includes the fragment
	 * @param {string} sIdPrefix ID of prefix
	 */
	RequestHeaderEditListController.prototype.onInit = function(sIdPrefix) {
		this._localUIModel = new sap.ui.model.json.JSONModel();
		this._localUIModel.setData({
			requestHeaders: [],
			REQUEST_HEADER_FIELDS: Constants.REQUEST_HEADER_FIELDS,	// for request header field select control
			REQUEST_HEADER_VALUES: Constants.REQUEST_HEADER_VALUES 	// for request header value select control
		});
		this.getView().setModel(this._localUIModel);
		this._oTable = sap.ui.core.Fragment.byId(sIdPrefix, "idTableRequestHeaders");
	};

	/**
	 * copy requestHeaders and set to local ui model for editing
	 * @param {object} oSelectedRequest the currently selected request
	 */
	RequestHeaderEditListController.prototype.setSelectedRequest = function(oSelectedRequest) {
		//TODO use array of request headers as input?

		var aRequestHeaders = oSelectedRequest.getRequestHeaders();
		//create a deep copy of the requestHeaders because
		//we do not want to edit the original data
		var aCopyRequestHeaders = jQuery.extend(true, [], aRequestHeaders);
		//copy requestHeaders from request to local ui model
		this._localUIModel.setProperty("/requestHeaders", aCopyRequestHeaders);
	};

	/**
	 * @return {array} returns the edited requestHeaders from the local ui model
	 */
	RequestHeaderEditListController.prototype.getRequestHeadersCopy = function() {
		var aRequestHeaders =  this._localUIModel.getProperty("/requestHeaders");
		var aCopyRequestHeaders = jQuery.extend(true, [], aRequestHeaders);
		return aCopyRequestHeaders;
	};

	RequestHeaderEditListController.prototype.getRequestHeaders = function() {
		var aRequestHeaders =  this._localUIModel.getProperty("/requestHeaders");
		return aRequestHeaders;
	};

	RequestHeaderEditListController.prototype.updateBindings = function() {
		this._localUIModel.updateBindings();
	};



	// /////////////////////////////////////////////////////////////////////////////
	// /// Private Methods
	// /////////////////////////////////////////////////////////////////////////////

	//TODO move to helper
	/**
	 * @param {object} oListItem current list item
	 * @return {object} returns bound object of list item
	 */
	RequestHeaderEditListController.prototype._getBoundObjectForItem = function(oListItem) {
		var oBindingContext = oListItem.getBindingContext();
		var oModel = oBindingContext.getModel();
		var sPath = oBindingContext.getPath();
		var oboundObject = oModel.getProperty(sPath);
		return oboundObject;
	};

	return RequestHeaderEditListController;

}, /* bExport= */ true);

//TODO implement save of requestHeaders
//TODO create new requestHeaders
//TODO delete requestHeaders
//TODO edit requestHeader
