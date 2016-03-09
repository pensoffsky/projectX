sap.ui.require([
	"sap/ui/test/Opa5", "tests/integration/pages/Common"
],
function (Opa5, Common) {
	"use strict";
	
	var sViewName = "projectX.view.Project.Project";
	
	Opa5.createPageObjects({
		onProjectPage : {

			baseClass : Common,
			actions : {
				iCloseTheDialog : function(){
					return this.triggerTapOnDialogButtonWithText("OK");
				},
				iTypeIntoProjectNameInput : function(sText){
					return this.typeTextIntoInputWithID("testingIDProjectName", sText, true);
				},
				
			}
		}
	});
});