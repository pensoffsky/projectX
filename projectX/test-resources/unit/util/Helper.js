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


QUnit.test("createMarkdownDocuForProject", 1, function(assert) {
    var oProject = new projectX.util.Project({
        name : "proj1",
        prefixUrl : "http://prefixURL",
        csrfTokenUrl : "http://csrftokenurl"
    });
    var oRequest = oProject.addNewRequest("request1", "http://www.url.com", "POST");
    //create the assertion
    var sProperty = projectX.util.Constants.ASSERTPROPERTY_STATUS;
    var sOperation = projectX.util.Constants.ASSERTOPERATION_EQUALS; 
    var oAssertion = new projectX.util.Assertion();
    oAssertion.setAssertProperty(sProperty);
    oAssertion.setOperation(sOperation);
    oAssertion.setExpected("199");
    oRequest.addAssertion(oAssertion);
    
    var sRes = projectX.util.Helper.createMarkdownDocuForProject(oProject);
    assert.ok(sRes, "some output generated")
    console.log(sRes);
});
