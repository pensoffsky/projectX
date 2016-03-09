jQuery.sap.require("projectX.util.PrefixUrl");

QUnit.module("util/PrefixUrl", {
    setup: function() {
      this._oPrefixUrl = new projectX.util.PrefixUrl();
    },
    teardown: function() {
			
    }
});

QUnit.test("Instantiation", 1, function(assert) {
  var oPrefixUrl = new projectX.util.PrefixUrl();
  assert.ok(oPrefixUrl , "PrefixUrl instance created");
});

QUnit.test("serialize", 1, function(assert) {
  this._oPrefixUrl.serialize();  
});

QUnit.test("resetTempData", 1, function(assert) {
  this._oPrefixUrl.resetTempData();  
});

