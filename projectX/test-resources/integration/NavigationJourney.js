sap.ui.require([
	"sap/ui/test/opaQunit"
], function () {
	"use strict";
	QUnit.module("NavigationJourney");
	
	opaTest("change name of project in settingsdialog", function (Given, When, Then) {
		const sProjectName = "projectName";
		
		Given.iStartMyAppInAFrame("../../index.html?opaTest=true");
		
		//open the settings dialog
		//type in a new project name
		//close the settings dialog
		When.onAppPage.iTapOnEditProject();
		When.onProjectPage.iTypeIntoProjectNameInput("projectName");
		When.onProjectPage.iCloseTheDialog();
			
		
		//check if new project name is shown
		Then.onAppPage.iSeeProjectName(sProjectName).
			and.iTeardownMyAppFrame();
	});
	
	opaTest("add a new sequence", function (Given, When, Then) {
		const sProjectName = "New Sequence";
		
		Given.iStartMyAppInAFrame("../../index.html?opaTest=true");
		
		When.onMasterPage.iTapOnSequenceTab();
		When.onMasterPage.iTapOnNewSequence();
		When.onSequencePage.iTapOnAddRequests();
		When.onSequencePage.iSelectRequestWithName("New Request");
		When.onSequencePage.iTapOnSelectRequestDialogOK();
			
		
		Then.onMasterPage.iSeeSequenceWithName("New Sequence").
			and.onSequencePage.iSeeSequenceName("New Sequence").
			and.onSequencePage.iSeeRequestWithName("New Request").
			and.iTeardownMyAppFrame();
	});
	
	opaTest("open odata dialog", function (Given, When, Then) {
		const sProjectName = "New Sequence";
		
		Given.iStartMyAppInAFrame("../../index.html?opaTest=true");
		
		When.onMasterPage.iTapOnAddODataRequest();
		
		Then.onMasterPage.iSeeODataDialog().
			and.iTeardownMyAppFrame();
	});
	
	
});