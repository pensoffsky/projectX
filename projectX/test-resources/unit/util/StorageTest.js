jQuery.sap.require("projectX.util.Storage");

QUnit.module("util/Storage");
test("tests", function() {
  //test empty project constructor
  var oProject = new projectX.util.Project();
  ok(oProject != null, "project constructor no parameter");
  
  //test setting a name
  var sName = "test1 {";
  oProject.setName(sName);
  equal(oProject.getName(), sName, "name with open paranthesis");
  
  //test error case for createJsonString
  var sData = projectX.util.Storage.createJsonString(null);
  equal(sData, null, "createJsonString no input");
  var sData = projectX.util.Storage.createJsonString([]);
  equal(sData, null, "createJsonString empty array");
    
  //turn project into json string
  var sData = projectX.util.Storage.createJsonString([oProject]);
  ok(sData.length > 0, "project serialized");
  
  //load project from string
  var aProjects = projectX.util.Storage.parseAndLoadProjects(sData);
  ok(aProjects.length === 1, "project deserialized");
  equal(oProject.getName(), sName, "name with open paranthesis");
  
  //error cases for load project from string
  var aProjects = projectX.util.Storage.parseAndLoadProjects(undefined);
  ok(!aProjects, "parseload with undefined does not throw exception");
  
});