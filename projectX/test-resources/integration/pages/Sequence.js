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
					return this.triggerTapOnDialogButtonWithText("OK");
				},
				
				iSelectRequestWithName : function (sRequestName) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.StandardListItem",
						matchers : new sap.ui.test.matchers.PropertyStrictEquals({
								name : "title",
								value: sRequestName
						  }),
						success : function (aListItems) {
							aListItems[0].$().trigger("tap");
							ok(true, "triggered tap on list item with text: " + sRequestName);
						},
						errorMessage : "Did not find list item with text: " + sRequestName
					});
				},
				
				iTapOnAddRequests : function () {
					return this.triggerTapOnCtrlWithID(sViewName, "testingIDAddRequest");
				},
			},
			assertions : {
				iSeeRequestsInList : function () {
					return this.waitFor({
						viewName : sViewName,
						id: "idSelectedRequestsTable",
						matchers : new sap.ui.test.matchers.AggregationFilled({
								name : "items"
						  }),
						success : function () {
							ok(true, "found request in table");
						},
						errorMessage : "Did not find request in table: "
					});
				},
				
				iSeeSequenceName : function (sSequenceName) {
					return this.waitFor({
						viewName : sViewName,
						id: "testingIDSequenceName",
						matchers : new sap.ui.test.matchers.PropertyStrictEquals({
								name : "value",
								value: sSequenceName
						  }),
						success : function () {
							ok(true, "found sequence name : " + sSequenceName);
						},
						errorMessage : "Did not find list item with text: " + sSequenceName
					});
				},
			}
		}
	});
});