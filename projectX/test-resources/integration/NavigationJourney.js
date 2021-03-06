sap.ui.require([
	"sap/ui/test/opaQunit"
], function () {
	"use strict";
	QUnit.module("NavigationJourney");
	
	opaTest("change name of project in settingsdialog", function (Given, When, Then) {
		var sProjectName = "projectName";
		
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
	
	opaTest("add a new sequence with a request", function (Given, When, Then) {
		var sSequenceName = "New Sequence";
		var sRequestName = "New Request";
		
		Given.iStartMyAppInAFrame("../../index.html?opaTest=true");
		
		When.onMasterPage.iTapOnSequenceTab();
		When.onMasterPage.iTapOnNewSequence();
		When.onSequencePage.iTapOnAddRequests();
		When.onSequencePage.iSelectRequestWithName(sRequestName);
		When.onSequencePage.iTapOnSelectRequestDialogOK();
		
		Then.onMasterPage.iSeeSequenceWithName(sSequenceName);
		Then.onSequencePage.iSeeSequenceName(sSequenceName).
			and.iSeeRequestsInList().
			and.iTeardownMyAppFrame();
	});
	
	opaTest("open the export project dialog and check binding", function (Given, When, Then) {
		Given.iStartMyAppInAFrame("../../index.html?opaTest=true");
		
		When.onAppPage.iTapOnProjectExport();
		
		Then.onAppPage.iSeeProjectExportDialogWithItem().
			and.iTeardownMyAppFrame();
	});
	
	opaTest("open the export request dialog", function (Given, When, Then) {
		Given.iStartMyAppInAFrame("../../index.html?opaTest=true");
		
		When.onMasterPage.iTapOnOnlyRequest();
		When.onRequestPage.iTapOnExportRequest();
		
		Then.onAppPage.iSeeRequestExportDialogWithTextLength(446).
			and.iTeardownMyAppFrame();
	});
	
	// opaTest("open the create odata request dialog", function (Given, When, Then) {
	// 	var sDialogTitle = "Add new request based on OData metadata";
	// 	
	// 	Given.iStartMyAppInAFrame("../../index.html?opaTest=true");
	// 	
	// 	When.onMasterPage.iTapOnAddODataRequest();
	// 	
	// 	Then.onMasterPage.iSeeODataDialog().
	// 		and.iTeardownMyAppFrame();
	// });
	
	
});