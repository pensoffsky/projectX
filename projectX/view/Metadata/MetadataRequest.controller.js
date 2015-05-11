jQuery.sap.declare("projectX.view.Metadata.MetadataRequest");
jQuery.sap.require("projectX.util.Project");
jQuery.sap.require("projectX.util.Request");
jQuery.sap.require("projectX.util.Controller");
jQuery.sap.require("projectX.util.Helper");

//TODO add button to load metadata again
//TODO fix binding to entitySets and so on. on Northwind the
//servicedata is structured differently compared to OData(Read/Write)

projectX.util.Controller.extend("projectX.view.Metadata.MetadataRequest", {

	_localUIModel: undefined,

	//TODO create enum for the binding targets

	//initialization and routing

	onInit: function() {
		this._localUIModel = new sap.ui.model.json.JSONModel({
			serviceMetadata: {}, //the metadata object loaded from the odata service
			associationSets: [],
			entitySets: [],
			functionImports: []
		});

		var oBindingContainer = this.getView().byId("idBindingContainer");
		oBindingContainer.setModel(this._localUIModel);
		//this.getView().setModel(this._localUIModel, "localUIModel");

		//hook navigation event
		this.getRouter().getRoute("metadata").attachPatternMatched(this.onRouteMatched, this);
	},

	onRouteMatched: function(oEvent) {
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

	onBtnAddEntitySetRequest: function(oEvent) {
		//get selected items
		var oTable = this.getView().byId("idTableEntitySets");
		var aSelectedItems = oTable.getSelectedItems();
		if (!aSelectedItems || aSelectedItems.length <= 0) {
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

	onBtnAddFunctionImportRequest: function(oEvent) {
		//get selected items
		var oTable = this.getView().byId("idTableFunctionImports");
		var aSelectedItems = oTable.getSelectedItems();
		if (!aSelectedItems || aSelectedItems.length <= 0) {
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
			var sName = "FI: " + oBoundObject.name;
			var sUrl = oSelectedProject.getBaseUrl() + oBoundObject.name;
			var sHttpMethod = oBoundObject.httpMethod;

			for (var iParamIndex = 0; iParamIndex < oBoundObject.parameter.length; iParamIndex++) {
				if (iParamIndex === 0) {
					sUrl += "?";
				} else {
					sUrl += "&";
				}
				sUrl += oBoundObject.parameter[iParamIndex].name + "=";
			}

			oSelectedProject.addNewRequest(sName, sUrl, sHttpMethod);
		}

		oModel.updateBindings();
	},


	// /////////////////////////////////////////////////////////////////////////////
	// /// private methods
	// /////////////////////////////////////////////////////////////////////////////

	_createRequest : function(sListId, fCreate){

	},

	/**
	 * extracts all instances of of the sTarget element over all schemas.
	 * @param {object} oMetaData the metadata object
	 * @param {string} sTarget   name of the object to extract from the schemas
	 */
	_extractFromMetadata: function(oMetaData, sTarget) {
		var aRes = [];

		if(!oMetaData ||
			!oMetaData.dataServices ||
			!oMetaData.dataServices.schema) {
			return aRes;
		}

		var aSchemas = oMetaData.dataServices.schema;
		for(var i=0; i < aSchemas.length; i++) {
			var oContainer = aSchemas[i][sTarget];
			if(!oContainer){
				continue;
			}
			aRes.push(oContainer);
		}

		return aRes;
	},

	_extractFromEntityContainer: function(aEntityContainers, sTarget) {
		var aRes = [];
		for(var i=0; i < aEntityContainers.length; i++) {
			var aContainers =  aEntityContainers[i];

			for(var j=0; j < aContainers.length; j++) {
				var aTargets = aContainers[j][sTarget];
				if(!aTargets){
					continue;
				}
				for(var k=0; k<aTargets.length; k++){
					aRes.push(aTargets[k]);
				}
			}
		}
		return aRes;
	},

	/**
	 * check if the given base url points to a valid odata service
	 */
	_getODataServiceMetadata: function(sServiceUrl) {
		this._localUIModel.setProperty("/odataServiceCheckRes", "checking odata service defined in project...");
		var oDeferred = projectX.util.Helper.getODataServiceMetadata(sServiceUrl);

		var that = this;
		oDeferred.done(function(oMetaData) {
			// console.log(JSON.stringify(oMetaData, null, 2));
			// console.log(oMetaData);
			console.log("successfully loaded service metadata");
			that._localUIModel.setProperty("/odataServiceCheckRes", "metadata loaded successfully");
			that._localUIModel.setProperty("/serviceMetadata", oMetaData);

			//get an array of maybe multiple entityContainers
			var aEntityContainers = that._extractFromMetadata(oMetaData, "entityContainer");

			that._localUIModel.setProperty("/associationSets", that._extractFromEntityContainer(aEntityContainers, "associationSet"));
			that._localUIModel.setProperty("/entitySets", that._extractFromEntityContainer(aEntityContainers, "entitySet"));
			that._localUIModel.setProperty("/functionImports", that._extractFromEntityContainer(aEntityContainers, "functionImport"));
		});

		oDeferred.fail(function() {
			console.log("Service Metadata could not be loaded");
			that._localUIModel.setProperty("/odataServiceCheckRes", "failed to load metadata");
			that._localUIModel.setProperty("/serviceMetadata", null);
			that._localUIModel.setProperty("/entitySets", null);
			that._localUIModel.setProperty("/functionImports", null);
			that._localUIModel.setProperty("/associationSet", null);
			//TODO clear data
		});
	},


});