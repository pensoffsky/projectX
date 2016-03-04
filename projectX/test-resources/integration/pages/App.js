sap.ui.require([
	"sap/ui/test/Opa5", "tests/integration/pages/Common"
],
function (Opa5, Common) {
	"use strict";
	
	var sViewName = "projectX.view.App",
		sProjectSelectID = "testingIDProjectSelect";
	
	Opa5.createPageObjects({
		onAppPage : {

			baseClass : Common,
			actions : {
				iTapOnEditProject : function(){
					return this.triggerTapOnCtrlWithID(sViewName, "testingIDEditProject");
				},
			},
			assertions : {
				iSeeProjectName : function(sText){
					return this.waitFor({
						viewName : sViewName,
						id : sProjectSelectID,
						check: function (oSelect) {
							return oSelect.getSelectedItem().getText() === sText;
						},
						success : function (oSelect) {
							ok(true, "project name ok: " + sText);
						},
						errorMessage : "Did not find select control with id: " + sProjectSelectID
					});
				}
			}
		}
	});
});