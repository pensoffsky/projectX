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
		oModel.updateBindings();
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
	}
	
});