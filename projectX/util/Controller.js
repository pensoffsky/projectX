jQuery.sap.declare("projectX.util.Controller");

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
});