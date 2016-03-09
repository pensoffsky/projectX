jQuery.sap.declare("projectX.util.Controller");
jQuery.sap.require("projectX.util.Constants");

sap.ui.core.mvc.Controller.extend("projectX.util.Controller", {
	
	
	// /////////////////////////////////////////////////////////////////////////////
	// /// Constructor
	// /////////////////////////////////////////////////////////////////////////////

	constructor : function() {
		// call the base constructor
		sap.ui.core.mvc.Controller.apply(this, arguments);

		// Make sure that our init-coding is executed
		// even if the extending controller overrides onInit() and does not call
		// onInit() of the super class.

		var fbaseOnInit = jQuery.proxy(this._baseOnInit, this);
		var fOnInit = jQuery.proxy(this.onInit, this);

		this.onInit = jQuery.proxy(function() {
			fbaseOnInit();
			fOnInit();
		}, this);
	},

	/**
	* This init function is called before the regular onInit function. hook the view events and the router events.
	*/
	_baseOnInit : function() {
		this._hookViewEvents();
	},

	onInit : function() {
		// do not add any coding here. Just needed in case the extending controller
		// calls onInit() of the super class. Gets overwritten by the extending controller.
	},

	onExit : function() {
		if (this._busyDialog) {
			this._busyDialog.destroy();
		}
	},

	/**
	* Hook the events from the view associated to oController. hook events to local functions to allow central functionality for all controllers
	* using this baseController composition.
	*/
	_hookViewEvents : function() {
		var oView = this.getView();
		oView.addEventDelegate({
			onBeforeShow : this.onBeforeShow
		}, this);
		oView.addEventDelegate({
			onAfterShow : this.onAfterShow
		}, this);
		oView.addEventDelegate({
			onBeforeHide : this.onBeforeHide
		}, this);
		oView.addEventDelegate({
			onAfterHide : this.onAfterHide
		}, this);
	},
	
	// /////////////////////////////////////////////////////////////////////////////
	// /// view events that can be overwritten
	// /////////////////////////////////////////////////////////////////////////////

	/**
	* event handler for view event. hooked and called from base controller. Override this method in the inherited controller if you want to handle
	* this view event.
	*/
	onBeforeHide : function(oEvt) {
		this._bIsViewHidden = true;
	},

	/**
	* event handler for view event. hooked and called from base controller. Override this method in the inherited controller if you want to handle
	* this view event.
	*/
	onAfterHide : function(oEvt) {

	},

	/**
	* event handler for view event. hooked and called from base controller. Override this method in the inherited controller if you want to handle
	* this view event.
	*/
	onBeforeShow : function(oEvt) {
		this._bIsViewHidden = false;
	},

	/**
	* event handler for view event. hooked and called from base controller. Override this method in the inherited controller if you want to handle
	* this view event.
	*/
	onAfterShow : function(oEvt) {

	},

	// /////////////////////////////////////////////////////////////////////////////
	// /// common helper functions
	// /////////////////////////////////////////////////////////////////////////////
	
	getEventBus : function () {
		return this.getOwnerComponent().getEventBus();
	},

	getRouter : function () {
		return sap.ui.core.UIComponent.getRouterFor(this);
	},
	
	getComponent: function () {  
        var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());  
        return sap.ui.component(sComponentId);  
    },  
	
	updateMasterList : function () {
		var oModel = this.getView().getModel();
		oModel.updateBindings(true);
	},
	
	getCurrentProject : function () {
		//TODO use component to get the selected project
		var oModel = this.getView().getModel();
		var oSelectedProject = oModel.getProperty("/SelectedProject");
		return oSelectedProject;
	},
	
	triggerWithInputDelay : function (fAction) {
		if (this._inputDelay) {
			jQuery.sap.clearDelayedCall(this._inputDelay);
			this._inputDelay = null;
		}
		
		this._inputDelay = jQuery.sap.delayedCall(projectX.util.Constants.INPUTDELAY, this, fAction);
	},

	showSuccessMessage : function (sMessage) {
		sap.m.MessageToast.show(sMessage);
	},

	showErrorMessage : function (sMessage) {
		sap.m.MessageBox.alert(sMessage);
	},
	
	showPrompt : function (sMessage, sData, fInputCallback) {		
		var oDialog = null;
		var oInput = new sap.m.TextArea({
			rows: 8,
			editable: false,
			width: "100%"
		});
		oInput.setValue(sData);
				
		var aButtons = [new sap.m.Button({
			text: "Close",
			press: function () {
				oDialog.close();
			}
		})];
		
		//if the input callback is set then provide an import button
		if (fInputCallback) {
			oInput.setEditable(true);
			aButtons.unshift(
				new sap.m.Button({
					text: "Import Request",
					press: function () {
						oDialog.close();
						fInputCallback(oInput.getValue());
					}
				}));
		}
		
		oDialog = new sap.m.Dialog({
			stretch: false,
			showHeader: false,
			content: [new sap.m.VBox({
				items: [
					new sap.m.Text({
						text:sMessage
					}), 
					oInput
				]
			})],
			afterClose: function() {
				oDialog.destroy();
			},
			afterOpen: function() {
				oInput.selectText(0, sData.length);
			},
			buttons: aButtons
		});
		
		//to get access to the global model
		//this.getView().addDependent(oDialog);
		oDialog.open();
				
	},
	
	navToRequest : function(iRequestID, iProjectID) {
		this.getRouter().navTo("product", {
				requestID : iRequestID,
				projectID : iProjectID
			}, true);
	},
	
	navToRequestNotFound : function() {
		this.getRouter().navTo("notfound", {
			}, true);
	},
	
});