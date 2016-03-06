sap.ui.require([
	"sap/ui/test/Opa5", "tests/integration/pages/Common"
],
function (Opa5, Common) {
	"use strict";
	
	var sViewName = "projectX.view.Master.Master";
	
	Opa5.createPageObjects({
		onMasterPage : {

			baseClass : Common,
			actions : {
				iTapOnSequenceTab : function () {
					
				},
				
				iTapOnNewSequence : function () {
					
				}
			}, 
			assertions : {
				iSeeSequenceWithName : function (sSequenceName) {
					
				},
			}
		}
	});
});