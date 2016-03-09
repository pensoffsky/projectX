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
					return this.triggerTapOnCtrlWithID(sViewName, "idButtonSequences");
				},
				
				iTapOnRequestTab : function () {
					return this.triggerTapOnCtrlWithID(sViewName, "idButtonRequests");
				},
				
				iTapOnNewSequence : function () {
					return this.triggerTapOnCtrlWithID(sViewName, "testingIDNewSequence");
				}
			}, 
			assertions : {
				iSeeSequenceWithName : function (sSequenceName) {
					return this.waitFor({
						viewName : sViewName,
						controlType: "sap.m.Text",
						matchers : [new sap.ui.test.matchers.PropertyStrictEquals({
								name : "text",
								value: sSequenceName
						  })],
						success : function () {
							ok(true, "sequence with name ok: " + sSequenceName);
						},
						errorMessage : "Did not find list item control with text: " + sSequenceName
					});
				},
			}
		}
	});
});