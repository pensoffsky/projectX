jQuery.sap.declare("projectX.util.Controller");
jQuery.sap.require("projectX.util.Constants");

sap.ui.core.mvc.Controller.extend("projectX.util.Controller", {
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