jQuery.sap.require("projectX.Component");

QUnit.module("Component", {
    setup: function() {
      
    },
    teardown: function() {
			
    }
});

QUnit.test("Instantiation", 1, function(assert) {
  var oComponent = new projectX.Component();
  assert.ok(oComponent , "Component instance created");
});