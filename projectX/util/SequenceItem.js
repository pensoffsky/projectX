
// Provides control sap.m.App.
sap.ui.define(['jquery.sap.global', 'projectX/util/MyManagedObject'],
	function(jQuery, MyManagedObject) {
	"use strict";

	var SequenceItem = MyManagedObject.extend("projectX.util.SequenceItem", { 
		constructor : function (oData) {
			MyManagedObject.apply(this, arguments);
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
