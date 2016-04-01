jQuery.sap.require("projectX.util.Project");

QUnit.module("util/Project", {
    setup: function() {
        
    },
    teardown: function() {
        
    }
});

QUnit.test('instantiation', 1, function (assert) {
    var oProject = new projectX.util.Project({
        name : "proj1",
        url : "http://www.url1.com",
        scriptCode : "asdf = bla;"
    });
    assert.ok(oProject, "instantiation ok");
});

QUnit.test('create new request in project with prefixUrl', 2, function (assert) {
    var oProject = new projectX.util.Project({
        prefixUrl : "http://www.url1.com"
    });
    oProject.addNewRequest();
    var aRequests = oProject.getRequests();
    assert.ok(aRequests.length === 1, "1 request added to project");
    assert.ok(aRequests[0].getUseProjectPrefixUrl(), "useProjectPrefixUrl was set");
});

QUnit.test('create new request in project without prefixUrl', 2, function (assert) {
    var oProject = new projectX.util.Project({});
    oProject.addNewRequest();
    var aRequests = oProject.getRequests();
    assert.ok(aRequests.length === 1, "1 request added to project");
    assert.ok(!aRequests[0].getUseProjectPrefixUrl(), "useProjectPrefixUrl was not set");
});
