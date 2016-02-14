jQuery.sap.require("projectX.util.Assertion");

QUnit.module("util/Assertion", {
    setup: function() {
      this._oAssertion = new projectX.util.Assertion();
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


QUnit.test("resetTempData", 1, function(assert) {
	this._oAssertion.resetTempData();
});

QUnit.test("serialize", 1, function(assert) {
	this._oAssertion.serialize();
});

QUnit.test("assert", 1, function(assert) {
	this._oAssertion.assert();
});

QUnit.test("_opEquals", 1, function(assert) {
	this._oAssertion._opEquals();
});

QUnit.test("_opEqualsNot", 1, function(assert) {
	this._oAssertion._opEqualsNot();
});

QUnit.test("_opLess", 1, function(assert) {
	this._oAssertion._opLess();
});

QUnit.test("_opLessOrEqual", 1, function(assert) {
	this._oAssertion._opLessOrEqual();
});

QUnit.test("_opGreater", 1, function(assert) {
	this._oAssertion._opGreater();
});

QUnit.test("_opGreaterOrEqual", 1, function(assert) {
	this._oAssertion._opGreaterOrEqual();
});

QUnit.test("_opExists", 1, function(assert) {
	this._oAssertion._opExists();
});

QUnit.test("_opExistsNot", 1, function(assert) {
	this._oAssertion._opExistsNot();
});

QUnit.test("_opContains", 1, function(assert) {
	this._oAssertion._opContains();
});

QUnit.test("_opContainsNot", 1, function(assert) {
	this._oAssertion._opContainsNot();
});

