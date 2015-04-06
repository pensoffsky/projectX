jQuery.sap.require("projectX.util.Project");
jQuery.sap.require("projectX.util.Request");
jQuery.sap.require("projectX.util.Controller");
jQuery.sap.require("projectX.util.Helper");

//TODO add button to load metadata again
//TODO fix binding to entitySets and so on. on Northwind the 
//servicedata is structured differently compared to OData(Read/Write)

projectX.util.Controller.extend("projectX.view.Metadata", {
	
	_localUIModel : undefined,

	//TODO create enum for the binding targets

//initialization and routing

	onInit : function() {
		this._localUIModel = new sap.ui.model.json.JSONModel({
			serviceMetadata : {} //the metadata object loaded from the odata service
		});
		
		var oBindingContainer = this.getView().byId("idBindingContainer");
		oBindingContainer.setModel(this._localUIModel);
		//this.getView().setModel(this._localUIModel, "localUIModel");
		
		//hook navigation event
		this.getRouter().getRoute("metadata").attachPatternMatched(this.onRouteMatched, this);
	},

	onRouteMatched : function(oEvent) {
		//TODO check why this is called twice sometimes
		//var oParameters = oEvent.getParameters();
		//var iProjectID = parseInt(oParameters.arguments.projectID, 10);
			
		//user wants to add a request based on the currently selected project
		var oModel = this.getView().getModel();
		var oSelectedProject = oModel.getProperty("/SelectedProject");
		var sBaseUrl = oSelectedProject.getBaseUrl();
		this._getODataServiceMetadata(sBaseUrl);
	},

	// /////////////////////////////////////////////////////////////////////////////
	// /// event handler
	// /////////////////////////////////////////////////////////////////////////////

	
	onBtnAddEntitySetRequest : function(oEvent) {
		//get selected items
		var oTable = this.getView().byId("idTableEntitySets");
		var aSelectedItems = oTable.getSelectedItems();
		if (!aSelectedItems || aSelectedItems.length <= 0){
			alert("no items selected");
			return;
		}
		
		//get the selected project
		var oModel = this.getView().getModel();
		var oSelectedProject = oModel.getProperty("/SelectedProject");
		if (!oSelectedProject) {
			alert("no project selected");
			return;
		}
		
		for (var i = 0; i < aSelectedItems.length; i++) {
			//get the entityset description that is bound to the selected item
			var oBoundObject = projectX.util.Helper.getBoundObjectForItem(aSelectedItems[i]);
			//create request data and add the request to the currently selected project
			var sName = "ES: " + oBoundObject.name;
			var sUrl = oSelectedProject.getBaseUrl() + oBoundObject.name;
			oSelectedProject.addNewRequest(sName, sUrl);
			//TODO also add entitytype to request to allow filtering and so on ...?	
		}
		
		oModel.updateBindings();
	},
	
	

	// /////////////////////////////////////////////////////////////////////////////
	// /// private methods
	// /////////////////////////////////////////////////////////////////////////////

	_createRequest : function() {
		
		
	},
	
	/**
	 * check if the given base url points to a valid odata service
	 */
	_getODataServiceMetadata : function(sServiceUrl) {
		this._localUIModel.setProperty("/odataServiceCheckRes", "checking odata service defined in project...");
		var oDeferred = projectX.util.Helper.getODataServiceMetadata(sServiceUrl);

		var that = this;
		oDeferred.done(function(oServiceMetadata) {
			console.log(oServiceMetadata);
			console.log("successfully loaded service metadata");
			that._localUIModel.setProperty("/odataServiceCheckRes", "metadata loaded successfully");
			that._localUIModel.setProperty("/serviceMetadata", oServiceMetadata);
		});

		oDeferred.fail(function() {
			console.log("Service Metadata could not be loaded");
			that._localUIModel.setProperty("/odataServiceCheckRes", "failed to load metadata");
			that._localUIModel.setProperty("/serviceMetadata", null);
		});
	},
	

});