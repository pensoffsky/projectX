
// Provides control sap.m.App.
sap.ui.define(['jquery.sap.global', 'projectX/util/MyManagedObject'],
	function(jQuery, MyManagedObject) {
	"use strict";

	var PrefixUrl = MyManagedObject.extend("projectX.util.PrefixUrl", { 
		constructor : function (oData) {
			MyManagedObject.apply(this, arguments);
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
