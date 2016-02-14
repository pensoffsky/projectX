jQuery.sap.require("projectX.util.Controller");

QUnit.module("util/Controller", {
    setup: function() {
      this._oController = new projectX.util.Controller();
    },
    teardown: function() {
			
    }
});

QUnit.test("Instantiation", 1, function(assert) {
  var oController = new projectX.util.Controller();
  assert.ok(oController , "Controller instance created");
});

QUnit.test("_baseOnInit", 1, function(assert) {
	this._oController._baseOnInit();
});

QUnit.test("onInit", 1, function(assert) {
	this._oController.onInit();
});

QUnit.test("onExit", 1, function(assert) {
	this._oController.onExit();
});

QUnit.test("_hookViewEvents", 1, function(assert) {
	this._oController._hookViewEvents();
});

QUnit.test("onBeforeHide", 1, function(assert) {
	this._oController.onBeforeHide();
});

QUnit.test("onAfterHide", 1, function(assert) {
	this._oController.onAfterHide();
});

QUnit.test("onBeforeShow", 1, function(assert) {
	this._oController.onBeforeShow();
});

QUnit.test("onAfterShow", 1, function(assert) {
	this._oController.onAfterShow();
});

QUnit.test("getEventBus", 1, function(assert) {
	this._oController.getEventBus();
});

QUnit.test("getRouter", 1, function(assert) {
	this._oController.getRouter();
});

QUnit.test("getComponent", 1, function(assert) {
	this._oController.getComponent();
});

QUnit.test("updateMasterList", 1, function(assert) {
	this._oController.updateMasterList();
});

QUnit.test("getCurrentProject", 1, function(assert) {
	this._oController.getCurrentProject();
});

QUnit.test("triggerWithInputDelay", 1, function(assert) {
	this._oController.triggerWithInputDelay();
});

QUnit.test("showSuccessMessage", 1, function(assert) {
	this._oController.showSuccessMessage();
});

QUnit.test("navToRequest", 1, function(assert) {
	this._oController.navToRequest();
});

QUnit.test("navToRequestNotFound", 1, function(assert) {
	this._oController.navToRequestNotFound();
});
