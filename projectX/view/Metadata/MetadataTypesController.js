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

			this._localUIModel = new sap.ui.model.json.JSONModel();
			this._localUIModel.setData({

			});
			this.getView().setModel(this._localUIModel);
		};

		MetadataTypesController.prototype.setServiceUrl = function(sServiceUrl) {
			this._getODataServiceMetadata(sServiceUrl);
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
				that._localUIModel.setProperty("/complexTypes", that._extractFromMetadata(oMetaData, "complexType"));
				var aEntityTypes = that._extractFromMetadata(oMetaData, "entityType");

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

		MetadataTypesController.prototype._extractFromMetadata = function(oMetaData, sTarget) {
			var aRes = oMetaData &&
				oMetaData.dataServices &&
				oMetaData.dataServices.schema &&
				oMetaData.dataServices.schema[0] &&
				oMetaData.dataServices.schema[0][sTarget];
			return aRes;
		};

		MetadataTypesController.prototype._extractFromEntityContainer = function(aEntityContainer, sTarget) {
			var aRes = aEntityContainer &&
				aEntityContainer[0] &&
				aEntityContainer[0][sTarget];
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