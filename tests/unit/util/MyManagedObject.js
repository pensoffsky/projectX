jQuery.sap.require("projectX.util.MyManagedObject");

QUnit.module("util/MyManagedObject", {
    setup: function() {
      this._oMyManagedObject = new projectX.util.MyManagedObject();
    },
    teardown: function() {
			
    }
});

QUnit.test("Instantiation", 1, function(assert) {
  var oMyManagedObject = new projectX.util.MyManagedObject();
  assert.ok(oMyManagedObject , "MyManagedObject instance created");
});


QUnit.test("extractBindingInfo", 1, function(assert) {  
  this._oMyManagedObject.extractBindingInfo();
});
