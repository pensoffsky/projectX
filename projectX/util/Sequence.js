
// Provides control sap.m.App.
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject', 'projectX/util/SequenceItem'],
	function(jQuery, ManagedObject) {
	"use strict";

	var Sequence = ManagedObject.extend("projectX.util.Sequence", { metadata : {

		properties : {
			identifier : {type : "int", defaultValue : null},
			name : {type : "string", defaultValue : null},
			description : {type : "string", defaultValue : null}
		},
		aggregations : {
			sequenceItems : {type : "projectX.util.SequenceItem", multiple : true}
		}
	}});

	// /////////////////////////////////////////////////////////////////////////////
	// /// public functions
	// /////////////////////////////////////////////////////////////////////////////

	/**
	 * create a serialized version of this sequence.
	 * @return {object} a javascript object containing the data that has to be saved to disk.
	 */
	Sequence.prototype.serialize = function() {
		var oSequence = {};
		
		oSequence.identifier = this.getIdentifier();
		oSequence.name = this.getName();
		oSequence.description = this.getDescription();
		
		var aSerializedSequenceItems = [];
		var aSequenceItems = this.getSequenceItems();
		for (var i = 0; i < aSequenceItems.length; i++) {
			aSerializedSequenceItems.push(aSequenceItems[i].serialize());
		}
		oSequence.sequenceItems = aSerializedSequenceItems;
		
		return oSequence;
	};

	/**
	 * reset temporary data.
	 */
	Sequence.prototype.resetTempData = function() {
		
	};

	Sequence.prototype.getRequestIds = function(sRequestId) {
		var aRequestIds = [];
		var aSequenceItems = this.getSequenceItems();
		for (var i = 0; i < aSequenceItems.length; i++) {
			aRequestIds.push(aSequenceItems[i].getIdentifier());
		}
		return aRequestIds;
	};

	Sequence.prototype.addRequestIds = function(aRequests) {
		this.removeAllSequenceItems();
		for (var i = 0; i < aRequests.length; i++) {
			this.addSequenceItem(new projectX.util.SequenceItem({
				identifier : aRequests[i].getIdentifier()
			}));
		}	
	};

	return Sequence;

}, /* bExport= */ true);
