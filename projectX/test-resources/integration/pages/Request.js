sap.ui.require([
	"sap/ui/test/Opa5", "tests/integration/pages/Common"
],
function (Opa5, Common) {
	"use strict";
	
	var sViewName = "projectX.view.Request.Request";
	
	Opa5.createPageObjects({
		onRequestPage : {

			baseClass : Common,
			actions : {
				iTapOnExportRequest : function(){
					return this.triggerTapOnCtrlWithID(sViewName, "testingIDExportRequest");
				},
			}
		}
	});
});