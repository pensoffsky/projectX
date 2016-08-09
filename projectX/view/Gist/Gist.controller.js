jQuery.sap.require("projectX.util.Project");
jQuery.sap.require("projectX.util.Request");
jQuery.sap.require("projectX.util.Controller");
jQuery.sap.require("projectX.util.Helper");

projectX.util.Controller.extend("projectX.view.Gist.Gist", {

	_localUIModel : undefined,
	_oProject : null,
	
	//TODO create enum for the binding targets

//initialization and routing

	onInit : function() {
		this._localUIModel = new sap.ui.model.json.JSONModel({
			project: null,
			sScreenMode: "create", //create, read,
			githubPassword: ""
		});
		//set the local ui model to the view
		//use a name when addressing the local ui model from xml
		this.getView().setModel(this._localUIModel, "localUIModel");

	},

	/**
	 * read the currently selected model into the localUIModel for binding.
	 */
	initializeController : function() {
		this._oProject =  null;

		var oModel = this.getView().getModel();
		var oSelectedProject = oModel.getProperty("/SelectedProject");
		if (!oSelectedProject) {
			return;
		}

		this._oProject = oSelectedProject;
		this._localUIModel.setProperty("/project", oSelectedProject);
	},
	
	/**
	 * define the mode of the dialog (create, update or read)
	 */
	defineScreenMode : function(sScreenMode) {
		this._localUIModel.setProperty("/sScreenMode", sScreenMode);
	},
	
	// /////////////////////////////////////////////////////////////////////////////
	// /// event handler
	// /////////////////////////////////////////////////////////////////////////////

	onCreateGist : function() {
		var that = this;
		//get a new gist
		var oGitHub = this._getGitHubAPI();
		var gist = oGitHub.getGist();
		
		var oGistData = this._getGistData();
		
		gist.create(oGistData).then(function({data}) {
		   // Promises!
		   let gistJson = data;
		   gist.read(function(err, gist, xhr) {
		      // if no error occurred then err == null
			  if(err == null) {
				  that._localUIModel.setProperty("/project/mProperties/gistID", gist.id);
				  that.showSuccessMessage("Upload successfull to GIST with ID: " + gist.id);
			  } else {
				  that.showErrorMessage("GIST could not be created: " +  err);
			  }
		   });
		});
		
	},
	
	onUpdateGist : function() {
		var that = this;
		var sGistID = this._localUIModel.getProperty("/project/mProperties/gistID");
		var oGitHub = this._getGitHubAPI();
		var gist = oGitHub.getGist(sGistID);
		
		var oGistData = this._getGistData();
		
		gist.update(oGistData).then(function(httpResponse) {
			 var gistJson = httpResponse.data;
			 // Callbacks too
			 gist.read(function(err, gist, xhr) {
				 if(err == null) {
   				  that._localUIModel.setProperty("/project/mProperties/gistID", gist.id);
   				  that.showSuccessMessage("Gist updated successfully");
   			  } else {
   				  that.showErrorMessage("GIST could not be updated: " +  err);
   			  }
			 });
		  });
	},
	
	onImportFromGist : function() {
		
	},

	// /////////////////////////////////////////////////////////////////////////////
	// /// private methods
	// /////////////////////////////////////////////////////////////////////////////

	_getGistData: function () {
		//create json string of project
		var oProject = this.getCurrentProject();
		var sProject = JSON.stringify(oProject.serialize(), null, 2);
		
		//prepare payload for gist
		var oFiles = {
			projectData : {
				content: sProject
			}
		};
		var oGistData = {
		   public: true,
		   description: oProject.getName(),
		   files: oFiles
		};
		
		return oGistData;
	},

	_getGitHubAPI : function () {
		var sUsername = this._oProject.getGithubUsername();
		var sPassword = this._localUIModel.getProperty("/githubPassword");
		var sAPIUrl = this._oProject.getGithubApiUrl();
		
		var oGitHub = new GitHub({
		  username: sUsername,
		  password: sPassword
	  	}, sAPIUrl);
		
		return oGitHub;
	}

});
