
// Provides control sap.m.App.
sap.ui.define(['jquery.sap.global', 'projectX/util/MyManagedObject', 'projectX/util/SequenceItem'],
	function(jQuery, MyManagedObject) {
	"use strict";

	var Sequence = MyManagedObject.extend("projectX.util.Sequence", { 
		constructor : function (oData) {
			MyManagedObject.apply(this, arguments);
		},
		metadata : {
			properties : {
				identifier : {type : "int", defaultValue : null},
				name : {type : "string", defaultValue : null},
				description : {type : "string", defaultValue : null},
				preSequenceScript : {type : "string", defaultValue : null},
				abortOnFailedAssertion : {type : "boolean", defaultValue : false},
				
				//these fields are only temporary variables. they will not be persisted
				preSequenceScriptResult : {type : "string", defaultValue : null}
			},
			aggregations : {
				sequenceItems : {type : "projectX.util.SequenceItem", multiple : true}
			}
		}
	});

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
		oSequence.preSequenceScript = this.getPreSequenceScript();
		oSequence.abortOnFailedAssertion = this.getAbortOnFailedAssertion();
		
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
		this.setPreSequenceScriptResult(null);
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
	
	Sequence.prototype.removeRequest = function(oRequest) {
		var aSequenceItems = this.getSequenceItems();
		for (var i = 0; i < aSequenceItems.length; i++) {
			if(aSequenceItems[i].getIdentifier() === oRequest.getIdentifier()) {
				this.removeSequenceItem(aSequenceItems[i]);
				return;
			}
		}
	};

	Sequence.prototype.runPreSequenceScript = function(oSequenceStorage) {
		//get the pre-sequence javascript code, put into function and run
		var sPreSequenceScriptCode = this.getPreSequenceScript();
		//execute custom javascript code
		try {
			var fRunPreSequenceScript = new Function("seqStorage", sPreSequenceScriptCode);
			fRunPreSequenceScript(oSequenceStorage);
		} catch (e) {
			console.log(e);
			this.setPreSequenceScriptResult("SCRIPT ERROR");
			return false;
		}
		return true;
	};

	return Sequence;

}, /* bExport= */ true);
