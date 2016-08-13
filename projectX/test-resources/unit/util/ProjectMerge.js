jQuery.sap.require("projectX.util.Project");

QUnit.module("util/Project Merge", {
    setup: function() {
      this._oProjectRemote = new projectX.util.Project([
        {
          "identifier": 4,
          "name": "AAAA",
          "requests": [
            {
              "identifier": 1,
              "name": "req1 local",
              "revision": 1
            },
            {
              "identifier": 2,
              "name": "req2 local",
              "revision": 1
            }
          ]
        }
      ]);
    },
    teardown: function() {
        this._oProjectRemote.destroy();
    }
});

QUnit.test('instantiation', 1, function (assert) {
    assert.ok(this._oProjectRemote, "instantiation ok");
});

QUnit.test('local proj with new request, merge remote into', 2, function (assert) {
  var oProjectLocal = new projectX.util.Project([
    {
      "identifier": 4,
      "name": "AAAA",
      "requests": [
        {
          "identifier": 1,
          "name": "req1 local",
          "revision": 1
        },
        {
          "identifier": 2,
          "name": "req2 local",
          "revision": 1
        },
        {
          "identifier": 3,
          "name": "req3 local",
          "revision": 1
        }
      ]
    }
  ]);
  
  //rule: new request always stay, only if a deleted request exists then it gets deleted locally
  //expected after merging remote into local:
  // req1, req2, req3
  
});


QUnit.test('local proj with removed request, merge remote into', 2, function (assert) {
  var oProjectLocal = new projectX.util.Project([
    {
      "identifier": 4,
      "name": "AAAA",
      "requests": [
        {
          "identifier": 1,
          "name": "req1 local",
          "revision": 1
        },
        {
          "identifier": 2,
          "deleted": true,
          "revision": 2
        }
      ]
    }
  ]);

  //expected after merging remote into local:
  // req1, req2(del)
  
});



QUnit.test('remote proj with removed request, merge remote into local', 2, function (assert) {
  var oProjectRemote = new projectX.util.Project([
    {
      "identifier": 4,
      "name": "AAAA",
      "requests": [
        {
          "identifier": 1,
          "name": "req1 remote",
          "revision": 1
        },
        {
          "identifier": 2,
          "deleted": true,
          "revision": 2
        }
      ]
    }
  ]);
  var oProjectLocal = new projectX.util.Project([
    {
      "identifier": 4,
      "name": "AAAA",
      "requests": [
        {
          "identifier": 1,
          "name": "req1 local",
          "revision": 1
        },
        {
          "identifier": 2,
          "name": "req2 local",
          "revision": 1
        }
      ]
    }
  ]);

  //expected after merging remote into local:
  //req1, req2(del)
  
});




QUnit.test('remote proj changed a request, merge remote into local', 2, function (assert) {
  var oProjectRemote = new projectX.util.Project([
    {
      "identifier": 4,
      "name": "AAAA",
      "requests": [
        {
          "identifier": 1,
          "name": "req1 remote changed",
          "revision": 4
        }
      ]
    }
  ]);
  var oProjectLocal = new projectX.util.Project([
    {
      "identifier": 4,
      "name": "AAAA",
      "requests": [
        {
          "identifier": 1,
          "name": "req1 local original",
          "revision": 1
        }
      ]
    }
  ]);

  //rule: the change with the higher revision wins
  //expected after merging remote into local:
  //req1(remote changed)
  
});


