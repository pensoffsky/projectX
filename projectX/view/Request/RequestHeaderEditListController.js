
sap.ui.define(["jquery.sap.global",
							 'sap/ui/base/ManagedObject',
							 'sap/ui/core/Fragment',
							 "projectX/util/RequestHeader",
							 "projectX/util/Constants",
							 "projectX/util/Helper"],

	function(jQuery, ManagedObject, Fragment, RequestHeader, Constants, Helper) {
	"use strict";

	var RequestHeaderEditListController = ManagedObject.extend("projectX.util.RequestHeaderEditListController", {
		metadata : {
			properties : {
				view : {type : "object", defaultValue : null}
				},
			events : {
			}
		},

		/////////////////////////////////////////////////////////////////////////////
		/// Members
		/////////////////////////////////////////////////////////////////////////////

		// definition of view controls
		_oTable : undefined,
		_oExamples : undefined,
		_oField : undefined,
		_oValue : undefined

	});


	/////////////////////////////////////////////////////////////////////////////
	/// Event Handler
	/////////////////////////////////////////////////////////////////////////////

	/**
	 * create a new requestHeader and add it to the local ui model.
	 */
	RequestHeaderEditListController.prototype.onBtnAddRequestHeader = function() {
		var oRequestHeader = new RequestHeader();
		var oRequest =  this._localUIModel.getProperty("/request");
		oRequest.addRequestHeader(oRequestHeader);
		this.updateBindings();

	};

	RequestHeaderEditListController.prototype.onBtnDeleteRequestHeaders = function() {
		var aSelectedItems = this._oTable.getSelectedItems();
		if (!aSelectedItems){
			return;
		}

		var aRequest =  this._localUIModel.getProperty("/request");
		for (var i = 0; i < aSelectedItems.length; i++) {
			var oRequestHeader = this._getBoundObjectForItem(aSelectedItems[i]);
			//remove this requestHeader from array
			aRequest.removeRequestHeader(oRequestHeader);
		}
		this._oTable.removeSelections(true);
		this.updateBindings();
	};

	RequestHeaderEditListController.prototype.handleRequestHeaderFieldNameChanged = function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var oRequestHeader = Helper.getBoundObjectForItem(oSelectedItem);

			// delete current entry on UI


			// set new suggestion list
			switch (oRequestHeader.key) {
				case Constants.REQUEST_HEADER_FIELD_ACCEPT:
					this._localUIModel.setProperty("/REQUEST_HEADER_VALUES", Constants.REQUEST_HEADER_VALUES_ACCEPT);
					break;
			  case Constants.REQUEST_HEADER_FIELD_ACCEPT_CHARSET:
					this._localUIModel.setProperty("/REQUEST_HEADER_VALUES", Constants.REQUEST_HEADER_VALUES_ACCEPT_CHARSET);
					break;
			  case Constants.REQUEST_HEADER_FIELD_ACCEPT_ENCODING:
					this._localUIModel.setProperty("/REQUEST_HEADER_VALUES", Constants.REQUEST_HEADER_VALUES_ACCEPT_ENCODING);
					break;
			  case Constants.REQUEST_HEADER_FIELD_ACCEPT_LANGUAGE:
					this._localUIModel.setProperty("/REQUEST_HEADER_VALUES", Constants.REQUEST_HEADER_VALUES_ACCEPT_LANGUAGE);
					break;
			  case Constants.REQUEST_HEADER_FIELD_CONTENT_TYPE:
					this._localUIModel.setProperty("/REQUEST_HEADER_VALUES", Constants.REQUEST_HEADER_VALUES_CONTENT_TYPE);
					break;
			  case Constants.REQUEST_HEADER_FIELD_SAP_STATISTICS:
					this._localUIModel.setProperty("/REQUEST_HEADER_VALUES", Constants.REQUEST_HEADER_VALUES_SAP_STATISTICS);
					break;
			  case Constants.REQUEST_HEADER_FIELD_SAPGW_STATISTICS:
					this._localUIModel.setProperty("/REQUEST_HEADER_VALUES", Constants.REQUEST_HEADER_VALUES_SAPGW_STATISTICS);
					break;
			  case Constants.REQUEST_HEADER_FIELD_USER_AGENT:
					this._localUIModel.setProperty("/REQUEST_HEADER_VALUES", Constants.REQUEST_HEADER_VALUES_USER_AGENT);
					break;
			default:
				return "";
			}
	};

	/**
	 * handler for button of header examples (pre defined examples)
	 * @param  {object} oEvent event object of control
	 */
	RequestHeaderEditListController.prototype.onButtonRequestHeaderExamples = function(oEvent) {
		var oButton = oEvent.getSource();
		var oMenu = this._oExamples;
		var eDock = sap.ui.core.Popup.Dock;
		oMenu.open(false, oButton, eDock.BeginTop, eDock.BeginBottom, oButton);
	};

	/**
	 * handler for items of header example menu
	 * @param  {object} oEvent event object of control
	 */
	RequestHeaderEditListController.prototype.onMenuItemHeaderExampleSelected = function(oEvent) {
		var oItem = oEvent.getParameter("item");

		// get example from localUIModel
		var oRequestHeaderExample = oItem.getBindingContext().getObject();

		// create new request header object
		var oRequestHeader = new RequestHeader();
		oRequestHeader.setFieldName(oRequestHeaderExample.field);
		oRequestHeader.setFieldValue(oRequestHeaderExample.value);

		// push object to request header aggregation of request
		var oRequest =  this._localUIModel.getProperty("/request");
		oRequest.addRequestHeader(oRequestHeader);

		// update bindings of localUIModel
		this._localUIModel.updateBindings();
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
			REQUEST_HEADER_EXAMPLES: Constants.REQUESTHEADEREXAMPLES,
			REQUEST_HEADER_FIELDS: Constants.REQUEST_HEADER_FIELDS,	// for request header field select control
			REQUEST_HEADER_VALUES: null // for request header value select control
		});
		this.getView().setModel(this._localUIModel);

		// get controls once
		this._oTable = Fragment.byId(sIdPrefix, "idTableRequestHeaders");
		this._oExamples = Fragment.byId(sIdPrefix, "idMenuRequestHeaderExamples");
		this._oField = Fragment.byId(sIdPrefix, "idRequestHeaderFieldName");
		this._oValue = Fragment.byId(sIdPrefix, "idRequestHeaderFieldValue");

		// set filter function for input controls
		// this._setFilterForInputFieldControls();

	};

	/**
	 * copy requestHeaders and set to local ui model for editing
	 * @param {object} oSelectedRequest the currently selected request
	 */
	RequestHeaderEditListController.prototype.setSelectedRequest = function(oRequest) {
		this._localUIModel.setProperty("/request", oRequest);
	};


	RequestHeaderEditListController.prototype.updateBindings = function() {
		this._localUIModel.updateBindings();
	};



	/////////////////////////////////////////////////////////////////////////////
	/// Private Methods
	/////////////////////////////////////////////////////////////////////////////

	/**
	 *
	 */
	RequestHeaderEditListController.prototype._setFilterForInputFieldControls = function() {
		this._oField.setFilterFunction(function(sTerm, oItem) {
			// A case-insensitive 'string contains' style filter
			return oItem.getText().match(new RegExp(sTerm, "i"));
		});

		this._oValue.setFilterFunction(function(sTerm, oItem) {
			// A case-insensitive 'string contains' style filter
			return oItem.getText().match(new RegExp(sTerm, "i"));
		});
	}

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
