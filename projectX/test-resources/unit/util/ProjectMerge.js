jQuery.sap.require("projectX.util.Project");

QUnit.module("util/ProjectMerge", {
    setup: function() {
        
    },
    teardown: function() {
        
    }
});

QUnit.test("CompareRequests : local project exists, user wants to get the updated requests", function(assert) {

	var base = [{
		uuid : "1",
		name : "name A",
		identifier : 1
	}, {
		uuid : "2",
		name : "name B",
		identifier : 2
	}];
	
	var local = [{
		uuid : "1",
		name : "name A",
		identifier : 1
	}, {
		uuid : "2",
		name : "name Changed",
		identifier : 2
	}];
	
	var expected = {
		changed : [{
		uuid : "2",
		name : "name Changed",
		identifier : 2
	}],
		added : [],
		unchanged : [{
		uuid : "1",
		name : "name A",
		identifier : 1
	}]
	};
	
	var project = new projectX.util.Project();
	
	assert.deepEqual(project.compareRequests(local, base), expected, "Correct array returned with changed requests");
	
});

QUnit.test("CompareRequests : Added new Request to local project", function(assert) {

	var base = [{
		uuid : "1",
		name : "name A",
		identifier : 1
	}, {
		uuid : "2",
		name : "name B",
		identifier : 2
	}];
	
	var local = [{
		uuid : "1",
		name : "name A",
		identifier : 1
	}, {
		uuid : "2",
		name : "name B",
		identifier : 2
	}, {
		uuid : "3",
		name : "name C",
		identifier : 3
	}];
	
	var expected = {
		changed : [],
		added : [{
			uuid : "3",
			name : "name C",
			identifier : 3
		}],
		unchanged : [{
			uuid : "1",
			name : "name A",
			identifier : 1
		}, {
			uuid : "2",
			name : "name B",
			identifier : 2
		}]
	};
	
	var project = new projectX.util.Project();
	
	assert.deepEqual(project.compareRequests(local, base), expected, "Correct array returned with new requests");
	
});

QUnit.test("Merge : Changed Request from remote project to local project", function(assert) {
	
	var aRequestBase = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}, {
		uuid : "2",
		name : "Request B",
		identifier : 2
	}];
	
	var aRequestLocal = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}, {
		uuid : "2",
		name : "Request B",
		identifier : 2
	}];
	
	var aRequestRemote = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}, {
		uuid : "2",
		name : "UPDATED Request B",
		identifier : 2
	}];
	
	var expected = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}, {
		uuid : "2",
		name : "UPDATED Request B",
		identifier : 2
	}];
	
	var project = new projectX.util.Project();
	
	assert.deepEqual(project.mergeLogic(aRequestBase, aRequestLocal, aRequestRemote), expected, "Correct array returned with updated requests");
	
});

QUnit.test("Merge : Changed Request from LOCAL project", function(assert) {

	var aRequestBase = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}, {
		uuid : "2",
		name : "Request B",
		identifier : 2
	}];
	
	var aRequestLocal = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}, {
		uuid : "2",
		name : "[UPDATED] Request B",
		identifier : 2
	}];
	
	var aRequestRemote = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}, {
		uuid : "2",
		name : "Request B",
		identifier : 2
	}];
	
	var expected = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}, {
		uuid : "2",
		name : "[UPDATED] Request B",
		identifier : 2
	}];
	
	var project = new projectX.util.Project();
	
	assert.deepEqual(project.mergeLogic(aRequestBase, aRequestLocal, aRequestRemote), expected, "Correct array returned with updated requests");
	
});

QUnit.test("Merge : Changed Request from REMOTE project", function(assert) {

	var aRequestBase = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}, {
		uuid : "2",
		name : "Request B",
		identifier : 2
	}];
	
	var aRequestLocal = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}, {
		uuid : "2",
		name : "Request B",
		identifier : 2
	}];
	
	var aRequestRemote = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}, {
		uuid : "2",
		name : "[UPDATED] Request B",
		identifier : 2
	}];
	
	var expected = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}, {
		uuid : "2",
		name : "[UPDATED] Request B",
		identifier : 2
	}];
	
	var project = new projectX.util.Project();
	
	assert.deepEqual(project.mergeLogic(aRequestBase, aRequestLocal, aRequestRemote), expected, "Correct array returned with updated requests");
	
});

QUnit.test("Merge : A request has been created locally", function(assert) {
	
	var aRequestBase = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}];
	
	var aRequestLocal = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}, {
		uuid : "2",
		name : "NEW Request B",
		identifier : 2
	}];
	
	var aRequestRemote = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}];
	
	
	var expected = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}, {
		uuid : "2",
		name : "NEW Request B",
		identifier : 2
	}];
	
	var project = new projectX.util.Project();
	
	assert.deepEqual(project.mergeLogic(aRequestBase, aRequestLocal, aRequestRemote), expected, "Correct array returned with updated requests");
	
});

QUnit.test("Merge : A request has been created remotely", function(assert) {
	
	var aRequestBase = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}];
	
	var aRequestLocal = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}];
	
	var aRequestRemote = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}, {
		uuid : "2",
		name : "NEW Request B",
		identifier : 2
	}];
	
	var expected = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}, {
		uuid : "2",
		name : "NEW Request B",
		identifier : 2
	}];
	
	var project = new projectX.util.Project();
	
	assert.deepEqual(project.mergeLogic(aRequestBase, aRequestLocal, aRequestRemote), expected, "Correct array returned with updated requests");
	
});

QUnit.test("Merge : A request has been removed locally", function(assert) {
	
	var aRequestBase = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}, {
		uuid : "2",
		name : "Request B",
		identifier : 2
	}];
	
	var aRequestLocal = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}];
	
	var aRequestRemote = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}, {
		uuid : "2",
		name : "Request B",
		identifier : 2
	}];
	
	var expected = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}];
	
	var project = new projectX.util.Project();
	
	assert.deepEqual(project.mergeLogic(aRequestBase, aRequestLocal, aRequestRemote), expected, "Correct array returned with updated requests");
	
});

QUnit.test("Merge : A request has been removed remotely", function(assert) {
	
	var aRequestBase = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}, {
		uuid : "2",
		name : "Request B",
		identifier : 2
	}];
	
	var aRequestLocal = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}, {
		uuid : "2",
		name : "Request B",
		identifier : 2
	}];
	
	var aRequestRemote = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}];
	
	var expected = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}];
	
	var project = new projectX.util.Project();
	
	assert.deepEqual(project.mergeLogic(aRequestBase, aRequestLocal, aRequestRemote), expected, "Correct array returned with updated requests");
	
});

QUnit.test("Merge : A request has been removed remotely", function(assert) {
	
	var aRequestBase = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}, {
		uuid : "2",
		name : "Request B",
		identifier : 2
	}];
	
	var aRequestLocal = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}, {
		uuid : "2",
		name : "Request B",
		identifier : 2
	}];
	
	var aRequestRemote = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}];
	
	var expected = [{
		uuid : "1",
		name : "Request A",
		identifier : 1
	}];
	
	var project = new projectX.util.Project({
		uuid:"asdf"
	});
	project.mergeBlaBlub = sinon.spy();
	project.merge();
	assert.ok(project.mergeBlaBlub.called === true, "project.mergeBlaBlub was called");
	
	
	//temp.data[0].sha;
	var oCommitResults = {
		
	};
	
	var oDummyRepo = {
		listCommits: sinon.stub().returns({
			then: function(fnDingens){
				fnDingens(oCommitResults);
			}
		})
	};
	var fnMergeCallback = sinon.spy();
	
	
	
	
	
	project.merge(oDummyRepo, fnMergeCallback);
	
	var oMergeCallbackArgs = fnMergeCallback.args[0];
	//TODO check oMergeCallbackArgs
	assert.ok(fnMergeCallback.called === true, "mege callback was called");
	
});