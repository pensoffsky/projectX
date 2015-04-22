
// Provides control sap.m.App.
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject'],
	function(jQuery, ManagedObject) {
	"use strict";

	var Sequence = ManagedObject.extend("projectX.util.Sequence", { metadata : {

		properties : {
			identifier : {type : "int", defaultValue : null},
			name : {type : "string", defaultValue : null},
			description : {type : "string", defaultValue : null}
		},
		events : {

		},
		aggregations : {
			requests : {type : "string", multiple : true}
		}
	}});

	// /////////////////////////////////////////////////////////////////////////////
	// /// public functions
	// /////////////////////////////////////////////////////////////////////////////

	/**
	 * create a serialized version of this sequence.
	 * set temporary data to null.
	 * @return {object} a javascript object containing the data that has to be saved to disk.
	 */
	Request.prototype.serialize = function() {
		this.resetTempData();
		var oSequence = this.mProperties;
		return oSequence;
	};

	/**
	 * reset temporary data.
	 */
	Request.prototype.resetTempData = function() {
		
	};

	Sequence.prototype.addRequestId = function(sRequestId) {
		
	};

	return Sequence;

}, /* bExport= */ true);
