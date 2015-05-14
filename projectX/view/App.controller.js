/**
 * the controller for the main view of the application
 */
sap.ui.define(['jquery.sap.global', 'projectX/util/Controller', 'projectX/util/Constants', 'projectX/util/Formatter', 'projectX/util/Helper'],
	function(jQuery, Controller, Constants, Formatter, Helper) {
		"use strict";

		var App = Controller.extend("projectX.view.App", {
			metadata: {}
		});


		// /////////////////////////////////////////////////////////////////////////////
		// /// Members
		// /////////////////////////////////////////////////////////////////////////////

		App.prototype._localUIModel = null;

		// /////////////////////////////////////////////////////////////////////////////
		// /// Initialization
		// /////////////////////////////////////////////////////////////////////////////

		App.prototype.onInit = function() {
			this._localUIModel = new sap.ui.model.json.JSONModel();
			this._localUIModel.setData({
				selectedProjectIdentifier : null
			});
			this.getView().setModel(this._localUIModel, "localUIModel");

			//this.getRouter().getRoute("main").attachPatternMatched(this.onRouteMatched, this);
		};

		App.prototype.onRouteMatched = function(oEvent) {
			debugger
		};

		// /////////////////////////////////////////////////////////////////////////////
		// /// Event Handler
		// /////////////////////////////////////////////////////////////////////////////
		
		App.prototype.onSelectProjectChange = function() {
			var sIdentifier = this._localUIModel.getProperty("/selectedProjectIdentifier");
			var oComponent = this.getComponent();
			oComponent.setSelectedProject(sIdentifier);
			this.getRouter().navTo("project", {
				projectID : sIdentifier
			}, true);
		};
		
		
		App.prototype.onExport = function() {
			var oComponent = this.getComponent();
			oComponent.export();
		};

		App.prototype.onFileUploaderChange = function(oEvent) {
			//TODO add error hanlding. at the moment best case programming
			var aFiles = oEvent.getParameter("files");
			var oFile = aFiles[0];

			var oComponent = this.getComponent();
			oComponent.import(oFile);
		};
		
		App.prototype.onAddNewProject = function(oEvent) {
			var oComponent = this.getComponent();
			var oProject = oComponent.createNewProject();
			this._localUIModel.setProperty("/selectedProjectIdentifier", oProject.getIdentifier());
			this.getRouter().navTo("project", {
				projectID : oProject.getIdentifier()
			}, true);
		};
		
		App.prototype.onEditProject = function(oEvent) {
			var sIdentifier = this._localUIModel.getProperty("/selectedProjectIdentifier");
			this.getRouter().navTo("project", {
				projectID : sIdentifier
			}, true);
		};
		
		App.prototype.onDeleteSelectedProject = function(oEvent) {
			var sIdentifier = this._localUIModel.getProperty("/selectedProjectIdentifier");
			var oComponent = this.getComponent();
			oComponent.deletedProject(sIdentifier);
			var that = this;
			setTimeout(function(){
				that.onSelectProjectChange();
			}, 0);
		};
		
		return App;

	}, /* bExport= */ true);
