jQuery.sap.require("projectX.util.Constants");
jQuery.sap.require("projectX.view.Request.AssertionEditListController");


QUnit.module("view/Request/AssertionEditListController", {
    setup: function() {
        
      this._oController = projectX.view.Request.AssertionEditListController.create(
          function () {},
          "dummyID", //id for the fragment
          { addItem: function (oView) {}} //container 
        );
      this._oController.setSelectedRequest(new projectX.util.Request());
    },
    
    teardown: function() {
      //destroy the fragment to prevent duplicate id issues
			this._oController.getView().destroy(true);
    }
});

QUnit.test("Instantiation", 1, function(assert) {
    assert.ok(this._oController , "Controller instance created");
});

QUnit.test("formatAssertProperty2PathEnable, check formatter", 7, function(assert) {
    var bRes;
    bRes = this._oController.formatAssertProperty2PathEnable(projectX.util.Constants.ASSERTPROPERTY_STATUS);
    assert.ok(!bRes, "for status field is disabled");
    bRes = this._oController.formatAssertProperty2PathEnable(projectX.util.Constants.ASSERTPROPERTY_RESPONSEBODY);
    assert.ok(!bRes, "for RESPONSEBODY field is disabled");
    bRes = this._oController.formatAssertProperty2PathEnable(projectX.util.Constants.ASSERTPROPERTY_HEADER);
    assert.ok(!bRes, "for HEADER field is disabled");
    bRes = this._oController.formatAssertProperty2PathEnable(projectX.util.Constants.ASSERTPROPERTY_JSONBODY);
    assert.ok(bRes, "for JSONBODY field is enabled");
    bRes = this._oController.formatAssertProperty2PathEnable(projectX.util.Constants.ASSERTPROPERTY_XMLBODY);
    assert.ok(bRes, "for XMLBODY field is enabled");
    bRes = this._oController.formatAssertProperty2PathEnable(projectX.util.Constants.ASSERTPROPERTY_RESPONSETIME);
    assert.ok(!bRes, "for RESPONSETIME field is disabled");
    bRes = this._oController.formatAssertProperty2PathEnable(projectX.util.Constants.ASSERTPROPERTY_SAPSTATISTICS);
    assert.ok(bRes, "for SAPSTATISTICS field is enabled");
});

QUnit.test("formatAssertProperty2PathPlaceholder, check formatter", 3, function(assert) {
    var sRes;
    sRes = this._oController.formatAssertProperty2PathPlaceholder(projectX.util.Constants.ASSERTPROPERTY_JSONBODY);
    assert.ok(sRes === "JsonPath", "placeholder for path field is: " + sRes);
    sRes = this._oController.formatAssertProperty2PathPlaceholder(projectX.util.Constants.ASSERTPROPERTY_XMLBODY);
    assert.ok(sRes === "XPath", "placeholder for path field is: " + sRes);
    sRes = this._oController.formatAssertProperty2PathPlaceholder(projectX.util.Constants.ASSERTPROPERTY_SAPSTATISTICS);
    assert.ok(sRes === "Field", "placeholder for path field is: " + sRes);
});

QUnit.test("adding an assertion triggers the change event", 1, function(assert) {
  var onChangeSpy = sinon.spy();
  var oController = projectX.view.Request.AssertionEditListController.create(
      onChangeSpy,
      "someID", //id for the fragment
      { addItem: function (oView) {}} //container 
    );
    oController.setSelectedRequest(new projectX.util.Request());
    oController.onBtnExecuteAssertion();
    oController.onBtnAddAssertion();
    assert.ok(onChangeSpy.calledTwice, "change event was called twice");
});