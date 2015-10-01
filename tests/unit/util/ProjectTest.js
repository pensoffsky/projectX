jQuery.sap.require("projectX.util.Project");

QUnit.module("util/Project");
test("constructor", function() {
  var oProject = new projectX.util.Project();
  ok(oProject != null, "project instance created");
});