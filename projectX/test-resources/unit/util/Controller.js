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
    var spy = sinon.spy();
    this._oController._hookViewEvents = spy;
	this._oController._baseOnInit();
    assert.ok(spy.called, "hookViewEvents called");
});

QUnit.test("onInit", 1, function(assert) {
    var spy = sinon.spy();
    this._oController._hookViewEvents = spy;
	this._oController.onInit();
    assert.ok(spy.called, "hookViewEvents called");
});

QUnit.test("onExit", 1, function(assert) {    
    this._oController._busyDialog = { destroy : sinon.spy()};
    this._oController.onExit();
    assert.ok(this._oController._busyDialog.destroy.called ,"busydialog destroyed");
});

QUnit.test("_hookViewEvents", 1, function(assert) {
	var fAddViewEventDelegateSpy = sinon.spy();
    this._oController.getView = function () {
        return {
            addEventDelegate : fAddViewEventDelegateSpy
        };
    }
    
    this._oController._hookViewEvents();
    assert.ok(fAddViewEventDelegateSpy.callCount === 4, "events hooked");
});

QUnit.test("onBeforeHide", 2, function(assert) {
    assert.ok(!this._oController._bIsViewHidden, "unknown hide state");
	this._oController.onBeforeHide();
    assert.ok(this._oController._bIsViewHidden === true, "hide state");
});

QUnit.test("onAfterHide", 0, function(assert) {
    //nothing happens here
	this._oController.onAfterHide();
});

QUnit.test("onBeforeShow", 2, function(assert) {
    assert.ok(!this._oController._bIsViewHidden, "unknown hide state");
	this._oController.onBeforeShow();
    assert.ok(this._oController._bIsViewHidden === false, "no hide state");
});

QUnit.test("onAfterShow", 0, function(assert) {
    //nothing to test
	this._oController.onAfterShow();
});

// QUnit.test("getEventBus", 1, function(assert) {
// 	this._oController.getEventBus();
// });
// 
// QUnit.test("getRouter", 1, function(assert) {
// 	this._oController.getRouter();
// });

// QUnit.test("getComponent", 1, function(assert) {
// 	this._oController.getComponent();
// });

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
