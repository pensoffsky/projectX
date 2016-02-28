jQuery.sap.require("projectX.util.SequenceItem");

QUnit.module("util/SequenceItem", {
    setup: function() {
      this._oSequenceItem = new projectX.util.SequenceItem();
    },
    teardown: function() {
			
    }
});

QUnit.test("Instantiation", 1, function(assert) {
  var oSequenceItem = new projectX.util.SequenceItem();
  assert.ok(oSequenceItem , "SequenceItem instance created");
});

QUnit.test("serialize", 1, function(assert) {
  this._oSequenceItem.serialize();
});

QUnit.test("resetTempData", 1, function(assert) {
  this._oSequenceItem.resetTempData();
});
