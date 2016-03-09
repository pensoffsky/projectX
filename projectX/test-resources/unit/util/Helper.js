jQuery.sap.require("projectX.util.Helper");

QUnit.module("util/Helper", {
    setup: function() {
      
    },
    teardown: function() {
			
    }
});

QUnit.test("Instantiation", 1, function(assert) {
  var oHelper = new projectX.util.Helper();
  assert.ok(oHelper , "Helper instance created");
});


QUnit.test("xpathResultToString", 1, function(assert) {
  projectX.util.Helper.xpathResultToString();  
});

QUnit.test("getODataServiceMetadata", 1, function(assert) {
  projectX.util.Helper.getODataServiceMetadata();  
});

QUnit.test("getBoundObjectForItem", 1, function(assert) {
  projectX.util.Helper.getBoundObjectForItem();  
});

QUnit.test("moveArrayElementUp", 1, function(assert) {
  projectX.util.Helper.moveArrayElementUp();  
});

QUnit.test("moveArrayElementDown", 1, function(assert) {
  projectX.util.Helper.moveArrayElementDown();  
});

QUnit.test("scrollSelectedItemOfListIntoView", 1, function(assert) {
  projectX.util.Helper.scrollSelectedItemOfListIntoView();  
});

QUnit.test("addFilterToListBinding", 1, function(assert) {
  projectX.util.Helper.addFilterToListBinding();  
});
