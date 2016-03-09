jQuery.sap.require("projectX.util.Formatter");

QUnit.module("util/Formatter", {
    setup: function() {
      
    },
    teardown: function() {
			
    }
});

QUnit.test("Instantiation", 1, function(assert) {
  var oFormatter = new projectX.util.Formatter();
  assert.ok(oFormatter , "Formatter instance created");
});

QUnit.test("assertionsListResultToText", 1, function(assert) {
  projectX.util.Formatter.assertionsListResultToText();  
});

QUnit.test("assertionsListResultToImage", 1, function(assert) {
  projectX.util.Formatter.assertionsListResultToImage();  
});

QUnit.test("assertionsResultToImage", 1, function(assert) {
  projectX.util.Formatter.assertionsResultToImage();  
});

QUnit.test("entitytypeString", 1, function(assert) {
  projectX.util.Formatter.entitytypeString();  
});

QUnit.test("entitytypeSwitch", 1, function(assert) {
  projectX.util.Formatter.entitytypeSwitch();  
});

QUnit.test("entitytypeDateTime", 1, function(assert) {
  projectX.util.Formatter.entitytypeDateTime();  
});

QUnit.test("entitytypeTime", 1, function(assert) {
  projectX.util.Formatter.entitytypeTime();  
});

QUnit.test("entityPropertyKeyToImage", 1, function(assert) {
  projectX.util.Formatter.entityPropertyKeyToImage();  
});
