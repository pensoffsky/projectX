sap.ui.require([
	"sap/ui/test/Opa5", "tests/integration/pages/Common"
],
function (Opa5, Common) {
	"use strict";
	
	var sViewName = "projectX.view.Sequence.Sequence";
	
	Opa5.createPageObjects({
		onSequencePage : {

			baseClass : Common,
			actions : {
				iTapOnSelectRequestDialogOK : function () {
					
				},
				
				iSelectRequestWithName : function (sRequestName) {
					
				},
				
				iTapOnAddRequests : function () {
					
				},
			},
			assertions : {
				iSeeRequestWithName : function (sRequestName) {
					
				},
				
				iSeeSequenceName : function (sSequenceName) {
					
				},
			}
		}
	});
});