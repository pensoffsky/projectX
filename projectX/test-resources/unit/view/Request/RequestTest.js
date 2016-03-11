jQuery.sap.require("projectX.util.Constants");


QUnit.module("view/Request/Request.controller", {
    setup: function() {
        //instantiate the requestview 
        //which in turn instantiates the request controller
        var oView = sap.ui.xmlview("projectX.view.Request.Request");
        this._oController = oView.getController();
    },
    
    teardown: function() {
			
    },
    
    randomString : function(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
});

QUnit.test("Instantiation", 1, function(assert) {
    assert.ok(this._oController , "Controller instance created");
});

// /////////////////////////////////////////////////////////////////////////////
// /// _prettyPrintResponseBody
// /////////////////////////////////////////////////////////////////////////////

QUnit.test("_prettyPrintResponseBody, truncate long responseBody", 2, function(assert) {
    var oModel = this._oController._localUIModel;
    
    this._oController._prettyPrintResponseBody(
        this.randomString(projectX.util.Constants.REQUEST_RESPONSEBODY_LENGTH_LIMIT + 1),
        "",
        false); //truncate
    
    var iTruncatedLength = oModel.getProperty("/responseBodyFormatted").length;
    
    assert.ok(iTruncatedLength === projectX.util.Constants.REQUEST_RESPONSEBODY_LENGTH_TRUNCATED,
         "responseBodyFormatted was truncated");
    assert.ok(oModel.getProperty("/isHugeResponseBody") === true);
});

QUnit.test("_prettyPrintResponseBody, do not truncate short responseBody", 2, function(assert) {
    var oModel = this._oController._localUIModel;
    
    this._oController._prettyPrintResponseBody(
        this.randomString(projectX.util.Constants.REQUEST_RESPONSEBODY_LENGTH_LIMIT),
        "json",
        false); //truncate
    
    var iTruncatedLength = oModel.getProperty("/responseBodyFormatted").length;
    
    assert.ok(iTruncatedLength === projectX.util.Constants.REQUEST_RESPONSEBODY_LENGTH_LIMIT,
         "responseBodyFormatted was not truncated (length is limit)");
    assert.ok(oModel.getProperty("/isHugeResponseBody") === false);
});


QUnit.test("_prettyPrintResponseBody, skip truncation on long responseBody", 2, function(assert) {
    var oModel = this._oController._localUIModel;
    
    this._oController._prettyPrintResponseBody(
        this.randomString(projectX.util.Constants.REQUEST_RESPONSEBODY_LENGTH_LIMIT + 1),
        "xml",
        true); //skip truncation
    
    var iTruncatedLength = oModel.getProperty("/responseBodyFormatted").length;
    
    assert.ok(iTruncatedLength === projectX.util.Constants.REQUEST_RESPONSEBODY_LENGTH_LIMIT + 1,
         "responseBodyFormatted was not truncated (skipped truncation))");
    assert.ok(oModel.getProperty("/isHugeResponseBody") === false);
});

// /////////////////////////////////////////////////////////////////////////////
// /// _setResponseBodyButtonMode
// /////////////////////////////////////////////////////////////////////////////

QUnit.test("_setResponseBodyButtonMode, select json button", 1, function(assert) {
    this._oController._setResponseBodyButtonMode("html");
    var oSegmentedButton = this._oController.byId("idButtonResponseFormat");
    var sSelectedButtonID = oSegmentedButton.getSelectedButton();
    assert.ok(sSelectedButtonID.indexOf("idButtonResponseHTML") > 0, "html button selected");
});