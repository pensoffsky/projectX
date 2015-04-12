jQuery.sap.require("projectX.util.Project");
jQuery.sap.require("projectX.util.Request");
jQuery.sap.require("projectX.util.Controller");
jQuery.sap.require("projectX.util.Helper");

//TODO add button to load metadata again
//TODO fix binding to entitySets and so on. on Northwind the 
//servicedata is structured differently compared to OData(Read/Write)

projectX.util.Controller.extend("projectX.view.Metadata", {

	_localUIModel: undefined,

	//TODO create enum for the binding targets

	//initialization and routing

	onInit: function() {
		this._localUIModel = new sap.ui.model.json.JSONModel({
			serviceMetadata: {} //the metadata object loaded from the odata service
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

	onEntityTypeTableSelectionChange: function(oEvent) {
		var oTable = oEvent.getSource();
		var oTableBindingContext = oTable.getBindingContext();
		var oModel = oTableBindingContext.getModel();
		var sBasePath = oTableBindingContext.getPath();
		var aSelectedItems = oTable.getSelectedItems();

		//create keys string
		this._createAndSetCalculatedURLPart(aSelectedItems, oModel,
			sBasePath + "/calculatedKeys",
			jQuery.proxy(function(oEntityType) {
				return oEntityType.name + "=" + this._getDefaultValueForEdmType(oEntityType.type);
			}, this),
			"(", ", ", ")");

		//create orderBy string
		this._createAndSetCalculatedURLPart(aSelectedItems, oModel,
			sBasePath + "/calculatedOrderBy",
			function(oEntityType) {
				return oEntityType.name;
			},
			"$orderby=", ",", " asc");

		//create filter string
		this._createAndSetCalculatedURLPart(aSelectedItems, oModel,
			sBasePath + "/calculatedFilter",
			jQuery.proxy(function(oEntityType) {
				return oEntityType.name + " eq " + this._getDefaultValueForEdmType(oEntityType.type);
			}, this),
			"$filter=", " or ", "");

		//create select string
		this._createAndSetCalculatedURLPart(aSelectedItems, oModel,
			sBasePath + "/calculatedSelect",
			function(oEntityType) {
				return oEntityType.name;
			},
			"$select=", ",", "");

	},

	_getDefaultValueForEdmType : function(sEdmType){
		var oEdmTypeDefaults = {
			"Edm.Binary" : "binary'23ABFF'",
			"Edm.Boolean" : "true",
			"Edm.Byte" : "FF",
			"Edm.DateTime" : "datetime'2000-12-12T12:00'",
			"Edm.Decimal" : "2.345M",
			"Edm.Double" : "2.029d",
			"Edm.Single" : "2.0f",
			"Edm.Guid" : "guid'12345678-aaaa-bbbb-cccc-ddddeeeeffff'",
			"Edm.Int16" : "16",
			"Edm.Int32" : "32",
			"Edm.Int64" : "64L",
			"Edm.SByte" : "8",
			"Edm.String" : "'string'",
			"Edm.Time" : "13:20:00",
			"Edm.DateTimeOffset" : "2002-10-10T17:00:00Z"
		};
		return oEdmTypeDefaults[sEdmType];
	},

	_createAndSetCalculatedURLPart: function(aSelectedItems, oModel, sPath, fContent, sPrefix, sDelimiter, sSuffix) {

		if (!aSelectedItems || aSelectedItems.length <= 0) {
			oModel.setProperty(sPath, "");
			return;
		}

		var sRes = sPrefix;
		for (var i = 0; i < aSelectedItems.length; i++) {
			//get the entityType description that is bound to the selected item
			var oBoundObject = projectX.util.Helper.getBoundObjectForItem(aSelectedItems[i]);
			sRes += fContent(oBoundObject);
			if ((i + 1) < aSelectedItems.length) {
				sRes += sDelimiter;
			}
		}
		sRes += sSuffix;
		oModel.setProperty(sPath, sRes);
	},

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



	// /////////////////////////////////////////////////////////////////////////////
	// /// private methods
	// /////////////////////////////////////////////////////////////////////////////

	_extractFromMetadata: function(oMetaData, sTarget) {
		var aRes = oMetaData &&
			oMetaData.dataServices &&
			oMetaData.dataServices.schema &&
			oMetaData.dataServices.schema[0] &&
			oMetaData.dataServices.schema[0][sTarget];
		return aRes;
	},

	_extractFromEntityContainer: function(aEntityContainer, sTarget) {
		var aRes = aEntityContainer &&
			aEntityContainer[0] &&
			aEntityContainer[0][sTarget];
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
			console.log(JSON.stringify(oMetaData, null, 2));
			console.log(oMetaData);
			console.log("successfully loaded service metadata");
			that._localUIModel.setProperty("/odataServiceCheckRes", "metadata loaded successfully");
			that._localUIModel.setProperty("/serviceMetadata", oMetaData);
			that._localUIModel.setProperty("/entityTypes", that._extractFromMetadata(oMetaData, "entityType"));
			that._localUIModel.setProperty("/associations", that._extractFromMetadata(oMetaData, "association"));
			that._localUIModel.setProperty("/complexTypes", that._extractFromMetadata(oMetaData, "complexType"));
			var aEntityContainer = that._extractFromMetadata(oMetaData, "entityContainer");
			that._localUIModel.setProperty("/associationSets",
				that._extractFromEntityContainer(aEntityContainer, "associationSet"));
			that._localUIModel.setProperty("/entitySets",
				that._extractFromEntityContainer(aEntityContainer, "entitySet"));
			that._localUIModel.setProperty("/functionImports",
				that._extractFromEntityContainer(aEntityContainer, "functionImport"));

		});

		oDeferred.fail(function() {
			console.log("Service Metadata could not be loaded");
			that._localUIModel.setProperty("/odataServiceCheckRes", "failed to load metadata");
			that._localUIModel.setProperty("/serviceMetadata", null);
			that._localUIModel.setProperty("/entityTypes", null);
			//TODO clear data
		});
	},


});