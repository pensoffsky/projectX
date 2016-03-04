sap.ui.define(["sap/ui/test/Opa5"], function(Opa5){
	"use strict";
	
	var Common = Opa5.extend("test.integration.pages.Common", {

		//type value into an input control
		processInputOnControl : function(oControl, sValue, bDontBlur) {
		    oControl = oControl[0] || oControl;
		    oControl = oControl.$().children("input");
		    oControl.focus()
		        .val(sValue)
		        .trigger("input")
		        .change();

		    if (!bDontBlur) { // Blur event may close non-modal popovers, so it is optional
		        oControl.blur();
		    }
		},

		//trigger a tap event on a control
		triggerTapOnCtrlWithID : function(sViewName, sID){
			return this.waitFor({
				viewName : sViewName,
				id : sID,
				success : function (oButton) {
					oButton.$().trigger("tap");
					ok(true, "triggered tap on control: " + sID);
				},
				errorMessage : "Did not find control with id:" + sID
			});
		},
		
		//trigger a tap event on a button on a dialog based on text of button
		triggerTapOnDialogButtonWithText : function(sText){
			return this.waitFor({
				searchOpenDialogs: true,
				controlType: "sap.m.Button",
				matchers : new sap.ui.test.matchers.PropertyStrictEquals({
						name : "text",
						value: sText
				  }),
				success : function (aButtons) {
					aButtons[0].$().trigger("tap");
					ok(true, "triggered tap on dialog button with text: " + sText);
				},
				errorMessage : "Did not find dialog button with text: " + sText
			});
		},
		
		//type value into an input control
		typeTextIntoInputWithID : function(sID, sText, bInDialog){
			return this.waitFor({
				searchOpenDialogs: bInDialog,
				controlType: "sap.m.Input",
				success : function (aInputs) {
					aInputs = aInputs.filter(function(each){
						return each.getId().endsWith(sID);
					});
					this.processInputOnControl(aInputs, sText, false);
					ok(true, "typed text into input with id: " + sID);
				},
				errorMessage : "Did not find input control with id: " + sID
			});
		}
		
	});
	
	return Common;
});