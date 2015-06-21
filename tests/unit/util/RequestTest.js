//jQuery.sap.registerModulePath("projectX", "base/projectX");

jQuery.sap.require("projectX.util.Request");

test("util Request constructor", 5, function() {
  jQuery.sap.require("projectX.util.Request");
  var oRequest = new projectX.util.Request();
  ok(oRequest != null, "request instance created");
  
  var oRequest = new projectX.util.Request(
      {
          name : "name1",
          url : "http://www.url1.com",
          scriptCode : "asdf = bla;"
      }
  );
  equal(oRequest.getName(), "name1", "name setter and getter");
  equal(oRequest.getUrl(), "http://www.url1.com", "url setter and getter");
  equal(oRequest.getScriptCode(), "asdf = bla;", "scriptCode setter and getter");
  
  var oRequest = new projectX.util.Request(
      {
          scriptCode : "var oasdf = {;"
      }
  );
  equal(oRequest.getScriptCode(), "var oasdf = {;", "scriptCode with { paranthesis");
  
});