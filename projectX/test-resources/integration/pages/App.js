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
				iTapOnProjectExport : function(){
					return this.triggerTapOnCtrlWithID(sViewName, "testingIDExportProject");
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
				},
				iSeeProjectExportDialogWithItem : function(){
					return this.waitFor({
						searchOpenDialogs: true,
						viewName : sViewName,
						controlType: "sap.m.List",
						matchers : new sap.ui.test.matchers.AggregationFilled({
								name : "items"
						  }),
						success : function () {
							ok(true, "found item in table");
						},
						errorMessage : "Did not find item in table: "
					});
				},
				iSeeRequestExportDialogWithTextLength : function(iLength){
					return this.waitFor({
						searchOpenDialogs: true,
						viewName : sViewName,
						controlType: "sap.m.TextArea",
						success : function (aTextAreas) {
							var iValueLength = aTextAreas[0].getValue().length;
							ok(iValueLength === iLength, "textarea with text length: " + iLength);
						},
						errorMessage : "Did not find textarea with text length: " + iLength
					});
				}
			}
		}
	});
});