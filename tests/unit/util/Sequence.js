jQuery.sap.require("projectX.util.Sequence");

QUnit.module("util/Sequence", {
    setup: function() {
      this._oSequence = new projectX.util.Sequence();
    },
    teardown: function() {
			
    }
});

QUnit.test("Instantiation", 1, function(assert) {
  var oSequence = new projectX.util.Sequence();
  assert.ok(oSequence , "Sequence instance created");
});

QUnit.test("serialize", 1, function(assert) {
  this._oSequence.serialize();
});

QUnit.test("resetTempData", 1, function(assert) {
  this._oSequence.resetTempData();
});

QUnit.test("getRequestIds", 1, function(assert) {
  this._oSequence.getRequestIds();
});

QUnit.test("addRequestIds", 1, function(assert) {
  this._oSequence.addRequestIds();
});

QUnit.test("removeRequest", 1, function(assert) {
  this._oSequence.removeRequest();
});

QUnit.test("runPreSequenceScript", 1, function(assert) {
  this._oSequence.runPreSequenceScript();
});

