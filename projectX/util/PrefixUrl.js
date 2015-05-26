
// Provides control sap.m.App.
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject'],
	function(jQuery, ManagedObject) {
	"use strict";

	var PrefixUrl = ManagedObject.extend("projectX.util.PrefixUrl", { 
		constructor : function (oData) {
			ManagedObject.apply(this, arguments);
			this.setUrl(oData.url);
		},
		metadata : {
			properties : {
				url : {type : "string", defaultValue : null}
			},
			events : {

			}
		}
	});

	// /////////////////////////////////////////////////////////////////////////////
	// /// public functions
	// /////////////////////////////////////////////////////////////////////////////

	/**
	 * create a serialized version of this sequenceItem.
	 * @return {object} a javascript object containing the data that has to be saved to disk.
	 */
	PrefixUrl.prototype.serialize = function() {
		var oPrefixUrl = {};
		oPrefixUrl.url = this.getUrl();
		return oPrefixUrl;
	};

	/**
	 * reset temporary data.
	 */
	PrefixUrl.prototype.resetTempData = function() {

	};

	return PrefixUrl;

}, /* bExport= */ true);
