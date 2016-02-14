jQuery.sap.require("projectX.util.RequestHeader");

QUnit.module("util/RequestHeader", {
    setup: function() {
      this._oRequestHeader = new projectX.util.RequestHeader();
    },
    teardown: function() {
			
    }
});

QUnit.test("Instantiation", 1, function(assert) {
  var oRequestHeader = new projectX.util.RequestHeader();
  assert.ok(oRequestHeader , "RequestHeader instance created");
});

QUnit.test("serialize", 1, function(assert) {
  this._oRequestHeader.serialize();
});
