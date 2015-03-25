jQuery.sap.declare("projectX.util.Controller");

sap.ui.core.mvc.Controller.extend("projectX.util.Controller", {
	getEventBus : function () {
		return this.getOwnerComponent().getEventBus();
	},

	getRouter : function () {
		return sap.ui.core.UIComponent.getRouterFor(this);
	}
});