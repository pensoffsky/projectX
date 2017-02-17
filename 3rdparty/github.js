! function(e) {
	if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
	else if ("function" == typeof define && define.amd) define([], e);
	else {
		var t;
		t = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, t.GitHub =
			e()
	}
}(function() {
	var e;
	return function t(e, r, n) {
		function o(s, u) {
			if (!r[s]) {
				if (!e[s]) {
					var a = "function" == typeof require && require;
					if (!u && a) return a(s, !0);
					if (i) return i(s, !0);
					var f = new Error("Cannot find module '" + s + "'");
					throw f.code = "MODULE_NOT_FOUND", f
				}
				var c = r[s] = {
					exports: {}
				};
				e[s][0].call(c.exports, function(t) {
					var r = e[s][1][t];
					return o(r ? r : t)
				}, c, c.exports, t, e, r, n)
			}
			return r[s].exports
		}
		for (var i = "function" == typeof require && require, s = 0; s < n.length; s++) o(n[s]);
		return o
	}({
		1: [function(t, r, n) {
			! function(o, i) {
				if ("function" == typeof e && e.amd) e(["module", "./Requestable"], i);
				else if ("undefined" != typeof n) i(r, t("./Requestable"));
				else {
					var s = {
						exports: {}
					};
					i(s, o.Requestable), o.Gist = s.exports
				}
			}(this, function(e, t) {
				"use strict";

				function r(e) {
					return e && e.__esModule ? e : {
						"default": e
					}
				}

				function n(e, t) {
					if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
				}

				function o(e, t) {
					if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
					return !t || "object" != typeof t && "function" != typeof t ? e : t
				}

				function i(e, t) {
					if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " +
						typeof t);
					e.prototype = Object.create(t && t.prototype, {
						constructor: {
							value: e,
							enumerable: !1,
							writable: !0,
							configurable: !0
						}
					}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
				}
				var s = r(t),
					u = function() {
						function e(e, t) {
							for (var r = 0; r < t.length; r++) {
								var n = t[r];
								n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
							}
						}
						return function(t, r, n) {
							return r && e(t.prototype, r), n && e(t, n), t
						}
					}(),
					a = function(e) {
						function t(e, r, i) {
							n(this, t);
							var s = o(this, Object.getPrototypeOf(t).call(this, r, i));
							return s.__id = e, s
						}
						return i(t, e), u(t, [{
							key: "read",
							value: function(e) {
								return this._request("GET", "/gists/" + this.__id, null, e)
							}
						}, {
							key: "create",
							value: function(e, t) {
								var r = this;
								return this._request("POST", "/gists", e, t).then(function(e) {
									return r.__id = e.data.id, e
								})
							}
						}, {
							key: "delete",
							value: function(e) {
								return this._request("DELETE", "/gists/" + this.__id, null, e)
							}
						}, {
							key: "fork",
							value: function(e) {
								return this._request("POST", "/gists/" + this.__id + "/forks", null, e)
							}
						}, {
							key: "update",
							value: function(e, t) {
								return this._request("PATCH", "/gists/" + this.__id, e, t)
							}
						}, {
							key: "star",
							value: function(e) {
								return this._request("PUT", "/gists/" + this.__id + "/star", null, e)
							}
						}, {
							key: "unstar",
							value: function(e) {
								return this._request("DELETE", "/gists/" + this.__id + "/star", null, e)
							}
						}, {
							key: "isStarred",
							value: function(e) {
								return this._request204or404("/gists/" + this.__id + "/star", null, e)
							}
						}, {
							key: "listComments",
							value: function(e) {
								return this._requestAllPages("/gists/" + this.__id + "/comments", null, e)
							}
						}, {
							key: "getComment",
							value: function(e, t) {
								return this._request("GET", "/gists/" + this.__id + "/comments/" + e, null, t)
							}
						}, {
							key: "createComment",
							value: function(e, t) {
								return this._request("POST", "/gists/" + this.__id + "/comments", {
									body: e
								}, t)
							}
						}, {
							key: "editComment",
							value: function(e, t, r) {
								return this._request("PATCH", "/gists/" + this.__id + "/comments/" + e, {
									body: t
								}, r)
							}
						}, {
							key: "deleteComment",
							value: function(e, t) {
								return this._request("DELETE", "/gists/" + this.__id + "/comments/" + e, null, t)
							}
						}]), t
					}(s["default"]);
				e.exports = a
			})
		}, {
			"./Requestable": 8
		}],
		2: [function(t, r, n) {
			! function(o, i) {
				if ("function" == typeof e && e.amd) e(["module", "./Gist", "./User", "./Issue", "./Search", "./RateLimit", "./Repository",
					"./Organization", "./Team", "./Markdown"
				], i);
				else if ("undefined" != typeof n) i(r, t("./Gist"), t("./User"), t("./Issue"), t("./Search"), t("./RateLimit"), t("./Repository"),
					t("./Organization"), t("./Team"), t("./Markdown"));
				else {
					var s = {
						exports: {}
					};
					i(s, o.Gist, o.User, o.Issue, o.Search, o.RateLimit, o.Repository, o.Organization, o.Team, o.Markdown), o.GitHub = s.exports
				}
			}(this, function(e, t, r, n, o, i, s, u, a, f) {
				"use strict";

				function c(e) {
					return e && e.__esModule ? e : {
						"default": e
					}
				}

				function l(e, t) {
					if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
				}
				var h = c(t),
					p = c(r),
					d = c(n),
					y = c(o),
					_ = c(i),
					g = c(s),
					m = c(u),
					v = c(a),
					b = c(f),
					w = function() {
						function e(e, t) {
							for (var r = 0; r < t.length; r++) {
								var n = t[r];
								n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
							}
						}
						return function(t, r, n) {
							return r && e(t.prototype, r), n && e(t, n), t
						}
					}(),
					E = function() {
						function e(t) {
							var r = arguments.length <= 1 || void 0 === arguments[1] ? "https://api.github.com" : arguments[1];
							l(this, e), this.__apiBase = r, this.__auth = t || {}
						}
						return w(e, [{
							key: "getGist",
							value: function(e) {
								return new h["default"](e, this.__auth, this.__apiBase)
							}
						}, {
							key: "getUser",
							value: function(e) {
								return new p["default"](e, this.__auth, this.__apiBase)
							}
						}, {
							key: "getOrganization",
							value: function(e) {
								return new m["default"](e, this.__auth, this.__apiBase)
							}
						}, {
							key: "getTeam",
							value: function(e) {
								return new v["default"](e, this.__auth, this.__apiBase)
							}
						}, {
							key: "getRepo",
							value: function(e, t) {
								return new g["default"](this._getFullName(e, t), this.__auth, this.__apiBase)
							}
						}, {
							key: "getIssues",
							value: function(e, t) {
								return new d["default"](this._getFullName(e, t), this.__auth, this.__apiBase)
							}
						}, {
							key: "search",
							value: function(e) {
								return new y["default"](e, this.__auth, this.__apiBase)
							}
						}, {
							key: "getRateLimit",
							value: function() {
								return new _["default"](this.__auth, this.__apiBase)
							}
						}, {
							key: "getMarkdown",
							value: function() {
								return new b["default"](this.__auth, this.__apiBase)
							}
						}, {
							key: "_getFullName",
							value: function(e, t) {
								var r = e;
								return t && (r = e + "/" + t), r
							}
						}]), e
					}();
				e.exports = E
			})
		}, {
			"./Gist": 1,
			"./Issue": 3,
			"./Markdown": 4,
			"./Organization": 5,
			"./RateLimit": 6,
			"./Repository": 7,
			"./Search": 9,
			"./Team": 10,
			"./User": 11
		}],
		3: [function(t, r, n) {
			! function(o, i) {
				if ("function" == typeof e && e.amd) e(["module", "./Requestable"], i);
				else if ("undefined" != typeof n) i(r, t("./Requestable"));
				else {
					var s = {
						exports: {}
					};
					i(s, o.Requestable), o.Issue = s.exports
				}
			}(this, function(e, t) {
				"use strict";

				function r(e) {
					return e && e.__esModule ? e : {
						"default": e
					}
				}

				function n(e, t) {
					if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
				}

				function o(e, t) {
					if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
					return !t || "object" != typeof t && "function" != typeof t ? e : t
				}

				function i(e, t) {
					if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " +
						typeof t);
					e.prototype = Object.create(t && t.prototype, {
						constructor: {
							value: e,
							enumerable: !1,
							writable: !0,
							configurable: !0
						}
					}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
				}
				var s = r(t),
					u = function() {
						function e(e, t) {
							for (var r = 0; r < t.length; r++) {
								var n = t[r];
								n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
							}
						}
						return function(t, r, n) {
							return r && e(t.prototype, r), n && e(t, n), t
						}
					}(),
					a = function(e) {
						function t(e, r, i) {
							n(this, t);
							var s = o(this, Object.getPrototypeOf(t).call(this, r, i));
							return s.__repository = e, s
						}
						return i(t, e), u(t, [{
							key: "createIssue",
							value: function(e, t) {
								return this._request("POST", "/repos/" + this.__repository + "/issues", e, t)
							}
						}, {
							key: "listIssues",
							value: function(e, t) {
								return this._requestAllPages("/repos/" + this.__repository + "/issues", e, t)
							}
						}, {
							key: "listIssueEvents",
							value: function(e, t) {
								return this._request("GET", "/repos/" + this.__repository + "/issues/" + e + "/events", null, t)
							}
						}, {
							key: "listIssueComments",
							value: function(e, t) {
								return this._request("GET", "/repos/" + this.__repository + "/issues/" + e + "/comments", null, t)
							}
						}, {
							key: "getIssueComment",
							value: function(e, t) {
								return this._request("GET", "/repos/" + this.__repository + "/issues/comments/" + e, null, t)
							}
						}, {
							key: "createIssueComment",
							value: function(e, t, r) {
								return this._request("POST", "/repos/" + this.__repository + "/issues/" + e + "/comments", {
									body: t
								}, r)
							}
						}, {
							key: "editIssueComment",
							value: function(e, t, r) {
								return this._request("PATCH", "/repos/" + this.__repository + "/issues/comments/" + e, {
									body: t
								}, r)
							}
						}, {
							key: "deleteIssueComment",
							value: function(e, t) {
								return this._request("DELETE", "/repos/" + this.__repository + "/issues/comments/" + e, null, t)
							}
						}, {
							key: "editIssue",
							value: function(e, t, r) {
								return this._request("PATCH", "/repos/" + this.__repository + "/issues/" + e, t, r)
							}
						}, {
							key: "getIssue",
							value: function(e, t) {
								return this._request("GET", "/repos/" + this.__repository + "/issues/" + e, null, t)
							}
						}, {
							key: "listMilestones",
							value: function(e, t) {
								return this._request("GET", "/repos/" + this.__repository + "/milestones", e, t)
							}
						}, {
							key: "getMilestone",
							value: function(e, t) {
								return this._request("GET", "/repos/" + this.__repository + "/milestones/" + e, null, t)
							}
						}, {
							key: "createMilestone",
							value: function(e, t) {
								return this._request("POST", "/repos/" + this.__repository + "/milestones", e, t)
							}
						}, {
							key: "editMilestone",
							value: function(e, t, r) {
								return this._request("PATCH", "/repos/" + this.__repository + "/milestones/" + e, t, r)
							}
						}, {
							key: "deleteMilestone",
							value: function(e, t) {
								return this._request("DELETE", "/repos/" + this.__repository + "/milestones/" + e, null, t)
							}
						}]), t
					}(s["default"]);
				e.exports = a
			})
		}, {
			"./Requestable": 8
		}],
		4: [function(t, r, n) {
			! function(o, i) {
				if ("function" == typeof e && e.amd) e(["module", "./Requestable"], i);
				else if ("undefined" != typeof n) i(r, t("./Requestable"));
				else {
					var s = {
						exports: {}
					};
					i(s, o.Requestable), o.Markdown = s.exports
				}
			}(this, function(e, t) {
				"use strict";

				function r(e) {
					return e && e.__esModule ? e : {
						"default": e
					}
				}

				function n(e, t) {
					if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
				}

				function o(e, t) {
					if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
					return !t || "object" != typeof t && "function" != typeof t ? e : t
				}

				function i(e, t) {
					if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " +
						typeof t);
					e.prototype = Object.create(t && t.prototype, {
						constructor: {
							value: e,
							enumerable: !1,
							writable: !0,
							configurable: !0
						}
					}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
				}
				var s = r(t),
					u = function() {
						function e(e, t) {
							for (var r = 0; r < t.length; r++) {
								var n = t[r];
								n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
							}
						}
						return function(t, r, n) {
							return r && e(t.prototype, r), n && e(t, n), t
						}
					}(),
					a = function(e) {
						function t(e, r) {
							return n(this, t), o(this, Object.getPrototypeOf(t).call(this, e, r))
						}
						return i(t, e), u(t, [{
							key: "render",
							value: function(e, t) {
								return this._request("POST", "/markdown", e, t)
							}
						}]), t
					}(s["default"]);
				e.exports = a
			})
		}, {
			"./Requestable": 8
		}],
		5: [function(t, r, n) {
			! function(o, i) {
				if ("function" == typeof e && e.amd) e(["module", "./Requestable"], i);
				else if ("undefined" != typeof n) i(r, t("./Requestable"));
				else {
					var s = {
						exports: {}
					};
					i(s, o.Requestable), o.Organization = s.exports
				}
			}(this, function(e, t) {
				"use strict";

				function r(e) {
					return e && e.__esModule ? e : {
						"default": e
					}
				}

				function n(e, t) {
					if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
				}

				function o(e, t) {
					if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
					return !t || "object" != typeof t && "function" != typeof t ? e : t
				}

				function i(e, t) {
					if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " +
						typeof t);
					e.prototype = Object.create(t && t.prototype, {
						constructor: {
							value: e,
							enumerable: !1,
							writable: !0,
							configurable: !0
						}
					}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
				}
				var s = r(t),
					u = function() {
						function e(e, t) {
							for (var r = 0; r < t.length; r++) {
								var n = t[r];
								n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
							}
						}
						return function(t, r, n) {
							return r && e(t.prototype, r), n && e(t, n), t
						}
					}(),
					a = function(e) {
						function t(e, r, i) {
							n(this, t);
							var s = o(this, Object.getPrototypeOf(t).call(this, r, i));
							return s.__name = e, s
						}
						return i(t, e), u(t, [{
							key: "createRepo",
							value: function(e, t) {
								return this._request("POST", "/orgs/" + this.__name + "/repos", e, t)
							}
						}, {
							key: "getRepos",
							value: function(e) {
								var t = this._getOptionsWithDefaults({
									direction: "desc"
								});
								return this._requestAllPages("/orgs/" + this.__name + "/repos", t, e)
							}
						}, {
							key: "isMember",
							value: function(e, t) {
								return this._request204or404("/orgs/" + this.__name + "/members/" + e, null, t)
							}
						}, {
							key: "listMembers",
							value: function(e, t) {
								return this._request("GET", "/orgs/" + this.__name + "/members", e, t)
							}
						}, {
							key: "getTeams",
							value: function(e) {
								return this._requestAllPages("/orgs/" + this.__name + "/teams", void 0, e)
							}
						}, {
							key: "createTeam",
							value: function(e, t) {
								return this._request("POST", "/orgs/" + this.__name + "/teams", e, t)
							}
						}]), t
					}(s["default"]);
				e.exports = a
			})
		}, {
			"./Requestable": 8
		}],
		6: [function(t, r, n) {
			! function(o, i) {
				if ("function" == typeof e && e.amd) e(["module", "./Requestable"], i);
				else if ("undefined" != typeof n) i(r, t("./Requestable"));
				else {
					var s = {
						exports: {}
					};
					i(s, o.Requestable), o.RateLimit = s.exports
				}
			}(this, function(e, t) {
				"use strict";

				function r(e) {
					return e && e.__esModule ? e : {
						"default": e
					}
				}

				function n(e, t) {
					if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
				}

				function o(e, t) {
					if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
					return !t || "object" != typeof t && "function" != typeof t ? e : t
				}

				function i(e, t) {
					if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " +
						typeof t);
					e.prototype = Object.create(t && t.prototype, {
						constructor: {
							value: e,
							enumerable: !1,
							writable: !0,
							configurable: !0
						}
					}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
				}
				var s = r(t),
					u = function() {
						function e(e, t) {
							for (var r = 0; r < t.length; r++) {
								var n = t[r];
								n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
							}
						}
						return function(t, r, n) {
							return r && e(t.prototype, r), n && e(t, n), t
						}
					}(),
					a = function(e) {
						function t(e, r) {
							return n(this, t), o(this, Object.getPrototypeOf(t).call(this, e, r))
						}
						return i(t, e), u(t, [{
							key: "getRateLimit",
							value: function(e) {
								return this._request("GET", "/rate_limit", null, e)
							}
						}]), t
					}(s["default"]);
				e.exports = a
			})
		}, {
			"./Requestable": 8
		}],
		7: [function(t, r, n) {
			(function(o) {
				! function(o, i) {
					if ("function" == typeof e && e.amd) e(["module", "./Requestable", "utf8", "js-base64", "debug"], i);
					else if ("undefined" != typeof n) i(r, t("./Requestable"), t("utf8"), t("js-base64"), t("debug"));
					else {
						var s = {
							exports: {}
						};
						i(s, o.Requestable, o.utf8, o.jsBase64, o.debug), o.Repository = s.exports
					}
				}(this, function(e, t, r, n, i) {
					"use strict";

					function s(e) {
						return e && e.__esModule ? e : {
							"default": e
						}
					}

					function u(e, t) {
						if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
					}

					function a(e, t) {
						if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
						return !t || "object" != typeof t && "function" != typeof t ? e : t
					}

					function f(e, t) {
						if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " +
							typeof t);
						e.prototype = Object.create(t && t.prototype, {
							constructor: {
								value: e,
								enumerable: !1,
								writable: !0,
								configurable: !0
							}
						}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
					}
					var c = s(t),
						l = s(r),
						h = s(i),
						p = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
							return typeof e
						} : function(e) {
							return e && "function" == typeof Symbol && e.constructor === Symbol ? "symbol" : typeof e
						},
						d = function() {
							function e(e, t) {
								for (var r = 0; r < t.length; r++) {
									var n = t[r];
									n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key,
										n)
								}
							}
							return function(t, r, n) {
								return r && e(t.prototype, r), n && e(t, n), t
							}
						}(),
						y = (0, h["default"])("github:repository"),
						_ = function(e) {
							function t(e, r, n) {
								u(this, t);
								var o = a(this, Object.getPrototypeOf(t).call(this, r, n));
								return o.__fullname = e, o.__currentTree = {
									branch: null,
									sha: null
								}, o
							}
							return f(t, e), d(t, [{
								key: "getRef",
								value: function(e, t) {
									return this._request("GET", "/repos/" + this.__fullname + "/git/refs/" + e, null, t)
								}
							}, {
								key: "createRef",
								value: function(e, t) {
									return this._request("POST", "/repos/" + this.__fullname + "/git/refs", e, t)
								}
							}, {
								key: "deleteRef",
								value: function(e, t) {
									return this._request("DELETE", "/repos/" + this.__fullname + "/git/refs/" + e, null, t)
								}
							}, {
								key: "deleteRepo",
								value: function(e) {
									return this._request("DELETE", "/repos/" + this.__fullname, null, e)
								}
							}, {
								key: "listTags",
								value: function(e) {
									return this._request("GET", "/repos/" + this.__fullname + "/tags", null, e)
								}
							}, {
								key: "listPullRequests",
								value: function(e, t) {
									return e = e || {}, this._request("GET", "/repos/" + this.__fullname + "/pulls", e, t)
								}
							}, {
								key: "getPullRequest",
								value: function(e, t) {
									return this._request("GET", "/repos/" + this.__fullname + "/pulls/" + e, null, t)
								}
							}, {
								key: "listPullRequestFiles",
								value: function(e, t) {
									return this._request("GET", "/repos/" + this.__fullname + "/pulls/" + e + "/files", null, t)
								}
							}, {
								key: "compareBranches",
								value: function(e, t, r) {
									return this._request("GET", "/repos/" + this.__fullname + "/compare/" + e + "..." + t, null, r)
								}
							}, {
								key: "listBranches",
								value: function(e) {
									return this._request("GET", "/repos/" + this.__fullname + "/branches", null, e)
								}
							}, {
								key: "getBlob",
								value: function(e, t) {
									return this._request("GET", "/repos/" + this.__fullname + "/git/blobs/" + e, null, t, "raw")
								}
							}, {
								key: "getCommit",
								value: function(e, t) {
									return this._request("GET", "/repos/" + this.__fullname + "/git/commits/" + e, null, t)
								}
							}, {
								key: "listCommits",
								value: function(e, t) {
									return e = e || {}, e.since = this._dateToISO(e.since), e.until = this._dateToISO(e.until), this._request("GET",
										"/repos/" + this.__fullname + "/commits", e, t)
								}
							}, {
								key: "getSingleCommit",
								value: function(e, t) {
									return e = e || "", this._request("GET", "/repos/" + this.__fullname + "/commits/" + e, null, t)
								}
							}, {
								key: "getSha",
								value: function(e, t, r) {
									return e = e ? "?ref=" + e : "", this._request("GET", "/repos/" + this.__fullname + "/contents/" + t + e, null, r)
								}
							}, {
								key: "listStatuses",
								value: function(e, t) {
									return this._request("GET", "/repos/" + this.__fullname + "/commits/" + e + "/statuses", null, t)
								}
							}, {
								key: "getTree",
								value: function(e, t) {
									return this._request("GET", "/repos/" + this.__fullname + "/git/trees/" + e, null, t)
								}
							}, {
								key: "createBlob",
								value: function(e, t) {
									var r = this._getContentObject(e);
									return y("sending content", r), this._request("POST", "/repos/" + this.__fullname + "/git/blobs", r, t)
								}
							}, {
								key: "_getContentObject",
								value: function(e) {
									if ("string" == typeof e) return y("contet is a string"), {
										content: l["default"].encode(e),
										encoding: "utf-8"
									};
									if ("undefined" != typeof o && e instanceof o) return y("We appear to be in Node"), {
										content: e.toString("base64"),
										encoding: "base64"
									};
									if ("undefined" != typeof Blob && e instanceof Blob) return y("We appear to be in the browser"), {
										content: n.Base64.encode(e),
										encoding: "base64"
									};
									throw y("Not sure what this content is: " + ("undefined" == typeof e ? "undefined" : p(e)) + ", " + JSON.stringify(e)),
										new Error("Unknown content passed to postBlob. Must be string or Buffer (node) or Blob (web)")
								}
							}, {
								key: "updateTree",
								value: function(e, t, r, n) {
									var o = {
										base_tree: e,
										tree: [{
											path: t,
											sha: r,
											mode: "100644",
											type: "blob"
										}]
									};
									return this._request("POST", "/repos/" + this.__fullname + "/git/trees", o, n)
								}
							}, {
								key: "createTree",
								value: function(e, t, r) {
									return this._request("POST", "/repos/" + this.__fullname + "/git/trees", {
										tree: e,
										base_tree: t
									}, r)
								}
							}, {
								key: "commit",
								value: function(e, t, r, n) {
									var o = this,
										i = {
											message: r,
											tree: t,
											parents: [e]
										};
									return this._request("POST", "/repos/" + this.__fullname + "/git/commits", i, n).then(function(e) {
										return o.__currentTree.sha = e.data.sha, e
									})
								}
							}, {
								key: "updateHead",
								value: function(e, t, r, n) {
									return this._request("PATCH", "/repos/" + this.__fullname + "/git/refs/" + e, {
										sha: t,
										force: r
									}, n)
								}
							}, {
								key: "getDetails",
								value: function(e) {
									return this._request("GET", "/repos/" + this.__fullname, null, e)
								}
							}, {
								key: "getContributors",
								value: function(e) {
									return this._request("GET", "/repos/" + this.__fullname + "/stats/contributors", null, e)
								}
							}, {
								key: "getCollaborators",
								value: function(e) {
									return this._request("GET", "/repos/" + this.__fullname + "/collaborators", null, e)
								}
							}, {
								key: "isCollaborator",
								value: function(e, t) {
									return this._request("GET", "/repos/" + this.__fullname + "/collaborators/" + e, null, t)
								}
							}, {
								key: "getContents",
								value: function(e, t, r, n) {
									return t = t ? "" + encodeURI(t) : "", this._request("GET", "/repos/" + this.__fullname + "/contents/" + t, {
										ref: e
									}, n, r)
								}
							}, {
								key: "getReadme",
								value: function(e, t, r) {
									return this._request("GET", "/repos/" + this.__fullname + "/readme", {
										ref: e
									}, r, t)
								}
							}, {
								key: "fork",
								value: function(e) {
									return this._request("POST", "/repos/" + this.__fullname + "/forks", null, e)
								}
							}, {
								key: "listForks",
								value: function(e) {
									return this._request("GET", "/repos/" + this.__fullname + "/forks", null, e)
								}
							}, {
								key: "createBranch",
								value: function(e, t, r) {
									var n = this;
									return "function" == typeof t && (r = t, t = e, e = "master"), this.getRef("heads/" + e).then(function(e) {
										var o = e.data.object.sha;
										return n.createRef({
											sha: o,
											ref: "refs/heads/" + t
										}, r)
									})
								}
							}, {
								key: "createPullRequest",
								value: function(e, t) {
									return this._request("POST", "/repos/" + this.__fullname + "/pulls", e, t)
								}
							}, {
								key: "updatePullRequst",
								value: function(e, t, r) {
									return this._request("PATCH", "/repos/" + this.__fullname + "/pulls/" + e, t, r)
								}
							}, {
								key: "listHooks",
								value: function(e) {
									return this._request("GET", "/repos/" + this.__fullname + "/hooks", null, e)
								}
							}, {
								key: "getHook",
								value: function(e, t) {
									return this._request("GET", "/repos/" + this.__fullname + "/hooks/" + e, null, t)
								}
							}, {
								key: "createHook",
								value: function(e, t) {
									return this._request("POST", "/repos/" + this.__fullname + "/hooks", e, t)
								}
							}, {
								key: "updateHook",
								value: function(e, t, r) {
									return this._request("PATCH", "/repos/" + this.__fullname + "/hooks/" + e, t, r)
								}
							}, {
								key: "deleteHook",
								value: function(e, t) {
									return this._request("DELETE", this.__repoPath + "/hooks/" + e, null, t)
								}
							}, {
								key: "deleteFile",
								value: function(e, t, r) {
									var n = this;
									return this.getSha(e, t).then(function(o) {
										var i = {
											message: "Delete the file at '" + t + "'",
											sha: o.data.sha,
											branch: e
										};
										return n._request("DELETE", "/repos/" + n.__fullname + "/contents/" + t, i, r)
									})
								}
							}, {
								key: "move",
								value: function(e, t, r, n) {
									var o = this,
										i = void 0;
									return this.getRef("heads/" + e).then(function(e) {
										var t = e.data.object;
										return o.getTree(t.sha + "?recursive=true")
									}).then(function(e) {
										var n = e.data,
											s = n.tree,
											u = n.sha;
										i = u;
										var a = s.map(function(e) {
											return e.path === t && (e.path = r), "tree" === e.type && delete e.sha, e
										});
										return o.createTree(a)
									}).then(function(e) {
										var n = e.data;
										return o.commit(i, n.sha, "Renamed '" + t + "' to '" + r + "'")
									}).then(function(t) {
										var r = t.data;
										return o.updateHead("heads/" + e, r.sha, !0, n)
									})
								}
							}, {
								key: "writeFile",
								value: function(e, t, r, o, i, s) {
									var u = this;
									"function" == typeof i && (s = i, i = {});
									var a = t ? encodeURI(t) : "",
										f = i.encode !== !1,
										c = {
											branch: e,
											message: o,
											author: i.author,
											committer: i.committer,
											content: f ? n.Base64.encode(r) : r
										};
									return this.getSha(e, a).then(function(e) {
										return c.sha = e.data.sha, u._request("PUT", "/repos/" + u.__fullname + "/contents/" + a, c, s)
									}, function() {
										return u._request("PUT", "/repos/" + u.__fullname + "/contents/" + a, c, s)
									})
								}
							}, {
								key: "isStarred",
								value: function(e) {
									return this._request204or404("/user/starred/" + this.__fullname, null, e)
								}
							}, {
								key: "star",
								value: function(e) {
									return this._request("PUT", "/user/starred/" + this.__fullname, null, e)
								}
							}, {
								key: "unstar",
								value: function(e) {
									return this._request("DELETE", "/user/starred/" + this.__fullname, null, e)
								}
							}, {
								key: "createRelease",
								value: function(e, t) {
									return this._request("POST", "/repos/" + this.__fullname + "/releases", e, t)
								}
							}, {
								key: "updateRelease",
								value: function(e, t, r) {
									return this._request("PATCH", "/repos/" + this.__fullname + "/releases/" + e, t, r)
								}
							}, {
								key: "listReleases",
								value: function(e) {
									return this._request("GET", "/repos/" + this.__fullname + "/releases", null, e)
								}
							}, {
								key: "getRelease",
								value: function(e, t) {
									return this._request("GET", "/repos/" + this.__fullname + "/releases/" + e, null, t)
								}
							}, {
								key: "deleteRelease",
								value: function(e, t) {
									return this._request("DELETE", "/repos/" + this.__fullname + "/releases/" + e, null, t)
								}
							}, {
								key: "mergePullRequest",
								value: function(e, t, r) {
									return this._request("PUT", "/repos/" + this.__fullname + "/pulls/" + e + "/merge", t, r)
								}
							}]), t
						}(c["default"]);
					e.exports = _
				})
			}).call(this, t("buffer").Buffer)
		}, {
			"./Requestable": 8,
			buffer: 30,
			debug: 31,
			"js-base64": 36,
			utf8: 39
		}],
		8: [function(t, r, n) {
			! function(o, i) {
				if ("function" == typeof e && e.amd) e(["module", "axios", "debug", "js-base64", "es6-promise"], i);
				else if ("undefined" != typeof n) i(r, t("axios"), t("debug"), t("js-base64"), t("es6-promise"));
				else {
					var s = {
						exports: {}
					};
					i(s, o.axios, o.debug, o.jsBase64, o.Promise), o.Requestable = s.exports
				}
			}(this, function(e, t, r, n, o) {
				"use strict";

				function i(e) {
					return e && e.__esModule ? e : {
						"default": e
					}
				}

				function s(e, t) {
					if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
				}

				function u(e, t) {
					if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
					return !t || "object" != typeof t && "function" != typeof t ? e : t
				}

				function a(e, t) {
					if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " +
						typeof t);
					e.prototype = Object.create(t && t.prototype, {
						constructor: {
							value: e,
							enumerable: !1,
							writable: !0,
							configurable: !0
						}
					}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
				}

				function f(e) {
					return -1 !== v.indexOf(e)
				}

				function c() {
					var e = arguments.length <= 0 || void 0 === arguments[0] ? "" : arguments[0],
						t = e.split(/\s*,\s*/);
					return t.reduce(function(e, t) {
						return -1 !== t.search(/rel="next"/) ? (t.match(/<(.*)>/) || [])[1] : e
					}, void 0)
				}

				function l(e, t) {
					return function(r) {
						var n = "error making request " + r.config.method + " " + r.config.url,
							o = new g(n, t, r);
						if (_(n + " " + JSON.stringify(r.data)), !e) throw _("throwing error"), o;
						_("going to error callback"), e(o)
					}
				}
				var h = i(t),
					p = i(r),
					d = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
						return typeof e
					} : function(e) {
						return e && "function" == typeof Symbol && e.constructor === Symbol ? "symbol" : typeof e
					},
					y = function() {
						function e(e, t) {
							for (var r = 0; r < t.length; r++) {
								var n = t[r];
								n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
							}
						}
						return function(t, r, n) {
							return r && e(t.prototype, r), n && e(t, n), t
						}
					}(),
					_ = (0, p["default"])("github:request");
				"undefined" == typeof Promise && (0, o.polyfill)();
				var g = function(e) {
						function t(e, r, n) {
							s(this, t);
							var o = u(this, Object.getPrototypeOf(t).call(this, e));
							return o.path = r, o.request = n.config, o.response = n, o.status = n.status, o
						}
						return a(t, e), t
					}(Error),
					m = function() {
						function e(t, r) {
							s(this, e), this.__apiBase = r || "https://api.github.com", this.__auth = {
								token: t.token,
								username: t.username,
								password: t.password
							}, t.token ? this.__authorizationHeader = "token " + t.token : t.username && t.password && (this.__authorizationHeader =
								"Basic " + n.Base64.encode(t.username + ":" + t.password))
						}
						return y(e, [{
							key: "__getURL",
							value: function(e) {
								var t = e; - 1 === e.indexOf("//") && (t = this.__apiBase + e);
								var r = "timestamp=" + (new Date).getTime();
								return t.replace(/(timestamp=\d+)/, r)
							}
						}, {
							key: "__getRequestHeaders",
							value: function(e) {
								var t = {
									Accept: e ? "application/vnd.github.v3.raw+json" : "application/vnd.github.v3+json",
									"Content-Type": "application/json;charset=UTF-8"
								};
								return this.__authorizationHeader && (t.Authorization = this.__authorizationHeader), t
							}
						}, {
							key: "_getOptionsWithDefaults",
							value: function() {
								var e = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0];
								return e.visibility || e.affiliation || (e.type = e.type || "all"), e.sort = e.sort || "updated", e.per_page = e.per_page ||
									"100", e
							}
						}, {
							key: "_dateToISO",
							value: function(e) {
								return e && e instanceof Date && (e = e.toISOString()), e
							}
						}, {
							key: "_request",
							value: function(e, t, r, n, o) {
								var i = this.__getURL(t),
									s = this.__getRequestHeaders(o),
									u = {},
									a = r && "object" === ("undefined" == typeof r ? "undefined" : d(r)) && f(e);
								a && (u = r, r = void 0);
								var c = {
									url: i,
									method: e,
									headers: s,
									params: u,
									data: r,
									responseType: o ? "text" : "json"
								};
								_(c.method + " to " + c.url);
								var p = (0, h["default"])(c)["catch"](l(n, t));
								return n && p.then(function(e) {
									n(null, e.data || !0, e)
								}), p
							}
						}, {
							key: "_request204or404",
							value: function(e, t, r) {
								var n = arguments.length <= 3 || void 0 === arguments[3] ? "GET" : arguments[3];
								return this._request(n, e, t).then(function(e) {
									return r && r(null, !0, e), !0
								}, function(e) {
									if (404 === e.status) return r && r(null, !1, e), !1;
									throw r && r(e), e
								})
							}
						}, {
							key: "_requestAllPages",
							value: function(e, t, r, n) {
								var o = this;
								return n = n || [], this._request("GET", e, t).then(function(i) {
									var s = void 0;
									if (i.data instanceof Array) s = i.data;
									else {
										if (!(i.data.items instanceof Array)) {
											var u = "cannot figure out how to append " + i.data + " to the result set";
											throw new g(u, e, i)
										}
										s = i.data.items
									}
									n.push.apply(n, s);
									var a = c(i.headers.link);
									return a ? (_("getting next page: " + a), o._requestAllPages(a, t, r, n)) : (r && r(null, n, i), i.data = n, i)
								})["catch"](l(r, e))
							}
						}]), e
					}();
				e.exports = m;
				var v = ["GET", "HEAD", "DELETE"]
			})
		}, {
			axios: 12,
			debug: 31,
			"es6-promise": 33,
			"js-base64": 36
		}],
		9: [function(t, r, n) {
			! function(o, i) {
				if ("function" == typeof e && e.amd) e(["module", "./Requestable", "debug"], i);
				else if ("undefined" != typeof n) i(r, t("./Requestable"), t("debug"));
				else {
					var s = {
						exports: {}
					};
					i(s, o.Requestable, o.debug), o.Search = s.exports
				}
			}(this, function(e, t, r) {
				"use strict";

				function n(e) {
					return e && e.__esModule ? e : {
						"default": e
					}
				}

				function o(e, t) {
					if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
				}

				function i(e, t) {
					if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
					return !t || "object" != typeof t && "function" != typeof t ? e : t
				}

				function s(e, t) {
					if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " +
						typeof t);
					e.prototype = Object.create(t && t.prototype, {
						constructor: {
							value: e,
							enumerable: !1,
							writable: !0,
							configurable: !0
						}
					}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
				}
				var u = n(t),
					a = n(r),
					f = function() {
						function e(e, t) {
							for (var r = 0; r < t.length; r++) {
								var n = t[r];
								n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
							}
						}
						return function(t, r, n) {
							return r && e(t.prototype, r), n && e(t, n), t
						}
					}(),
					c = (0, a["default"])("github:search"),
					l = function(e) {
						function t(e, r, n) {
							o(this, t);
							var s = i(this, Object.getPrototypeOf(t).call(this, r, n));
							return s.__defaults = s._getOptionsWithDefaults(e), s
						}
						return s(t, e), f(t, [{
							key: "_search",
							value: function(e) {
								var t = this,
									r = arguments.length <= 1 || void 0 === arguments[1] ? {} : arguments[1],
									n = arguments.length <= 2 || void 0 === arguments[2] ? void 0 : arguments[2],
									o = {};
								return Object.keys(this.__defaults).forEach(function(e) {
									o[e] = t.__defaults[e]
								}), Object.keys(r).forEach(function(e) {
									o[e] = r[e]
								}), c("searching " + e + " with options:", o), this._requestAllPages("/search/" + e, o, n)
							}
						}, {
							key: "forRepositories",
							value: function(e, t) {
								return this._search("repositories", e, t)
							}
						}, {
							key: "forCode",
							value: function(e, t) {
								return this._search("code", e, t)
							}
						}, {
							key: "forIssues",
							value: function(e, t) {
								return this._search("issues", e, t)
							}
						}, {
							key: "forUsers",
							value: function(e, t) {
								return this._search("users", e, t)
							}
						}]), t
					}(u["default"]);
				e.exports = l
			})
		}, {
			"./Requestable": 8,
			debug: 31
		}],
		10: [function(t, r, n) {
			! function(o, i) {
				if ("function" == typeof e && e.amd) e(["module", "./Requestable", "debug"], i);
				else if ("undefined" != typeof n) i(r, t("./Requestable"), t("debug"));
				else {
					var s = {
						exports: {}
					};
					i(s, o.Requestable, o.debug), o.Team = s.exports
				}
			}(this, function(e, t, r) {
				"use strict";

				function n(e) {
					return e && e.__esModule ? e : {
						"default": e
					}
				}

				function o(e, t) {
					if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
				}

				function i(e, t) {
					if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
					return !t || "object" != typeof t && "function" != typeof t ? e : t
				}

				function s(e, t) {
					if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " +
						typeof t);
					e.prototype = Object.create(t && t.prototype, {
						constructor: {
							value: e,
							enumerable: !1,
							writable: !0,
							configurable: !0
						}
					}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
				}
				var u = n(t),
					a = n(r),
					f = function() {
						function e(e, t) {
							for (var r = 0; r < t.length; r++) {
								var n = t[r];
								n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
							}
						}
						return function(t, r, n) {
							return r && e(t.prototype, r), n && e(t, n), t
						}
					}(),
					c = (0, a["default"])("github:team"),
					l = function(e) {
						function t(e, r, n) {
							o(this, t);
							var s = i(this, Object.getPrototypeOf(t).call(this, r, n));
							return s.__teamId = e, s
						}
						return s(t, e), f(t, [{
							key: "getTeam",
							value: function(e) {
								return c("Fetching Team " + this.__teamId), this._request("Get", "/teams/" + this.__teamId, void 0, e)
							}
						}, {
							key: "listRepos",
							value: function(e) {
								return c("Fetching repositories for Team " + this.__teamId), this._requestAllPages("/teams/" + this.__teamId + "/repos",
									void 0, e)
							}
						}, {
							key: "editTeam",
							value: function(e, t) {
								return c("Editing Team " + this.__teamId), this._request("PATCH", "/teams/" + this.__teamId, e, t)
							}
						}, {
							key: "listMembers",
							value: function(e, t) {
								return c("Getting members of Team " + this.__teamId), this._requestAllPages("/teams/" + this.__teamId + "/members", e, t)
							}
						}, {
							key: "getMembership",
							value: function(e, t) {
								return c("Getting membership of user " + e + " in Team " + this.__teamId), this._request("GET", "/teams/" + this.__teamId +
									"/memberships/" + e, void 0, t)
							}
						}, {
							key: "addMembership",
							value: function(e, t, r) {
								return c("Adding user " + e + " to Team " + this.__teamId), this._request("PUT", "/teams/" + this.__teamId +
									"/memberships/" + e, t, r)
							}
						}, {
							key: "isManagedRepo",
							value: function(e, t, r) {
								return c("Getting repo management by Team " + this.__teamId + " for repo " + e + "/" + t),
									this._request204or404("/teams/" + this.__teamId + "/repos/" + e + "/" + t, void 0, r)
							}
						}, {
							key: "manageRepo",
							value: function(e, t, r, n) {
								return c("Adding or Updating repo management by Team " + this.__teamId + " for repo " + e + "/" + t), this._request204or404(
									"/teams/" + this.__teamId + "/repos/" + e + "/" + t, r, n, "PUT")
							}
						}, {
							key: "unmanageRepo",
							value: function(e, t, r) {
								return c("Remove repo management by Team " + this.__teamId + " for repo " + e + "/" + t), this._request204or404("/teams/" +
									this.__teamId + "/repos/" + e + "/" + t, void 0, r, "DELETE")
							}
						}, {
							key: "deleteTeam",
							value: function(e) {
								return c("Deleting Team " + this.__teamId), this._request204or404("/teams/" + this.__teamId, void 0, e, "DELETE")
							}
						}]), t
					}(u["default"]);
				e.exports = l
			})
		}, {
			"./Requestable": 8,
			debug: 31
		}],
		11: [function(t, r, n) {
			! function(o, i) {
				if ("function" == typeof e && e.amd) e(["module", "./Requestable", "debug"], i);
				else if ("undefined" != typeof n) i(r, t("./Requestable"), t("debug"));
				else {
					var s = {
						exports: {}
					};
					i(s, o.Requestable, o.debug), o.User = s.exports
				}
			}(this, function(e, t, r) {
				"use strict";

				function n(e) {
					return e && e.__esModule ? e : {
						"default": e
					}
				}

				function o(e, t) {
					if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
				}

				function i(e, t) {
					if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
					return !t || "object" != typeof t && "function" != typeof t ? e : t
				}

				function s(e, t) {
					if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " +
						typeof t);
					e.prototype = Object.create(t && t.prototype, {
						constructor: {
							value: e,
							enumerable: !1,
							writable: !0,
							configurable: !0
						}
					}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
				}
				var u = n(t),
					a = n(r),
					f = function() {
						function e(e, t) {
							for (var r = 0; r < t.length; r++) {
								var n = t[r];
								n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
							}
						}
						return function(t, r, n) {
							return r && e(t.prototype, r), n && e(t, n), t
						}
					}(),
					c = (0, a["default"])("github:user"),
					l = function(e) {
						function t(e, r, n) {
							o(this, t);
							var s = i(this, Object.getPrototypeOf(t).call(this, r, n));
							return s.__user = e, s
						}
						return s(t, e), f(t, [{
							key: "__getScopedUrl",
							value: function(e) {
								if (this.__user) return e ? "/users/" + this.__user + "/" + e : "/users/" + this.__user;
								switch (e) {
									case "":
										return "/user";
									case "notifications":
									case "gists":
										return "/" + e;
									default:
										return "/user/" + e
								}
							}
						}, {
							key: "listRepos",
							value: function(e, t) {
								return "function" == typeof e && (t = e, e = {}), e = this._getOptionsWithDefaults(e), c(
									"Fetching repositories with options: " + JSON.stringify(e)), this._requestAllPages(this.__getScopedUrl("repos"), e, t)
							}
						}, {
							key: "listOrgs",
							value: function(e) {
								return this._request("GET", this.__getScopedUrl("orgs"), null, e)
							}
						}, {
							key: "listGists",
							value: function(e) {
								return this._request("GET", this.__getScopedUrl("gists"), null, e)
							}
						}, {
							key: "listNotifications",
							value: function(e, t) {
								return e = e || {}, "function" == typeof e && (t = e, e = {}), e.since = this._dateToISO(e.since), e.before = this._dateToISO(
									e.before), this._request("GET", this.__getScopedUrl("notifications"), e, t)
							}
						}, {
							key: "getProfile",
							value: function(e) {
								return this._request("GET", this.__getScopedUrl(""), null, e)
							}
						}, {
							key: "listStarredRepos",
							value: function(e) {
								var t = this._getOptionsWithDefaults();
								return this._requestAllPages(this.__getScopedUrl("starred"), t, e)
							}
						}, {
							key: "follow",
							value: function(e, t) {
								return this._request("PUT", "/user/following/" + this.__user, null, t)
							}
						}, {
							key: "unfollow",
							value: function(e, t) {
								return this._request("DELETE", "/user/following/" + this.__user, null, t)
							}
						}, {
							key: "createRepo",
							value: function(e, t) {
								return this._request("POST", "/user/repos", e, t)
							}
						}]), t
					}(u["default"]);
				e.exports = l
			})
		}, {
			"./Requestable": 8,
			debug: 31
		}],
		12: [function(e, t, r) {
			t.exports = e("./lib/axios")
		}, {
			"./lib/axios": 14
		}],
		13: [function(e, t, r) {
			(function(r) {
				"use strict";
				var n = e("./../utils"),
					o = e("./../helpers/buildURL"),
					i = e("./../helpers/parseHeaders"),
					s = e("./../helpers/transformData"),
					u = e("./../helpers/isURLSameOrigin"),
					a = "undefined" != typeof window && window.btoa || e("./../helpers/btoa");
				t.exports = function(t, f, c) {
					var l = c.data,
						h = c.headers;
					n.isFormData(l) && delete h["Content-Type"];
					var p = new XMLHttpRequest,
						d = "onreadystatechange",
						y = !1;
					if ("test" === r.env.NODE_ENV || "undefined" == typeof window || !window.XDomainRequest || "withCredentials" in p || u(c.url) ||
						(p = new window.XDomainRequest, d = "onload", y = !0), c.auth) {
						var _ = c.auth.username || "",
							g = c.auth.password || "";
						h.Authorization = "Basic " + a(_ + ":" + g)
					}
					if (p.open(c.method.toUpperCase(), o(c.url, c.params, c.paramsSerializer), !0), p.timeout = c.timeout, p.onprogress = function() {},
						p.ontimeout = function() {}, p[d] = function() {
							if (p && (4 === p.readyState || y) && 0 !== p.status) {
								var e = "getAllResponseHeaders" in p ? i(p.getAllResponseHeaders()) : null,
									r = c.responseType && "text" !== c.responseType ? p.response : p.responseText,
									n = {
										data: s(r, e, c.transformResponse),
										status: 1223 === p.status ? 204 : p.status,
										statusText: 1223 === p.status ? "No Content" : p.statusText,
										headers: e,
										config: c,
										request: p
									};
								(n.status >= 200 && n.status < 300 || !("status" in p) && p.responseText ? t : f)(n), p = null
							}
						}, p.onerror = function() {
							f(new Error("Network Error")), p = null
						}, p.ontimeout = function() {
							var e = new Error("timeout of " + c.timeout + "ms exceeded");
							e.timeout = c.timeout, e.code = "ECONNABORTED", f(e), p = null
						}, n.isStandardBrowserEnv()) {
						var m = e("./../helpers/cookies"),
							v = c.withCredentials || u(c.url) ? m.read(c.xsrfCookieName) : void 0;
						v && (h[c.xsrfHeaderName] = v)
					}
					if ("setRequestHeader" in p && n.forEach(h, function(e, t) {
							"undefined" == typeof l && "content-type" === t.toLowerCase() ? delete h[t] : p.setRequestHeader(t, e)
						}), c.withCredentials && (p.withCredentials = !0), c.responseType) try {
						p.responseType = c.responseType
					} catch (b) {
						if ("json" !== p.responseType) throw b
					}
					c.progress && ("post" === c.method || "put" === c.method ? p.upload.addEventListener("progress", c.progress) : "get" === c.method &&
						p.addEventListener("progress", c.progress)), n.isArrayBuffer(l) && (l = new DataView(l)), void 0 === l && (l = null), p.send(
						l)
				}
			}).call(this, e("_process"))
		}, {
			"./../helpers/btoa": 19,
			"./../helpers/buildURL": 20,
			"./../helpers/cookies": 22,
			"./../helpers/isURLSameOrigin": 24,
			"./../helpers/parseHeaders": 25,
			"./../helpers/transformData": 27,
			"./../utils": 28,
			_process: 38
		}],
		14: [function(e, t, r) {
			"use strict";

			function n(e) {
				this.defaults = i.merge({}, e), this.interceptors = {
					request: new u,
					response: new u
				}
			}
			var o = e("./defaults"),
				i = e("./utils"),
				s = e("./core/dispatchRequest"),
				u = e("./core/InterceptorManager"),
				a = e("./helpers/isAbsoluteURL"),
				f = e("./helpers/combineURLs"),
				c = e("./helpers/bind"),
				l = e("./helpers/transformData");
			n.prototype.request = function(e) {
				"string" == typeof e && (e = i.merge({
						url: arguments[0]
					}, arguments[1])), e = i.merge(o, this.defaults, {
						method: "get"
					}, e), e.baseURL && !a(e.url) && (e.url = f(e.baseURL, e.url)), e.withCredentials = e.withCredentials || this.defaults.withCredentials,
					e.data = l(e.data, e.headers, e.transformRequest), e.headers = i.merge(e.headers.common || {}, e.headers[e.method] || {}, e.headers || {}),
					i.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function(t) {
						delete e.headers[t]
					});
				var t = [s, void 0],
					r = Promise.resolve(e);
				for (this.interceptors.request.forEach(function(e) {
						t.unshift(e.fulfilled, e.rejected)
					}), this.interceptors.response.forEach(function(e) {
						t.push(e.fulfilled, e.rejected)
					}); t.length;) r = r.then(t.shift(), t.shift());
				return r
			};
			var h = new n(o),
				p = t.exports = c(n.prototype.request, h);
			p.defaults = h.defaults, p.interceptors = h.interceptors, p.create = function(e) {
				return new n(e)
			}, p.all = function(e) {
				return Promise.all(e)
			}, p.spread = e("./helpers/spread"), i.forEach(["delete", "get", "head"], function(e) {
				n.prototype[e] = function(t, r) {
					return this.request(i.merge(r || {}, {
						method: e,
						url: t
					}))
				}, p[e] = c(n.prototype[e], h)
			}), i.forEach(["post", "put", "patch"], function(e) {
				n.prototype[e] = function(t, r, n) {
					return this.request(i.merge(n || {}, {
						method: e,
						url: t,
						data: r
					}))
				}, p[e] = c(n.prototype[e], h)
			})
		}, {
			"./core/InterceptorManager": 15,
			"./core/dispatchRequest": 16,
			"./defaults": 17,
			"./helpers/bind": 18,
			"./helpers/combineURLs": 21,
			"./helpers/isAbsoluteURL": 23,
			"./helpers/spread": 26,
			"./helpers/transformData": 27,
			"./utils": 28
		}],
		15: [function(e, t, r) {
			"use strict";

			function n() {
				this.handlers = []
			}
			var o = e("./../utils");
			n.prototype.use = function(e, t) {
				return this.handlers.push({
					fulfilled: e,
					rejected: t
				}), this.handlers.length - 1
			}, n.prototype.eject = function(e) {
				this.handlers[e] && (this.handlers[e] = null)
			}, n.prototype.forEach = function(e) {
				o.forEach(this.handlers, function(t) {
					null !== t && e(t)
				})
			}, t.exports = n
		}, {
			"./../utils": 28
		}],
		16: [function(e, t, r) {
			(function(r) {
				"use strict";
				t.exports = function(t) {
					return new Promise(function(n, o) {
						try {
							var i;
							"function" == typeof t.adapter ? i = t.adapter : "undefined" != typeof XMLHttpRequest ? i = e("../adapters/xhr") :
								"undefined" != typeof r && (i = e("../adapters/http")), "function" == typeof i && i(n, o, t)
						} catch (s) {
							o(s)
						}
					})
				}
			}).call(this, e("_process"))
		}, {
			"../adapters/http": 13,
			"../adapters/xhr": 13,
			_process: 38
		}],
		17: [function(e, t, r) {
			"use strict";
			var n = e("./utils"),
				o = /^\)\]\}',?\n/,
				i = {
					"Content-Type": "application/x-www-form-urlencoded"
				};
			t.exports = {
				transformRequest: [function(e, t) {
					return n.isFormData(e) ? e : n.isArrayBuffer(e) ? e : n.isArrayBufferView(e) ? e.buffer : !n.isObject(e) || n.isFile(e) || n.isBlob(
						e) ? e : (n.isUndefined(t) || (n.forEach(t, function(e, r) {
						"content-type" === r.toLowerCase() && (t["Content-Type"] = e)
					}), n.isUndefined(t["Content-Type"]) && (t["Content-Type"] = "application/json;charset=utf-8")), JSON.stringify(e))
				}],
				transformResponse: [function(e) {
					if ("string" == typeof e) {
						e = e.replace(o, "");
						try {
							e = JSON.parse(e)
						} catch (t) {}
					}
					return e
				}],
				headers: {
					common: {
						Accept: "application/json, text/plain, */*"
					},
					patch: n.merge(i),
					post: n.merge(i),
					put: n.merge(i)
				},
				timeout: 0,
				xsrfCookieName: "XSRF-TOKEN",
				xsrfHeaderName: "X-XSRF-TOKEN",
				maxContentLength: -1
			}
		}, {
			"./utils": 28
		}],
		18: [function(e, t, r) {
			"use strict";
			t.exports = function(e, t) {
				return function() {
					for (var r = new Array(arguments.length), n = 0; n < r.length; n++) r[n] = arguments[n];
					return e.apply(t, r)
				}
			}
		}, {}],
		19: [function(e, t, r) {
			"use strict";

			function n() {
				this.message = "String contains an invalid character"
			}

			function o(e) {
				for (var t, r, o = String(e), s = "", u = 0, a = i; o.charAt(0 | u) || (a = "=", u % 1); s += a.charAt(63 & t >> 8 - u % 1 * 8)) {
					if (r = o.charCodeAt(u += .75), r > 255) throw new n;
					t = t << 8 | r
				}
				return s
			}
			var i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
			n.prototype = new Error, n.prototype.code = 5, n.prototype.name = "InvalidCharacterError", t.exports = o
		}, {}],
		20: [function(e, t, r) {
			"use strict";

			function n(e) {
				return encodeURIComponent(e).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g,
					"+").replace(/%5B/gi, "[").replace(/%5D/gi, "]")
			}
			var o = e("./../utils");
			t.exports = function(e, t, r) {
				if (!t) return e;
				var i;
				if (r) i = r(t);
				else {
					var s = [];
					o.forEach(t, function(e, t) {
						null !== e && "undefined" != typeof e && (o.isArray(e) && (t += "[]"), o.isArray(e) || (e = [e]), o.forEach(e, function(e) {
							o.isDate(e) ? e = e.toISOString() : o.isObject(e) && (e = JSON.stringify(e)), s.push(n(t) + "=" + n(e))
						}))
					}), i = s.join("&")
				}
				return i && (e += (-1 === e.indexOf("?") ? "?" : "&") + i), e
			}
		}, {
			"./../utils": 28
		}],
		21: [function(e, t, r) {
			"use strict";
			t.exports = function(e, t) {
				return e.replace(/\/+$/, "") + "/" + t.replace(/^\/+/, "")
			}
		}, {}],
		22: [function(e, t, r) {
			"use strict";
			var n = e("./../utils");
			t.exports = n.isStandardBrowserEnv() ? function() {
				return {
					write: function(e, t, r, o, i, s) {
						var u = [];
						u.push(e + "=" + encodeURIComponent(t)), n.isNumber(r) && u.push("expires=" + new Date(r).toGMTString()), n.isString(o) && u.push(
							"path=" + o), n.isString(i) && u.push("domain=" + i), s === !0 && u.push("secure"), document.cookie = u.join("; ")
					},
					read: function(e) {
						var t = document.cookie.match(new RegExp("(^|;\\s*)(" + e + ")=([^;]*)"));
						return t ? decodeURIComponent(t[3]) : null
					},
					remove: function(e) {
						this.write(e, "", Date.now() - 864e5)
					}
				}
			}() : function() {
				return {
					write: function() {},
					read: function() {
						return null
					},
					remove: function() {}
				}
			}()
		}, {
			"./../utils": 28
		}],
		23: [function(e, t, r) {
			"use strict";
			t.exports = function(e) {
				return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)
			}
		}, {}],
		24: [function(e, t, r) {
			"use strict";
			var n = e("./../utils");
			t.exports = n.isStandardBrowserEnv() ? function() {
				function e(e) {
					var t = e;
					return r && (o.setAttribute("href", t), t = o.href), o.setAttribute("href", t), {
						href: o.href,
						protocol: o.protocol ? o.protocol.replace(/:$/, "") : "",
						host: o.host,
						search: o.search ? o.search.replace(/^\?/, "") : "",
						hash: o.hash ? o.hash.replace(/^#/, "") : "",
						hostname: o.hostname,
						port: o.port,
						pathname: "/" === o.pathname.charAt(0) ? o.pathname : "/" + o.pathname
					}
				}
				var t, r = /(msie|trident)/i.test(navigator.userAgent),
					o = document.createElement("a");
				return t = e(window.location.href),
					function(r) {
						var o = n.isString(r) ? e(r) : r;
						return o.protocol === t.protocol && o.host === t.host
					}
			}() : function() {
				return function() {
					return !0
				}
			}()
		}, {
			"./../utils": 28
		}],
		25: [function(e, t, r) {
			"use strict";
			var n = e("./../utils");
			t.exports = function(e) {
				var t, r, o, i = {};
				return e ? (n.forEach(e.split("\n"), function(e) {
					o = e.indexOf(":"), t = n.trim(e.substr(0, o)).toLowerCase(), r = n.trim(e.substr(o + 1)), t && (i[t] = i[t] ? i[t] + ", " +
						r : r)
				}), i) : i
			}
		}, {
			"./../utils": 28
		}],
		26: [function(e, t, r) {
			"use strict";
			t.exports = function(e) {
				return function(t) {
					return e.apply(null, t)
				}
			}
		}, {}],
		27: [function(e, t, r) {
			"use strict";
			var n = e("./../utils");
			t.exports = function(e, t, r) {
				return n.forEach(r, function(r) {
					e = r(e, t)
				}), e
			}
		}, {
			"./../utils": 28
		}],
		28: [function(e, t, r) {
			"use strict";

			function n(e) {
				return "[object Array]" === m.call(e)
			}

			function o(e) {
				return "[object ArrayBuffer]" === m.call(e)
			}

			function i(e) {
				return "[object FormData]" === m.call(e)
			}

			function s(e) {
				var t;
				return t = "undefined" != typeof ArrayBuffer && ArrayBuffer.isView ? ArrayBuffer.isView(e) : e && e.buffer && e.buffer instanceof ArrayBuffer
			}

			function u(e) {
				return "string" == typeof e
			}

			function a(e) {
				return "number" == typeof e
			}

			function f(e) {
				return "undefined" == typeof e
			}

			function c(e) {
				return null !== e && "object" == typeof e
			}

			function l(e) {
				return "[object Date]" === m.call(e)
			}

			function h(e) {
				return "[object File]" === m.call(e)
			}

			function p(e) {
				return "[object Blob]" === m.call(e)
			}

			function d(e) {
				return e.replace(/^\s*/, "").replace(/\s*$/, "")
			}

			function y() {
				return "undefined" != typeof window && "undefined" != typeof document && "function" == typeof document.createElement
			}

			function _(e, t) {
				if (null !== e && "undefined" != typeof e)
					if ("object" == typeof e || n(e) || (e = [e]), n(e))
						for (var r = 0, o = e.length; o > r; r++) t.call(null, e[r], r, e);
					else
						for (var i in e) e.hasOwnProperty(i) && t.call(null, e[i], i, e)
			}

			function g() {
				function e(e, r) {
					"object" == typeof t[r] && "object" == typeof e ? t[r] = g(t[r], e) : t[r] = e
				}
				for (var t = {}, r = 0, n = arguments.length; n > r; r++) _(arguments[r], e);
				return t
			}
			var m = Object.prototype.toString;
			t.exports = {
				isArray: n,
				isArrayBuffer: o,
				isFormData: i,
				isArrayBufferView: s,
				isString: u,
				isNumber: a,
				isObject: c,
				isUndefined: f,
				isDate: l,
				isFile: h,
				isBlob: p,
				isStandardBrowserEnv: y,
				forEach: _,
				merge: g,
				trim: d
			}
		}, {}],
		29: [function(e, t, r) {
			"use strict";

			function n() {
				for (var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", t = 0, r = e.length; r > t; ++t) a[t] = e[t], f[e
					.charCodeAt(t)] = t;
				f["-".charCodeAt(0)] = 62, f["_".charCodeAt(0)] = 63
			}

			function o(e) {
				var t, r, n, o, i, s, u = e.length;
				if (u % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
				i = "=" === e[u - 2] ? 2 : "=" === e[u - 1] ? 1 : 0, s = new c(3 * u / 4 - i), n = i > 0 ? u - 4 : u;
				var a = 0;
				for (t = 0, r = 0; n > t; t += 4, r += 3) o = f[e.charCodeAt(t)] << 18 | f[e.charCodeAt(t + 1)] << 12 | f[e.charCodeAt(t + 2)] <<
					6 | f[e.charCodeAt(t + 3)], s[a++] = o >> 16 & 255, s[a++] = o >> 8 & 255, s[a++] = 255 & o;
				return 2 === i ? (o = f[e.charCodeAt(t)] << 2 | f[e.charCodeAt(t + 1)] >> 4, s[a++] = 255 & o) : 1 === i && (o = f[e.charCodeAt(t)] <<
					10 | f[e.charCodeAt(t + 1)] << 4 | f[e.charCodeAt(t + 2)] >> 2, s[a++] = o >> 8 & 255, s[a++] = 255 & o), s
			}

			function i(e) {
				return a[e >> 18 & 63] + a[e >> 12 & 63] + a[e >> 6 & 63] + a[63 & e]
			}

			function s(e, t, r) {
				for (var n, o = [], s = t; r > s; s += 3) n = (e[s] << 16) + (e[s + 1] << 8) + e[s + 2], o.push(i(n));
				return o.join("")
			}

			function u(e) {
				for (var t, r = e.length, n = r % 3, o = "", i = [], u = 16383, f = 0, c = r - n; c > f; f += u) i.push(s(e, f, f + u > c ? c : f +
					u));
				return 1 === n ? (t = e[r - 1], o += a[t >> 2], o += a[t << 4 & 63], o += "==") : 2 === n && (t = (e[r - 2] << 8) + e[r - 1], o +=
					a[t >> 10], o += a[t >> 4 & 63], o += a[t << 2 & 63], o += "="), i.push(o), i.join("")
			}
			r.toByteArray = o, r.fromByteArray = u;
			var a = [],
				f = [],
				c = "undefined" != typeof Uint8Array ? Uint8Array : Array;
			n()
		}, {}],
		30: [function(e, t, r) {
			(function(t) {
				"use strict";

				function n() {
					try {
						var e = new Uint8Array(1);
						return e.foo = function() {
							return 42
						}, 42 === e.foo() && "function" == typeof e.subarray && 0 === e.subarray(1, 1).byteLength
					} catch (t) {
						return !1
					}
				}

				function o() {
					return s.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
				}

				function i(e, t) {
					if (o() < t) throw new RangeError("Invalid typed array length");
					return s.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t), e.__proto__ = s.prototype) : (null === e && (e = new s(t)), e.length = t),
						e
				}

				function s(e, t, r) {
					if (!(s.TYPED_ARRAY_SUPPORT || this instanceof s)) return new s(e, t, r);
					if ("number" == typeof e) {
						if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");
						return c(this, e)
					}
					return u(this, e, t, r)
				}

				function u(e, t, r, n) {
					if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');
					return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? p(e, t, r, n) : "string" == typeof t ? l(e, t, r) : d(e,
						t)
				}

				function a(e) {
					if ("number" != typeof e) throw new TypeError('"size" argument must be a number')
				}

				function f(e, t, r, n) {
					return a(t), 0 >= t ? i(e, t) : void 0 !== r ? "string" == typeof n ? i(e, t).fill(r, n) : i(e, t).fill(r) : i(e, t)
				}

				function c(e, t) {
					if (a(t), e = i(e, 0 > t ? 0 : 0 | y(t)), !s.TYPED_ARRAY_SUPPORT)
						for (var r = 0; t > r; r++) e[r] = 0;
					return e
				}

				function l(e, t, r) {
					if ("string" == typeof r && "" !== r || (r = "utf8"), !s.isEncoding(r)) throw new TypeError(
						'"encoding" must be a valid string encoding');
					var n = 0 | g(t, r);
					return e = i(e, n), e.write(t, r), e
				}

				function h(e, t) {
					var r = 0 | y(t.length);
					e = i(e, r);
					for (var n = 0; r > n; n += 1) e[n] = 255 & t[n];
					return e
				}

				function p(e, t, r, n) {
					if (t.byteLength, 0 > r || t.byteLength < r) throw new RangeError("'offset' is out of bounds");
					if (t.byteLength < r + (n || 0)) throw new RangeError("'length' is out of bounds");
					return t = void 0 === n ? new Uint8Array(t, r) : new Uint8Array(t, r, n), s.TYPED_ARRAY_SUPPORT ? (e = t, e.__proto__ = s.prototype) :
						e = h(e, t), e
				}

				function d(e, t) {
					if (s.isBuffer(t)) {
						var r = 0 | y(t.length);
						return e = i(e, r), 0 === e.length ? e : (t.copy(e, 0, 0, r), e)
					}
					if (t) {
						if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length ||
							J(t.length) ? i(e, 0) : h(e, t);
						if ("Buffer" === t.type && Z(t.data)) return h(e, t.data)
					}
					throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
				}

				function y(e) {
					if (e >= o()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + o().toString(16) + " bytes");
					return 0 | e
				}

				function _(e) {
					return +e != e && (e = 0), s.alloc(+e)
				}

				function g(e, t) {
					if (s.isBuffer(e)) return e.length;
					if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer))
						return e.byteLength;
					"string" != typeof e && (e = "" + e);
					var r = e.length;
					if (0 === r) return 0;
					for (var n = !1;;) switch (t) {
						case "ascii":
						case "binary":
						case "raw":
						case "raws":
							return r;
						case "utf8":
						case "utf-8":
						case void 0:
							return H(e).length;
						case "ucs2":
						case "ucs-2":
						case "utf16le":
						case "utf-16le":
							return 2 * r;
						case "hex":
							return r >>> 1;
						case "base64":
							return W(e).length;
						default:
							if (n) return H(e).length;
							t = ("" + t).toLowerCase(), n = !0
					}
				}

				function m(e, t, r) {
					var n = !1;
					if ((void 0 === t || 0 > t) && (t = 0), t > this.length) return "";
					if ((void 0 === r || r > this.length) && (r = this.length), 0 >= r) return "";
					if (r >>>= 0, t >>>= 0, t >= r) return "";
					for (e || (e = "utf8");;) switch (e) {
						case "hex":
							return C(this, t, r);
						case "utf8":
						case "utf-8":
							return P(this, t, r);
						case "ascii":
							return S(this, t, r);
						case "binary":
							return x(this, t, r);
						case "base64":
							return O(this, t, r);
						case "ucs2":
						case "ucs-2":
						case "utf16le":
						case "utf-16le":
							return j(this, t, r);
						default:
							if (n) throw new TypeError("Unknown encoding: " + e);
							e = (e + "").toLowerCase(), n = !0
					}
				}

				function v(e, t, r) {
					var n = e[t];
					e[t] = e[r], e[r] = n
				}

				function b(e, t, r, n) {
					function o(e, t) {
						return 1 === i ? e[t] : e.readUInt16BE(t * i)
					}
					var i = 1,
						s = e.length,
						u = t.length;
					if (void 0 !== n && (n = String(n).toLowerCase(), "ucs2" === n || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
						if (e.length < 2 || t.length < 2) return -1;
						i = 2, s /= 2, u /= 2, r /= 2
					}
					for (var a = -1, f = 0; s > r + f; f++)
						if (o(e, r + f) === o(t, -1 === a ? 0 : f - a)) {
							if (-1 === a && (a = f), f - a + 1 === u) return (r + a) * i
						} else -1 !== a && (f -= f - a), a = -1;
					return -1
				}

				function w(e, t, r, n) {
					r = Number(r) || 0;
					var o = e.length - r;
					n ? (n = Number(n), n > o && (n = o)) : n = o;
					var i = t.length;
					if (i % 2 !== 0) throw new Error("Invalid hex string");
					n > i / 2 && (n = i / 2);
					for (var s = 0; n > s; s++) {
						var u = parseInt(t.substr(2 * s, 2), 16);
						if (isNaN(u)) return s;
						e[r + s] = u
					}
					return s
				}

				function E(e, t, r, n) {
					return X(H(t, e.length - r), e, r, n)
				}

				function T(e, t, r, n) {
					return X(z(t), e, r, n)
				}

				function R(e, t, r, n) {
					return T(e, t, r, n)
				}

				function A(e, t, r, n) {
					return X(W(t), e, r, n)
				}

				function k(e, t, r, n) {
					return X(V(t, e.length - r), e, r, n)
				}

				function O(e, t, r) {
					return 0 === t && r === e.length ? $.fromByteArray(e) : $.fromByteArray(e.slice(t, r))
				}

				function P(e, t, r) {
					r = Math.min(e.length, r);
					for (var n = [], o = t; r > o;) {
						var i = e[o],
							s = null,
							u = i > 239 ? 4 : i > 223 ? 3 : i > 191 ? 2 : 1;
						if (r >= o + u) {
							var a, f, c, l;
							switch (u) {
								case 1:
									128 > i && (s = i);
									break;
								case 2:
									a = e[o + 1], 128 === (192 & a) && (l = (31 & i) << 6 | 63 & a, l > 127 && (s = l));
									break;
								case 3:
									a = e[o + 1], f = e[o + 2], 128 === (192 & a) && 128 === (192 & f) && (l = (15 & i) << 12 | (63 & a) << 6 | 63 & f, l > 2047 &&
										(55296 > l || l > 57343) && (s = l));
									break;
								case 4:
									a = e[o + 1], f = e[o + 2], c = e[o + 3], 128 === (192 & a) && 128 === (192 & f) && 128 === (192 & c) && (l = (15 & i) << 18 |
										(63 & a) << 12 | (63 & f) << 6 | 63 & c, l > 65535 && 1114112 > l && (s = l))
							}
						}
						null === s ? (s = 65533, u = 1) : s > 65535 && (s -= 65536, n.push(s >>> 10 & 1023 | 55296), s = 56320 | 1023 & s), n.push(s),
							o += u
					}
					return q(n)
				}

				function q(e) {
					var t = e.length;
					if (Q >= t) return String.fromCharCode.apply(String, e);
					for (var r = "", n = 0; t > n;) r += String.fromCharCode.apply(String, e.slice(n, n += Q));
					return r
				}

				function S(e, t, r) {
					var n = "";
					r = Math.min(e.length, r);
					for (var o = t; r > o; o++) n += String.fromCharCode(127 & e[o]);
					return n
				}

				function x(e, t, r) {
					var n = "";
					r = Math.min(e.length, r);
					for (var o = t; r > o; o++) n += String.fromCharCode(e[o]);
					return n
				}

				function C(e, t, r) {
					var n = e.length;
					(!t || 0 > t) && (t = 0), (!r || 0 > r || r > n) && (r = n);
					for (var o = "", i = t; r > i; i++) o += F(e[i]);
					return o
				}

				function j(e, t, r) {
					for (var n = e.slice(t, r), o = "", i = 0; i < n.length; i += 2) o += String.fromCharCode(n[i] + 256 * n[i + 1]);
					return o
				}

				function B(e, t, r) {
					if (e % 1 !== 0 || 0 > e) throw new RangeError("offset is not uint");
					if (e + t > r) throw new RangeError("Trying to access beyond buffer length")
				}

				function U(e, t, r, n, o, i) {
					if (!s.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
					if (t > o || i > t) throw new RangeError('"value" argument is out of bounds');
					if (r + n > e.length) throw new RangeError("Index out of range")
				}

				function I(e, t, r, n) {
					0 > t && (t = 65535 + t + 1);
					for (var o = 0, i = Math.min(e.length - r, 2); i > o; o++) e[r + o] = (t & 255 << 8 * (n ? o : 1 - o)) >>> 8 * (n ? o : 1 - o)
				}

				function M(e, t, r, n) {
					0 > t && (t = 4294967295 + t + 1);
					for (var o = 0, i = Math.min(e.length - r, 4); i > o; o++) e[r + o] = t >>> 8 * (n ? o : 3 - o) & 255
				}

				function L(e, t, r, n, o, i) {
					if (r + n > e.length) throw new RangeError("Index out of range");
					if (0 > r) throw new RangeError("Index out of range")
				}

				function D(e, t, r, n, o) {
					return o || L(e, t, r, 4, 3.4028234663852886e38, -3.4028234663852886e38), K.write(e, t, r, n, 23, 4), r + 4
				}

				function G(e, t, r, n, o) {
					return o || L(e, t, r, 8, 1.7976931348623157e308, -1.7976931348623157e308), K.write(e, t, r, n, 52, 8), r + 8
				}

				function Y(e) {
					if (e = N(e).replace(ee, ""), e.length < 2) return "";
					for (; e.length % 4 !== 0;) e += "=";
					return e
				}

				function N(e) {
					return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "")
				}

				function F(e) {
					return 16 > e ? "0" + e.toString(16) : e.toString(16)
				}

				function H(e, t) {
					t = t || 1 / 0;
					for (var r, n = e.length, o = null, i = [], s = 0; n > s; s++) {
						if (r = e.charCodeAt(s), r > 55295 && 57344 > r) {
							if (!o) {
								if (r > 56319) {
									(t -= 3) > -1 && i.push(239, 191, 189);
									continue
								}
								if (s + 1 === n) {
									(t -= 3) > -1 && i.push(239, 191, 189);
									continue
								}
								o = r;
								continue
							}
							if (56320 > r) {
								(t -= 3) > -1 && i.push(239, 191, 189), o = r;
								continue
							}
							r = (o - 55296 << 10 | r - 56320) + 65536
						} else o && (t -= 3) > -1 && i.push(239, 191, 189);
						if (o = null, 128 > r) {
							if ((t -= 1) < 0) break;
							i.push(r)
						} else if (2048 > r) {
							if ((t -= 2) < 0) break;
							i.push(r >> 6 | 192, 63 & r | 128)
						} else if (65536 > r) {
							if ((t -= 3) < 0) break;
							i.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128)
						} else {
							if (!(1114112 > r)) throw new Error("Invalid code point");
							if ((t -= 4) < 0) break;
							i.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128)
						}
					}
					return i
				}

				function z(e) {
					for (var t = [], r = 0; r < e.length; r++) t.push(255 & e.charCodeAt(r));
					return t
				}

				function V(e, t) {
					for (var r, n, o, i = [], s = 0; s < e.length && !((t -= 2) < 0); s++) r = e.charCodeAt(s), n = r >> 8, o = r % 256, i.push(o),
						i.push(n);
					return i
				}

				function W(e) {
					return $.toByteArray(Y(e))
				}

				function X(e, t, r, n) {
					for (var o = 0; n > o && !(o + r >= t.length || o >= e.length); o++) t[o + r] = e[o];
					return o
				}

				function J(e) {
					return e !== e
				}
				var $ = e("base64-js"),
					K = e("ieee754"),
					Z = e("isarray");
				r.Buffer = s, r.SlowBuffer = _, r.INSPECT_MAX_BYTES = 50, s.TYPED_ARRAY_SUPPORT = void 0 !== t.TYPED_ARRAY_SUPPORT ? t.TYPED_ARRAY_SUPPORT :
					n(), r.kMaxLength = o(), s.poolSize = 8192, s._augment = function(e) {
						return e.__proto__ = s.prototype, e
					}, s.from = function(e, t, r) {
						return u(null, e, t, r)
					}, s.TYPED_ARRAY_SUPPORT && (s.prototype.__proto__ = Uint8Array.prototype, s.__proto__ = Uint8Array, "undefined" != typeof Symbol &&
						Symbol.species && s[Symbol.species] === s && Object.defineProperty(s, Symbol.species, {
							value: null,
							configurable: !0
						})), s.alloc = function(e, t, r) {
						return f(null, e, t, r)
					}, s.allocUnsafe = function(e) {
						return c(null, e)
					}, s.allocUnsafeSlow = function(e) {
						return c(null, e)
					}, s.isBuffer = function(e) {
						return !(null == e || !e._isBuffer)
					}, s.compare = function(e, t) {
						if (!s.isBuffer(e) || !s.isBuffer(t)) throw new TypeError("Arguments must be Buffers");
						if (e === t) return 0;
						for (var r = e.length, n = t.length, o = 0, i = Math.min(r, n); i > o; ++o)
							if (e[o] !== t[o]) {
								r = e[o], n = t[o];
								break
							}
						return n > r ? -1 : r > n ? 1 : 0
					}, s.isEncoding = function(e) {
						switch (String(e).toLowerCase()) {
							case "hex":
							case "utf8":
							case "utf-8":
							case "ascii":
							case "binary":
							case "base64":
							case "raw":
							case "ucs2":
							case "ucs-2":
							case "utf16le":
							case "utf-16le":
								return !0;
							default:
								return !1
						}
					}, s.concat = function(e, t) {
						if (!Z(e)) throw new TypeError('"list" argument must be an Array of Buffers');
						if (0 === e.length) return s.alloc(0);
						var r;
						if (void 0 === t)
							for (t = 0, r = 0; r < e.length; r++) t += e[r].length;
						var n = s.allocUnsafe(t),
							o = 0;
						for (r = 0; r < e.length; r++) {
							var i = e[r];
							if (!s.isBuffer(i)) throw new TypeError('"list" argument must be an Array of Buffers');
							i.copy(n, o), o += i.length
						}
						return n
					}, s.byteLength = g, s.prototype._isBuffer = !0, s.prototype.swap16 = function() {
						var e = this.length;
						if (e % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
						for (var t = 0; e > t; t += 2) v(this, t, t + 1);
						return this
					}, s.prototype.swap32 = function() {
						var e = this.length;
						if (e % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
						for (var t = 0; e > t; t += 4) v(this, t, t + 3), v(this, t + 1, t + 2);
						return this
					}, s.prototype.toString = function() {
						var e = 0 | this.length;
						return 0 === e ? "" : 0 === arguments.length ? P(this, 0, e) : m.apply(this, arguments)
					}, s.prototype.equals = function(e) {
						if (!s.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
						return this === e ? !0 : 0 === s.compare(this, e)
					}, s.prototype.inspect = function() {
						var e = "",
							t = r.INSPECT_MAX_BYTES;
						return this.length > 0 && (e = this.toString("hex", 0, t).match(/.{2}/g).join(" "), this.length > t && (e += " ... ")),
							"<Buffer " + e + ">"
					}, s.prototype.compare = function(e, t, r, n, o) {
						if (!s.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
						if (void 0 === t && (t = 0), void 0 === r && (r = e ? e.length : 0), void 0 === n && (n = 0), void 0 === o && (o = this.length),
							0 > t || r > e.length || 0 > n || o > this.length) throw new RangeError("out of range index");
						if (n >= o && t >= r) return 0;
						if (n >= o) return -1;
						if (t >= r) return 1;
						if (t >>>= 0, r >>>= 0, n >>>= 0, o >>>= 0, this === e) return 0;
						for (var i = o - n, u = r - t, a = Math.min(i, u), f = this.slice(n, o), c = e.slice(t, r), l = 0; a > l; ++l)
							if (f[l] !== c[l]) {
								i = f[l], u = c[l];
								break
							}
						return u > i ? -1 : i > u ? 1 : 0
					}, s.prototype.indexOf = function(e, t, r) {
						if ("string" == typeof t ? (r = t, t = 0) : t > 2147483647 ? t = 2147483647 : -2147483648 > t && (t = -2147483648), t >>= 0, 0 ===
							this.length) return -1;
						if (t >= this.length) return -1;
						if (0 > t && (t = Math.max(this.length + t, 0)), "string" == typeof e && (e = s.from(e, r)), s.isBuffer(e)) return 0 === e.length ?
							-1 : b(this, e, t, r);
						if ("number" == typeof e) return s.TYPED_ARRAY_SUPPORT && "function" === Uint8Array.prototype.indexOf ? Uint8Array.prototype.indexOf
							.call(this, e, t) : b(this, [e], t, r);
						throw new TypeError("val must be string, number or Buffer")
					}, s.prototype.includes = function(e, t, r) {
						return -1 !== this.indexOf(e, t, r)
					}, s.prototype.write = function(e, t, r, n) {
						if (void 0 === t) n = "utf8", r = this.length, t = 0;
						else if (void 0 === r && "string" == typeof t) n = t, r = this.length, t = 0;
						else {
							if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
							t = 0 | t, isFinite(r) ? (r = 0 | r, void 0 === n && (n = "utf8")) : (n = r, r = void 0)
						}
						var o = this.length - t;
						if ((void 0 === r || r > o) && (r = o), e.length > 0 && (0 > r || 0 > t) || t > this.length) throw new RangeError(
							"Attempt to write outside buffer bounds");
						n || (n = "utf8");
						for (var i = !1;;) switch (n) {
							case "hex":
								return w(this, e, t, r);
							case "utf8":
							case "utf-8":
								return E(this, e, t, r);
							case "ascii":
								return T(this, e, t, r);
							case "binary":
								return R(this, e, t, r);
							case "base64":
								return A(this, e, t, r);
							case "ucs2":
							case "ucs-2":
							case "utf16le":
							case "utf-16le":
								return k(this, e, t, r);
							default:
								if (i) throw new TypeError("Unknown encoding: " + n);
								n = ("" + n).toLowerCase(), i = !0
						}
					}, s.prototype.toJSON = function() {
						return {
							type: "Buffer",
							data: Array.prototype.slice.call(this._arr || this, 0)
						}
					};
				var Q = 4096;
				s.prototype.slice = function(e, t) {
					var r = this.length;
					e = ~~e, t = void 0 === t ? r : ~~t, 0 > e ? (e += r, 0 > e && (e = 0)) : e > r && (e = r), 0 > t ? (t += r, 0 > t && (t = 0)) :
						t > r && (t = r), e > t && (t = e);
					var n;
					if (s.TYPED_ARRAY_SUPPORT) n = this.subarray(e, t), n.__proto__ = s.prototype;
					else {
						var o = t - e;
						n = new s(o, void 0);
						for (var i = 0; o > i; i++) n[i] = this[i + e]
					}
					return n
				}, s.prototype.readUIntLE = function(e, t, r) {
					e = 0 | e, t = 0 | t, r || B(e, t, this.length);
					for (var n = this[e], o = 1, i = 0; ++i < t && (o *= 256);) n += this[e + i] * o;
					return n
				}, s.prototype.readUIntBE = function(e, t, r) {
					e = 0 | e, t = 0 | t, r || B(e, t, this.length);
					for (var n = this[e + --t], o = 1; t > 0 && (o *= 256);) n += this[e + --t] * o;
					return n
				}, s.prototype.readUInt8 = function(e, t) {
					return t || B(e, 1, this.length), this[e]
				}, s.prototype.readUInt16LE = function(e, t) {
					return t || B(e, 2, this.length), this[e] | this[e + 1] << 8
				}, s.prototype.readUInt16BE = function(e, t) {
					return t || B(e, 2, this.length), this[e] << 8 | this[e + 1]
				}, s.prototype.readUInt32LE = function(e, t) {
					return t || B(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
				}, s.prototype.readUInt32BE = function(e, t) {
					return t || B(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
				}, s.prototype.readIntLE = function(e, t, r) {
					e = 0 | e, t = 0 | t, r || B(e, t, this.length);
					for (var n = this[e], o = 1, i = 0; ++i < t && (o *= 256);) n += this[e + i] * o;
					return o *= 128, n >= o && (n -= Math.pow(2, 8 * t)), n
				}, s.prototype.readIntBE = function(e, t, r) {
					e = 0 | e, t = 0 | t, r || B(e, t, this.length);
					for (var n = t, o = 1, i = this[e + --n]; n > 0 && (o *= 256);) i += this[e + --n] * o;
					return o *= 128, i >= o && (i -= Math.pow(2, 8 * t)), i
				}, s.prototype.readInt8 = function(e, t) {
					return t || B(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
				}, s.prototype.readInt16LE = function(e, t) {
					t || B(e, 2, this.length);
					var r = this[e] | this[e + 1] << 8;
					return 32768 & r ? 4294901760 | r : r
				}, s.prototype.readInt16BE = function(e, t) {
					t || B(e, 2, this.length);
					var r = this[e + 1] | this[e] << 8;
					return 32768 & r ? 4294901760 | r : r
				}, s.prototype.readInt32LE = function(e, t) {
					return t || B(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
				}, s.prototype.readInt32BE = function(e, t) {
					return t || B(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
				}, s.prototype.readFloatLE = function(e, t) {
					return t || B(e, 4, this.length), K.read(this, e, !0, 23, 4)
				}, s.prototype.readFloatBE = function(e, t) {
					return t || B(e, 4, this.length), K.read(this, e, !1, 23, 4)
				}, s.prototype.readDoubleLE = function(e, t) {
					return t || B(e, 8, this.length), K.read(this, e, !0, 52, 8)
				}, s.prototype.readDoubleBE = function(e, t) {
					return t || B(e, 8, this.length), K.read(this, e, !1, 52, 8)
				}, s.prototype.writeUIntLE = function(e, t, r, n) {
					if (e = +e, t = 0 | t, r = 0 | r, !n) {
						var o = Math.pow(2, 8 * r) - 1;
						U(this, e, t, r, o, 0)
					}
					var i = 1,
						s = 0;
					for (this[t] = 255 & e; ++s < r && (i *= 256);) this[t + s] = e / i & 255;
					return t + r
				}, s.prototype.writeUIntBE = function(e, t, r, n) {
					if (e = +e, t = 0 | t, r = 0 | r, !n) {
						var o = Math.pow(2, 8 * r) - 1;
						U(this, e, t, r, o, 0)
					}
					var i = r - 1,
						s = 1;
					for (this[t + i] = 255 & e; --i >= 0 && (s *= 256);) this[t + i] = e / s & 255;
					return t + r
				}, s.prototype.writeUInt8 = function(e, t, r) {
					return e = +e, t = 0 | t, r || U(this, e, t, 1, 255, 0), s.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), this[t] = 255 & e, t + 1
				}, s.prototype.writeUInt16LE = function(e, t, r) {
					return e = +e, t = 0 | t, r || U(this, e, t, 2, 65535, 0), s.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) :
						I(this, e, t, !0), t + 2
				}, s.prototype.writeUInt16BE = function(e, t, r) {
					return e = +e, t = 0 | t, r || U(this, e, t, 2, 65535, 0), s.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) :
						I(this, e, t, !1), t + 2
				}, s.prototype.writeUInt32LE = function(e, t, r) {
					return e = +e, t = 0 | t, r || U(this, e, t, 4, 4294967295, 0), s.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, this[t + 2] =
						e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e) : M(this, e, t, !0), t + 4
				}, s.prototype.writeUInt32BE = function(e, t, r) {
					return e = +e, t = 0 | t, r || U(this, e, t, 4, 4294967295, 0), s.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>>
						16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : M(this, e, t, !1), t + 4
				}, s.prototype.writeIntLE = function(e, t, r, n) {
					if (e = +e, t = 0 | t, !n) {
						var o = Math.pow(2, 8 * r - 1);
						U(this, e, t, r, o - 1, -o)
					}
					var i = 0,
						s = 1,
						u = 0;
					for (this[t] = 255 & e; ++i < r && (s *= 256);) 0 > e && 0 === u && 0 !== this[t + i - 1] && (u = 1), this[t + i] = (e / s >> 0) -
						u & 255;
					return t + r
				}, s.prototype.writeIntBE = function(e, t, r, n) {
					if (e = +e, t = 0 | t, !n) {
						var o = Math.pow(2, 8 * r - 1);
						U(this, e, t, r, o - 1, -o)
					}
					var i = r - 1,
						s = 1,
						u = 0;
					for (this[t + i] = 255 & e; --i >= 0 && (s *= 256);) 0 > e && 0 === u && 0 !== this[t + i + 1] && (u = 1), this[t + i] = (e / s >>
						0) - u & 255;
					return t + r
				}, s.prototype.writeInt8 = function(e, t, r) {
					return e = +e, t = 0 | t, r || U(this, e, t, 1, 127, -128), s.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), 0 > e && (e = 255 + e +
						1), this[t] = 255 & e, t + 1
				}, s.prototype.writeInt16LE = function(e, t, r) {
					return e = +e, t = 0 | t, r || U(this, e, t, 2, 32767, -32768), s.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>>
						8) : I(this, e, t, !0), t + 2
				}, s.prototype.writeInt16BE = function(e, t, r) {
					return e = +e, t = 0 | t, r || U(this, e, t, 2, 32767, -32768), s.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 &
						e) : I(this, e, t, !1), t + 2
				}, s.prototype.writeInt32LE = function(e, t, r) {
					return e = +e, t = 0 | t, r || U(this, e, t, 4, 2147483647, -2147483648), s.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t +
						1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : M(this, e, t, !0), t + 4
				}, s.prototype.writeInt32BE = function(e, t, r) {
					return e = +e, t = 0 | t, r || U(this, e, t, 4, 2147483647, -2147483648), 0 > e && (e = 4294967295 + e + 1), s.TYPED_ARRAY_SUPPORT ?
						(this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : M(this, e, t, !1), t + 4
				}, s.prototype.writeFloatLE = function(e, t, r) {
					return D(this, e, t, !0, r)
				}, s.prototype.writeFloatBE = function(e, t, r) {
					return D(this, e, t, !1, r)
				}, s.prototype.writeDoubleLE = function(e, t, r) {
					return G(this, e, t, !0, r)
				}, s.prototype.writeDoubleBE = function(e, t, r) {
					return G(this, e, t, !1, r)
				}, s.prototype.copy = function(e, t, r, n) {
					if (r || (r = 0), n || 0 === n || (n = this.length), t >= e.length && (t = e.length), t || (t = 0), n > 0 && r > n && (n = r),
						n === r) return 0;
					if (0 === e.length || 0 === this.length) return 0;
					if (0 > t) throw new RangeError("targetStart out of bounds");
					if (0 > r || r >= this.length) throw new RangeError("sourceStart out of bounds");
					if (0 > n) throw new RangeError("sourceEnd out of bounds");
					n > this.length && (n = this.length), e.length - t < n - r && (n = e.length - t + r);
					var o, i = n - r;
					if (this === e && t > r && n > t)
						for (o = i - 1; o >= 0; o--) e[o + t] = this[o + r];
					else if (1e3 > i || !s.TYPED_ARRAY_SUPPORT)
						for (o = 0; i > o; o++) e[o + t] = this[o + r];
					else Uint8Array.prototype.set.call(e, this.subarray(r, r + i), t);
					return i
				}, s.prototype.fill = function(e, t, r, n) {
					if ("string" == typeof e) {
						if ("string" == typeof t ? (n = t, t = 0, r = this.length) : "string" == typeof r && (n = r, r = this.length), 1 === e.length) {
							var o = e.charCodeAt(0);
							256 > o && (e = o)
						}
						if (void 0 !== n && "string" != typeof n) throw new TypeError("encoding must be a string");
						if ("string" == typeof n && !s.isEncoding(n)) throw new TypeError("Unknown encoding: " + n)
					} else "number" == typeof e && (e = 255 & e);
					if (0 > t || this.length < t || this.length < r) throw new RangeError("Out of range index");
					if (t >= r) return this;
					t >>>= 0, r = void 0 === r ? this.length : r >>> 0, e || (e = 0);
					var i;
					if ("number" == typeof e)
						for (i = t; r > i; i++) this[i] = e;
					else {
						var u = s.isBuffer(e) ? e : H(new s(e, n).toString()),
							a = u.length;
						for (i = 0; r - t > i; i++) this[i + t] = u[i % a]
					}
					return this
				};
				var ee = /[^+\/0-9A-Za-z-_]/g
			}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
		}, {
			"base64-js": 29,
			ieee754: 34,
			isarray: 35
		}],
		31: [function(e, t, r) {
			function n() {
				return "WebkitAppearance" in document.documentElement.style || window.console && (console.firebug || console.exception && console.table) ||
					navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31
			}

			function o() {
				var e = arguments,
					t = this.useColors;
				if (e[0] = (t ? "%c" : "") + this.namespace + (t ? " %c" : " ") + e[0] + (t ? "%c " : " ") + "+" + r.humanize(this.diff), !t)
					return e;
				var n = "color: " + this.color;
				e = [e[0], n, "color: inherit"].concat(Array.prototype.slice.call(e, 1));
				var o = 0,
					i = 0;
				return e[0].replace(/%[a-z%]/g, function(e) {
					"%%" !== e && (o++, "%c" === e && (i = o))
				}), e.splice(i, 0, n), e
			}

			function i() {
				return "object" == typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments)
			}

			function s(e) {
				try {
					null == e ? r.storage.removeItem("debug") : r.storage.debug = e
				} catch (t) {}
			}

			function u() {
				var e;
				try {
					e = r.storage.debug
				} catch (t) {}
				return e
			}

			function a() {
				try {
					return window.localStorage
				} catch (e) {}
			}
			r = t.exports = e("./debug"), r.log = i, r.formatArgs = o, r.save = s, r.load = u, r.useColors = n, r.storage = "undefined" !=
				typeof chrome && "undefined" != typeof chrome.storage ? chrome.storage.local : a(), r.colors = ["lightseagreen", "forestgreen",
					"goldenrod", "dodgerblue", "darkorchid", "crimson"
				], r.formatters.j = function(e) {
					return JSON.stringify(e)
				}, r.enable(u())
		}, {
			"./debug": 32
		}],
		32: [function(e, t, r) {
			function n() {
				return r.colors[c++ % r.colors.length]
			}

			function o(e) {
				function t() {}

				function o() {
					var e = o,
						t = +new Date,
						i = t - (f || t);
					e.diff = i, e.prev = f, e.curr = t, f = t, null == e.useColors && (e.useColors = r.useColors()), null == e.color && e.useColors &&
						(e.color = n());
					var s = Array.prototype.slice.call(arguments);
					s[0] = r.coerce(s[0]), "string" != typeof s[0] && (s = ["%o"].concat(s));
					var u = 0;
					s[0] = s[0].replace(/%([a-z%])/g, function(t, n) {
						if ("%%" === t) return t;
						u++;
						var o = r.formatters[n];
						if ("function" == typeof o) {
							var i = s[u];
							t = o.call(e, i), s.splice(u, 1), u--
						}
						return t
					}), "function" == typeof r.formatArgs && (s = r.formatArgs.apply(e, s));
					var a = o.log || r.log || console.log.bind(console);
					a.apply(e, s)
				}
				t.enabled = !1, o.enabled = !0;
				var i = r.enabled(e) ? o : t;
				return i.namespace = e, i
			}

			function i(e) {
				r.save(e);
				for (var t = (e || "").split(/[\s,]+/), n = t.length, o = 0; n > o; o++) t[o] && (e = t[o].replace(/\*/g, ".*?"), "-" === e[0] ? r
					.skips.push(new RegExp("^" + e.substr(1) + "$")) : r.names.push(new RegExp("^" + e + "$")))
			}

			function s() {
				r.enable("")
			}

			function u(e) {
				var t, n;
				for (t = 0, n = r.skips.length; n > t; t++)
					if (r.skips[t].test(e)) return !1;
				for (t = 0, n = r.names.length; n > t; t++)
					if (r.names[t].test(e)) return !0;
				return !1
			}

			function a(e) {
				return e instanceof Error ? e.stack || e.message : e
			}
			r = t.exports = o, r.coerce = a, r.disable = s, r.enable = i, r.enabled = u, r.humanize = e("ms"), r.names = [], r.skips = [], r.formatters = {};
			var f, c = 0
		}, {
			ms: 37
		}],
		33: [function(t, r, n) {
			(function(n, o) {
				(function() {
					"use strict";

					function i(e) {
						return "function" == typeof e || "object" == typeof e && null !== e
					}

					function s(e) {
						return "function" == typeof e
					}

					function u(e) {
						J = e
					}

					function a(e) {
						Q = e
					}

					function f() {
						return function() {
							n.nextTick(d)
						}
					}

					function c() {
						return function() {
							X(d)
						}
					}

					function l() {
						var e = 0,
							t = new re(d),
							r = document.createTextNode("");
						return t.observe(r, {
								characterData: !0
							}),
							function() {
								r.data = e = ++e % 2
							}
					}

					function h() {
						var e = new MessageChannel;
						return e.port1.onmessage = d,
							function() {
								e.port2.postMessage(0)
							}
					}

					function p() {
						return function() {
							setTimeout(d, 1)
						}
					}

					function d() {
						for (var e = 0; Z > e; e += 2) {
							var t = ie[e],
								r = ie[e + 1];
							t(r), ie[e] = void 0, ie[e + 1] = void 0
						}
						Z = 0
					}

					function y() {
						try {
							var e = t,
								r = e("vertx");
							return X = r.runOnLoop || r.runOnContext, c()
						} catch (n) {
							return p()
						}
					}

					function _(e, t) {
						var r = this,
							n = new this.constructor(m);
						void 0 === n[ae] && M(n);
						var o = r._state;
						if (o) {
							var i = arguments[o - 1];
							Q(function() {
								B(o, n, i, r._result)
							})
						} else S(r, n, e, t);
						return n
					}

					function g(e) {
						var t = this;
						if (e && "object" == typeof e && e.constructor === t) return e;
						var r = new t(m);
						return k(r, e), r
					}

					function m() {}

					function v() {
						return new TypeError("You cannot resolve a promise with itself")
					}

					function b() {
						return new TypeError("A promises callback cannot return that same promise.")
					}

					function w(e) {
						try {
							return e.then
						} catch (t) {
							return he.error = t, he
						}
					}

					function E(e, t, r, n) {
						try {
							e.call(t, r, n)
						} catch (o) {
							return o
						}
					}

					function T(e, t, r) {
						Q(function(e) {
							var n = !1,
								o = E(r, t, function(r) {
									n || (n = !0, t !== r ? k(e, r) : P(e, r))
								}, function(t) {
									n || (n = !0, q(e, t))
								}, "Settle: " + (e._label || " unknown promise"));
							!n && o && (n = !0, q(e, o))
						}, e)
					}

					function R(e, t) {
						t._state === ce ? P(e, t._result) : t._state === le ? q(e, t._result) : S(t, void 0, function(t) {
							k(e, t)
						}, function(t) {
							q(e, t)
						})
					}

					function A(e, t, r) {
						t.constructor === e.constructor && r === se && constructor.resolve === ue ? R(e, t) : r === he ? q(e, he.error) : void 0 === r ?
							P(e, t) : s(r) ? T(e, t, r) : P(e, t)
					}

					function k(e, t) {
						e === t ? q(e, v()) : i(t) ? A(e, t, w(t)) : P(e, t)
					}

					function O(e) {
						e._onerror && e._onerror(e._result), x(e)
					}

					function P(e, t) {
						e._state === fe && (e._result = t, e._state = ce, 0 !== e._subscribers.length && Q(x, e))
					}

					function q(e, t) {
						e._state === fe && (e._state = le, e._result = t, Q(O, e))
					}

					function S(e, t, r, n) {
						var o = e._subscribers,
							i = o.length;
						e._onerror = null, o[i] = t, o[i + ce] = r, o[i + le] = n, 0 === i && e._state && Q(x, e)
					}

					function x(e) {
						var t = e._subscribers,
							r = e._state;
						if (0 !== t.length) {
							for (var n, o, i = e._result, s = 0; s < t.length; s += 3) n = t[s], o = t[s + r], n ? B(r, n, o, i) : o(i);
							e._subscribers.length = 0
						}
					}

					function C() {
						this.error = null
					}

					function j(e, t) {
						try {
							return e(t)
						} catch (r) {
							return pe.error = r, pe
						}
					}

					function B(e, t, r, n) {
						var o, i, u, a, f = s(r);
						if (f) {
							if (o = j(r, n), o === pe ? (a = !0, i = o.error, o = null) : u = !0, t === o) return void q(t, b())
						} else o = n, u = !0;
						t._state !== fe || (f && u ? k(t, o) : a ? q(t, i) : e === ce ? P(t, o) : e === le && q(t, o))
					}

					function U(e, t) {
						try {
							t(function(t) {
								k(e, t)
							}, function(t) {
								q(e, t)
							})
						} catch (r) {
							q(e, r)
						}
					}

					function I() {
						return de++
					}

					function M(e) {
						e[ae] = de++, e._state = void 0, e._result = void 0, e._subscribers = []
					}

					function L(e) {
						return new ve(this, e).promise
					}

					function D(e) {
						var t = this;
						return new t(K(e) ? function(r, n) {
							for (var o = e.length, i = 0; o > i; i++) t.resolve(e[i]).then(r, n)
						} : function(e, t) {
							t(new TypeError("You must pass an array to race."))
						})
					}

					function G(e) {
						var t = this,
							r = new t(m);
						return q(r, e), r
					}

					function Y() {
						throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")
					}

					function N() {
						throw new TypeError(
							"Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")
					}

					function F(e) {
						this[ae] = I(), this._result = this._state = void 0, this._subscribers = [], m !== e && ("function" != typeof e && Y(), this instanceof F ?
							U(this, e) : N())
					}

					function H(e, t) {
						this._instanceConstructor = e, this.promise = new e(m), this.promise[ae] || M(this.promise), K(t) ? (this._input = t, this.length =
							t.length, this._remaining = t.length, this._result = new Array(this.length), 0 === this.length ? P(this.promise, this._result) :
							(this.length = this.length || 0, this._enumerate(), 0 === this._remaining && P(this.promise, this._result))) : q(this.promise,
							z())
					}

					function z() {
						return new Error("Array Methods must be provided an Array")
					}

					function V() {
						var e;
						if ("undefined" != typeof o) e = o;
						else if ("undefined" != typeof self) e = self;
						else try {
							e = Function("return this")()
						} catch (t) {
							throw new Error("polyfill failed because global object is unavailable in this environment")
						}
						var r = e.Promise;
						r && "[object Promise]" === Object.prototype.toString.call(r.resolve()) && !r.cast || (e.Promise = me)
					}
					var W;
					W = Array.isArray ? Array.isArray : function(e) {
						return "[object Array]" === Object.prototype.toString.call(e)
					};
					var X, J, $, K = W,
						Z = 0,
						Q = function(e, t) {
							ie[Z] = e, ie[Z + 1] = t, Z += 2, 2 === Z && (J ? J(d) : $())
						},
						ee = "undefined" != typeof window ? window : void 0,
						te = ee || {},
						re = te.MutationObserver || te.WebKitMutationObserver,
						ne = "undefined" == typeof self && "undefined" != typeof n && "[object process]" === {}.toString.call(n),
						oe = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel,
						ie = new Array(1e3);
					$ = ne ? f() : re ? l() : oe ? h() : void 0 === ee && "function" == typeof t ? y() : p();
					var se = _,
						ue = g,
						ae = Math.random().toString(36).substring(16),
						fe = void 0,
						ce = 1,
						le = 2,
						he = new C,
						pe = new C,
						de = 0,
						ye = L,
						_e = D,
						ge = G,
						me = F;
					F.all = ye, F.race = _e, F.resolve = ue, F.reject = ge, F._setScheduler = u, F._setAsap = a, F._asap = Q, F.prototype = {
						constructor: F,
						then: se,
						"catch": function(e) {
							return this.then(null, e)
						}
					};
					var ve = H;
					H.prototype._enumerate = function() {
						for (var e = this.length, t = this._input, r = 0; this._state === fe && e > r; r++) this._eachEntry(t[r], r)
					}, H.prototype._eachEntry = function(e, t) {
						var r = this._instanceConstructor,
							n = r.resolve;
						if (n === ue) {
							var o = w(e);
							if (o === se && e._state !== fe) this._settledAt(e._state, t, e._result);
							else if ("function" != typeof o) this._remaining--, this._result[t] = e;
							else if (r === me) {
								var i = new r(m);
								A(i, e, o), this._willSettleAt(i, t)
							} else this._willSettleAt(new r(function(t) {
								t(e)
							}), t)
						} else this._willSettleAt(n(e), t)
					}, H.prototype._settledAt = function(e, t, r) {
						var n = this.promise;
						n._state === fe && (this._remaining--, e === le ? q(n, r) : this._result[t] = r), 0 === this._remaining && P(n, this._result)
					}, H.prototype._willSettleAt = function(e, t) {
						var r = this;
						S(e, void 0, function(e) {
							r._settledAt(ce, t, e)
						}, function(e) {
							r._settledAt(le, t, e)
						})
					};
					var be = V,
						we = {
							Promise: me,
							polyfill: be
						};
					"function" == typeof e && e.amd ? e(function() {
						return we
					}) : "undefined" != typeof r && r.exports ? r.exports = we : "undefined" != typeof this && (this.ES6Promise = we), be()
				}).call(this)
			}).call(this, t("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ?
				window : {})
		}, {
			_process: 38
		}],
		34: [function(e, t, r) {
			r.read = function(e, t, r, n, o) {
				var i, s, u = 8 * o - n - 1,
					a = (1 << u) - 1,
					f = a >> 1,
					c = -7,
					l = r ? o - 1 : 0,
					h = r ? -1 : 1,
					p = e[t + l];
				for (l += h, i = p & (1 << -c) - 1, p >>= -c, c += u; c > 0; i = 256 * i + e[t + l], l += h, c -= 8);
				for (s = i & (1 << -c) - 1, i >>= -c, c += n; c > 0; s = 256 * s + e[t + l], l += h, c -= 8);
				if (0 === i) i = 1 - f;
				else {
					if (i === a) return s ? NaN : (p ? -1 : 1) * (1 / 0);
					s += Math.pow(2, n), i -= f
				}
				return (p ? -1 : 1) * s * Math.pow(2, i - n)
			}, r.write = function(e, t, r, n, o, i) {
				var s, u, a, f = 8 * i - o - 1,
					c = (1 << f) - 1,
					l = c >> 1,
					h = 23 === o ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
					p = n ? 0 : i - 1,
					d = n ? 1 : -1,
					y = 0 > t || 0 === t && 0 > 1 / t ? 1 : 0;
				for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (u = isNaN(t) ? 1 : 0, s = c) : (s = Math.floor(Math.log(t) / Math.LN2), t * (a =
							Math.pow(2, -s)) < 1 && (s--, a *= 2), t += s + l >= 1 ? h / a : h * Math.pow(2, 1 - l), t * a >= 2 && (s++, a /= 2), s + l >=
						c ? (u = 0, s = c) : s + l >= 1 ? (u = (t * a - 1) * Math.pow(2, o), s += l) : (u = t * Math.pow(2, l - 1) * Math.pow(2, o), s =
							0)); o >= 8; e[r + p] = 255 & u, p += d, u /= 256, o -= 8);
				for (s = s << o | u, f += o; f > 0; e[r + p] = 255 & s, p += d, s /= 256, f -= 8);
				e[r + p - d] |= 128 * y
			}
		}, {}],
		35: [function(e, t, r) {
			var n = {}.toString;
			t.exports = Array.isArray || function(e) {
				return "[object Array]" == n.call(e)
			}
		}, {}],
		36: [function(e, t, r) {
			! function(r) {
				"use strict";
				var n, o = r.Base64,
					i = "2.1.9";
				if ("undefined" != typeof t && t.exports) try {
					n = e("buffer").Buffer
				} catch (s) {}
				var u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
					a = function(e) {
						for (var t = {}, r = 0, n = e.length; n > r; r++) t[e.charAt(r)] = r;
						return t
					}(u),
					f = String.fromCharCode,
					c = function(e) {
						if (e.length < 2) {
							var t = e.charCodeAt(0);
							return 128 > t ? e : 2048 > t ? f(192 | t >>> 6) + f(128 | 63 & t) : f(224 | t >>> 12 & 15) + f(128 | t >>> 6 & 63) + f(128 |
								63 & t)
						}
						var t = 65536 + 1024 * (e.charCodeAt(0) - 55296) + (e.charCodeAt(1) - 56320);
						return f(240 | t >>> 18 & 7) + f(128 | t >>> 12 & 63) + f(128 | t >>> 6 & 63) + f(128 | 63 & t)
					},
					l = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g,
					h = function(e) {
						return e.replace(l, c)
					},
					p = function(e) {
						var t = [0, 2, 1][e.length % 3],
							r = e.charCodeAt(0) << 16 | (e.length > 1 ? e.charCodeAt(1) : 0) << 8 | (e.length > 2 ? e.charCodeAt(2) : 0),
							n = [u.charAt(r >>> 18), u.charAt(r >>> 12 & 63), t >= 2 ? "=" : u.charAt(r >>> 6 & 63), t >= 1 ? "=" : u.charAt(63 & r)];
						return n.join("")
					},
					d = r.btoa ? function(e) {
						return r.btoa(e)
					} : function(e) {
						return e.replace(/[\s\S]{1,3}/g, p)
					},
					y = n ? function(e) {
						return (e.constructor === n.constructor ? e : new n(e)).toString("base64")
					} : function(e) {
						return d(h(e))
					},
					_ = function(e, t) {
						return t ? y(String(e)).replace(/[+\/]/g, function(e) {
							return "+" == e ? "-" : "_"
						}).replace(/=/g, "") : y(String(e))
					},
					g = function(e) {
						return _(e, !0)
					},
					m = new RegExp(["[À-ß][-¿]", "[à-ï][-¿]{2}", "[ð-÷][-¿]{3}"].join("|"), "g"),
					v = function(e) {
						switch (e.length) {
							case 4:
								var t = (7 & e.charCodeAt(0)) << 18 | (63 & e.charCodeAt(1)) << 12 | (63 & e.charCodeAt(2)) << 6 | 63 & e.charCodeAt(3),
									r = t - 65536;
								return f((r >>> 10) + 55296) + f((1023 & r) + 56320);
							case 3:
								return f((15 & e.charCodeAt(0)) << 12 | (63 & e.charCodeAt(1)) << 6 | 63 & e.charCodeAt(2));
							default:
								return f((31 & e.charCodeAt(0)) << 6 | 63 & e.charCodeAt(1))
						}
					},
					b = function(e) {
						return e.replace(m, v)
					},
					w = function(e) {
						var t = e.length,
							r = t % 4,
							n = (t > 0 ? a[e.charAt(0)] << 18 : 0) | (t > 1 ? a[e.charAt(1)] << 12 : 0) | (t > 2 ? a[e.charAt(2)] << 6 : 0) | (t > 3 ? a[e.charAt(
								3)] : 0),
							o = [f(n >>> 16), f(n >>> 8 & 255), f(255 & n)];
						return o.length -= [0, 0, 2, 1][r], o.join("")
					},
					E = r.atob ? function(e) {
						return r.atob(e)
					} : function(e) {
						return e.replace(/[\s\S]{1,4}/g, w)
					},
					T = n ? function(e) {
						return (e.constructor === n.constructor ? e : new n(e, "base64")).toString()
					} : function(e) {
						return b(E(e))
					},
					R = function(e) {
						return T(String(e).replace(/[-_]/g, function(e) {
							return "-" == e ? "+" : "/"
						}).replace(/[^A-Za-z0-9\+\/]/g, ""))
					},
					A = function() {
						var e = r.Base64;
						return r.Base64 = o, e
					};
				if (r.Base64 = {
						VERSION: i,
						atob: E,
						btoa: d,
						fromBase64: R,
						toBase64: _,
						utob: h,
						encode: _,
						encodeURI: g,
						btou: b,
						decode: R,
						noConflict: A
					}, "function" == typeof Object.defineProperty) {
					var k = function(e) {
						return {
							value: e,
							enumerable: !1,
							writable: !0,
							configurable: !0
						}
					};
					r.Base64.extendString = function() {
						Object.defineProperty(String.prototype, "fromBase64", k(function() {
							return R(this)
						})), Object.defineProperty(String.prototype, "toBase64", k(function(e) {
							return _(this, e)
						})), Object.defineProperty(String.prototype, "toBase64URI", k(function() {
							return _(this, !0)
						}))
					}
				}
				r.Meteor && (Base64 = r.Base64)
			}(this)
		}, {
			buffer: 30
		}],
		37: [function(e, t, r) {
			function n(e) {
				if (e = "" + e, !(e.length > 1e4)) {
					var t = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
						e);
					if (t) {
						var r = parseFloat(t[1]),
							n = (t[2] || "ms").toLowerCase();
						switch (n) {
							case "years":
							case "year":
							case "yrs":
							case "yr":
							case "y":
								return r * l;
							case "days":
							case "day":
							case "d":
								return r * c;
							case "hours":
							case "hour":
							case "hrs":
							case "hr":
							case "h":
								return r * f;
							case "minutes":
							case "minute":
							case "mins":
							case "min":
							case "m":
								return r * a;
							case "seconds":
							case "second":
							case "secs":
							case "sec":
							case "s":
								return r * u;
							case "milliseconds":
							case "millisecond":
							case "msecs":
							case "msec":
							case "ms":
								return r
						}
					}
				}
			}

			function o(e) {
				return e >= c ? Math.round(e / c) + "d" : e >= f ? Math.round(e / f) + "h" : e >= a ? Math.round(e / a) + "m" : e >= u ? Math.round(
					e / u) + "s" : e + "ms"
			}

			function i(e) {
				return s(e, c, "day") || s(e, f, "hour") || s(e, a, "minute") || s(e, u, "second") || e + " ms"
			}

			function s(e, t, r) {
				return t > e ? void 0 : 1.5 * t > e ? Math.floor(e / t) + " " + r : Math.ceil(e / t) + " " + r + "s"
			}
			var u = 1e3,
				a = 60 * u,
				f = 60 * a,
				c = 24 * f,
				l = 365.25 * c;
			t.exports = function(e, t) {
				return t = t || {}, "string" == typeof e ? n(e) : t["long"] ? i(e) : o(e)
			}
		}, {}],
		38: [function(e, t, r) {
			function n() {
				c && u && (c = !1, u.length ? f = u.concat(f) : l = -1, f.length && o())
			}

			function o() {
				if (!c) {
					var e = setTimeout(n);
					c = !0;
					for (var t = f.length; t;) {
						for (u = f, f = []; ++l < t;) u && u[l].run();
						l = -1, t = f.length
					}
					u = null, c = !1, clearTimeout(e)
				}
			}

			function i(e, t) {
				this.fun = e, this.array = t
			}

			function s() {}
			var u, a = t.exports = {},
				f = [],
				c = !1,
				l = -1;
			a.nextTick = function(e) {
					var t = new Array(arguments.length - 1);
					if (arguments.length > 1)
						for (var r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
					f.push(new i(e, t)), 1 !== f.length || c || setTimeout(o, 0)
				}, i.prototype.run = function() {
					this.fun.apply(null, this.array)
				}, a.title = "browser", a.browser = !0, a.env = {}, a.argv = [], a.version = "", a.versions = {}, a.on = s, a.addListener = s, a.once =
				s, a.off = s, a.removeListener = s, a.removeAllListeners = s, a.emit = s, a.binding = function(e) {
					throw new Error("process.binding is not supported")
				}, a.cwd = function() {
					return "/"
				}, a.chdir = function(e) {
					throw new Error("process.chdir is not supported")
				}, a.umask = function() {
					return 0
				}
		}, {}],
		39: [function(t, r, n) {
			(function(t) {
				! function(o) {
					function i(e) {
						for (var t, r, n = [], o = 0, i = e.length; i > o;) t = e.charCodeAt(o++), t >= 55296 && 56319 >= t && i > o ? (r = e.charCodeAt(
							o++), 56320 == (64512 & r) ? n.push(((1023 & t) << 10) + (1023 & r) + 65536) : (n.push(t), o--)) : n.push(t);
						return n
					}

					function s(e) {
						for (var t, r = e.length, n = -1, o = ""; ++n < r;) t = e[n], t > 65535 && (t -= 65536, o += b(t >>> 10 & 1023 | 55296), t =
							56320 | 1023 & t), o += b(t);
						return o
					}

					function u(e) {
						if (e >= 55296 && 57343 >= e) throw Error("Lone surrogate U+" + e.toString(16).toUpperCase() + " is not a scalar value")
					}

					function a(e, t) {
						return b(e >> t & 63 | 128)
					}

					function f(e) {
						if (0 == (4294967168 & e)) return b(e);
						var t = "";
						return 0 == (4294965248 & e) ? t = b(e >> 6 & 31 | 192) : 0 == (4294901760 & e) ? (u(e), t = b(e >> 12 & 15 | 224), t += a(e, 6)) :
							0 == (4292870144 & e) && (t = b(e >> 18 & 7 | 240), t += a(e, 12), t += a(e, 6)), t += b(63 & e | 128)
					}

					function c(e) {
						for (var t, r = i(e), n = r.length, o = -1, s = ""; ++o < n;) t = r[o], s += f(t);
						return s
					}

					function l() {
						if (v >= m) throw Error("Invalid byte index");
						var e = 255 & g[v];
						if (v++, 128 == (192 & e)) return 63 & e;
						throw Error("Invalid continuation byte")
					}

					function h() {
						var e, t, r, n, o;
						if (v > m) throw Error("Invalid byte index");
						if (v == m) return !1;
						if (e = 255 & g[v], v++, 0 == (128 & e)) return e;
						if (192 == (224 & e)) {
							var t = l();
							if (o = (31 & e) << 6 | t, o >= 128) return o;
							throw Error("Invalid continuation byte")
						}
						if (224 == (240 & e)) {
							if (t = l(), r = l(), o = (15 & e) << 12 | t << 6 | r, o >= 2048) return u(o), o;
							throw Error("Invalid continuation byte")
						}
						if (240 == (248 & e) && (t = l(), r = l(), n = l(), o = (15 & e) << 18 | t << 12 | r << 6 | n, o >= 65536 && 1114111 >= o))
							return o;
						throw Error("Invalid UTF-8 detected")
					}

					function p(e) {
						g = i(e), m = g.length, v = 0;
						for (var t, r = [];
							(t = h()) !== !1;) r.push(t);
						return s(r)
					}
					var d = "object" == typeof n && n,
						y = "object" == typeof r && r && r.exports == d && r,
						_ = "object" == typeof t && t;
					_.global !== _ && _.window !== _ || (o = _);
					var g, m, v, b = String.fromCharCode,
						w = {
							version: "2.0.0",
							encode: c,
							decode: p
						};
					if ("function" == typeof e && "object" == typeof e.amd && e.amd) e(function() {
						return w
					});
					else if (d && !d.nodeType)
						if (y) y.exports = w;
						else {
							var E = {},
								T = E.hasOwnProperty;
							for (var R in w) T.call(w, R) && (d[R] = w[R])
						}
					else o.utf8 = w
				}(this)
			}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
		}, {}]
	}, {}, [2])(2)
});
//# sourceMappingURL=GitHub.bundle.min.js.map