/**
 * the controller for the main view of the application
 */
sap.ui.define(['jquery.sap.global', 'projectX/util/Controller', 'projectX/util/Constants', 'projectX/util/Formatter', 'projectX/util/Helper', "sap/m/MessageBox"],
	function(jQuery, Controller, Constants, Formatter, Helper, MessageBox) {
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
			this._showProjectDialog();
		};
		
		App.prototype.onEditProject = function(oEvent) {
			this._showProjectDialog();
		};
		
		App.prototype.onDeleteSelectedProject = function(oEvent) {
			var that = this;
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.confirm(
		      "Do you want to delete this project?", {
		        styleClass: bCompact ? "sapUiSizeCompact" : "",
				onClose : function(oAction) {
					if (oAction === "OK") {
						that._deleteSelectedProject();
					}
				}
		      }
		    );
		};
		
		// /////////////////////////////////////////////////////////////////////////////
		// /// Private Functions
		// /////////////////////////////////////////////////////////////////////////////
		
		App.prototype._deleteSelectedProject = function() {
			var sIdentifier = this._localUIModel.getProperty("/selectedProjectIdentifier");
			var oComponent = this.getComponent();
			oComponent.deletedProject(sIdentifier);
			var that = this;
			setTimeout(function(){
				that.onSelectProjectChange();
			}, 0);
		};
		
		App.prototype._showProjectDialog = function(oEvent) {
			var oView = sap.ui.xmlview("projectX.view.Project.Project");
			var dialog = new sap.m.Dialog({
		      title: 'Project',
		      contentWidth: "90%",
		      contentHeight: "250px",
		      content: oView,
		      beginButton: new sap.m.Button({
		        text: 'OK',
		        press: function () {
		          dialog.close();
		        }
		      }),
		      afterClose: function() {
		        dialog.destroy();
		      }
		    });

		    //to get access to the global model
		    this.getView().addDependent(dialog);
		    dialog.open();
			oView.getController().onRouteMatched();
		};
		
		
		return App;

	}, /* bExport= */ true);
