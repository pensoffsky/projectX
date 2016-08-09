/**
 * the controller for the main view of the application
 */
sap.ui.define([
	"jquery.sap.global",
	"projectX/util/Controller",
	"projectX/util/Constants",
	"projectX/util/Formatter",
	"projectX/util/Helper",
	"sap/m/MessageBox",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
],	function(
		jQuery,
		Controller,
		Constants,
		Formatter,
		Helper,
		MessageBox,
		Sorter,
		Filter,
		FilterOperator
	) {

		"use strict";

		var App = Controller.extend("projectX.view.App", {
			metadata: {}
		});


		App.prototype.onSaveToGist = function() {
			this._showGistDialog("create");
		};
		
		App.prototype.onReadFromGist = function() {
			this._showGistDialog("read");
		};


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

		// /////////////////////////////////////////////////////////////////////////////
		// /// Event Handler
		// /////////////////////////////////////////////////////////////////////////////

		App.prototype.onSelectProjectChange = function() {
			var sIdentifier = this._localUIModel.getProperty("/selectedProjectIdentifier");
			var oComponent = this.getComponent();
			oComponent.setSelectedProject(sIdentifier);
		};

		/**
		 * Handler for export button.
		 *
		 * @public
		 */
		App.prototype.onExport = function() {
			var oExportSelectDialog = this.getView().byId("idExportSelectDialog");
			var oSorter = new Sorter("mProperties/identifier", false);
			oExportSelectDialog.getBinding("items").sort(oSorter);
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), oExportSelectDialog);
			oExportSelectDialog.open();
		};

		/**
		 * Handler for search button in export dialog.
		 *
		 * @param  {object} oEvent Object of event by current control
		 * @public
		 */
		App.prototype.onExportSelectDialogSearch = function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("mProperties/name", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		};

		/**
		 * Handler for confirm to export selected projects.
		 *
		 * @param {object} oEvent Object of event by current control
		 * @public
		 */
		App.prototype.onExportSelectDialogConfirm = function(oEvent) {
			// get context of all selected items
			var aContexts = oEvent.getParameter("selectedContexts");
			var aProjects = [];

			// leave when no project is selected
			if (!aContexts.length) {
				return;
			}

			aProjects = aContexts.map(function(oContext) {
				return oContext.getObject();
			}, this);

			var oComponent = this.getComponent();
			oComponent.export(aProjects);
		};

		App.prototype.onFileUploaderChange = function(oEvent) {
			//TODO add error hanlding. at the moment best case programming
			var aFiles = oEvent.getParameter("files");
			var oFile = aFiles[0];

			//clear the cache of the fileuplaoder
			//fixes bug where the same file could not be imported twice
			oEvent.getSource().clear();

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
		      contentHeight: "500px",
			  resizable: true,
			  draggable: true,
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
		
		//TODO move to gist controller function?
		App.prototype._showGistDialog = function(sScreenMode) {
			var oView = sap.ui.xmlview("projectX.view.Gist.Gist");
			var dialog = new sap.m.Dialog({
		      title: 'Gist',
		      contentWidth: "90%",
		      contentHeight: "500px",
			  resizable: true,
			  draggable: true,
		      content: oView,
		      beginButton: new sap.m.Button({
		        text: 'Close',
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
			oView.getController().initializeController();
			oView.getController().defineScreenMode(sScreenMode);
		};
		
		
		return App;

	}, /* bExport= */ true);
