
// Provides control sap.m.App.
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject'],
	function(jQuery, ManagedObject) {
	"use strict";

	var SequenceItem = ManagedObject.extend("projectX.util.SequenceItem", { 
		constructor : function (oData) {
			ManagedObject.apply(this, arguments);
			this.setIdentifier(oData.identifier);
		},
		metadata : {
			properties : {
				identifier : {type : "int", defaultValue : null}
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
	SequenceItem.prototype.serialize = function() {
		var oSequenceItem = {};
		oSequenceItem.identifier = this.getIdentifier();
		return oSequenceItem;
	};

	/**
	 * reset temporary data.
	 */
	SequenceItem.prototype.resetTempData = function() {
		
	};

	return SequenceItem;

}, /* bExport= */ true);
