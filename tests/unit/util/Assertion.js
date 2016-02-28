jQuery.sap.require("projectX.util.Assertion");

QUnit.module("util/Assertion", {
    setup: function() {
      this._oAssertion = new projectX.util.Assertion({
          "name": "",
          "assertProperty": "STATUS",
          "operation": "EQUALS",
          "path": "",
          "expected": "201"
        });
    },
    teardown: function() {
			
    }
});

QUnit.test("Instantiation", 1, function(assert) {
  var oAssertion = new projectX.util.Assertion();
  assert.ok(oAssertion , "Assertion instance created");
});


QUnit.test("createDefaultAssertion", 1, function(assert) {
  var oAssertion = projectX.util.Assertion.createDefaultAssertion();
  assert.ok(oAssertion , "createDefaultAssertion");
});


QUnit.test("resetTempData", 3, function(assert) {
    //set temporary data
    this._oAssertion.setEvaluatedValue("string1");
    this._oAssertion.setResult(true);
    this._oAssertion.setResultReady(true);
    
	this._oAssertion.resetTempData();
    
    //check that data was resetted to default values
    assert.equal(this._oAssertion.getEvaluatedValue(), "","EvaluatedValue is empty");
    assert.equal(this._oAssertion.getResult(), false,"Result is empty");
    assert.equal(this._oAssertion.getResultReady(), false,"ResultReady is empty");
});

QUnit.test("serialize", 5, function(assert) {
	var oSerialized = this._oAssertion.serialize();
    assert.equal(oSerialized.name, this._oAssertion.getName(), "name serialized");
    assert.equal(oSerialized.assertProperty, this._oAssertion.getAssertProperty(), "assertProperty serialized");
    assert.equal(oSerialized.operation, this._oAssertion.getOperation(), "operation serialized");
    assert.equal(oSerialized.path, this._oAssertion.getPath(), "path serialized");
    assert.equal(oSerialized.expected, this._oAssertion.getExpected(), "expected serialized");
});

QUnit.test("assert", 3, function(assert) {
    var iStatus = 200;
    var sResponseBody = "myResponse";
    var sResponseHeaders = "Content-Type: application/json;charset=utf-8";
    var iResponseTime = 480;
    var sSapStatistics = "";

    this._oAssertion.assert(iStatus, sResponseBody, sResponseHeaders, iResponseTime, sSapStatistics);
    assert.equal(this._oAssertion.getResultReady(), true, "Result is ready");
    assert.equal(this._oAssertion.getResult(), false, "Result false");
    
    iStatus = 201;
    this._oAssertion.assert(iStatus, sResponseBody, sResponseHeaders, iResponseTime, sSapStatistics);
    assert.equal(this._oAssertion.getResult(), true, "Result true");
    
    //TODO test more cases
});

QUnit.test("_opEquals", 2, function(assert) {
    assert.equal(this._oAssertion._opEquals("ab", "ab"), true, "ok");
    assert.equal(this._oAssertion._opEquals("a", "ab"), false, "ok");
});

QUnit.test("_opEqualsNot", 2, function(assert) {
    assert.equal(this._oAssertion._opEqualsNot("ab", "ab"), false, "ok");
    assert.equal(this._oAssertion._opEqualsNot("a", "ab"), true, "ok");
});

QUnit.test("_opLess", 2, function(assert) {
    assert.equal(this._oAssertion._opLess("100", "120"), true, "ok");
    assert.equal(this._oAssertion._opLess("120", "100"), false, "ok");
});

QUnit.test("_opLessOrEqual", 3, function(assert) {
    assert.equal(this._oAssertion._opLessOrEqual("100", "120"), true, "ok");
    assert.equal(this._oAssertion._opLessOrEqual("120", "100"), false, "ok");
    assert.equal(this._oAssertion._opLessOrEqual("100", "100"), true, "ok");
});

QUnit.test("_opGreater", 2, function(assert) {
    assert.equal(this._oAssertion._opGreater("100", "120"), false, "ok");
    assert.equal(this._oAssertion._opGreater("120", "100"), true, "ok");
});

QUnit.test("_opGreaterOrEqual", 3, function(assert) {
    assert.equal(this._oAssertion._opGreaterOrEqual("100", "120"), false, "ok");
    assert.equal(this._oAssertion._opGreaterOrEqual("120", "100"), true, "ok");
    assert.equal(this._oAssertion._opGreaterOrEqual("100", "100"), true, "ok");
});

QUnit.test("_opExists", 2, function(assert) {
    assert.equal(this._oAssertion._opExists("llo wo", undefined), true, "ok");
    assert.equal(this._oAssertion._opExists("", undefined), false, "ok");
});

QUnit.test("_opExistsNot", 2, function(assert) {
    assert.equal(this._oAssertion._opExistsNot("llo wo", undefined), false, "ok");
    assert.equal(this._oAssertion._opExistsNot("", undefined), true, "ok");
});

QUnit.test("_opContains", 2, function(assert) {
    assert.equal(this._oAssertion._opContains("hello world", "llo wo"), true, "ok");
    assert.equal(this._oAssertion._opContains("hello world", "wirld"), false, "ok");
});

QUnit.test("_opContainsNot", 2, function(assert) {
    assert.equal(this._oAssertion._opContainsNot("hello world", "llo wo"), false, "ok");
    assert.equal(this._oAssertion._opContainsNot("hello world", "wirld"), true, "ok");
});

