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
	"sap/m/MessageToast",
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
		MessageToast,
		Sorter,
		Filter,
		FilterOperator
	) {

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
		
		App.prototype.showCredentialsDialog = function(oEvent) {
		
			var oView = sap.ui.xmlview("projectX.view.GitHubDialog.GitHubDialog");
			var dialog = new sap.m.Dialog({
		      title: 'User credentials are missing!',
		      contentWidth: "250px",
		      contentHeight: "200px",
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
		
		App.prototype.onGitHubPush = function(oEvent) {
			// get selected project
			var oSelectedProject = this.getView().getModel().getProperty("/SelectedProject");
			var bGitHubUsed = this.getView().getModel().getProperty("/SelectedProject/mProperties/useGithub");
			var aSelectedProject = [];
			aSelectedProject.push(oSelectedProject);
			//var aContexts = oEvent.getParameter("selectedContexts");
			
			// leave when no project is selected
			if (!bGitHubUsed) {
				return;
			}

			/*var aProject = aSelectedProject.map(function(oContext) {
				return oContext.getObject();
			}, this);*/

			var gitApi = this._getGitHubAPI();
			
			var oComponent = this.getComponent();
			
			//given Content for file
			var sContent = oComponent.createGitHubJson(aSelectedProject);
			
			//getting repo
			var sRepo = aSelectedProject[0].mProperties.githubRepository;
			
			var sUserRepo = aSelectedProject[0].mProperties.githubUserRepository;

			//getting repo
			var gitRepo = gitApi.getRepo(sUserRepo,sRepo);
			
			//given branch
			var branch = "master";
			
			//given path for file 
			var path = aSelectedProject[0].mProperties.githubFileName;
			
			//given commit message
			var message = "test1";
			
			var options = {
						path : oSelectedProject.getGithubFileName()
			};
			
			if (oSelectedProject.getGithubUser() === "" || oSelectedProject.getGithubPassword() === "") {
				this.showCredentialsDialog();
			} else {
				var gettingListOfCommits = gitRepo.listCommits(options);
				gettingListOfCommits.then(function (listOfCommits) {
					if (listOfCommits.data.length === 0) {
						//TODO show messagetoast only if successfull / error
						var newFile = gitRepo.writeFile(branch, path, sContent, message, function () {
						});
						newFile.then(function() {
							MessageToast.show("Requests have been pushed!");
						});	
					} else {
						try {
							oSelectedProject.merge(gitRepo,function() {
								//deleting actual file from repository and creating new one with a HTTP - PUT
								//TODO show messagetoast only if successfull / error
								var newFile = gitRepo.writeFile(branch,path,sContent,message,function () {
								});
								newFile.then(function() {
									MessageToast.show("Requests have been pushed!");
								});
							});
						} catch (err) {
							MessageToast.show("An Error has occured: " + err);
						}
					}
				});
			}
		};

		App.prototype.onGitHubFetch = function(oEvent) {
			//get Data from UI for GitHub
			var oModel = this.getView().getModel();
			var gitApi = this._getGitHubAPI();
			var selectedProject = oModel.getProperty("/SelectedProject");
			
			//get branch
			var ref = "master";
			
			//get path from given Project
			var path = selectedProject.mProperties.githubFileName;
			
			var sRepo = selectedProject.mProperties.githubRepository;
			
			var sUserRepo = selectedProject.mProperties.githubUserRepository;

			//getting repo
			var gitRepo = gitApi.getRepo(sUserRepo,sRepo);
			
			//get Content from given path
			var fileContent = gitRepo.getContents(ref,path,true,function() {
				
			});
			fileContent.then(function(temp){
				//todo add success and error callback to provide feedback to the user
				try {
					var oSelectedAndBaseProjectmerged = selectedProject.merge(gitRepo, function(oMergedProject) {
							oModel.updateBindings(true);
							return oMergedProject;
							
							MessageToast.show("Requests have been updated!");
					});
				} catch (err) {
					MessageToast.show("An Error has occured: " + err);	
				}
			}, function(reason) {MessageToast.show("An Error has occured: " + reason); })
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
		
		App.prototype._getGitHubAPI = function() {
			var oModel = this.getView().getModel();
			var selectedProject = oModel.getProperty("/SelectedProject");
		//	var sUsername = "";
		//	var sPassword = "";
			var sAPIUrl = selectedProject.mProperties.githubUrl;
			var sUsername = selectedProject.mProperties.githubUser;
			var sPassword = selectedProject.mProperties.githubPassword;
			/*var selectedProjectIdentifier = "0";
			selectedProjectIdentifier = this._localUIModel.getProperty("/selectedProjectIdentifier");*/
			
			/*sUsername = selectedProject.mProperties.githubUser;
			sPassword = selectedProject.mProperties.githubPassword;*/

			var oGitHub = new GitHub({
				username: sUsername,
				password: sPassword
			}, sAPIUrl);

			return oGitHub;
		};
		
		return App;

	}, /* bExport= */ true);