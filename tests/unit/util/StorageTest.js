jQuery.sap.require("projectX.util.Storage");

test("util/Storage tests", function() {
  //test empty project constructor
  var oProject = new projectX.util.Project();
  ok(oProject != null, "project constructor no parameter");
  
  //test setting a name
  var sName = "test1 {";
  oProject.setName(sName);
  equal(oProject.getName(), sName, "name with open paranthesis");
  
  //turn project into json string
  var sData = projectX.util.Storage.createJsonString([oProject]);
  ok(sData.length > 0, "project serialized");
  
  var aProjects = projectX.util.Storage.parseAndLoadProjects(sData);
  ok(aProjects.length === 1, "project deserialized");
  equal(oProject.getName(), sName, "name with open paranthesis");
  
});