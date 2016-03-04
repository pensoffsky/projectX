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
		Then.onAppPage.iSeeProjectName(sProjectName);
	});
	
	
});