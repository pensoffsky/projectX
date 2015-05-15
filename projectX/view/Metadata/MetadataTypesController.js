sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject', 'projectX/util/Helper', 'projectX/util/Constants'],
	function(jQuery, ManagedObject, Helper, Constants) {
		"use strict";

		var MetadataTypesController = ManagedObject.extend("projectX.view.Metadata.MetadataTypesController", {
			metadata: {

				properties: {
					view: {
						type: "object",
						defaultValue: null
					}
				},
				events: {

				}
			}
		});

		// /////////////////////////////////////////////////////////////////////////////
		// /// Constructor & Initialization
		// /////////////////////////////////////////////////////////////////////////////

		MetadataTypesController.prototype.constructor = function() {
			ManagedObject.apply(this, arguments);
		};


		// /////////////////////////////////////////////////////////////////////////////
		// /// Event Handler
		// /////////////////////////////////////////////////////////////////////////////

		MetadataTypesController.prototype.onBtnCalculatedKeyPress = function(oEvent) {
			var sUrl = oEvent.getSource().data("url");
			this._oRequest.appendToUrl(sUrl);
		};
		
		MetadataTypesController.prototype.onEntityTypesListSelect = function(oEvent) {
			var oItem = this._oEntityTypesList.getSelectedItem();
			var oBindingContext = oItem.getBindingContext();
			var sPath = oBindingContext.getPath();
						
			this._oEntityTypeTree.bindRows(sPath);
		};




		// /////////////////////////////////////////////////////////////////////////////
		// /// Public Methods
		// /////////////////////////////////////////////////////////////////////////////

		/**
		 * create the local ui model that is used as binding target.
		 * this way we do not have any dependency to the page that includes the fragment
		 */
		MetadataTypesController.prototype.onInit = function(sIdPrefix) {
			var oMetadataTypesFragment = sap.ui.xmlfragment(sIdPrefix,
				"projectX.view.Metadata.MetadataTypes",
				this);
			//set fragment view to fragment controller
			this.setView(oMetadataTypesFragment);

			this._oEntityTypesList = sap.ui.core.Fragment.byId(sIdPrefix, "idListEntityTypes");
			this._oEntityTypeTree = sap.ui.core.Fragment.byId(sIdPrefix, "idTableDemo");

			this._localUIModel = new sap.ui.model.json.JSONModel();
			this._localUIModel.setData({

			});
			//TODO do not set as global model, fix get bound object
			this.getView().setModel(this._localUIModel);
		};

		MetadataTypesController.prototype.setSelectedRequest = function(oProject, oRequest) {
			this._oProject = oProject;
			this._oRequest = oRequest;
			this._getODataServiceMetadata(this._oProject.getBaseUrl());
		};


		// /////////////////////////////////////////////////////////////////////////////
		// /// Private Methods
		// /////////////////////////////////////////////////////////////////////////////

		/**
		 * check if the given base url points to a valid odata service
		 */
		MetadataTypesController.prototype._getODataServiceMetadata = function(sServiceUrl) {
			this._localUIModel.setProperty("/odataServiceCheckRes", "checking odata service defined in project...");
			var oDeferred = projectX.util.Helper.getODataServiceMetadata(sServiceUrl);

			var that = this;
			oDeferred.done(function(oMetaData) {
				// console.log(JSON.stringify(oMetaData, null, 2));
				// console.log(oMetaData);
				// console.log("successfully loaded service metadata");
				that._localUIModel.setProperty("/odataServiceCheckRes", "metadata loaded successfully");
				that._localUIModel.setProperty("/serviceMetadata", oMetaData);
				var aComplexTypes = that._extractFromMetadata(oMetaData, "complexType", true);
				that._localUIModel.setProperty("/complexTypes", aComplexTypes);
				
				var aEntityTypes = that._extractFromMetadata(oMetaData, "entityType", false);
				
				that._extendEntityTypeWithComplexTypes(aEntityTypes, aComplexTypes);				

				//set the keys of an entitytype to the corresponding properties
				aEntityTypes.map(function(oEntityType) {
					//loop over the keys
					oEntityType.key.propertyRef.map(function(oKey) {
						oEntityType.property.map(function(oProperty) {
							if (oProperty.name === oKey.name) {
								oProperty.calculatedIsKey = true;
							} else {
								oProperty.calculatedIsKey = false;
							}
						});
					});
					//remove the key info because it will cause the tree control
					//to show an extra expandable line
					oEntityType.key = null;
					//remove the navigationProperty out of the same reasons
					oEntityType.navigationProperty = null;
				});
				that._localUIModel.setProperty("/entityTypes", aEntityTypes);

			});

			oDeferred.fail(function() {
				console.log("Service Metadata could not be loaded");
				that._localUIModel.setProperty("/odataServiceCheckRes", "failed to load metadata");
				that._localUIModel.setProperty("/serviceMetadata", null);
				that._localUIModel.setProperty("/entityTypes", null);
				//TODO clear data
			});
		};

		MetadataTypesController.prototype._extendEntityTypeWithComplexTypes = function(aEntityTypes, aComplexTypes) {
			for (var i = 0; i < aEntityTypes.length; i++) {
				var oEntityType = aEntityTypes[i];
				for (var k = 0; k < oEntityType.property.length; k++) {
					var oProperty = oEntityType.property[k];
				
					if(oProperty.type.indexOf("Edm.") === 0) {
						//we are searching for complex types and not normal edm types
						continue;
					}
					
					for (var j = 0; j < aComplexTypes.length; j++) {
						var oComplexType = aComplexTypes[j];
						if(oComplexType.name !== oProperty.type) {
							continue;
						}
						oProperty._complexTypeChild = oComplexType.property;
					//	debugger
					}
				}
			}
		};

		MetadataTypesController.prototype._extractFromMetadata = function(oMetaData, sTarget, bComplexType) {
			var aRes = [];

			if (!oMetaData ||
				!oMetaData.dataServices ||
				!oMetaData.dataServices.schema) {
				return aRes;
			}

			var aSchemas = oMetaData.dataServices.schema;
			for (var i = 0; i < aSchemas.length; i++) {
				var aContainer = aSchemas[i][sTarget];
				if (!aContainer) {
					continue;
				}
				for (var j = 0; j < aContainer.length; j++) {
					if (bComplexType === true) {
						aContainer[j].name = aSchemas[i].namespace + "." + aContainer[j].name;
					}
					aRes.push(aContainer[j]);
				}
			}

			return aRes;
		};


		MetadataTypesController.prototype.onEntityTypeTableSelectionChange = function(oEvent) {
			var oTable = oEvent.getSource();
			var oTableBindingContext = oTable.getBindingContext();
			var oModel = oTableBindingContext.getModel();
			var sBasePath = oTableBindingContext.getPath();
			var aSelectedItems = oTable.getSelectedItems();

			//create keys string
			this._createAndSetCalculatedURLPart(aSelectedItems, oModel,
				sBasePath + "/calculatedKeys",
				jQuery.proxy(function(oProperty) {
					if (oProperty.___userInput) {
						return oProperty.name + "=" + oProperty.___userInput;
					} else {
						return oProperty.name + "=" + this._getDefaultValueForEdmType(oProperty.type);
					}
				}, this),
				"(", ", ", ")");

			//create orderBy string
			this._createAndSetCalculatedURLPart(aSelectedItems, oModel,
				sBasePath + "/calculatedOrderBy",
				function(oProperty) {
					return oProperty.name;
				},
				"$orderby=", ",", " asc");

			//create filter string
			this._createAndSetCalculatedURLPart(aSelectedItems, oModel,
				sBasePath + "/calculatedFilter",
				jQuery.proxy(function(oProperty) {
					return oProperty.name + " eq " + this._getDefaultValueForEdmType(oProperty.type);
				}, this),
				"$filter=", " or ", "");

			//create select string
			this._createAndSetCalculatedURLPart(aSelectedItems, oModel,
				sBasePath + "/calculatedSelect",
				function(oProperty) {
					return oProperty.name;
				},
				"$select=", ",", "");

		};

		MetadataTypesController.prototype._getDefaultValueForEdmType = function(sEdmType) {
			var oEdmTypeDefaults = {
				"Edm.Binary": "binary'23ABFF'",
				"Edm.Boolean": "true",
				"Edm.Byte": "FF",
				"Edm.DateTime": "datetime'2000-12-12T12:00'",
				"Edm.Decimal": "2.345M",
				"Edm.Double": "2.029d",
				"Edm.Single": "2.0f",
				"Edm.Guid": "guid'12345678-aaaa-bbbb-cccc-ddddeeeeffff'",
				"Edm.Int16": "16",
				"Edm.Int32": "32",
				"Edm.Int64": "64L",
				"Edm.SByte": "8",
				"Edm.String": "'string'",
				"Edm.Time": "13:20:00",
				"Edm.DateTimeOffset": "2002-10-10T17:00:00Z"
			};
			return oEdmTypeDefaults[sEdmType];
		};

		MetadataTypesController.prototype._createAndSetCalculatedURLPart = function(aSelectedItems, oModel, sPath, fContent, sPrefix, sDelimiter, sSuffix) {

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
		};

		return MetadataTypesController;

	}, /* bExport= */ true);