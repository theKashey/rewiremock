/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "5d29dd0ed51e1aca68b2"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./_tests/karma.js")(__webpack_require__.s = "./_tests/karma.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./_tests recursive .js$":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
var map = {
	"./cache.spec.js": "./_tests/cache.spec.js",
	"./es6.spec.js": "./_tests/es6.spec.js",
	"./isolation.spec.js": "./_tests/isolation.spec.js",
	"./karma.js": "./_tests/karma.js",
	"./lib/a/foo.js": "./_tests/lib/a/foo.js",
	"./lib/a/foo2.js": "./_tests/lib/a/foo2.js",
	"./lib/a/test.es6.js": "./_tests/lib/a/test.es6.js",
	"./lib/a/test.js": "./_tests/lib/a/test.js",
	"./lib/b/bar.js": "./_tests/lib/b/bar.js",
	"./lib/b/baz.js": "./_tests/lib/b/baz.js",
	"./lib/c/bar.js": "./_tests/lib/c/bar.js",
	"./lib/c/barbaz.js": "./_tests/lib/c/barbaz.js",
	"./lib/c/baz.js": "./_tests/lib/c/baz.js",
	"./lib/c/foo.js": "./_tests/lib/c/foo.js",
	"./lib/cache/a.js": "./_tests/lib/cache/a.js",
	"./lib/cache/b.js": "./_tests/lib/cache/b.js",
	"./lib/cache/index.js": "./_tests/lib/cache/index.js",
	"./lib/es6/bar.js": "./_tests/lib/es6/bar.js",
	"./lib/es6/foo.js": "./_tests/lib/es6/foo.js",
	"./lib/es6/test.js": "./_tests/lib/es6/test.js",
	"./lib/nested-broken.setup.js": "./_tests/lib/nested-broken.setup.js",
	"./lib/nested-valid.setup.js": "./_tests/lib/nested-valid.setup.js",
	"./lib/tristate/a1.js": "./_tests/lib/tristate/a1.js",
	"./lib/tristate/a2.js": "./_tests/lib/tristate/a2.js",
	"./lib/tristate/b.js": "./_tests/lib/tristate/b.js",
	"./lib/tristate/c.js": "./_tests/lib/tristate/c.js",
	"./lib/typed/a-delayed.js": "./_tests/lib/typed/a-delayed.js",
	"./lib/typed/a.js": "./_tests/lib/typed/a.js",
	"./lib/typed/b.js": "./_tests/lib/typed/b.js",
	"./lib/use-node_module.js": "./_tests/lib/use-node_module.js",
	"./mock.spec.js": "./_tests/mock.spec.js",
	"./nested.spec.js": "./_tests/nested.spec.js",
	"./plugins/allDisabled.spec.js": "./_tests/plugins/allDisabled.spec.js",
	"./plugins/common/alias.spec.js": "./_tests/plugins/common/alias.spec.js",
	"./plugins/lib/foo.js": "./_tests/plugins/lib/foo.js",
	"./plugins/lib/sub/foo.js": "./_tests/plugins/lib/sub/foo.js",
	"./plugins/lib/sub/test.js": "./_tests/plugins/lib/sub/test.js",
	"./plugins/lib/test.js": "./_tests/plugins/lib/test.js",
	"./plugins/relative.spec.js": "./_tests/plugins/relative.spec.js",
	"./scope.spec.js": "./_tests/scope.spec.js",
	"./simple-case.spec.js": "./_tests/simple-case.spec.js",
	"./tristate.spec.js": "./_tests/tristate.spec.js",
	"./typedImport.spec.js": "./_tests/typedImport.spec.js",
	"./webpack.config.js": "./_tests/webpack.config.js"
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./_tests recursive .js$";

/***/ }),

/***/ "./_tests recursive .spec.js$":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
var map = {
	"./cache.spec.js": "./_tests/cache.spec.js",
	"./es6.spec.js": "./_tests/es6.spec.js",
	"./isolation.spec.js": "./_tests/isolation.spec.js",
	"./mock.spec.js": "./_tests/mock.spec.js",
	"./nested.spec.js": "./_tests/nested.spec.js",
	"./plugins/allDisabled.spec.js": "./_tests/plugins/allDisabled.spec.js",
	"./plugins/common/alias.spec.js": "./_tests/plugins/common/alias.spec.js",
	"./plugins/relative.spec.js": "./_tests/plugins/relative.spec.js",
	"./scope.spec.js": "./_tests/scope.spec.js",
	"./simple-case.spec.js": "./_tests/simple-case.spec.js",
	"./tristate.spec.js": "./_tests/tristate.spec.js",
	"./typedImport.spec.js": "./_tests/typedImport.spec.js"
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./_tests recursive .spec.js$";

/***/ }),

/***/ "./_tests/cache.spec.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(__filename) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chai__ = __webpack_require__("./node_modules/chai/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chai___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_chai__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_path__ = __webpack_require__("./node_modules/path-browserify/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_index__ = __webpack_require__("./src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_wipeCache__ = __webpack_require__("./src/wipeCache.js");





describe('cache', () => {

  const resetCache = () => {
    const wipeAll = (stubs, moduleName) => moduleName.indexOf(stubs) === 0;
    Object(__WEBPACK_IMPORTED_MODULE_3__src_wipeCache__["b" /* wipe */])(__WEBPACK_IMPORTED_MODULE_1_path___default.a.dirname(__filename), wipeAll);
  };

  it('should clear mocked modules cache', () => {
    __WEBPACK_IMPORTED_MODULE_2__src_index__["b" /* default */].inScope(() => {
      resetCache();
      var a1 = __webpack_require__("./_tests/lib/cache/a.js").functionA;
      __WEBPACK_IMPORTED_MODULE_2__src_index__["b" /* default */].forceCacheClear('nocache');
      var i0 = __WEBPACK_IMPORTED_MODULE_2__src_index__["b" /* default */].proxy('./lib/cache', {
        './a': {
          functionA: () => {
          }
        },
      }).default;
      var a2 = __webpack_require__("./_tests/lib/cache/a.js").functionA;
      var b2 = __webpack_require__("./_tests/lib/cache/b.js").functionB;
      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(String(a1)).to.be.equal(String(a2));
      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(a1).not.to.be.equal(a2);
      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(i0.a).not.to.be.equal(a1);
      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(i0.a).not.to.be.equal(a2);
      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(i0.b).to.be.equal(b2);
    });
  });

  it('should disrespect all the cache', () => {
    __WEBPACK_IMPORTED_MODULE_2__src_index__["b" /* default */].inScope(() => {
      resetCache();
      var a1 = __webpack_require__("./_tests/lib/cache/a.js").functionA;
      __WEBPACK_IMPORTED_MODULE_2__src_index__["b" /* default */].forceCacheClear();
      var i0 = __WEBPACK_IMPORTED_MODULE_2__src_index__["b" /* default */].proxy('./lib/cache', {
        './a': {
          functionA: () => {
          }
        },
      }).default;
      var a2 = __webpack_require__("./_tests/lib/cache/a.js").functionA;
      var b2 = __webpack_require__("./_tests/lib/cache/b.js").functionB;
      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(a1).to.be.deep.equal(a2);
      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(a1).to.be.equal(a2);
      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(i0.a).not.to.be.equal(a1);
      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(i0.a).not.to.be.equal(a2);
      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(i0.b).not.to.be.equal(b2);
    });
  });

  it('should respect cache', () => {
    __WEBPACK_IMPORTED_MODULE_2__src_index__["b" /* default */].inScope(() => {
      resetCache();
      var a1 = __webpack_require__("./_tests/lib/cache/a.js").functionA;
      var i0 = __WEBPACK_IMPORTED_MODULE_2__src_index__["b" /* default */].proxy('./lib/cache', {
        './a': {
          functionA: () => {
          }
        },
      }).default;
      var a2 = __webpack_require__("./_tests/lib/cache/a.js").functionA;
      var b2 = __webpack_require__("./_tests/lib/cache/b.js").functionB;
      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(a1).to.be.deep.equal(a2);
      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(a1).to.be.equal(a2);
      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(i0.a).not.to.be.equal(a1);
      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(i0.a).not.to.be.equal(a2);
      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(i0.b).to.be.equal(b2);
    });
  })
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, "/index.js"))

/***/ }),

/***/ "./_tests/es6.spec.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chai__ = __webpack_require__("./node_modules/chai/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chai___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_chai__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_index__ = __webpack_require__("./src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_plugins__ = __webpack_require__("./src/plugins.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_plugins_relative__ = __webpack_require__("./src/plugins/relative.js");







describe('es6 modules ', () => {
    it('should not overload: ', () => {
        const unmockedBaz = __webpack_require__("./_tests/lib/es6/test.js").default;
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz()).to.be.equal('foobarbaz');
    });

    it('should overload default export with node plugin: ', () => {
        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_1__src_index__["c" /* plugins */].relative);
        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./foo')
            .withDefault(()=>'aa');

        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./bar')
            .with({
                bar: ()=>'bb',
                baz: ()=>'cc',
            });

        const unmockedBaz = __webpack_require__("./_tests/lib/es6/test.js").default;
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz()).to.be.equal('foobarbaz');

        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].enable();

        const mockedBaz = __webpack_require__("./_tests/lib/es6/test.js").default;
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('aabbcc');
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].disable();
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].clear();
        Object(__WEBPACK_IMPORTED_MODULE_2__src_plugins__["a" /* _clearPlugins */])();
    });

    it('should overload not-default export with node plugin: ', () => {
        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_3__src_plugins_relative__["a" /* default */]);
        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./foo')
            .with(()=>'aa');

        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./bar')
            .es6()
            .with({
                bar: ()=>'bb',
                baz: ()=>'cc',
            });

        const unmockedBaz = __webpack_require__("./_tests/lib/es6/test.js").default;
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz()).to.be.equal('foobarbaz');

        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].enable();

        const mockedBaz = __webpack_require__("./_tests/lib/es6/test.js").default;
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('aabbcc');
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].disable();
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].clear();
        Object(__WEBPACK_IMPORTED_MODULE_2__src_plugins__["a" /* _clearPlugins */])();
    });

    it('should fail with callThrough: ', () => {
        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_3__src_plugins_relative__["a" /* default */]);
        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./foo')
            .callThrough()
            .with(()=>'aa');

        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./bar')
            .es6()
            .with({
                bar: ()=>'bb',
                baz: ()=>'cc',
            });

        const unmockedBaz = __webpack_require__("./_tests/lib/es6/test.js").default;
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz()).to.be.equal('foobarbaz');

        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].enable();

        const mockedBaz = __webpack_require__("./_tests/lib/es6/test.js").default;
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('foobbcc');
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].disable();
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].clear();
        Object(__WEBPACK_IMPORTED_MODULE_2__src_plugins__["a" /* _clearPlugins */])();
    });

    it('should fail with callThrough: ', () => {
        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_3__src_plugins_relative__["a" /* default */]);
        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./foo')
            .callThrough()
            .withDefault(()=>'aa');

        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./bar')
            .es6()
            .with({
                bar: ()=>'bb',
                baz: ()=>'cc',
            });

        const unmockedBaz = __webpack_require__("./_tests/lib/es6/test.js").default;
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz()).to.be.equal('foobarbaz');

        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].enable();

        const mockedBaz = __webpack_require__("./_tests/lib/es6/test.js").default;
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('aabbcc');
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].disable();
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].clear();
        Object(__WEBPACK_IMPORTED_MODULE_2__src_plugins__["a" /* _clearPlugins */])();
    });

});


/***/ }),

/***/ "./_tests/isolation.spec.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chai__ = __webpack_require__("./node_modules/chai/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chai___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_chai__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_index__ = __webpack_require__("./src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_plugins__ = __webpack_require__("./src/plugins.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_plugins_nodejs__ = __webpack_require__("./src/plugins/nodejs.js");







describe('isolation ', () => {
  it('should trigger error: ', () => {
    Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_3__src_plugins_nodejs__["a" /* default */]);
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].enable();
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].isolation();

    try {
      __webpack_require__("./_tests/lib/a/test.js");
      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])("should not be called").to.be.equal(false);
    } catch (e) {

    }
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].disable();
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].clear();
    Object(__WEBPACK_IMPORTED_MODULE_2__src_plugins__["a" /* _clearPlugins */])();
  });

  it('work in isolation: ', () => {
    Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_3__src_plugins_nodejs__["a" /* default */]);
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].passBy(/node_modules/);
    Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./lib/a/foo')
      .with(() => 'aa');

    Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./lib/a/../b/bar')
      .with(() => 'bb');

    Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./lib/a/../b/baz')
      .with(() => 'cc');

    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].enable();
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].isolation();

    const mockedBaz = __webpack_require__("./_tests/lib/a/test.js");
    Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('aabbcc');
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].disable();
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].clear();
    Object(__WEBPACK_IMPORTED_MODULE_2__src_plugins__["a" /* _clearPlugins */])();
  });

  it('should passby modules: ', () => {
    Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_3__src_plugins_nodejs__["a" /* default */]);
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].passBy(/node_modules/);
    Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./lib/a/foo')
      .with(() => 'aa');

    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].passBy(module => module.indexOf('b/bar') >= 0);
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].passBy(/b\/baz/);

    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].enable();
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].isolation();

    const mockedBaz = __webpack_require__("./_tests/lib/a/test.js");
    Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('aabarbaz');
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].disable();
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].clear();
    Object(__WEBPACK_IMPORTED_MODULE_2__src_plugins__["a" /* _clearPlugins */])();
  });

  it('should nest passby: ', () => {
    Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_3__src_plugins_nodejs__["a" /* default */]);
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].passBy(/node_modules/);
    Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./lib/a/foo')
      .with(() => 'aa');

    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].passBy(/test.js/);

    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].enable();
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].isolation();

    const mockedBaz = __webpack_require__("./_tests/lib/a/test.js");
    Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('aabarbaz');
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].disable();
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].clear();
    Object(__WEBPACK_IMPORTED_MODULE_2__src_plugins__["a" /* _clearPlugins */])();
  });

  it('should nest mocked module: ', () => {
    Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_3__src_plugins_nodejs__["a" /* default */]);
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].passBy(/node_modules/);
    Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./lib/c/bar')
      .callThrough();

    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].enable();
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].isolation();

    const mockedBaz = __webpack_require__("./_tests/lib/c/foo.js");
    Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('>+!');
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].disable();
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].clear();
    Object(__WEBPACK_IMPORTED_MODULE_2__src_plugins__["a" /* _clearPlugins */])();
  });

  it('should nest mocked module with options: ', () => {
    Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_3__src_plugins_nodejs__["a" /* default */]);
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].passBy(/node_modules/);
    Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./lib/c/bar')
      .callThrough();

    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].enable();
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].isolation({
      noAutoPassBy: true
    });

    try {
      __webpack_require__("./_tests/lib/c/foo.js");
      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])('should not be called').to.equal.false();
    } catch(e) {

    }
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].disable();
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].clear();
    Object(__WEBPACK_IMPORTED_MODULE_2__src_plugins__["a" /* _clearPlugins */])();
  });

  it('should inverse isolation by toBeUsed: ', () => {
    Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./lib/a/foo')
      .with(() => 'aa')
      .toBeUsed();

    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].enable();

    const mockedBaz = __webpack_require__("./_tests/lib/a/test.js");
    Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('foobarbaz');
    try {
      __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].disable();
      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])('should not be called').to.equal.false();
    } catch (e) {

    }
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].clear();
    Object(__WEBPACK_IMPORTED_MODULE_2__src_plugins__["a" /* _clearPlugins */])();
  });
});


/***/ }),

/***/ "./_tests/karma.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
__webpack_require__("./_tests recursive .js$");
__webpack_require__("./webpack/interceptor.js")

var testsContext = __webpack_require__("./_tests recursive .spec.js$");
testsContext.keys().forEach(testsContext);

/***/ }),

/***/ "./_tests/lib/a/foo.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
module.exports = function foo(){
    return 'foo';
}

/***/ }),

/***/ "./_tests/lib/a/foo2.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
module.exports = function foo(){
    return 'FOO';
}

/***/ }),

/***/ "./_tests/lib/a/test.es6.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var test1 = __webpack_require__("./_tests/lib/a/foo.js");
var test2 = __webpack_require__("./_tests/lib/b/bar.js");
var test3 = __webpack_require__("./_tests/lib/b/baz.js");

/* harmony default export */ __webpack_exports__["default"] = (function () {
    return test1() + test2() + test3();
});;

/***/ }),

/***/ "./_tests/lib/a/test.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
var test1 = __webpack_require__("./_tests/lib/a/foo.js");
var test2 = __webpack_require__("./_tests/lib/b/bar.js");
var test3 = __webpack_require__("./_tests/lib/b/baz.js");

module.exports = function () {
    return test1() + test2() + test3();
};

/***/ }),

/***/ "./_tests/lib/b/bar.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
module.exports = function bar(){
    return 'bar';
}

/***/ }),

/***/ "./_tests/lib/b/baz.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
module.exports = function bar(){
    return 'baz';
}

/***/ }),

/***/ "./_tests/lib/c/bar.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
var baz = __webpack_require__("./_tests/lib/c/baz.js");

module.exports = function () {
  return "+"+baz();
};

/***/ }),

/***/ "./_tests/lib/c/barbaz.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
var bar = __webpack_require__("./_tests/lib/c/bar.js");
var baz = __webpack_require__("./_tests/lib/c/baz.js");

module.exports = function () {
  return ">"+bar()+baz();
};

/***/ }),

/***/ "./_tests/lib/c/baz.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
module.exports = function () {
  return "!";
};

/***/ }),

/***/ "./_tests/lib/c/foo.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
var bar = __webpack_require__("./_tests/lib/c/bar.js");

module.exports = function () {
  return ">"+bar();
};

/***/ }),

/***/ "./_tests/lib/cache/a.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
const functionA = () => 'A'
/* harmony export (immutable) */ __webpack_exports__["functionA"] = functionA;


/***/ }),

/***/ "./_tests/lib/cache/b.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
const functionB = () => 'A'
/* harmony export (immutable) */ __webpack_exports__["functionB"] = functionB;


/***/ }),

/***/ "./_tests/lib/cache/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__a__ = __webpack_require__("./_tests/lib/cache/a.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__b__ = __webpack_require__("./_tests/lib/cache/b.js");



/* harmony default export */ __webpack_exports__["default"] = ({
  a: __WEBPACK_IMPORTED_MODULE_0__a__["functionA"],
  b: __WEBPACK_IMPORTED_MODULE_1__b__["functionB"]
});

/***/ }),

/***/ "./_tests/lib/es6/bar.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bar", function() { return bar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "baz", function() { return baz; });
const bar = () => 'bar';
const baz = () => 'baz';



/***/ }),

/***/ "./_tests/lib/es6/foo.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
const foo = () => 'foo';

/* harmony default export */ __webpack_exports__["default"] = (foo);

/***/ }),

/***/ "./_tests/lib/es6/test.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__foo__ = __webpack_require__("./_tests/lib/es6/foo.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bar__ = __webpack_require__("./_tests/lib/es6/bar.js");



const test = () => Object(__WEBPACK_IMPORTED_MODULE_0__foo__["default"])() + Object(__WEBPACK_IMPORTED_MODULE_1__bar__["bar"])() + Object(__WEBPACK_IMPORTED_MODULE_1__bar__["baz"])();

/* harmony default export */ __webpack_exports__["default"] = (test);

/***/ }),

/***/ "./_tests/lib/nested-broken.setup.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_index__ = __webpack_require__("./src/index.js");
//import rewiremock from '../../src/index';


Object(__WEBPACK_IMPORTED_MODULE_0__src_index__["b" /* default */])('./foo')
    .with(()=>'aa');

Object(__WEBPACK_IMPORTED_MODULE_0__src_index__["b" /* default */])('../b/bar')
    .with(()=>'bb');

Object(__WEBPACK_IMPORTED_MODULE_0__src_index__["b" /* default */])('../b/baz')
    .with(()=>'cc');

/***/ }),

/***/ "./_tests/lib/nested-valid.setup.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
//import rewiremock from '../../nested';
//import rewiremock from '../../src/nested';

module.exports = (rewiremock) => {
    rewiremock('./foo')
        .with(() => 'aa');

    rewiremock('../b/bar')
        .with(() => 'bb');

    rewiremock('../b/baz')
        .with(() => 'cc');
};

/***/ }),

/***/ "./_tests/lib/tristate/a1.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__b__ = __webpack_require__("./_tests/lib/tristate/b.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__c__ = __webpack_require__("./_tests/lib/tristate/c.js");



/* harmony default export */ __webpack_exports__["default"] = (() => Object(__WEBPACK_IMPORTED_MODULE_0__b__["default"])() + Object(__WEBPACK_IMPORTED_MODULE_1__c__["default"])());

/***/ }),

/***/ "./_tests/lib/tristate/a2.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__c__ = __webpack_require__("./_tests/lib/tristate/c.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__b__ = __webpack_require__("./_tests/lib/tristate/b.js");



/* harmony default export */ __webpack_exports__["default"] = (() => Object(__WEBPACK_IMPORTED_MODULE_1__b__["default"])() + Object(__WEBPACK_IMPORTED_MODULE_0__c__["default"])());

/***/ }),

/***/ "./_tests/lib/tristate/b.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__c__ = __webpack_require__("./_tests/lib/tristate/c.js");


/* harmony default export */ __webpack_exports__["default"] = (() => Object(__WEBPACK_IMPORTED_MODULE_0__c__["default"])().toUpperCase());

/***/ }),

/***/ "./_tests/lib/tristate/c.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony default export */ __webpack_exports__["default"] = (() => "foo");

/***/ }),

/***/ "./_tests/lib/typed/a-delayed.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
// @flow
let a=42;

new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, "./_tests/lib/typed/b.js")).then(t => a=t.default());

/* harmony default export */ __webpack_exports__["default"] = (() => a);

/***/ }),

/***/ "./_tests/lib/typed/a.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__b_js__ = __webpack_require__("./_tests/lib/typed/b.js");
// @flow



/* harmony default export */ __webpack_exports__["default"] = (() => Object(__WEBPACK_IMPORTED_MODULE_0__b_js__["default"])());

/***/ }),

/***/ "./_tests/lib/typed/b.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
// @flow
const function1 = () => {};
/* harmony export (immutable) */ __webpack_exports__["function1"] = function1;

const value1 = 42;
/* harmony export (immutable) */ __webpack_exports__["value1"] = value1;

/* harmony default export */ __webpack_exports__["default"] = (() => 10);

/***/ }),

/***/ "./_tests/lib/use-node_module.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_path__ = __webpack_require__("./node_modules/path-browserify/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_path__);


const test = () => __WEBPACK_IMPORTED_MODULE_0_path___default.a.readFileSync('./use-node_module.js');
/* harmony export (immutable) */ __webpack_exports__["test"] = test;


/***/ }),

/***/ "./_tests/mock.spec.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chai__ = __webpack_require__("./node_modules/chai/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chai___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_chai__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_index__ = __webpack_require__("./src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_plugins_nodejs__ = __webpack_require__("./src/plugins/nodejs.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_plugins_relative__ = __webpack_require__("./src/plugins/relative.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__src_plugins_webpack_alias__ = __webpack_require__("./src/plugins/webpack-alias.js");








describe('rewiremock ', () => {
  describe('overloads ', () => {
    it('should not overload: ', () => {
      Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./lib/a/foo')
        .with(() => 'aa');

      Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./lib/a/../b/bar')
        .with(() => 'bb');

      Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./lib/a/../b/baz')
        .with(() => 'cc');

      const unmockedBaz = __webpack_require__("./_tests/lib/a/test.js");
      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz()).to.be.equal('foobarbaz');

      __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].enable();

      const mockedBaz = __webpack_require__("./_tests/lib/a/test.js");
      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('foobarbaz');
      __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].disable();
    });

    it('should overload with node plugin: ', () => {
      __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].inScope(() => {
        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_2__src_plugins_nodejs__["a" /* default */]);
        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./lib/a/foo')
          .with(() => 'aa');

        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./lib/a/../b/bar')
          .with(() => 'bb');

        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./lib/a/../b/baz')
          .with(() => 'cc');

        const unmockedBaz = __webpack_require__("./_tests/lib/a/test.js");
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz()).to.be.equal('foobarbaz');

        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].enable();

        const mockedBaz = __webpack_require__("./_tests/lib/a/test.js");
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('aabbcc');
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].disable();
      });
    });

    it('should overload with relative plugin: ', () => {
      __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].inScope(() => {
        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_3__src_plugins_relative__["a" /* default */]);
        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./foo')
          .with(() => 'aa');

        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('../b/bar')
          .with(() => 'bb');

        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('../b/baz')
          .with(() => 'cc');

        const unmockedBaz = __webpack_require__("./_tests/lib/a/test.js");
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz()).to.be.equal('foobarbaz');

        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].enable();

        const mockedBaz = __webpack_require__("./_tests/lib/a/test.js");
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('aabbcc');
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].disable();
      });
    });

    it('should overload with webpack alias plugin: ', () => {
      __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].inScope(() => {
        Object(__WEBPACK_IMPORTED_MODULE_4__src_plugins_webpack_alias__["a" /* configure */])('_tests/webpack.config.js');

        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_4__src_plugins_webpack_alias__["b" /* default */]);
        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('my-absolute-test-lib/foo')
          .with(() => 'aa');

        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('same-folder-lib/bar')
          .with(() => 'bb');

        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('../b/baz')
          .with(() => 'cc');

        const unmockedBaz = __webpack_require__("./_tests/lib/a/test.js");
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz()).to.be.equal('foobarbaz');

        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].enable();

        const mockedBaz = __webpack_require__("./_tests/lib/a/test.js");
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('aabbcc');
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].disable();
      });
    });
  });

  describe('mocking ', () => {
    it('should replace one module by another: ', () => {
      return __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].around(() => __webpack_require__("./_tests/lib/a/test.js"),
        () => {
          Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_3__src_plugins_relative__["a" /* default */]);
          Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./foo').by('./foo2');
        })
        .then(mocked => Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mocked()).to.be.equal('FOObarbaz'));
    });

    it('should replace one module by autogenerated one: ', () => {
      let toched = false;
      return __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].around(() => __webpack_require__("./_tests/lib/a/test.js"),
        () => {
          Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_3__src_plugins_relative__["a" /* default */]);

          Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./foo').by(({name}) => {
            toched = name;
            return () => "FOO";
          });
          Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(toched).to.be.false;
        })
        .then(mocked => {
          Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mocked()).to.be.equal('FOObarbaz');
        });
    });

    it('should replace one module by autogenerated one with callThougth: ', () => {
      return __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].around(() => __webpack_require__("./_tests/lib/a/test.js"),
        () => {
          Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_3__src_plugins_relative__["a" /* default */]);

          Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./foo')
            .callThrough()
            .by(({original}) => {
              return () => "~" + original() + '~'
            });
        })
        .then(mocked => Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mocked()).to.be.equal('~foo~barbaz'));
    });

    it('should replace one module by autogenerated one with requireActual: ', () => {
      return __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].around(() => __webpack_require__("./_tests/lib/a/test.js"),
        () => {
          Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_3__src_plugins_relative__["a" /* default */]);

          Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./foo')
            .by(({requireActual}) => {
              return () => "~" + requireActual('./foo.js')() + '~'
            });
        })
        .then(mocked => Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mocked()).to.be.equal('~foo~barbaz'));
    });
  });

  describe('direct child ', () => {
    it('should mock any level entity: ', () => {
      return __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].around(() => __webpack_require__("./_tests/lib/c/barbaz.js"),
        () => {
          Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./baz')
            .with(() => 'mock');
        })
        .then(mocked => Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mocked()).to.be.equal('>+mockmock'));
    });

    it('should mock top level entity only: ', () => {
      return __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].around(() => __webpack_require__("./_tests/lib/c/barbaz.js"),
        () => {
          //addPlugin(nodePlugin);
          Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./baz')
            .with(() => 'mock')
            .directChildOnly();
        })
        .then(mocked => Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mocked()).to.be.equal('>+!mock'));
    });
  });

  describe('called from a mock ', () => {
    it('should mock top level entity only due to mocked parent: ', () => {
      return __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].around(() => __webpack_require__("./_tests/lib/c/barbaz.js"),
        () => {
          //addPlugin(nodePlugin);
          Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./baz')
            .with(() => 'mock')
            .calledFromMock();
        })
        .then(mocked => Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mocked()).to.be.equal('>+!mock'));
    });

    it('should mock all due to callThrough mocked / async : ', () => {
      return __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].around(() => __webpack_require__("./_tests/lib/c/barbaz.js"),
        () => {
          //addPlugin(nodePlugin);
          Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])(() => new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, "./_tests/lib/c/baz.js")))
            .with(() => 'mock')
            .calledFromMock();
          Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])(() => new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, "./_tests/lib/c/bar.js")))
            .callThrough();
        })
        .then(mocked => Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mocked()).to.be.equal('>+mockmock'));
    });

    it('should mock all due to callThrough mocked / sync: ', () => {
      return __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].around(() => __webpack_require__("./_tests/lib/c/barbaz.js"),
        () => {
          //addPlugin(nodePlugin);
          Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./baz')
            .with(() => 'mock')
            .calledFromMock();
          Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./bar')
            .callThrough();
        })
        .then(mocked => Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mocked()).to.be.equal('>+mockmock'));
    });
  });

});


/***/ }),

/***/ "./_tests/nested.spec.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chai__ = __webpack_require__("./node_modules/chai/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chai___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_chai__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_index__ = __webpack_require__("./src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_plugins__ = __webpack_require__("./src/plugins.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_plugins_relative__ = __webpack_require__("./src/plugins/relative.js");





describe('nested ', () => {
    it('should fail to load mocks (interference/isolation): ', () => {
        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_3__src_plugins_relative__["a" /* default */]);

        __webpack_require__("./_tests/lib/nested-broken.setup.js");

        const unmockedBaz = __webpack_require__("./_tests/lib/a/test.js");
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz()).to.be.equal('foobarbaz');

        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].enable();

        const mockedBaz = __webpack_require__("./_tests/lib/a/test.js");
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('foobarbaz');
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].disable();
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].clear();
        Object(__WEBPACK_IMPORTED_MODULE_2__src_plugins__["a" /* _clearPlugins */])();
    });

    it('should load external nested setup: ', () => {
        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_3__src_plugins_relative__["a" /* default */]);

        (__webpack_require__("./_tests/lib/nested-valid.setup.js"))(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */]);

        const unmockedBaz = __webpack_require__("./_tests/lib/a/test.js");
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz()).to.be.equal('foobarbaz');

        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].enable();

        const mockedBaz = __webpack_require__("./_tests/lib/a/test.js");
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('aabbcc');
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].disable();
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].clear();
        Object(__WEBPACK_IMPORTED_MODULE_2__src_plugins__["a" /* _clearPlugins */])();
    });
});


/***/ }),

/***/ "./_tests/plugins/allDisabled.spec.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chai__ = __webpack_require__("./node_modules/chai/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chai___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_chai__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_index__ = __webpack_require__("./src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_plugins__ = __webpack_require__("./src/plugins.js");





describe('relative ', () => {

    it('should mock only first level: ', () => {
        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_1__src_index__["c" /* plugins */].disabledByDefault);
        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_1__src_index__["c" /* plugins */].relative);
        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./foo')
            .with(() => 'aa');

        const unmockedBaz = __webpack_require__("./_tests/plugins/lib/test.js");
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz()).to.be.equal('foobar');

        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].enable();

        const mockedBaz = __webpack_require__("./_tests/plugins/lib/test.js");
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('foobar');
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].disable();
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].clear();
        Object(__WEBPACK_IMPORTED_MODULE_2__src_plugins__["a" /* _clearPlugins */])();
    });
});


/***/ }),

/***/ "./_tests/plugins/common/alias.spec.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(process) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chai__ = __webpack_require__("./node_modules/chai/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chai___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_chai__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_path__ = __webpack_require__("./node_modules/path-browserify/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_plugins_common_aliases__ = __webpack_require__("./src/plugins/common/aliases.js");





const aliasConfig = '_tests/webpack.config.js';

describe('aliases', () => {
    it('should read aliases ', () => {
        const aliases = Object(__WEBPACK_IMPORTED_MODULE_2__src_plugins_common_aliases__["b" /* readAliases */])(aliasConfig);
        const targetConfig = {
            aliasConf: {
                'my-absolute-test-lib': Object(__WEBPACK_IMPORTED_MODULE_1_path__["join"])(process.cwd(), '/_tests/lib/a'),
                'same-folder-lib': Object(__WEBPACK_IMPORTED_MODULE_1_path__["join"])(process.cwd(), '/_tests/lib/b')
            },
            extensionsConf: null
        };
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(aliases).to.deep.equal(targetConfig);
    });

    it('should transform filename', () => {
        const aliases = Object(__WEBPACK_IMPORTED_MODULE_2__src_plugins_common_aliases__["b" /* readAliases */])(aliasConfig);
        const newFileName1 = Object(__WEBPACK_IMPORTED_MODULE_2__src_plugins_common_aliases__["a" /* processFile */])('my-absolute-test-lib/foo.js', aliases);
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(newFileName1).to.be.equal(Object(__WEBPACK_IMPORTED_MODULE_1_path__["join"])(process.cwd(), '/_tests/lib/a/foo.js'));

        const newFileName2 = Object(__WEBPACK_IMPORTED_MODULE_2__src_plugins_common_aliases__["a" /* processFile */])('same-folder-lib/foo.js', aliases);
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(newFileName2).to.be.equal(Object(__WEBPACK_IMPORTED_MODULE_1_path__["join"])(process.cwd(), '/_tests/lib/b/foo.js'));
    });
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./_tests/plugins/lib/foo.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
module.exports = function foo(){
    return 'foo';
}

/***/ }),

/***/ "./_tests/plugins/lib/sub/foo.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
module.exports = function foo(){
    return 'bar';
}

/***/ }),

/***/ "./_tests/plugins/lib/sub/test.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
var test1 = __webpack_require__("./_tests/plugins/lib/sub/foo.js");

module.exports = function () {
    return test1();
};

/***/ }),

/***/ "./_tests/plugins/lib/test.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
var test1 = __webpack_require__("./_tests/plugins/lib/foo.js");
var test2 = __webpack_require__("./_tests/plugins/lib/sub/test.js");

module.exports = function () {
    return test1() + test2();
};

/***/ }),

/***/ "./_tests/plugins/relative.spec.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chai__ = __webpack_require__("./node_modules/chai/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chai___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_chai__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_index__ = __webpack_require__("./src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_plugins__ = __webpack_require__("./src/plugins.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_plugins_relative__ = __webpack_require__("./src/plugins/relative.js");







describe('relative ', () => {

    it('should mock only first level: ', () => {
        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_3__src_plugins_relative__["a" /* default */]);
        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./foo')
            .with(()=>'aa');

        const unmockedBaz = __webpack_require__("./_tests/plugins/lib/test.js");
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz()).to.be.equal('foobar');

        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].enable();

        const mockedBaz = __webpack_require__("./_tests/plugins/lib/test.js");
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('aabar');
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].disable();
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].clear();
        Object(__WEBPACK_IMPORTED_MODULE_2__src_plugins__["a" /* _clearPlugins */])();
    });
});


/***/ }),

/***/ "./_tests/scope.spec.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chai__ = __webpack_require__("./node_modules/chai/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chai___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_chai__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_index__ = __webpack_require__("./src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_plugins__ = __webpack_require__("./src/plugins.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_plugins_nodejs__ = __webpack_require__("./src/plugins/nodejs.js");







describe('scope ', () => {
    it('scope test: ', () => {
        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_3__src_plugins_nodejs__["a" /* default */]);
        const unmockedBaz = __webpack_require__("./_tests/lib/a/test.js");
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz()).to.be.equal('foobarbaz');

        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./lib/a/foo').with(() => 'aa');
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].inScope(() => {
            Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./lib/a/../b/bar').with(() => 'bb');
            __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].enable();
            const mocked = __webpack_require__("./_tests/lib/a/test.js");
            Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mocked()).to.be.equal('aabbbaz');
            __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].disable();
        });

        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].enable();
        const mocked = __webpack_require__("./_tests/lib/a/test.js");
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mocked()).to.be.equal('aabarbaz');
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].disable();
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].clear();
        Object(__WEBPACK_IMPORTED_MODULE_2__src_plugins__["a" /* _clearPlugins */])();
    });

    it('scope load es5: ', () => {
        const unmockedBaz = __webpack_require__("./_tests/lib/a/test.js");
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz()).to.be.equal('foobarbaz');

        return __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].around(() => __webpack_require__("./_tests/lib/a/test.js"),
            (mock) => {
                Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_3__src_plugins_nodejs__["a" /* default */]);
                mock('./lib/a/foo').with(() => 'aa');
                mock('./lib/a/../b/bar').with(() => 'bb');
                mock('./lib/a/../b/baz').with(() => 'cc');
            })
            .then((mockedBaz) => {
                Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('aabbcc');
            });
    });

    it('scope load es6: ', () => {
        const unmockedBaz = __webpack_require__("./_tests/lib/a/test.js");
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz()).to.be.equal('foobarbaz');

        return __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].around(() => new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, "./_tests/lib/a/test.js")),
            (mock) => {
                Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_3__src_plugins_nodejs__["a" /* default */]);

                mock('./lib/a/foo').with(() => 'aa');
                mock('./lib/a/../b/bar').with(() => 'bb');
                mock('./lib/a/../b/baz').with(() => 'cc');
            })
            .then((mockedBaz) => {
                Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('aabbcc');
            });
    });

    it('scope load es6 with deferred create: ', () => {
        const unmockedBaz = __webpack_require__("./_tests/lib/a/test.js");
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz()).to.be.equal('foobarbaz');

        return __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].around(() => new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, "./_tests/lib/a/test.js")),
            (mock) =>
                Promise.resolve().then(() => {
                    Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_3__src_plugins_nodejs__["a" /* default */]);

                    mock('./lib/a/foo').with(() => 'aa');
                    mock('./lib/a/../b/bar').with(() => 'bb');
                    mock('./lib/a/../b/baz').with(() => 'cc');
                }))
            .then((mockedBaz) => {
                Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('aabbcc');
            });
    });

    it('scope load es6 with internal test: ', () => {
        const unmockedBaz = __webpack_require__("./_tests/lib/a/test.js");
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz()).to.be.equal('foobarbaz');

        return __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].around(
            () =>
                new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, "./_tests/lib/a/test.js"))
                    .then((mockedBaz) => {
                        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('aabbcc');
                    }),
            (mock) => {
                Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_3__src_plugins_nodejs__["a" /* default */]);

                mock('./lib/a/foo').with(() => 'aa');
                mock('./lib/a/../b/bar').with(() => 'bb');
                mock('./lib/a/../b/baz').with(() => 'cc');
            })
    });

    it('scope load es6 with one disabled: ', () => {
        const unmockedBaz = __webpack_require__("./_tests/lib/a/test.js");
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz()).to.be.equal('foobarbaz');

        return __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].around(() => new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, "./_tests/lib/a/test.js")),
            (mock) => {
                Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["a" /* addPlugin */])(__WEBPACK_IMPORTED_MODULE_3__src_plugins_nodejs__["a" /* default */]);

                mock('./lib/a/foo').with(() => 'aa');
                mock('./lib/a/../b/bar').with(() => 'bb').disable();
                mock('./lib/a/../b/baz').with(() => 'cc');
            })
            .then((mockedBaz) => {
                Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('aabarcc');
            });
    });

    it('scope load es6 with no module mocked: ', () => {
        const unmockedBaz = __webpack_require__("./_tests/lib/a/test.js");
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz()).to.be.equal('foobarbaz');

        return __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].around(() => new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, "./_tests/lib/a/test.js")))
            .then((mockedBaz) => {
                Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('foobarbaz');
            });
    });

    it('scope load via proxy call: ', () => {
        const unmockedBaz = __webpack_require__("./_tests/lib/a/test.js");
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz()).to.be.equal('foobarbaz');
        const mockedBaz = __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].proxy('./lib/a/test.js',{
            './foo': () => 'aa',
            '../b/baz':() => 'cc'
        });

        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('aabarcc');
    });

  describe('proxy call', () => {

    it('simple flow: ', () => {
      const unmockedBaz = __webpack_require__("./_tests/lib/a/test.js");
      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz()).to.be.equal('foobarbaz');
      const mockedBaz = __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].proxy('./lib/a/test.js', r => ({
        './foo': () => 'aa',
        '../b/baz': r.with(() => 'cc')
      }));

      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('aabarcc');
    });

    it('require call: ', () => {
      const unmockedBaz = __webpack_require__("./_tests/lib/a/test.js");
      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz()).to.be.equal('foobarbaz');
      const mockedBaz = __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].proxy(() => __webpack_require__("./_tests/lib/a/test.js"), {
        './foo': () => 'aa',
        '../b/baz': () => 'cc'
      });

      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('aabarcc');
    });

    it('import es5: ', () => {
      const unmockedBaz = __webpack_require__("./_tests/lib/a/test.js");
      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz()).to.be.equal('foobarbaz');
      const mockedBazLoad = __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].module( () => new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, "./_tests/lib/a/test.js")), r => ({
        './foo': () => 'aa',
        '../b/baz': r.with(() => 'cc')
      }));

      return mockedBazLoad.then(mockedBaz => {
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz()).to.be.equal('aabarcc')
      })
    });

    it('import es6: ', () => {
      const unmockedBaz = __webpack_require__("./_tests/lib/a/test.js");
      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz()).to.be.equal('foobarbaz');
      const mockedBazLoad = __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].module( () => new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, "./_tests/lib/a/test.es6.js")), r => ({
        './foo': () => 'aa',
        '../b/baz': r.with(() => 'cc')
      }));

      return mockedBazLoad.then(mockedBaz => {
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz.default()).to.be.equal('aabarcc')
      })
    });
  });
});


/***/ }),

/***/ "./_tests/simple-case.spec.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chai__ = __webpack_require__("./node_modules/chai/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chai___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_chai__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_index__ = __webpack_require__("./src/index.js");




describe('simples case ', () => {
  it('scope test: ', () => {
    Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('path')
      .with({
        readFileSync: () => "mocked"
      });

    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].enable();
    const mocked = __webpack_require__("./_tests/lib/use-node_module.js");
    Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mocked.test()).to.be.equal('mocked');
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].disable();
  });
});

/***/ }),

/***/ "./_tests/tristate.spec.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chai__ = __webpack_require__("./node_modules/chai/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chai___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_chai__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_index__ = __webpack_require__("./src/index.js");




describe('tristate test ', () => {

    it('a0 case - no mock: ', () => {
        return new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, "./_tests/lib/tristate/a1.js")).then(a1 =>
            Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(a1.default()).to.equal("FOOfoo")
        );
    });

    it('a1 case - mock before: ', () => {
        return __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].around(() => new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, "./_tests/lib/tristate/a1.js")),
            () => {
                __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].addPlugin(__WEBPACK_IMPORTED_MODULE_1__src_index__["c" /* plugins */].relative);
                Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./c.js').withDefault(() => "bar").toBeUsed();
            }).then(a1 => {
            Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(a1.default()).to.equal("FOObar");
        })
    });

    it('a2 case - mock after: ', () => {
        return __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].around(() => new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, "./_tests/lib/tristate/a2.js")),
            () => {
                __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].addPlugin(__WEBPACK_IMPORTED_MODULE_1__src_index__["c" /* plugins */].relative);
                Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./c.js').withDefault(() => "bar").toBeUsed();
            }).then(a1 => {
            Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(a1.default()).to.equal("FOObar");
        })
    });

    it('a1 case - mock all: ', () => {
        return __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].around(() => new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, "./_tests/lib/tristate/a1.js")),
            () => {
                __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].addPlugin(__WEBPACK_IMPORTED_MODULE_1__src_index__["c" /* plugins */].nodejs);
                Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./lib/tristate/c.js').withDefault(() => "bar").toBeUsed();
            }).then(a1 => {
            Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(a1.default()).to.equal("BARbar");
        })
    });

});


/***/ }),

/***/ "./_tests/typedImport.spec.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chai__ = __webpack_require__("./node_modules/chai/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chai___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_chai__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_index__ = __webpack_require__("./src/index.js");
// @flow




describe('typed import ', () => {
  it('should throw: ', () => {
    __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].inScope(() => {
      Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])(() => new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, "./_tests/lib/typed/b.js"))).with(() => 42);
      __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].enable();
      try {
        __webpack_require__("./_tests/lib/typed/a.js");
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])("should throw").to.be.false();
      } catch (e) {
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(true).to.be.equal(true);
      }
      __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].disable();
    });
  });

  it('import as a mock name: ', () => {
    const unmockedBaz = __webpack_require__("./_tests/lib/typed/a.js");
    Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz.default()).to.be.equal(10);

    const mockedBazLoad = __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].around(
      () => new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, "./_tests/lib/typed/a.js")),
      mock => {
        mock(() => new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, "./_tests/lib/typed/b.js"))).with(() => 42).toBeUsed();
        mock(() => new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, "./_tests/lib/typed/a-delayed.js"))).with(() => 24);
      });

    return mockedBazLoad.then(mockedBaz => {
      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz.default()).to.be.equal(42)
    })
  });

  it('should disable mock: ', () => {
    const unmockedBaz = __webpack_require__("./_tests/lib/typed/a.js");
    Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(unmockedBaz.default()).to.be.equal(10);

    const mockedBazLoad = __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].around(
      () => new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, "./_tests/lib/typed/a.js")),
      mock => {
        mock(() => new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, "./_tests/lib/typed/b.js"))).with(() => 42);
        mock.getMock(() => new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, "./_tests/lib/typed/b.js"))).disable();
      });

    return mockedBazLoad.then(mockedBaz => {
      Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz.default()).to.be.equal(10)
    })
  });

  describe('check exports', () => {
    it('check exports - ok: ', () => {
      return __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].inScope(() => {
        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./b.js')
          .with({
            default: () => {
            }
          })
          .toBeUsed()
          .toMatchOrigin();
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].enable();
        try {
          __webpack_require__("./_tests/lib/typed/a.js");
        } catch (e) {
          Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])('should not be called').to.be.equal(false);
        }
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].disable();
      });
    });

    it('check exports - fail: ', () => {
      return __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].inScope(() => {
        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./b.js')
          .with({
            default: 42
          })
          .toBeUsed()
          .toMatchOrigin();
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].enable();
        try {
          __webpack_require__("./_tests/lib/typed/a.js");
          Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])('should not be called').to.be.equal(false);
        } catch (e) {

        }
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].disable();
      });
    });

    it('check exports - fail: ', () => {
      return __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].inScope(() => {
        Object(__WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */])('./b.js')
          .with({
            somethingMissing: 42
          })
          .toBeUsed()
          .toMatchOrigin();
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].enable();
        try {
          __webpack_require__("./_tests/lib/typed/a.js");
          Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])('should not be called').to.be.equal(false);
        } catch (e) {

        }
        __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].disable();
      });
    });
  });

  describe('import delayed: ', () => {
    it('import after: ', () => {
      const mockedBazLoad = __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].around(
        () => new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, "./_tests/lib/typed/a-delayed.js")),
        mock => {
          mock(() => new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, "./_tests/lib/typed/b.js"))).with(() => 0);
        });

      return mockedBazLoad.then(mockedBaz => {
        Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz.default()).not.to.be.equal('aa')
      })
    });

    it('import before: ', () => {
      return __WEBPACK_IMPORTED_MODULE_1__src_index__["b" /* default */].around(
        () =>
          new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, "./_tests/lib/typed/a-delayed.js"))
            .then(module => module) // emulate time tick
            .then(mockedBaz => {
              Object(__WEBPACK_IMPORTED_MODULE_0_chai__["expect"])(mockedBaz.default()).to.be.equal(5)
            }),
        mock => {
          mock(() => new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, "./_tests/lib/typed/b.js"))).with(() => 5);
        });
    });
  });
});


/***/ }),

/***/ "./_tests/webpack.config.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* WEBPACK VAR INJECTION */(function(__dirname) {var path = __webpack_require__("./node_modules/path-browserify/index.js");

module.exports = {
    resolve: {
        alias: {
            'my-absolute-test-lib': path.join(__dirname, 'lib/a'),
            'same-folder-lib': path.resolve(__dirname, 'lib/b'),
        }
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),

/***/ "./node_modules/assertion-error/index.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * assertion-error
 * Copyright(c) 2013 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Return a function that will copy properties from
 * one object to another excluding any originally
 * listed. Returned function will create a new `{}`.
 *
 * @param {String} excluded properties ...
 * @return {Function}
 */

function exclude () {
  var excludes = [].slice.call(arguments);

  function excludeProps (res, obj) {
    Object.keys(obj).forEach(function (key) {
      if (!~excludes.indexOf(key)) res[key] = obj[key];
    });
  }

  return function extendExclude () {
    var args = [].slice.call(arguments)
      , i = 0
      , res = {};

    for (; i < args.length; i++) {
      excludeProps(res, args[i]);
    }

    return res;
  };
};

/*!
 * Primary Exports
 */

module.exports = AssertionError;

/**
 * ### AssertionError
 *
 * An extension of the JavaScript `Error` constructor for
 * assertion and validation scenarios.
 *
 * @param {String} message
 * @param {Object} properties to include (optional)
 * @param {callee} start stack function (optional)
 */

function AssertionError (message, _props, ssf) {
  var extend = exclude('name', 'message', 'stack', 'constructor', 'toJSON')
    , props = extend(_props || {});

  // default values
  this.message = message || 'Unspecified AssertionError';
  this.showDiff = false;

  // copy from properties
  for (var key in props) {
    this[key] = props[key];
  }

  // capture stack trace
  ssf = ssf || arguments.callee;
  if (ssf && Error.captureStackTrace) {
    Error.captureStackTrace(this, ssf);
  } else {
    try {
      throw new Error();
    } catch(e) {
      this.stack = e.stack;
    }
  }
}

/*!
 * Inherit from Error.prototype
 */

AssertionError.prototype = Object.create(Error.prototype);

/*!
 * Statically set name
 */

AssertionError.prototype.name = 'AssertionError';

/*!
 * Ensure correct constructor
 */

AssertionError.prototype.constructor = AssertionError;

/**
 * Allow errors to be converted to JSON for static transfer.
 *
 * @param {Boolean} include stack (default: `true`)
 * @return {Object} object that can be `JSON.stringify`
 */

AssertionError.prototype.toJSON = function (stack) {
  var extend = exclude('constructor', 'toJSON', 'stack')
    , props = extend({ name: this.name }, this);

  // include stack if exists and not turned off
  if (false !== stack && this.stack) {
    props.stack = this.stack;
  }

  return props;
};


/***/ }),

/***/ "./node_modules/base64-js/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/buffer/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__("./node_modules/base64-js/index.js")
var ieee754 = __webpack_require__("./node_modules/ieee754/index.js")
var isArray = __webpack_require__("./node_modules/isarray/index.js")

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/chai/index.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
module.exports = __webpack_require__("./node_modules/chai/lib/chai.js");


/***/ }),

/***/ "./node_modules/chai/lib/chai.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var used = []
  , exports = module.exports = {};

/*!
 * Chai version
 */

exports.version = '3.5.0';

/*!
 * Assertion Error
 */

exports.AssertionError = __webpack_require__("./node_modules/assertion-error/index.js");

/*!
 * Utils for plugins (not exported)
 */

var util = __webpack_require__("./node_modules/chai/lib/chai/utils/index.js");

/**
 * # .use(function)
 *
 * Provides a way to extend the internals of Chai
 *
 * @param {Function}
 * @returns {this} for chaining
 * @api public
 */

exports.use = function (fn) {
  if (!~used.indexOf(fn)) {
    fn(this, util);
    used.push(fn);
  }

  return this;
};

/*!
 * Utility Functions
 */

exports.util = util;

/*!
 * Configuration
 */

var config = __webpack_require__("./node_modules/chai/lib/chai/config.js");
exports.config = config;

/*!
 * Primary `Assertion` prototype
 */

var assertion = __webpack_require__("./node_modules/chai/lib/chai/assertion.js");
exports.use(assertion);

/*!
 * Core Assertions
 */

var core = __webpack_require__("./node_modules/chai/lib/chai/core/assertions.js");
exports.use(core);

/*!
 * Expect interface
 */

var expect = __webpack_require__("./node_modules/chai/lib/chai/interface/expect.js");
exports.use(expect);

/*!
 * Should interface
 */

var should = __webpack_require__("./node_modules/chai/lib/chai/interface/should.js");
exports.use(should);

/*!
 * Assert interface
 */

var assert = __webpack_require__("./node_modules/chai/lib/chai/interface/assert.js");
exports.use(assert);


/***/ }),

/***/ "./node_modules/chai/lib/chai/assertion.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * chai
 * http://chaijs.com
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var config = __webpack_require__("./node_modules/chai/lib/chai/config.js");

module.exports = function (_chai, util) {
  /*!
   * Module dependencies.
   */

  var AssertionError = _chai.AssertionError
    , flag = util.flag;

  /*!
   * Module export.
   */

  _chai.Assertion = Assertion;

  /*!
   * Assertion Constructor
   *
   * Creates object for chaining.
   *
   * @api private
   */

  function Assertion (obj, msg, stack) {
    flag(this, 'ssfi', stack || arguments.callee);
    flag(this, 'object', obj);
    flag(this, 'message', msg);
  }

  Object.defineProperty(Assertion, 'includeStack', {
    get: function() {
      console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
      return config.includeStack;
    },
    set: function(value) {
      console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
      config.includeStack = value;
    }
  });

  Object.defineProperty(Assertion, 'showDiff', {
    get: function() {
      console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
      return config.showDiff;
    },
    set: function(value) {
      console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
      config.showDiff = value;
    }
  });

  Assertion.addProperty = function (name, fn) {
    util.addProperty(this.prototype, name, fn);
  };

  Assertion.addMethod = function (name, fn) {
    util.addMethod(this.prototype, name, fn);
  };

  Assertion.addChainableMethod = function (name, fn, chainingBehavior) {
    util.addChainableMethod(this.prototype, name, fn, chainingBehavior);
  };

  Assertion.overwriteProperty = function (name, fn) {
    util.overwriteProperty(this.prototype, name, fn);
  };

  Assertion.overwriteMethod = function (name, fn) {
    util.overwriteMethod(this.prototype, name, fn);
  };

  Assertion.overwriteChainableMethod = function (name, fn, chainingBehavior) {
    util.overwriteChainableMethod(this.prototype, name, fn, chainingBehavior);
  };

  /**
   * ### .assert(expression, message, negateMessage, expected, actual, showDiff)
   *
   * Executes an expression and check expectations. Throws AssertionError for reporting if test doesn't pass.
   *
   * @name assert
   * @param {Philosophical} expression to be tested
   * @param {String|Function} message or function that returns message to display if expression fails
   * @param {String|Function} negatedMessage or function that returns negatedMessage to display if negated expression fails
   * @param {Mixed} expected value (remember to check for negation)
   * @param {Mixed} actual (optional) will default to `this.obj`
   * @param {Boolean} showDiff (optional) when set to `true`, assert will display a diff in addition to the message if expression fails
   * @api private
   */

  Assertion.prototype.assert = function (expr, msg, negateMsg, expected, _actual, showDiff) {
    var ok = util.test(this, arguments);
    if (true !== showDiff) showDiff = false;
    if (true !== config.showDiff) showDiff = false;

    if (!ok) {
      var msg = util.getMessage(this, arguments)
        , actual = util.getActual(this, arguments);
      throw new AssertionError(msg, {
          actual: actual
        , expected: expected
        , showDiff: showDiff
      }, (config.includeStack) ? this.assert : flag(this, 'ssfi'));
    }
  };

  /*!
   * ### ._obj
   *
   * Quick reference to stored `actual` value for plugin developers.
   *
   * @api private
   */

  Object.defineProperty(Assertion.prototype, '_obj',
    { get: function () {
        return flag(this, 'object');
      }
    , set: function (val) {
        flag(this, 'object', val);
      }
  });
};


/***/ }),

/***/ "./node_modules/chai/lib/chai/config.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
module.exports = {

  /**
   * ### config.includeStack
   *
   * User configurable property, influences whether stack trace
   * is included in Assertion error message. Default of false
   * suppresses stack trace in the error message.
   *
   *     chai.config.includeStack = true;  // enable stack on error
   *
   * @param {Boolean}
   * @api public
   */

   includeStack: false,

  /**
   * ### config.showDiff
   *
   * User configurable property, influences whether or not
   * the `showDiff` flag should be included in the thrown
   * AssertionErrors. `false` will always be `false`; `true`
   * will be true when the assertion has requested a diff
   * be shown.
   *
   * @param {Boolean}
   * @api public
   */

  showDiff: true,

  /**
   * ### config.truncateThreshold
   *
   * User configurable property, sets length threshold for actual and
   * expected values in assertion errors. If this threshold is exceeded, for
   * example for large data structures, the value is replaced with something
   * like `[ Array(3) ]` or `{ Object (prop1, prop2) }`.
   *
   * Set it to zero if you want to disable truncating altogether.
   *
   * This is especially userful when doing assertions on arrays: having this
   * set to a reasonable large value makes the failure messages readily
   * inspectable.
   *
   *     chai.config.truncateThreshold = 0;  // disable truncating
   *
   * @param {Number}
   * @api public
   */

  truncateThreshold: 40

};


/***/ }),

/***/ "./node_modules/chai/lib/chai/core/assertions.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * chai
 * http://chaijs.com
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

module.exports = function (chai, _) {
  var Assertion = chai.Assertion
    , toString = Object.prototype.toString
    , flag = _.flag;

  /**
   * ### Language Chains
   *
   * The following are provided as chainable getters to
   * improve the readability of your assertions. They
   * do not provide testing capabilities unless they
   * have been overwritten by a plugin.
   *
   * **Chains**
   *
   * - to
   * - be
   * - been
   * - is
   * - that
   * - which
   * - and
   * - has
   * - have
   * - with
   * - at
   * - of
   * - same
   *
   * @name language chains
   * @namespace BDD
   * @api public
   */

  [ 'to', 'be', 'been'
  , 'is', 'and', 'has', 'have'
  , 'with', 'that', 'which', 'at'
  , 'of', 'same' ].forEach(function (chain) {
    Assertion.addProperty(chain, function () {
      return this;
    });
  });

  /**
   * ### .not
   *
   * Negates any of assertions following in the chain.
   *
   *     expect(foo).to.not.equal('bar');
   *     expect(goodFn).to.not.throw(Error);
   *     expect({ foo: 'baz' }).to.have.property('foo')
   *       .and.not.equal('bar');
   *
   * @name not
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('not', function () {
    flag(this, 'negate', true);
  });

  /**
   * ### .deep
   *
   * Sets the `deep` flag, later used by the `equal` and
   * `property` assertions.
   *
   *     expect(foo).to.deep.equal({ bar: 'baz' });
   *     expect({ foo: { bar: { baz: 'quux' } } })
   *       .to.have.deep.property('foo.bar.baz', 'quux');
   *
   * `.deep.property` special characters can be escaped
   * by adding two slashes before the `.` or `[]`.
   *
   *     var deepCss = { '.link': { '[target]': 42 }};
   *     expect(deepCss).to.have.deep.property('\\.link.\\[target\\]', 42);
   *
   * @name deep
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('deep', function () {
    flag(this, 'deep', true);
  });

  /**
   * ### .any
   *
   * Sets the `any` flag, (opposite of the `all` flag)
   * later used in the `keys` assertion.
   *
   *     expect(foo).to.have.any.keys('bar', 'baz');
   *
   * @name any
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('any', function () {
    flag(this, 'any', true);
    flag(this, 'all', false)
  });


  /**
   * ### .all
   *
   * Sets the `all` flag (opposite of the `any` flag)
   * later used by the `keys` assertion.
   *
   *     expect(foo).to.have.all.keys('bar', 'baz');
   *
   * @name all
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('all', function () {
    flag(this, 'all', true);
    flag(this, 'any', false);
  });

  /**
   * ### .a(type)
   *
   * The `a` and `an` assertions are aliases that can be
   * used either as language chains or to assert a value's
   * type.
   *
   *     // typeof
   *     expect('test').to.be.a('string');
   *     expect({ foo: 'bar' }).to.be.an('object');
   *     expect(null).to.be.a('null');
   *     expect(undefined).to.be.an('undefined');
   *     expect(new Error).to.be.an('error');
   *     expect(new Promise).to.be.a('promise');
   *     expect(new Float32Array()).to.be.a('float32array');
   *     expect(Symbol()).to.be.a('symbol');
   *
   *     // es6 overrides
   *     expect({[Symbol.toStringTag]:()=>'foo'}).to.be.a('foo');
   *
   *     // language chain
   *     expect(foo).to.be.an.instanceof(Foo);
   *
   * @name a
   * @alias an
   * @param {String} type
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function an (type, msg) {
    if (msg) flag(this, 'message', msg);
    type = type.toLowerCase();
    var obj = flag(this, 'object')
      , article = ~[ 'a', 'e', 'i', 'o', 'u' ].indexOf(type.charAt(0)) ? 'an ' : 'a ';

    this.assert(
        type === _.type(obj)
      , 'expected #{this} to be ' + article + type
      , 'expected #{this} not to be ' + article + type
    );
  }

  Assertion.addChainableMethod('an', an);
  Assertion.addChainableMethod('a', an);

  /**
   * ### .include(value)
   *
   * The `include` and `contain` assertions can be used as either property
   * based language chains or as methods to assert the inclusion of an object
   * in an array or a substring in a string. When used as language chains,
   * they toggle the `contains` flag for the `keys` assertion.
   *
   *     expect([1,2,3]).to.include(2);
   *     expect('foobar').to.contain('foo');
   *     expect({ foo: 'bar', hello: 'universe' }).to.include.keys('foo');
   *
   * @name include
   * @alias contain
   * @alias includes
   * @alias contains
   * @param {Object|String|Number} obj
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function includeChainingBehavior () {
    flag(this, 'contains', true);
  }

  function include (val, msg) {
    _.expectTypes(this, ['array', 'object', 'string']);

    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    var expected = false;

    if (_.type(obj) === 'array' && _.type(val) === 'object') {
      for (var i in obj) {
        if (_.eql(obj[i], val)) {
          expected = true;
          break;
        }
      }
    } else if (_.type(val) === 'object') {
      if (!flag(this, 'negate')) {
        for (var k in val) new Assertion(obj).property(k, val[k]);
        return;
      }
      var subset = {};
      for (var k in val) subset[k] = obj[k];
      expected = _.eql(subset, val);
    } else {
      expected = (obj != undefined) && ~obj.indexOf(val);
    }
    this.assert(
        expected
      , 'expected #{this} to include ' + _.inspect(val)
      , 'expected #{this} to not include ' + _.inspect(val));
  }

  Assertion.addChainableMethod('include', include, includeChainingBehavior);
  Assertion.addChainableMethod('contain', include, includeChainingBehavior);
  Assertion.addChainableMethod('contains', include, includeChainingBehavior);
  Assertion.addChainableMethod('includes', include, includeChainingBehavior);

  /**
   * ### .ok
   *
   * Asserts that the target is truthy.
   *
   *     expect('everything').to.be.ok;
   *     expect(1).to.be.ok;
   *     expect(false).to.not.be.ok;
   *     expect(undefined).to.not.be.ok;
   *     expect(null).to.not.be.ok;
   *
   * @name ok
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('ok', function () {
    this.assert(
        flag(this, 'object')
      , 'expected #{this} to be truthy'
      , 'expected #{this} to be falsy');
  });

  /**
   * ### .true
   *
   * Asserts that the target is `true`.
   *
   *     expect(true).to.be.true;
   *     expect(1).to.not.be.true;
   *
   * @name true
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('true', function () {
    this.assert(
        true === flag(this, 'object')
      , 'expected #{this} to be true'
      , 'expected #{this} to be false'
      , this.negate ? false : true
    );
  });

  /**
   * ### .false
   *
   * Asserts that the target is `false`.
   *
   *     expect(false).to.be.false;
   *     expect(0).to.not.be.false;
   *
   * @name false
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('false', function () {
    this.assert(
        false === flag(this, 'object')
      , 'expected #{this} to be false'
      , 'expected #{this} to be true'
      , this.negate ? true : false
    );
  });

  /**
   * ### .null
   *
   * Asserts that the target is `null`.
   *
   *     expect(null).to.be.null;
   *     expect(undefined).to.not.be.null;
   *
   * @name null
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('null', function () {
    this.assert(
        null === flag(this, 'object')
      , 'expected #{this} to be null'
      , 'expected #{this} not to be null'
    );
  });

  /**
   * ### .undefined
   *
   * Asserts that the target is `undefined`.
   *
   *     expect(undefined).to.be.undefined;
   *     expect(null).to.not.be.undefined;
   *
   * @name undefined
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('undefined', function () {
    this.assert(
        undefined === flag(this, 'object')
      , 'expected #{this} to be undefined'
      , 'expected #{this} not to be undefined'
    );
  });

  /**
   * ### .NaN
   * Asserts that the target is `NaN`.
   *
   *     expect('foo').to.be.NaN;
   *     expect(4).not.to.be.NaN;
   *
   * @name NaN
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('NaN', function () {
    this.assert(
        isNaN(flag(this, 'object'))
        , 'expected #{this} to be NaN'
        , 'expected #{this} not to be NaN'
    );
  });

  /**
   * ### .exist
   *
   * Asserts that the target is neither `null` nor `undefined`.
   *
   *     var foo = 'hi'
   *       , bar = null
   *       , baz;
   *
   *     expect(foo).to.exist;
   *     expect(bar).to.not.exist;
   *     expect(baz).to.not.exist;
   *
   * @name exist
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('exist', function () {
    this.assert(
        null != flag(this, 'object')
      , 'expected #{this} to exist'
      , 'expected #{this} to not exist'
    );
  });


  /**
   * ### .empty
   *
   * Asserts that the target's length is `0`. For arrays and strings, it checks
   * the `length` property. For objects, it gets the count of
   * enumerable keys.
   *
   *     expect([]).to.be.empty;
   *     expect('').to.be.empty;
   *     expect({}).to.be.empty;
   *
   * @name empty
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('empty', function () {
    var obj = flag(this, 'object')
      , expected = obj;

    if (Array.isArray(obj) || 'string' === typeof object) {
      expected = obj.length;
    } else if (typeof obj === 'object') {
      expected = Object.keys(obj).length;
    }

    this.assert(
        !expected
      , 'expected #{this} to be empty'
      , 'expected #{this} not to be empty'
    );
  });

  /**
   * ### .arguments
   *
   * Asserts that the target is an arguments object.
   *
   *     function test () {
   *       expect(arguments).to.be.arguments;
   *     }
   *
   * @name arguments
   * @alias Arguments
   * @namespace BDD
   * @api public
   */

  function checkArguments () {
    var obj = flag(this, 'object')
      , type = Object.prototype.toString.call(obj);
    this.assert(
        '[object Arguments]' === type
      , 'expected #{this} to be arguments but got ' + type
      , 'expected #{this} to not be arguments'
    );
  }

  Assertion.addProperty('arguments', checkArguments);
  Assertion.addProperty('Arguments', checkArguments);

  /**
   * ### .equal(value)
   *
   * Asserts that the target is strictly equal (`===`) to `value`.
   * Alternately, if the `deep` flag is set, asserts that
   * the target is deeply equal to `value`.
   *
   *     expect('hello').to.equal('hello');
   *     expect(42).to.equal(42);
   *     expect(1).to.not.equal(true);
   *     expect({ foo: 'bar' }).to.not.equal({ foo: 'bar' });
   *     expect({ foo: 'bar' }).to.deep.equal({ foo: 'bar' });
   *
   * @name equal
   * @alias equals
   * @alias eq
   * @alias deep.equal
   * @param {Mixed} value
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertEqual (val, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    if (flag(this, 'deep')) {
      return this.eql(val);
    } else {
      this.assert(
          val === obj
        , 'expected #{this} to equal #{exp}'
        , 'expected #{this} to not equal #{exp}'
        , val
        , this._obj
        , true
      );
    }
  }

  Assertion.addMethod('equal', assertEqual);
  Assertion.addMethod('equals', assertEqual);
  Assertion.addMethod('eq', assertEqual);

  /**
   * ### .eql(value)
   *
   * Asserts that the target is deeply equal to `value`.
   *
   *     expect({ foo: 'bar' }).to.eql({ foo: 'bar' });
   *     expect([ 1, 2, 3 ]).to.eql([ 1, 2, 3 ]);
   *
   * @name eql
   * @alias eqls
   * @param {Mixed} value
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertEql(obj, msg) {
    if (msg) flag(this, 'message', msg);
    this.assert(
        _.eql(obj, flag(this, 'object'))
      , 'expected #{this} to deeply equal #{exp}'
      , 'expected #{this} to not deeply equal #{exp}'
      , obj
      , this._obj
      , true
    );
  }

  Assertion.addMethod('eql', assertEql);
  Assertion.addMethod('eqls', assertEql);

  /**
   * ### .above(value)
   *
   * Asserts that the target is greater than `value`.
   *
   *     expect(10).to.be.above(5);
   *
   * Can also be used in conjunction with `length` to
   * assert a minimum length. The benefit being a
   * more informative error message than if the length
   * was supplied directly.
   *
   *     expect('foo').to.have.length.above(2);
   *     expect([ 1, 2, 3 ]).to.have.length.above(2);
   *
   * @name above
   * @alias gt
   * @alias greaterThan
   * @param {Number} value
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertAbove (n, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    if (flag(this, 'doLength')) {
      new Assertion(obj, msg).to.have.property('length');
      var len = obj.length;
      this.assert(
          len > n
        , 'expected #{this} to have a length above #{exp} but got #{act}'
        , 'expected #{this} to not have a length above #{exp}'
        , n
        , len
      );
    } else {
      this.assert(
          obj > n
        , 'expected #{this} to be above ' + n
        , 'expected #{this} to be at most ' + n
      );
    }
  }

  Assertion.addMethod('above', assertAbove);
  Assertion.addMethod('gt', assertAbove);
  Assertion.addMethod('greaterThan', assertAbove);

  /**
   * ### .least(value)
   *
   * Asserts that the target is greater than or equal to `value`.
   *
   *     expect(10).to.be.at.least(10);
   *
   * Can also be used in conjunction with `length` to
   * assert a minimum length. The benefit being a
   * more informative error message than if the length
   * was supplied directly.
   *
   *     expect('foo').to.have.length.of.at.least(2);
   *     expect([ 1, 2, 3 ]).to.have.length.of.at.least(3);
   *
   * @name least
   * @alias gte
   * @param {Number} value
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertLeast (n, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    if (flag(this, 'doLength')) {
      new Assertion(obj, msg).to.have.property('length');
      var len = obj.length;
      this.assert(
          len >= n
        , 'expected #{this} to have a length at least #{exp} but got #{act}'
        , 'expected #{this} to have a length below #{exp}'
        , n
        , len
      );
    } else {
      this.assert(
          obj >= n
        , 'expected #{this} to be at least ' + n
        , 'expected #{this} to be below ' + n
      );
    }
  }

  Assertion.addMethod('least', assertLeast);
  Assertion.addMethod('gte', assertLeast);

  /**
   * ### .below(value)
   *
   * Asserts that the target is less than `value`.
   *
   *     expect(5).to.be.below(10);
   *
   * Can also be used in conjunction with `length` to
   * assert a maximum length. The benefit being a
   * more informative error message than if the length
   * was supplied directly.
   *
   *     expect('foo').to.have.length.below(4);
   *     expect([ 1, 2, 3 ]).to.have.length.below(4);
   *
   * @name below
   * @alias lt
   * @alias lessThan
   * @param {Number} value
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertBelow (n, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    if (flag(this, 'doLength')) {
      new Assertion(obj, msg).to.have.property('length');
      var len = obj.length;
      this.assert(
          len < n
        , 'expected #{this} to have a length below #{exp} but got #{act}'
        , 'expected #{this} to not have a length below #{exp}'
        , n
        , len
      );
    } else {
      this.assert(
          obj < n
        , 'expected #{this} to be below ' + n
        , 'expected #{this} to be at least ' + n
      );
    }
  }

  Assertion.addMethod('below', assertBelow);
  Assertion.addMethod('lt', assertBelow);
  Assertion.addMethod('lessThan', assertBelow);

  /**
   * ### .most(value)
   *
   * Asserts that the target is less than or equal to `value`.
   *
   *     expect(5).to.be.at.most(5);
   *
   * Can also be used in conjunction with `length` to
   * assert a maximum length. The benefit being a
   * more informative error message than if the length
   * was supplied directly.
   *
   *     expect('foo').to.have.length.of.at.most(4);
   *     expect([ 1, 2, 3 ]).to.have.length.of.at.most(3);
   *
   * @name most
   * @alias lte
   * @param {Number} value
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertMost (n, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    if (flag(this, 'doLength')) {
      new Assertion(obj, msg).to.have.property('length');
      var len = obj.length;
      this.assert(
          len <= n
        , 'expected #{this} to have a length at most #{exp} but got #{act}'
        , 'expected #{this} to have a length above #{exp}'
        , n
        , len
      );
    } else {
      this.assert(
          obj <= n
        , 'expected #{this} to be at most ' + n
        , 'expected #{this} to be above ' + n
      );
    }
  }

  Assertion.addMethod('most', assertMost);
  Assertion.addMethod('lte', assertMost);

  /**
   * ### .within(start, finish)
   *
   * Asserts that the target is within a range.
   *
   *     expect(7).to.be.within(5,10);
   *
   * Can also be used in conjunction with `length` to
   * assert a length range. The benefit being a
   * more informative error message than if the length
   * was supplied directly.
   *
   *     expect('foo').to.have.length.within(2,4);
   *     expect([ 1, 2, 3 ]).to.have.length.within(2,4);
   *
   * @name within
   * @param {Number} start lowerbound inclusive
   * @param {Number} finish upperbound inclusive
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  Assertion.addMethod('within', function (start, finish, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object')
      , range = start + '..' + finish;
    if (flag(this, 'doLength')) {
      new Assertion(obj, msg).to.have.property('length');
      var len = obj.length;
      this.assert(
          len >= start && len <= finish
        , 'expected #{this} to have a length within ' + range
        , 'expected #{this} to not have a length within ' + range
      );
    } else {
      this.assert(
          obj >= start && obj <= finish
        , 'expected #{this} to be within ' + range
        , 'expected #{this} to not be within ' + range
      );
    }
  });

  /**
   * ### .instanceof(constructor)
   *
   * Asserts that the target is an instance of `constructor`.
   *
   *     var Tea = function (name) { this.name = name; }
   *       , Chai = new Tea('chai');
   *
   *     expect(Chai).to.be.an.instanceof(Tea);
   *     expect([ 1, 2, 3 ]).to.be.instanceof(Array);
   *
   * @name instanceof
   * @param {Constructor} constructor
   * @param {String} message _optional_
   * @alias instanceOf
   * @namespace BDD
   * @api public
   */

  function assertInstanceOf (constructor, msg) {
    if (msg) flag(this, 'message', msg);
    var name = _.getName(constructor);
    this.assert(
        flag(this, 'object') instanceof constructor
      , 'expected #{this} to be an instance of ' + name
      , 'expected #{this} to not be an instance of ' + name
    );
  };

  Assertion.addMethod('instanceof', assertInstanceOf);
  Assertion.addMethod('instanceOf', assertInstanceOf);

  /**
   * ### .property(name, [value])
   *
   * Asserts that the target has a property `name`, optionally asserting that
   * the value of that property is strictly equal to  `value`.
   * If the `deep` flag is set, you can use dot- and bracket-notation for deep
   * references into objects and arrays.
   *
   *     // simple referencing
   *     var obj = { foo: 'bar' };
   *     expect(obj).to.have.property('foo');
   *     expect(obj).to.have.property('foo', 'bar');
   *
   *     // deep referencing
   *     var deepObj = {
   *         green: { tea: 'matcha' }
   *       , teas: [ 'chai', 'matcha', { tea: 'konacha' } ]
   *     };
   *
   *     expect(deepObj).to.have.deep.property('green.tea', 'matcha');
   *     expect(deepObj).to.have.deep.property('teas[1]', 'matcha');
   *     expect(deepObj).to.have.deep.property('teas[2].tea', 'konacha');
   *
   * You can also use an array as the starting point of a `deep.property`
   * assertion, or traverse nested arrays.
   *
   *     var arr = [
   *         [ 'chai', 'matcha', 'konacha' ]
   *       , [ { tea: 'chai' }
   *         , { tea: 'matcha' }
   *         , { tea: 'konacha' } ]
   *     ];
   *
   *     expect(arr).to.have.deep.property('[0][1]', 'matcha');
   *     expect(arr).to.have.deep.property('[1][2].tea', 'konacha');
   *
   * Furthermore, `property` changes the subject of the assertion
   * to be the value of that property from the original object. This
   * permits for further chainable assertions on that property.
   *
   *     expect(obj).to.have.property('foo')
   *       .that.is.a('string');
   *     expect(deepObj).to.have.property('green')
   *       .that.is.an('object')
   *       .that.deep.equals({ tea: 'matcha' });
   *     expect(deepObj).to.have.property('teas')
   *       .that.is.an('array')
   *       .with.deep.property('[2]')
   *         .that.deep.equals({ tea: 'konacha' });
   *
   * Note that dots and bracket in `name` must be backslash-escaped when
   * the `deep` flag is set, while they must NOT be escaped when the `deep`
   * flag is not set.
   *
   *     // simple referencing
   *     var css = { '.link[target]': 42 };
   *     expect(css).to.have.property('.link[target]', 42);
   *
   *     // deep referencing
   *     var deepCss = { '.link': { '[target]': 42 }};
   *     expect(deepCss).to.have.deep.property('\\.link.\\[target\\]', 42);
   *
   * @name property
   * @alias deep.property
   * @param {String} name
   * @param {Mixed} value (optional)
   * @param {String} message _optional_
   * @returns value of property for chaining
   * @namespace BDD
   * @api public
   */

  Assertion.addMethod('property', function (name, val, msg) {
    if (msg) flag(this, 'message', msg);

    var isDeep = !!flag(this, 'deep')
      , descriptor = isDeep ? 'deep property ' : 'property '
      , negate = flag(this, 'negate')
      , obj = flag(this, 'object')
      , pathInfo = isDeep ? _.getPathInfo(name, obj) : null
      , hasProperty = isDeep
        ? pathInfo.exists
        : _.hasProperty(name, obj)
      , value = isDeep
        ? pathInfo.value
        : obj[name];

    if (negate && arguments.length > 1) {
      if (undefined === value) {
        msg = (msg != null) ? msg + ': ' : '';
        throw new Error(msg + _.inspect(obj) + ' has no ' + descriptor + _.inspect(name));
      }
    } else {
      this.assert(
          hasProperty
        , 'expected #{this} to have a ' + descriptor + _.inspect(name)
        , 'expected #{this} to not have ' + descriptor + _.inspect(name));
    }

    if (arguments.length > 1) {
      this.assert(
          val === value
        , 'expected #{this} to have a ' + descriptor + _.inspect(name) + ' of #{exp}, but got #{act}'
        , 'expected #{this} to not have a ' + descriptor + _.inspect(name) + ' of #{act}'
        , val
        , value
      );
    }

    flag(this, 'object', value);
  });


  /**
   * ### .ownProperty(name)
   *
   * Asserts that the target has an own property `name`.
   *
   *     expect('test').to.have.ownProperty('length');
   *
   * @name ownProperty
   * @alias haveOwnProperty
   * @param {String} name
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertOwnProperty (name, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    this.assert(
        obj.hasOwnProperty(name)
      , 'expected #{this} to have own property ' + _.inspect(name)
      , 'expected #{this} to not have own property ' + _.inspect(name)
    );
  }

  Assertion.addMethod('ownProperty', assertOwnProperty);
  Assertion.addMethod('haveOwnProperty', assertOwnProperty);

  /**
   * ### .ownPropertyDescriptor(name[, descriptor[, message]])
   *
   * Asserts that the target has an own property descriptor `name`, that optionally matches `descriptor`.
   *
   *     expect('test').to.have.ownPropertyDescriptor('length');
   *     expect('test').to.have.ownPropertyDescriptor('length', { enumerable: false, configurable: false, writable: false, value: 4 });
   *     expect('test').not.to.have.ownPropertyDescriptor('length', { enumerable: false, configurable: false, writable: false, value: 3 });
   *     expect('test').ownPropertyDescriptor('length').to.have.property('enumerable', false);
   *     expect('test').ownPropertyDescriptor('length').to.have.keys('value');
   *
   * @name ownPropertyDescriptor
   * @alias haveOwnPropertyDescriptor
   * @param {String} name
   * @param {Object} descriptor _optional_
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertOwnPropertyDescriptor (name, descriptor, msg) {
    if (typeof descriptor === 'string') {
      msg = descriptor;
      descriptor = null;
    }
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    var actualDescriptor = Object.getOwnPropertyDescriptor(Object(obj), name);
    if (actualDescriptor && descriptor) {
      this.assert(
          _.eql(descriptor, actualDescriptor)
        , 'expected the own property descriptor for ' + _.inspect(name) + ' on #{this} to match ' + _.inspect(descriptor) + ', got ' + _.inspect(actualDescriptor)
        , 'expected the own property descriptor for ' + _.inspect(name) + ' on #{this} to not match ' + _.inspect(descriptor)
        , descriptor
        , actualDescriptor
        , true
      );
    } else {
      this.assert(
          actualDescriptor
        , 'expected #{this} to have an own property descriptor for ' + _.inspect(name)
        , 'expected #{this} to not have an own property descriptor for ' + _.inspect(name)
      );
    }
    flag(this, 'object', actualDescriptor);
  }

  Assertion.addMethod('ownPropertyDescriptor', assertOwnPropertyDescriptor);
  Assertion.addMethod('haveOwnPropertyDescriptor', assertOwnPropertyDescriptor);

  /**
   * ### .length
   *
   * Sets the `doLength` flag later used as a chain precursor to a value
   * comparison for the `length` property.
   *
   *     expect('foo').to.have.length.above(2);
   *     expect([ 1, 2, 3 ]).to.have.length.above(2);
   *     expect('foo').to.have.length.below(4);
   *     expect([ 1, 2, 3 ]).to.have.length.below(4);
   *     expect('foo').to.have.length.within(2,4);
   *     expect([ 1, 2, 3 ]).to.have.length.within(2,4);
   *
   * *Deprecation notice:* Using `length` as an assertion will be deprecated
   * in version 2.4.0 and removed in 3.0.0. Code using the old style of
   * asserting for `length` property value using `length(value)` should be
   * switched to use `lengthOf(value)` instead.
   *
   * @name length
   * @namespace BDD
   * @api public
   */

  /**
   * ### .lengthOf(value[, message])
   *
   * Asserts that the target's `length` property has
   * the expected value.
   *
   *     expect([ 1, 2, 3]).to.have.lengthOf(3);
   *     expect('foobar').to.have.lengthOf(6);
   *
   * @name lengthOf
   * @param {Number} length
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertLengthChain () {
    flag(this, 'doLength', true);
  }

  function assertLength (n, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    new Assertion(obj, msg).to.have.property('length');
    var len = obj.length;

    this.assert(
        len == n
      , 'expected #{this} to have a length of #{exp} but got #{act}'
      , 'expected #{this} to not have a length of #{act}'
      , n
      , len
    );
  }

  Assertion.addChainableMethod('length', assertLength, assertLengthChain);
  Assertion.addMethod('lengthOf', assertLength);

  /**
   * ### .match(regexp)
   *
   * Asserts that the target matches a regular expression.
   *
   *     expect('foobar').to.match(/^foo/);
   *
   * @name match
   * @alias matches
   * @param {RegExp} RegularExpression
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */
  function assertMatch(re, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    this.assert(
        re.exec(obj)
      , 'expected #{this} to match ' + re
      , 'expected #{this} not to match ' + re
    );
  }

  Assertion.addMethod('match', assertMatch);
  Assertion.addMethod('matches', assertMatch);

  /**
   * ### .string(string)
   *
   * Asserts that the string target contains another string.
   *
   *     expect('foobar').to.have.string('bar');
   *
   * @name string
   * @param {String} string
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  Assertion.addMethod('string', function (str, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    new Assertion(obj, msg).is.a('string');

    this.assert(
        ~obj.indexOf(str)
      , 'expected #{this} to contain ' + _.inspect(str)
      , 'expected #{this} to not contain ' + _.inspect(str)
    );
  });


  /**
   * ### .keys(key1, [key2], [...])
   *
   * Asserts that the target contains any or all of the passed-in keys.
   * Use in combination with `any`, `all`, `contains`, or `have` will affect
   * what will pass.
   *
   * When used in conjunction with `any`, at least one key that is passed
   * in must exist in the target object. This is regardless whether or not
   * the `have` or `contain` qualifiers are used. Note, either `any` or `all`
   * should be used in the assertion. If neither are used, the assertion is
   * defaulted to `all`.
   *
   * When both `all` and `contain` are used, the target object must have at
   * least all of the passed-in keys but may have more keys not listed.
   *
   * When both `all` and `have` are used, the target object must both contain
   * all of the passed-in keys AND the number of keys in the target object must
   * match the number of keys passed in (in other words, a target object must
   * have all and only all of the passed-in keys).
   *
   *     expect({ foo: 1, bar: 2 }).to.have.any.keys('foo', 'baz');
   *     expect({ foo: 1, bar: 2 }).to.have.any.keys('foo');
   *     expect({ foo: 1, bar: 2 }).to.contain.any.keys('bar', 'baz');
   *     expect({ foo: 1, bar: 2 }).to.contain.any.keys(['foo']);
   *     expect({ foo: 1, bar: 2 }).to.contain.any.keys({'foo': 6});
   *     expect({ foo: 1, bar: 2 }).to.have.all.keys(['bar', 'foo']);
   *     expect({ foo: 1, bar: 2 }).to.have.all.keys({'bar': 6, 'foo': 7});
   *     expect({ foo: 1, bar: 2, baz: 3 }).to.contain.all.keys(['bar', 'foo']);
   *     expect({ foo: 1, bar: 2, baz: 3 }).to.contain.all.keys({'bar': 6});
   *
   *
   * @name keys
   * @alias key
   * @param {...String|Array|Object} keys
   * @namespace BDD
   * @api public
   */

  function assertKeys (keys) {
    var obj = flag(this, 'object')
      , str
      , ok = true
      , mixedArgsMsg = 'keys must be given single argument of Array|Object|String, or multiple String arguments';

    switch (_.type(keys)) {
      case "array":
        if (arguments.length > 1) throw (new Error(mixedArgsMsg));
        break;
      case "object":
        if (arguments.length > 1) throw (new Error(mixedArgsMsg));
        keys = Object.keys(keys);
        break;
      default:
        keys = Array.prototype.slice.call(arguments);
    }

    if (!keys.length) throw new Error('keys required');

    var actual = Object.keys(obj)
      , expected = keys
      , len = keys.length
      , any = flag(this, 'any')
      , all = flag(this, 'all');

    if (!any && !all) {
      all = true;
    }

    // Has any
    if (any) {
      var intersection = expected.filter(function(key) {
        return ~actual.indexOf(key);
      });
      ok = intersection.length > 0;
    }

    // Has all
    if (all) {
      ok = keys.every(function(key){
        return ~actual.indexOf(key);
      });
      if (!flag(this, 'negate') && !flag(this, 'contains')) {
        ok = ok && keys.length == actual.length;
      }
    }

    // Key string
    if (len > 1) {
      keys = keys.map(function(key){
        return _.inspect(key);
      });
      var last = keys.pop();
      if (all) {
        str = keys.join(', ') + ', and ' + last;
      }
      if (any) {
        str = keys.join(', ') + ', or ' + last;
      }
    } else {
      str = _.inspect(keys[0]);
    }

    // Form
    str = (len > 1 ? 'keys ' : 'key ') + str;

    // Have / include
    str = (flag(this, 'contains') ? 'contain ' : 'have ') + str;

    // Assertion
    this.assert(
        ok
      , 'expected #{this} to ' + str
      , 'expected #{this} to not ' + str
      , expected.slice(0).sort()
      , actual.sort()
      , true
    );
  }

  Assertion.addMethod('keys', assertKeys);
  Assertion.addMethod('key', assertKeys);

  /**
   * ### .throw(constructor)
   *
   * Asserts that the function target will throw a specific error, or specific type of error
   * (as determined using `instanceof`), optionally with a RegExp or string inclusion test
   * for the error's message.
   *
   *     var err = new ReferenceError('This is a bad function.');
   *     var fn = function () { throw err; }
   *     expect(fn).to.throw(ReferenceError);
   *     expect(fn).to.throw(Error);
   *     expect(fn).to.throw(/bad function/);
   *     expect(fn).to.not.throw('good function');
   *     expect(fn).to.throw(ReferenceError, /bad function/);
   *     expect(fn).to.throw(err);
   *
   * Please note that when a throw expectation is negated, it will check each
   * parameter independently, starting with error constructor type. The appropriate way
   * to check for the existence of a type of error but for a message that does not match
   * is to use `and`.
   *
   *     expect(fn).to.throw(ReferenceError)
   *        .and.not.throw(/good function/);
   *
   * @name throw
   * @alias throws
   * @alias Throw
   * @param {ErrorConstructor} constructor
   * @param {String|RegExp} expected error message
   * @param {String} message _optional_
   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
   * @returns error for chaining (null if no error)
   * @namespace BDD
   * @api public
   */

  function assertThrows (constructor, errMsg, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    new Assertion(obj, msg).is.a('function');

    var thrown = false
      , desiredError = null
      , name = null
      , thrownError = null;

    if (arguments.length === 0) {
      errMsg = null;
      constructor = null;
    } else if (constructor && (constructor instanceof RegExp || 'string' === typeof constructor)) {
      errMsg = constructor;
      constructor = null;
    } else if (constructor && constructor instanceof Error) {
      desiredError = constructor;
      constructor = null;
      errMsg = null;
    } else if (typeof constructor === 'function') {
      name = constructor.prototype.name;
      if (!name || (name === 'Error' && constructor !== Error)) {
        name = constructor.name || (new constructor()).name;
      }
    } else {
      constructor = null;
    }

    try {
      obj();
    } catch (err) {
      // first, check desired error
      if (desiredError) {
        this.assert(
            err === desiredError
          , 'expected #{this} to throw #{exp} but #{act} was thrown'
          , 'expected #{this} to not throw #{exp}'
          , (desiredError instanceof Error ? desiredError.toString() : desiredError)
          , (err instanceof Error ? err.toString() : err)
        );

        flag(this, 'object', err);
        return this;
      }

      // next, check constructor
      if (constructor) {
        this.assert(
            err instanceof constructor
          , 'expected #{this} to throw #{exp} but #{act} was thrown'
          , 'expected #{this} to not throw #{exp} but #{act} was thrown'
          , name
          , (err instanceof Error ? err.toString() : err)
        );

        if (!errMsg) {
          flag(this, 'object', err);
          return this;
        }
      }

      // next, check message
      var message = 'error' === _.type(err) && "message" in err
        ? err.message
        : '' + err;

      if ((message != null) && errMsg && errMsg instanceof RegExp) {
        this.assert(
            errMsg.exec(message)
          , 'expected #{this} to throw error matching #{exp} but got #{act}'
          , 'expected #{this} to throw error not matching #{exp}'
          , errMsg
          , message
        );

        flag(this, 'object', err);
        return this;
      } else if ((message != null) && errMsg && 'string' === typeof errMsg) {
        this.assert(
            ~message.indexOf(errMsg)
          , 'expected #{this} to throw error including #{exp} but got #{act}'
          , 'expected #{this} to throw error not including #{act}'
          , errMsg
          , message
        );

        flag(this, 'object', err);
        return this;
      } else {
        thrown = true;
        thrownError = err;
      }
    }

    var actuallyGot = ''
      , expectedThrown = name !== null
        ? name
        : desiredError
          ? '#{exp}' //_.inspect(desiredError)
          : 'an error';

    if (thrown) {
      actuallyGot = ' but #{act} was thrown'
    }

    this.assert(
        thrown === true
      , 'expected #{this} to throw ' + expectedThrown + actuallyGot
      , 'expected #{this} to not throw ' + expectedThrown + actuallyGot
      , (desiredError instanceof Error ? desiredError.toString() : desiredError)
      , (thrownError instanceof Error ? thrownError.toString() : thrownError)
    );

    flag(this, 'object', thrownError);
  };

  Assertion.addMethod('throw', assertThrows);
  Assertion.addMethod('throws', assertThrows);
  Assertion.addMethod('Throw', assertThrows);

  /**
   * ### .respondTo(method)
   *
   * Asserts that the object or class target will respond to a method.
   *
   *     Klass.prototype.bar = function(){};
   *     expect(Klass).to.respondTo('bar');
   *     expect(obj).to.respondTo('bar');
   *
   * To check if a constructor will respond to a static function,
   * set the `itself` flag.
   *
   *     Klass.baz = function(){};
   *     expect(Klass).itself.to.respondTo('baz');
   *
   * @name respondTo
   * @alias respondsTo
   * @param {String} method
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function respondTo (method, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object')
      , itself = flag(this, 'itself')
      , context = ('function' === _.type(obj) && !itself)
        ? obj.prototype[method]
        : obj[method];

    this.assert(
        'function' === typeof context
      , 'expected #{this} to respond to ' + _.inspect(method)
      , 'expected #{this} to not respond to ' + _.inspect(method)
    );
  }

  Assertion.addMethod('respondTo', respondTo);
  Assertion.addMethod('respondsTo', respondTo);

  /**
   * ### .itself
   *
   * Sets the `itself` flag, later used by the `respondTo` assertion.
   *
   *     function Foo() {}
   *     Foo.bar = function() {}
   *     Foo.prototype.baz = function() {}
   *
   *     expect(Foo).itself.to.respondTo('bar');
   *     expect(Foo).itself.not.to.respondTo('baz');
   *
   * @name itself
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('itself', function () {
    flag(this, 'itself', true);
  });

  /**
   * ### .satisfy(method)
   *
   * Asserts that the target passes a given truth test.
   *
   *     expect(1).to.satisfy(function(num) { return num > 0; });
   *
   * @name satisfy
   * @alias satisfies
   * @param {Function} matcher
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function satisfy (matcher, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');
    var result = matcher(obj);
    this.assert(
        result
      , 'expected #{this} to satisfy ' + _.objDisplay(matcher)
      , 'expected #{this} to not satisfy' + _.objDisplay(matcher)
      , this.negate ? false : true
      , result
    );
  }

  Assertion.addMethod('satisfy', satisfy);
  Assertion.addMethod('satisfies', satisfy);

  /**
   * ### .closeTo(expected, delta)
   *
   * Asserts that the target is equal `expected`, to within a +/- `delta` range.
   *
   *     expect(1.5).to.be.closeTo(1, 0.5);
   *
   * @name closeTo
   * @alias approximately
   * @param {Number} expected
   * @param {Number} delta
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function closeTo(expected, delta, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');

    new Assertion(obj, msg).is.a('number');
    if (_.type(expected) !== 'number' || _.type(delta) !== 'number') {
      throw new Error('the arguments to closeTo or approximately must be numbers');
    }

    this.assert(
        Math.abs(obj - expected) <= delta
      , 'expected #{this} to be close to ' + expected + ' +/- ' + delta
      , 'expected #{this} not to be close to ' + expected + ' +/- ' + delta
    );
  }

  Assertion.addMethod('closeTo', closeTo);
  Assertion.addMethod('approximately', closeTo);

  function isSubsetOf(subset, superset, cmp) {
    return subset.every(function(elem) {
      if (!cmp) return superset.indexOf(elem) !== -1;

      return superset.some(function(elem2) {
        return cmp(elem, elem2);
      });
    })
  }

  /**
   * ### .members(set)
   *
   * Asserts that the target is a superset of `set`,
   * or that the target and `set` have the same strictly-equal (===) members.
   * Alternately, if the `deep` flag is set, set members are compared for deep
   * equality.
   *
   *     expect([1, 2, 3]).to.include.members([3, 2]);
   *     expect([1, 2, 3]).to.not.include.members([3, 2, 8]);
   *
   *     expect([4, 2]).to.have.members([2, 4]);
   *     expect([5, 2]).to.not.have.members([5, 2, 1]);
   *
   *     expect([{ id: 1 }]).to.deep.include.members([{ id: 1 }]);
   *
   * @name members
   * @param {Array} set
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  Assertion.addMethod('members', function (subset, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');

    new Assertion(obj).to.be.an('array');
    new Assertion(subset).to.be.an('array');

    var cmp = flag(this, 'deep') ? _.eql : undefined;

    if (flag(this, 'contains')) {
      return this.assert(
          isSubsetOf(subset, obj, cmp)
        , 'expected #{this} to be a superset of #{act}'
        , 'expected #{this} to not be a superset of #{act}'
        , obj
        , subset
      );
    }

    this.assert(
        isSubsetOf(obj, subset, cmp) && isSubsetOf(subset, obj, cmp)
        , 'expected #{this} to have the same members as #{act}'
        , 'expected #{this} to not have the same members as #{act}'
        , obj
        , subset
    );
  });

  /**
   * ### .oneOf(list)
   *
   * Assert that a value appears somewhere in the top level of array `list`.
   *
   *     expect('a').to.be.oneOf(['a', 'b', 'c']);
   *     expect(9).to.not.be.oneOf(['z']);
   *     expect([3]).to.not.be.oneOf([1, 2, [3]]);
   *
   *     var three = [3];
   *     // for object-types, contents are not compared
   *     expect(three).to.not.be.oneOf([1, 2, [3]]);
   *     // comparing references works
   *     expect(three).to.be.oneOf([1, 2, three]);
   *
   * @name oneOf
   * @param {Array<*>} list
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function oneOf (list, msg) {
    if (msg) flag(this, 'message', msg);
    var expected = flag(this, 'object');
    new Assertion(list).to.be.an('array');

    this.assert(
        list.indexOf(expected) > -1
      , 'expected #{this} to be one of #{exp}'
      , 'expected #{this} to not be one of #{exp}'
      , list
      , expected
    );
  }

  Assertion.addMethod('oneOf', oneOf);


  /**
   * ### .change(function)
   *
   * Asserts that a function changes an object property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val += 3 };
   *     var noChangeFn = function() { return 'foo' + 'bar'; }
   *     expect(fn).to.change(obj, 'val');
   *     expect(noChangeFn).to.not.change(obj, 'val')
   *
   * @name change
   * @alias changes
   * @alias Change
   * @param {String} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertChanges (object, prop, msg) {
    if (msg) flag(this, 'message', msg);
    var fn = flag(this, 'object');
    new Assertion(object, msg).to.have.property(prop);
    new Assertion(fn).is.a('function');

    var initial = object[prop];
    fn();

    this.assert(
      initial !== object[prop]
      , 'expected .' + prop + ' to change'
      , 'expected .' + prop + ' to not change'
    );
  }

  Assertion.addChainableMethod('change', assertChanges);
  Assertion.addChainableMethod('changes', assertChanges);

  /**
   * ### .increase(function)
   *
   * Asserts that a function increases an object property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 15 };
   *     expect(fn).to.increase(obj, 'val');
   *
   * @name increase
   * @alias increases
   * @alias Increase
   * @param {String} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertIncreases (object, prop, msg) {
    if (msg) flag(this, 'message', msg);
    var fn = flag(this, 'object');
    new Assertion(object, msg).to.have.property(prop);
    new Assertion(fn).is.a('function');

    var initial = object[prop];
    fn();

    this.assert(
      object[prop] - initial > 0
      , 'expected .' + prop + ' to increase'
      , 'expected .' + prop + ' to not increase'
    );
  }

  Assertion.addChainableMethod('increase', assertIncreases);
  Assertion.addChainableMethod('increases', assertIncreases);

  /**
   * ### .decrease(function)
   *
   * Asserts that a function decreases an object property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 5 };
   *     expect(fn).to.decrease(obj, 'val');
   *
   * @name decrease
   * @alias decreases
   * @alias Decrease
   * @param {String} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace BDD
   * @api public
   */

  function assertDecreases (object, prop, msg) {
    if (msg) flag(this, 'message', msg);
    var fn = flag(this, 'object');
    new Assertion(object, msg).to.have.property(prop);
    new Assertion(fn).is.a('function');

    var initial = object[prop];
    fn();

    this.assert(
      object[prop] - initial < 0
      , 'expected .' + prop + ' to decrease'
      , 'expected .' + prop + ' to not decrease'
    );
  }

  Assertion.addChainableMethod('decrease', assertDecreases);
  Assertion.addChainableMethod('decreases', assertDecreases);

  /**
   * ### .extensible
   *
   * Asserts that the target is extensible (can have new properties added to
   * it).
   *
   *     var nonExtensibleObject = Object.preventExtensions({});
   *     var sealedObject = Object.seal({});
   *     var frozenObject = Object.freeze({});
   *
   *     expect({}).to.be.extensible;
   *     expect(nonExtensibleObject).to.not.be.extensible;
   *     expect(sealedObject).to.not.be.extensible;
   *     expect(frozenObject).to.not.be.extensible;
   *
   * @name extensible
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('extensible', function() {
    var obj = flag(this, 'object');

    // In ES5, if the argument to this method is not an object (a primitive), then it will cause a TypeError.
    // In ES6, a non-object argument will be treated as if it was a non-extensible ordinary object, simply return false.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible
    // The following provides ES6 behavior when a TypeError is thrown under ES5.

    var isExtensible;

    try {
      isExtensible = Object.isExtensible(obj);
    } catch (err) {
      if (err instanceof TypeError) isExtensible = false;
      else throw err;
    }

    this.assert(
      isExtensible
      , 'expected #{this} to be extensible'
      , 'expected #{this} to not be extensible'
    );
  });

  /**
   * ### .sealed
   *
   * Asserts that the target is sealed (cannot have new properties added to it
   * and its existing properties cannot be removed).
   *
   *     var sealedObject = Object.seal({});
   *     var frozenObject = Object.freeze({});
   *
   *     expect(sealedObject).to.be.sealed;
   *     expect(frozenObject).to.be.sealed;
   *     expect({}).to.not.be.sealed;
   *
   * @name sealed
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('sealed', function() {
    var obj = flag(this, 'object');

    // In ES5, if the argument to this method is not an object (a primitive), then it will cause a TypeError.
    // In ES6, a non-object argument will be treated as if it was a sealed ordinary object, simply return true.
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isSealed
    // The following provides ES6 behavior when a TypeError is thrown under ES5.

    var isSealed;

    try {
      isSealed = Object.isSealed(obj);
    } catch (err) {
      if (err instanceof TypeError) isSealed = true;
      else throw err;
    }

    this.assert(
      isSealed
      , 'expected #{this} to be sealed'
      , 'expected #{this} to not be sealed'
    );
  });

  /**
   * ### .frozen
   *
   * Asserts that the target is frozen (cannot have new properties added to it
   * and its existing properties cannot be modified).
   *
   *     var frozenObject = Object.freeze({});
   *
   *     expect(frozenObject).to.be.frozen;
   *     expect({}).to.not.be.frozen;
   *
   * @name frozen
   * @namespace BDD
   * @api public
   */

  Assertion.addProperty('frozen', function() {
    var obj = flag(this, 'object');

    // In ES5, if the argument to this method is not an object (a primitive), then it will cause a TypeError.
    // In ES6, a non-object argument will be treated as if it was a frozen ordinary object, simply return true.
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen
    // The following provides ES6 behavior when a TypeError is thrown under ES5.

    var isFrozen;

    try {
      isFrozen = Object.isFrozen(obj);
    } catch (err) {
      if (err instanceof TypeError) isFrozen = true;
      else throw err;
    }

    this.assert(
      isFrozen
      , 'expected #{this} to be frozen'
      , 'expected #{this} to not be frozen'
    );
  });
};


/***/ }),

/***/ "./node_modules/chai/lib/chai/interface/assert.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */


module.exports = function (chai, util) {

  /*!
   * Chai dependencies.
   */

  var Assertion = chai.Assertion
    , flag = util.flag;

  /*!
   * Module export.
   */

  /**
   * ### assert(expression, message)
   *
   * Write your own test expressions.
   *
   *     assert('foo' !== 'bar', 'foo is not bar');
   *     assert(Array.isArray([]), 'empty arrays are arrays');
   *
   * @param {Mixed} expression to test for truthiness
   * @param {String} message to display on error
   * @name assert
   * @namespace Assert
   * @api public
   */

  var assert = chai.assert = function (express, errmsg) {
    var test = new Assertion(null, null, chai.assert);
    test.assert(
        express
      , errmsg
      , '[ negation message unavailable ]'
    );
  };

  /**
   * ### .fail(actual, expected, [message], [operator])
   *
   * Throw a failure. Node.js `assert` module-compatible.
   *
   * @name fail
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @param {String} operator
   * @namespace Assert
   * @api public
   */

  assert.fail = function (actual, expected, message, operator) {
    message = message || 'assert.fail()';
    throw new chai.AssertionError(message, {
        actual: actual
      , expected: expected
      , operator: operator
    }, assert.fail);
  };

  /**
   * ### .isOk(object, [message])
   *
   * Asserts that `object` is truthy.
   *
   *     assert.isOk('everything', 'everything is ok');
   *     assert.isOk(false, 'this will fail');
   *
   * @name isOk
   * @alias ok
   * @param {Mixed} object to test
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isOk = function (val, msg) {
    new Assertion(val, msg).is.ok;
  };

  /**
   * ### .isNotOk(object, [message])
   *
   * Asserts that `object` is falsy.
   *
   *     assert.isNotOk('everything', 'this will fail');
   *     assert.isNotOk(false, 'this will pass');
   *
   * @name isNotOk
   * @alias notOk
   * @param {Mixed} object to test
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotOk = function (val, msg) {
    new Assertion(val, msg).is.not.ok;
  };

  /**
   * ### .equal(actual, expected, [message])
   *
   * Asserts non-strict equality (`==`) of `actual` and `expected`.
   *
   *     assert.equal(3, '3', '== coerces values to strings');
   *
   * @name equal
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.equal = function (act, exp, msg) {
    var test = new Assertion(act, msg, assert.equal);

    test.assert(
        exp == flag(test, 'object')
      , 'expected #{this} to equal #{exp}'
      , 'expected #{this} to not equal #{act}'
      , exp
      , act
    );
  };

  /**
   * ### .notEqual(actual, expected, [message])
   *
   * Asserts non-strict inequality (`!=`) of `actual` and `expected`.
   *
   *     assert.notEqual(3, 4, 'these numbers are not equal');
   *
   * @name notEqual
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notEqual = function (act, exp, msg) {
    var test = new Assertion(act, msg, assert.notEqual);

    test.assert(
        exp != flag(test, 'object')
      , 'expected #{this} to not equal #{exp}'
      , 'expected #{this} to equal #{act}'
      , exp
      , act
    );
  };

  /**
   * ### .strictEqual(actual, expected, [message])
   *
   * Asserts strict equality (`===`) of `actual` and `expected`.
   *
   *     assert.strictEqual(true, true, 'these booleans are strictly equal');
   *
   * @name strictEqual
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.strictEqual = function (act, exp, msg) {
    new Assertion(act, msg).to.equal(exp);
  };

  /**
   * ### .notStrictEqual(actual, expected, [message])
   *
   * Asserts strict inequality (`!==`) of `actual` and `expected`.
   *
   *     assert.notStrictEqual(3, '3', 'no coercion for strict equality');
   *
   * @name notStrictEqual
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notStrictEqual = function (act, exp, msg) {
    new Assertion(act, msg).to.not.equal(exp);
  };

  /**
   * ### .deepEqual(actual, expected, [message])
   *
   * Asserts that `actual` is deeply equal to `expected`.
   *
   *     assert.deepEqual({ tea: 'green' }, { tea: 'green' });
   *
   * @name deepEqual
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.deepEqual = function (act, exp, msg) {
    new Assertion(act, msg).to.eql(exp);
  };

  /**
   * ### .notDeepEqual(actual, expected, [message])
   *
   * Assert that `actual` is not deeply equal to `expected`.
   *
   *     assert.notDeepEqual({ tea: 'green' }, { tea: 'jasmine' });
   *
   * @name notDeepEqual
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notDeepEqual = function (act, exp, msg) {
    new Assertion(act, msg).to.not.eql(exp);
  };

   /**
   * ### .isAbove(valueToCheck, valueToBeAbove, [message])
   *
   * Asserts `valueToCheck` is strictly greater than (>) `valueToBeAbove`
   *
   *     assert.isAbove(5, 2, '5 is strictly greater than 2');
   *
   * @name isAbove
   * @param {Mixed} valueToCheck
   * @param {Mixed} valueToBeAbove
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isAbove = function (val, abv, msg) {
    new Assertion(val, msg).to.be.above(abv);
  };

   /**
   * ### .isAtLeast(valueToCheck, valueToBeAtLeast, [message])
   *
   * Asserts `valueToCheck` is greater than or equal to (>=) `valueToBeAtLeast`
   *
   *     assert.isAtLeast(5, 2, '5 is greater or equal to 2');
   *     assert.isAtLeast(3, 3, '3 is greater or equal to 3');
   *
   * @name isAtLeast
   * @param {Mixed} valueToCheck
   * @param {Mixed} valueToBeAtLeast
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isAtLeast = function (val, atlst, msg) {
    new Assertion(val, msg).to.be.least(atlst);
  };

   /**
   * ### .isBelow(valueToCheck, valueToBeBelow, [message])
   *
   * Asserts `valueToCheck` is strictly less than (<) `valueToBeBelow`
   *
   *     assert.isBelow(3, 6, '3 is strictly less than 6');
   *
   * @name isBelow
   * @param {Mixed} valueToCheck
   * @param {Mixed} valueToBeBelow
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isBelow = function (val, blw, msg) {
    new Assertion(val, msg).to.be.below(blw);
  };

   /**
   * ### .isAtMost(valueToCheck, valueToBeAtMost, [message])
   *
   * Asserts `valueToCheck` is less than or equal to (<=) `valueToBeAtMost`
   *
   *     assert.isAtMost(3, 6, '3 is less than or equal to 6');
   *     assert.isAtMost(4, 4, '4 is less than or equal to 4');
   *
   * @name isAtMost
   * @param {Mixed} valueToCheck
   * @param {Mixed} valueToBeAtMost
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isAtMost = function (val, atmst, msg) {
    new Assertion(val, msg).to.be.most(atmst);
  };

  /**
   * ### .isTrue(value, [message])
   *
   * Asserts that `value` is true.
   *
   *     var teaServed = true;
   *     assert.isTrue(teaServed, 'the tea has been served');
   *
   * @name isTrue
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isTrue = function (val, msg) {
    new Assertion(val, msg).is['true'];
  };

  /**
   * ### .isNotTrue(value, [message])
   *
   * Asserts that `value` is not true.
   *
   *     var tea = 'tasty chai';
   *     assert.isNotTrue(tea, 'great, time for tea!');
   *
   * @name isNotTrue
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotTrue = function (val, msg) {
    new Assertion(val, msg).to.not.equal(true);
  };

  /**
   * ### .isFalse(value, [message])
   *
   * Asserts that `value` is false.
   *
   *     var teaServed = false;
   *     assert.isFalse(teaServed, 'no tea yet? hmm...');
   *
   * @name isFalse
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isFalse = function (val, msg) {
    new Assertion(val, msg).is['false'];
  };

  /**
   * ### .isNotFalse(value, [message])
   *
   * Asserts that `value` is not false.
   *
   *     var tea = 'tasty chai';
   *     assert.isNotFalse(tea, 'great, time for tea!');
   *
   * @name isNotFalse
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotFalse = function (val, msg) {
    new Assertion(val, msg).to.not.equal(false);
  };

  /**
   * ### .isNull(value, [message])
   *
   * Asserts that `value` is null.
   *
   *     assert.isNull(err, 'there was no error');
   *
   * @name isNull
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNull = function (val, msg) {
    new Assertion(val, msg).to.equal(null);
  };

  /**
   * ### .isNotNull(value, [message])
   *
   * Asserts that `value` is not null.
   *
   *     var tea = 'tasty chai';
   *     assert.isNotNull(tea, 'great, time for tea!');
   *
   * @name isNotNull
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotNull = function (val, msg) {
    new Assertion(val, msg).to.not.equal(null);
  };

  /**
   * ### .isNaN
   * Asserts that value is NaN
   *
   *    assert.isNaN('foo', 'foo is NaN');
   *
   * @name isNaN
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNaN = function (val, msg) {
    new Assertion(val, msg).to.be.NaN;
  };

  /**
   * ### .isNotNaN
   * Asserts that value is not NaN
   *
   *    assert.isNotNaN(4, '4 is not NaN');
   *
   * @name isNotNaN
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */
  assert.isNotNaN = function (val, msg) {
    new Assertion(val, msg).not.to.be.NaN;
  };

  /**
   * ### .isUndefined(value, [message])
   *
   * Asserts that `value` is `undefined`.
   *
   *     var tea;
   *     assert.isUndefined(tea, 'no tea defined');
   *
   * @name isUndefined
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isUndefined = function (val, msg) {
    new Assertion(val, msg).to.equal(undefined);
  };

  /**
   * ### .isDefined(value, [message])
   *
   * Asserts that `value` is not `undefined`.
   *
   *     var tea = 'cup of chai';
   *     assert.isDefined(tea, 'tea has been defined');
   *
   * @name isDefined
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isDefined = function (val, msg) {
    new Assertion(val, msg).to.not.equal(undefined);
  };

  /**
   * ### .isFunction(value, [message])
   *
   * Asserts that `value` is a function.
   *
   *     function serveTea() { return 'cup of tea'; };
   *     assert.isFunction(serveTea, 'great, we can have tea now');
   *
   * @name isFunction
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isFunction = function (val, msg) {
    new Assertion(val, msg).to.be.a('function');
  };

  /**
   * ### .isNotFunction(value, [message])
   *
   * Asserts that `value` is _not_ a function.
   *
   *     var serveTea = [ 'heat', 'pour', 'sip' ];
   *     assert.isNotFunction(serveTea, 'great, we have listed the steps');
   *
   * @name isNotFunction
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotFunction = function (val, msg) {
    new Assertion(val, msg).to.not.be.a('function');
  };

  /**
   * ### .isObject(value, [message])
   *
   * Asserts that `value` is an object of type 'Object' (as revealed by `Object.prototype.toString`).
   * _The assertion does not match subclassed objects._
   *
   *     var selection = { name: 'Chai', serve: 'with spices' };
   *     assert.isObject(selection, 'tea selection is an object');
   *
   * @name isObject
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isObject = function (val, msg) {
    new Assertion(val, msg).to.be.a('object');
  };

  /**
   * ### .isNotObject(value, [message])
   *
   * Asserts that `value` is _not_ an object of type 'Object' (as revealed by `Object.prototype.toString`).
   *
   *     var selection = 'chai'
   *     assert.isNotObject(selection, 'tea selection is not an object');
   *     assert.isNotObject(null, 'null is not an object');
   *
   * @name isNotObject
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotObject = function (val, msg) {
    new Assertion(val, msg).to.not.be.a('object');
  };

  /**
   * ### .isArray(value, [message])
   *
   * Asserts that `value` is an array.
   *
   *     var menu = [ 'green', 'chai', 'oolong' ];
   *     assert.isArray(menu, 'what kind of tea do we want?');
   *
   * @name isArray
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isArray = function (val, msg) {
    new Assertion(val, msg).to.be.an('array');
  };

  /**
   * ### .isNotArray(value, [message])
   *
   * Asserts that `value` is _not_ an array.
   *
   *     var menu = 'green|chai|oolong';
   *     assert.isNotArray(menu, 'what kind of tea do we want?');
   *
   * @name isNotArray
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotArray = function (val, msg) {
    new Assertion(val, msg).to.not.be.an('array');
  };

  /**
   * ### .isString(value, [message])
   *
   * Asserts that `value` is a string.
   *
   *     var teaOrder = 'chai';
   *     assert.isString(teaOrder, 'order placed');
   *
   * @name isString
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isString = function (val, msg) {
    new Assertion(val, msg).to.be.a('string');
  };

  /**
   * ### .isNotString(value, [message])
   *
   * Asserts that `value` is _not_ a string.
   *
   *     var teaOrder = 4;
   *     assert.isNotString(teaOrder, 'order placed');
   *
   * @name isNotString
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotString = function (val, msg) {
    new Assertion(val, msg).to.not.be.a('string');
  };

  /**
   * ### .isNumber(value, [message])
   *
   * Asserts that `value` is a number.
   *
   *     var cups = 2;
   *     assert.isNumber(cups, 'how many cups');
   *
   * @name isNumber
   * @param {Number} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNumber = function (val, msg) {
    new Assertion(val, msg).to.be.a('number');
  };

  /**
   * ### .isNotNumber(value, [message])
   *
   * Asserts that `value` is _not_ a number.
   *
   *     var cups = '2 cups please';
   *     assert.isNotNumber(cups, 'how many cups');
   *
   * @name isNotNumber
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotNumber = function (val, msg) {
    new Assertion(val, msg).to.not.be.a('number');
  };

  /**
   * ### .isBoolean(value, [message])
   *
   * Asserts that `value` is a boolean.
   *
   *     var teaReady = true
   *       , teaServed = false;
   *
   *     assert.isBoolean(teaReady, 'is the tea ready');
   *     assert.isBoolean(teaServed, 'has tea been served');
   *
   * @name isBoolean
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isBoolean = function (val, msg) {
    new Assertion(val, msg).to.be.a('boolean');
  };

  /**
   * ### .isNotBoolean(value, [message])
   *
   * Asserts that `value` is _not_ a boolean.
   *
   *     var teaReady = 'yep'
   *       , teaServed = 'nope';
   *
   *     assert.isNotBoolean(teaReady, 'is the tea ready');
   *     assert.isNotBoolean(teaServed, 'has tea been served');
   *
   * @name isNotBoolean
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.isNotBoolean = function (val, msg) {
    new Assertion(val, msg).to.not.be.a('boolean');
  };

  /**
   * ### .typeOf(value, name, [message])
   *
   * Asserts that `value`'s type is `name`, as determined by
   * `Object.prototype.toString`.
   *
   *     assert.typeOf({ tea: 'chai' }, 'object', 'we have an object');
   *     assert.typeOf(['chai', 'jasmine'], 'array', 'we have an array');
   *     assert.typeOf('tea', 'string', 'we have a string');
   *     assert.typeOf(/tea/, 'regexp', 'we have a regular expression');
   *     assert.typeOf(null, 'null', 'we have a null');
   *     assert.typeOf(undefined, 'undefined', 'we have an undefined');
   *
   * @name typeOf
   * @param {Mixed} value
   * @param {String} name
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.typeOf = function (val, type, msg) {
    new Assertion(val, msg).to.be.a(type);
  };

  /**
   * ### .notTypeOf(value, name, [message])
   *
   * Asserts that `value`'s type is _not_ `name`, as determined by
   * `Object.prototype.toString`.
   *
   *     assert.notTypeOf('tea', 'number', 'strings are not numbers');
   *
   * @name notTypeOf
   * @param {Mixed} value
   * @param {String} typeof name
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notTypeOf = function (val, type, msg) {
    new Assertion(val, msg).to.not.be.a(type);
  };

  /**
   * ### .instanceOf(object, constructor, [message])
   *
   * Asserts that `value` is an instance of `constructor`.
   *
   *     var Tea = function (name) { this.name = name; }
   *       , chai = new Tea('chai');
   *
   *     assert.instanceOf(chai, Tea, 'chai is an instance of tea');
   *
   * @name instanceOf
   * @param {Object} object
   * @param {Constructor} constructor
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.instanceOf = function (val, type, msg) {
    new Assertion(val, msg).to.be.instanceOf(type);
  };

  /**
   * ### .notInstanceOf(object, constructor, [message])
   *
   * Asserts `value` is not an instance of `constructor`.
   *
   *     var Tea = function (name) { this.name = name; }
   *       , chai = new String('chai');
   *
   *     assert.notInstanceOf(chai, Tea, 'chai is not an instance of tea');
   *
   * @name notInstanceOf
   * @param {Object} object
   * @param {Constructor} constructor
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notInstanceOf = function (val, type, msg) {
    new Assertion(val, msg).to.not.be.instanceOf(type);
  };

  /**
   * ### .include(haystack, needle, [message])
   *
   * Asserts that `haystack` includes `needle`. Works
   * for strings and arrays.
   *
   *     assert.include('foobar', 'bar', 'foobar contains string "bar"');
   *     assert.include([ 1, 2, 3 ], 3, 'array contains value');
   *
   * @name include
   * @param {Array|String} haystack
   * @param {Mixed} needle
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.include = function (exp, inc, msg) {
    new Assertion(exp, msg, assert.include).include(inc);
  };

  /**
   * ### .notInclude(haystack, needle, [message])
   *
   * Asserts that `haystack` does not include `needle`. Works
   * for strings and arrays.
   *
   *     assert.notInclude('foobar', 'baz', 'string not include substring');
   *     assert.notInclude([ 1, 2, 3 ], 4, 'array not include contain value');
   *
   * @name notInclude
   * @param {Array|String} haystack
   * @param {Mixed} needle
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notInclude = function (exp, inc, msg) {
    new Assertion(exp, msg, assert.notInclude).not.include(inc);
  };

  /**
   * ### .match(value, regexp, [message])
   *
   * Asserts that `value` matches the regular expression `regexp`.
   *
   *     assert.match('foobar', /^foo/, 'regexp matches');
   *
   * @name match
   * @param {Mixed} value
   * @param {RegExp} regexp
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.match = function (exp, re, msg) {
    new Assertion(exp, msg).to.match(re);
  };

  /**
   * ### .notMatch(value, regexp, [message])
   *
   * Asserts that `value` does not match the regular expression `regexp`.
   *
   *     assert.notMatch('foobar', /^foo/, 'regexp does not match');
   *
   * @name notMatch
   * @param {Mixed} value
   * @param {RegExp} regexp
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notMatch = function (exp, re, msg) {
    new Assertion(exp, msg).to.not.match(re);
  };

  /**
   * ### .property(object, property, [message])
   *
   * Asserts that `object` has a property named by `property`.
   *
   *     assert.property({ tea: { green: 'matcha' }}, 'tea');
   *
   * @name property
   * @param {Object} object
   * @param {String} property
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.property = function (obj, prop, msg) {
    new Assertion(obj, msg).to.have.property(prop);
  };

  /**
   * ### .notProperty(object, property, [message])
   *
   * Asserts that `object` does _not_ have a property named by `property`.
   *
   *     assert.notProperty({ tea: { green: 'matcha' }}, 'coffee');
   *
   * @name notProperty
   * @param {Object} object
   * @param {String} property
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notProperty = function (obj, prop, msg) {
    new Assertion(obj, msg).to.not.have.property(prop);
  };

  /**
   * ### .deepProperty(object, property, [message])
   *
   * Asserts that `object` has a property named by `property`, which can be a
   * string using dot- and bracket-notation for deep reference.
   *
   *     assert.deepProperty({ tea: { green: 'matcha' }}, 'tea.green');
   *
   * @name deepProperty
   * @param {Object} object
   * @param {String} property
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.deepProperty = function (obj, prop, msg) {
    new Assertion(obj, msg).to.have.deep.property(prop);
  };

  /**
   * ### .notDeepProperty(object, property, [message])
   *
   * Asserts that `object` does _not_ have a property named by `property`, which
   * can be a string using dot- and bracket-notation for deep reference.
   *
   *     assert.notDeepProperty({ tea: { green: 'matcha' }}, 'tea.oolong');
   *
   * @name notDeepProperty
   * @param {Object} object
   * @param {String} property
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.notDeepProperty = function (obj, prop, msg) {
    new Assertion(obj, msg).to.not.have.deep.property(prop);
  };

  /**
   * ### .propertyVal(object, property, value, [message])
   *
   * Asserts that `object` has a property named by `property` with value given
   * by `value`.
   *
   *     assert.propertyVal({ tea: 'is good' }, 'tea', 'is good');
   *
   * @name propertyVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.propertyVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg).to.have.property(prop, val);
  };

  /**
   * ### .propertyNotVal(object, property, value, [message])
   *
   * Asserts that `object` has a property named by `property`, but with a value
   * different from that given by `value`.
   *
   *     assert.propertyNotVal({ tea: 'is good' }, 'tea', 'is bad');
   *
   * @name propertyNotVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.propertyNotVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg).to.not.have.property(prop, val);
  };

  /**
   * ### .deepPropertyVal(object, property, value, [message])
   *
   * Asserts that `object` has a property named by `property` with value given
   * by `value`. `property` can use dot- and bracket-notation for deep
   * reference.
   *
   *     assert.deepPropertyVal({ tea: { green: 'matcha' }}, 'tea.green', 'matcha');
   *
   * @name deepPropertyVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.deepPropertyVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg).to.have.deep.property(prop, val);
  };

  /**
   * ### .deepPropertyNotVal(object, property, value, [message])
   *
   * Asserts that `object` has a property named by `property`, but with a value
   * different from that given by `value`. `property` can use dot- and
   * bracket-notation for deep reference.
   *
   *     assert.deepPropertyNotVal({ tea: { green: 'matcha' }}, 'tea.green', 'konacha');
   *
   * @name deepPropertyNotVal
   * @param {Object} object
   * @param {String} property
   * @param {Mixed} value
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.deepPropertyNotVal = function (obj, prop, val, msg) {
    new Assertion(obj, msg).to.not.have.deep.property(prop, val);
  };

  /**
   * ### .lengthOf(object, length, [message])
   *
   * Asserts that `object` has a `length` property with the expected value.
   *
   *     assert.lengthOf([1,2,3], 3, 'array has length of 3');
   *     assert.lengthOf('foobar', 6, 'string has length of 6');
   *
   * @name lengthOf
   * @param {Mixed} object
   * @param {Number} length
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.lengthOf = function (exp, len, msg) {
    new Assertion(exp, msg).to.have.length(len);
  };

  /**
   * ### .throws(function, [constructor/string/regexp], [string/regexp], [message])
   *
   * Asserts that `function` will throw an error that is an instance of
   * `constructor`, or alternately that it will throw an error with message
   * matching `regexp`.
   *
   *     assert.throws(fn, 'function throws a reference error');
   *     assert.throws(fn, /function throws a reference error/);
   *     assert.throws(fn, ReferenceError);
   *     assert.throws(fn, ReferenceError, 'function throws a reference error');
   *     assert.throws(fn, ReferenceError, /function throws a reference error/);
   *
   * @name throws
   * @alias throw
   * @alias Throw
   * @param {Function} function
   * @param {ErrorConstructor} constructor
   * @param {RegExp} regexp
   * @param {String} message
   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
   * @namespace Assert
   * @api public
   */

  assert.throws = function (fn, errt, errs, msg) {
    if ('string' === typeof errt || errt instanceof RegExp) {
      errs = errt;
      errt = null;
    }

    var assertErr = new Assertion(fn, msg).to.throw(errt, errs);
    return flag(assertErr, 'object');
  };

  /**
   * ### .doesNotThrow(function, [constructor/regexp], [message])
   *
   * Asserts that `function` will _not_ throw an error that is an instance of
   * `constructor`, or alternately that it will not throw an error with message
   * matching `regexp`.
   *
   *     assert.doesNotThrow(fn, Error, 'function does not throw');
   *
   * @name doesNotThrow
   * @param {Function} function
   * @param {ErrorConstructor} constructor
   * @param {RegExp} regexp
   * @param {String} message
   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
   * @namespace Assert
   * @api public
   */

  assert.doesNotThrow = function (fn, type, msg) {
    if ('string' === typeof type) {
      msg = type;
      type = null;
    }

    new Assertion(fn, msg).to.not.Throw(type);
  };

  /**
   * ### .operator(val1, operator, val2, [message])
   *
   * Compares two values using `operator`.
   *
   *     assert.operator(1, '<', 2, 'everything is ok');
   *     assert.operator(1, '>', 2, 'this will fail');
   *
   * @name operator
   * @param {Mixed} val1
   * @param {String} operator
   * @param {Mixed} val2
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.operator = function (val, operator, val2, msg) {
    var ok;
    switch(operator) {
      case '==':
        ok = val == val2;
        break;
      case '===':
        ok = val === val2;
        break;
      case '>':
        ok = val > val2;
        break;
      case '>=':
        ok = val >= val2;
        break;
      case '<':
        ok = val < val2;
        break;
      case '<=':
        ok = val <= val2;
        break;
      case '!=':
        ok = val != val2;
        break;
      case '!==':
        ok = val !== val2;
        break;
      default:
        throw new Error('Invalid operator "' + operator + '"');
    }
    var test = new Assertion(ok, msg);
    test.assert(
        true === flag(test, 'object')
      , 'expected ' + util.inspect(val) + ' to be ' + operator + ' ' + util.inspect(val2)
      , 'expected ' + util.inspect(val) + ' to not be ' + operator + ' ' + util.inspect(val2) );
  };

  /**
   * ### .closeTo(actual, expected, delta, [message])
   *
   * Asserts that the target is equal `expected`, to within a +/- `delta` range.
   *
   *     assert.closeTo(1.5, 1, 0.5, 'numbers are close');
   *
   * @name closeTo
   * @param {Number} actual
   * @param {Number} expected
   * @param {Number} delta
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.closeTo = function (act, exp, delta, msg) {
    new Assertion(act, msg).to.be.closeTo(exp, delta);
  };

  /**
   * ### .approximately(actual, expected, delta, [message])
   *
   * Asserts that the target is equal `expected`, to within a +/- `delta` range.
   *
   *     assert.approximately(1.5, 1, 0.5, 'numbers are close');
   *
   * @name approximately
   * @param {Number} actual
   * @param {Number} expected
   * @param {Number} delta
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.approximately = function (act, exp, delta, msg) {
    new Assertion(act, msg).to.be.approximately(exp, delta);
  };

  /**
   * ### .sameMembers(set1, set2, [message])
   *
   * Asserts that `set1` and `set2` have the same members.
   * Order is not taken into account.
   *
   *     assert.sameMembers([ 1, 2, 3 ], [ 2, 1, 3 ], 'same members');
   *
   * @name sameMembers
   * @param {Array} set1
   * @param {Array} set2
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.sameMembers = function (set1, set2, msg) {
    new Assertion(set1, msg).to.have.same.members(set2);
  }

  /**
   * ### .sameDeepMembers(set1, set2, [message])
   *
   * Asserts that `set1` and `set2` have the same members - using a deep equality checking.
   * Order is not taken into account.
   *
   *     assert.sameDeepMembers([ {b: 3}, {a: 2}, {c: 5} ], [ {c: 5}, {b: 3}, {a: 2} ], 'same deep members');
   *
   * @name sameDeepMembers
   * @param {Array} set1
   * @param {Array} set2
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.sameDeepMembers = function (set1, set2, msg) {
    new Assertion(set1, msg).to.have.same.deep.members(set2);
  }

  /**
   * ### .includeMembers(superset, subset, [message])
   *
   * Asserts that `subset` is included in `superset`.
   * Order is not taken into account.
   *
   *     assert.includeMembers([ 1, 2, 3 ], [ 2, 1 ], 'include members');
   *
   * @name includeMembers
   * @param {Array} superset
   * @param {Array} subset
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.includeMembers = function (superset, subset, msg) {
    new Assertion(superset, msg).to.include.members(subset);
  }

  /**
   * ### .includeDeepMembers(superset, subset, [message])
   *
   * Asserts that `subset` is included in `superset` - using deep equality checking.
   * Order is not taken into account.
   * Duplicates are ignored.
   *
   *     assert.includeDeepMembers([ {a: 1}, {b: 2}, {c: 3} ], [ {b: 2}, {a: 1}, {b: 2} ], 'include deep members');
   *
   * @name includeDeepMembers
   * @param {Array} superset
   * @param {Array} subset
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.includeDeepMembers = function (superset, subset, msg) {
    new Assertion(superset, msg).to.include.deep.members(subset);
  }

  /**
   * ### .oneOf(inList, list, [message])
   *
   * Asserts that non-object, non-array value `inList` appears in the flat array `list`.
   *
   *     assert.oneOf(1, [ 2, 1 ], 'Not found in list');
   *
   * @name oneOf
   * @param {*} inList
   * @param {Array<*>} list
   * @param {String} message
   * @namespace Assert
   * @api public
   */

  assert.oneOf = function (inList, list, msg) {
    new Assertion(inList, msg).to.be.oneOf(list);
  }

   /**
   * ### .changes(function, object, property)
   *
   * Asserts that a function changes the value of a property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 22 };
   *     assert.changes(fn, obj, 'val');
   *
   * @name changes
   * @param {Function} modifier function
   * @param {Object} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.changes = function (fn, obj, prop) {
    new Assertion(fn).to.change(obj, prop);
  }

   /**
   * ### .doesNotChange(function, object, property)
   *
   * Asserts that a function does not changes the value of a property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { console.log('foo'); };
   *     assert.doesNotChange(fn, obj, 'val');
   *
   * @name doesNotChange
   * @param {Function} modifier function
   * @param {Object} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.doesNotChange = function (fn, obj, prop) {
    new Assertion(fn).to.not.change(obj, prop);
  }

   /**
   * ### .increases(function, object, property)
   *
   * Asserts that a function increases an object property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 13 };
   *     assert.increases(fn, obj, 'val');
   *
   * @name increases
   * @param {Function} modifier function
   * @param {Object} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.increases = function (fn, obj, prop) {
    new Assertion(fn).to.increase(obj, prop);
  }

   /**
   * ### .doesNotIncrease(function, object, property)
   *
   * Asserts that a function does not increase object property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 8 };
   *     assert.doesNotIncrease(fn, obj, 'val');
   *
   * @name doesNotIncrease
   * @param {Function} modifier function
   * @param {Object} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.doesNotIncrease = function (fn, obj, prop) {
    new Assertion(fn).to.not.increase(obj, prop);
  }

   /**
   * ### .decreases(function, object, property)
   *
   * Asserts that a function decreases an object property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 5 };
   *     assert.decreases(fn, obj, 'val');
   *
   * @name decreases
   * @param {Function} modifier function
   * @param {Object} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.decreases = function (fn, obj, prop) {
    new Assertion(fn).to.decrease(obj, prop);
  }

   /**
   * ### .doesNotDecrease(function, object, property)
   *
   * Asserts that a function does not decreases an object property
   *
   *     var obj = { val: 10 };
   *     var fn = function() { obj.val = 15 };
   *     assert.doesNotDecrease(fn, obj, 'val');
   *
   * @name doesNotDecrease
   * @param {Function} modifier function
   * @param {Object} object
   * @param {String} property name
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.doesNotDecrease = function (fn, obj, prop) {
    new Assertion(fn).to.not.decrease(obj, prop);
  }

  /*!
   * ### .ifError(object)
   *
   * Asserts if value is not a false value, and throws if it is a true value.
   * This is added to allow for chai to be a drop-in replacement for Node's
   * assert class.
   *
   *     var err = new Error('I am a custom error');
   *     assert.ifError(err); // Rethrows err!
   *
   * @name ifError
   * @param {Object} object
   * @namespace Assert
   * @api public
   */

  assert.ifError = function (val) {
    if (val) {
      throw(val);
    }
  };

  /**
   * ### .isExtensible(object)
   *
   * Asserts that `object` is extensible (can have new properties added to it).
   *
   *     assert.isExtensible({});
   *
   * @name isExtensible
   * @alias extensible
   * @param {Object} object
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.isExtensible = function (obj, msg) {
    new Assertion(obj, msg).to.be.extensible;
  };

  /**
   * ### .isNotExtensible(object)
   *
   * Asserts that `object` is _not_ extensible.
   *
   *     var nonExtensibleObject = Object.preventExtensions({});
   *     var sealedObject = Object.seal({});
   *     var frozenObject = Object.freese({});
   *
   *     assert.isNotExtensible(nonExtensibleObject);
   *     assert.isNotExtensible(sealedObject);
   *     assert.isNotExtensible(frozenObject);
   *
   * @name isNotExtensible
   * @alias notExtensible
   * @param {Object} object
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.isNotExtensible = function (obj, msg) {
    new Assertion(obj, msg).to.not.be.extensible;
  };

  /**
   * ### .isSealed(object)
   *
   * Asserts that `object` is sealed (cannot have new properties added to it
   * and its existing properties cannot be removed).
   *
   *     var sealedObject = Object.seal({});
   *     var frozenObject = Object.seal({});
   *
   *     assert.isSealed(sealedObject);
   *     assert.isSealed(frozenObject);
   *
   * @name isSealed
   * @alias sealed
   * @param {Object} object
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.isSealed = function (obj, msg) {
    new Assertion(obj, msg).to.be.sealed;
  };

  /**
   * ### .isNotSealed(object)
   *
   * Asserts that `object` is _not_ sealed.
   *
   *     assert.isNotSealed({});
   *
   * @name isNotSealed
   * @alias notSealed
   * @param {Object} object
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.isNotSealed = function (obj, msg) {
    new Assertion(obj, msg).to.not.be.sealed;
  };

  /**
   * ### .isFrozen(object)
   *
   * Asserts that `object` is frozen (cannot have new properties added to it
   * and its existing properties cannot be modified).
   *
   *     var frozenObject = Object.freeze({});
   *     assert.frozen(frozenObject);
   *
   * @name isFrozen
   * @alias frozen
   * @param {Object} object
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.isFrozen = function (obj, msg) {
    new Assertion(obj, msg).to.be.frozen;
  };

  /**
   * ### .isNotFrozen(object)
   *
   * Asserts that `object` is _not_ frozen.
   *
   *     assert.isNotFrozen({});
   *
   * @name isNotFrozen
   * @alias notFrozen
   * @param {Object} object
   * @param {String} message _optional_
   * @namespace Assert
   * @api public
   */

  assert.isNotFrozen = function (obj, msg) {
    new Assertion(obj, msg).to.not.be.frozen;
  };

  /*!
   * Aliases.
   */

  (function alias(name, as){
    assert[as] = assert[name];
    return alias;
  })
  ('isOk', 'ok')
  ('isNotOk', 'notOk')
  ('throws', 'throw')
  ('throws', 'Throw')
  ('isExtensible', 'extensible')
  ('isNotExtensible', 'notExtensible')
  ('isSealed', 'sealed')
  ('isNotSealed', 'notSealed')
  ('isFrozen', 'frozen')
  ('isNotFrozen', 'notFrozen');
};


/***/ }),

/***/ "./node_modules/chai/lib/chai/interface/expect.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

module.exports = function (chai, util) {
  chai.expect = function (val, message) {
    return new chai.Assertion(val, message);
  };

  /**
   * ### .fail(actual, expected, [message], [operator])
   *
   * Throw a failure.
   *
   * @name fail
   * @param {Mixed} actual
   * @param {Mixed} expected
   * @param {String} message
   * @param {String} operator
   * @namespace Expect
   * @api public
   */

  chai.expect.fail = function (actual, expected, message, operator) {
    message = message || 'expect.fail()';
    throw new chai.AssertionError(message, {
        actual: actual
      , expected: expected
      , operator: operator
    }, chai.expect.fail);
  };
};


/***/ }),

/***/ "./node_modules/chai/lib/chai/interface/should.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

module.exports = function (chai, util) {
  var Assertion = chai.Assertion;

  function loadShould () {
    // explicitly define this method as function as to have it's name to include as `ssfi`
    function shouldGetter() {
      if (this instanceof String || this instanceof Number || this instanceof Boolean ) {
        return new Assertion(this.valueOf(), null, shouldGetter);
      }
      return new Assertion(this, null, shouldGetter);
    }
    function shouldSetter(value) {
      // See https://github.com/chaijs/chai/issues/86: this makes
      // `whatever.should = someValue` actually set `someValue`, which is
      // especially useful for `global.should = require('chai').should()`.
      //
      // Note that we have to use [[DefineProperty]] instead of [[Put]]
      // since otherwise we would trigger this very setter!
      Object.defineProperty(this, 'should', {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    }
    // modify Object.prototype to have `should`
    Object.defineProperty(Object.prototype, 'should', {
      set: shouldSetter
      , get: shouldGetter
      , configurable: true
    });

    var should = {};

    /**
     * ### .fail(actual, expected, [message], [operator])
     *
     * Throw a failure.
     *
     * @name fail
     * @param {Mixed} actual
     * @param {Mixed} expected
     * @param {String} message
     * @param {String} operator
     * @namespace Should
     * @api public
     */

    should.fail = function (actual, expected, message, operator) {
      message = message || 'should.fail()';
      throw new chai.AssertionError(message, {
          actual: actual
        , expected: expected
        , operator: operator
      }, should.fail);
    };

    /**
     * ### .equal(actual, expected, [message])
     *
     * Asserts non-strict equality (`==`) of `actual` and `expected`.
     *
     *     should.equal(3, '3', '== coerces values to strings');
     *
     * @name equal
     * @param {Mixed} actual
     * @param {Mixed} expected
     * @param {String} message
     * @namespace Should
     * @api public
     */

    should.equal = function (val1, val2, msg) {
      new Assertion(val1, msg).to.equal(val2);
    };

    /**
     * ### .throw(function, [constructor/string/regexp], [string/regexp], [message])
     *
     * Asserts that `function` will throw an error that is an instance of
     * `constructor`, or alternately that it will throw an error with message
     * matching `regexp`.
     *
     *     should.throw(fn, 'function throws a reference error');
     *     should.throw(fn, /function throws a reference error/);
     *     should.throw(fn, ReferenceError);
     *     should.throw(fn, ReferenceError, 'function throws a reference error');
     *     should.throw(fn, ReferenceError, /function throws a reference error/);
     *
     * @name throw
     * @alias Throw
     * @param {Function} function
     * @param {ErrorConstructor} constructor
     * @param {RegExp} regexp
     * @param {String} message
     * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
     * @namespace Should
     * @api public
     */

    should.Throw = function (fn, errt, errs, msg) {
      new Assertion(fn, msg).to.Throw(errt, errs);
    };

    /**
     * ### .exist
     *
     * Asserts that the target is neither `null` nor `undefined`.
     *
     *     var foo = 'hi';
     *
     *     should.exist(foo, 'foo exists');
     *
     * @name exist
     * @namespace Should
     * @api public
     */

    should.exist = function (val, msg) {
      new Assertion(val, msg).to.exist;
    }

    // negation
    should.not = {}

    /**
     * ### .not.equal(actual, expected, [message])
     *
     * Asserts non-strict inequality (`!=`) of `actual` and `expected`.
     *
     *     should.not.equal(3, 4, 'these numbers are not equal');
     *
     * @name not.equal
     * @param {Mixed} actual
     * @param {Mixed} expected
     * @param {String} message
     * @namespace Should
     * @api public
     */

    should.not.equal = function (val1, val2, msg) {
      new Assertion(val1, msg).to.not.equal(val2);
    };

    /**
     * ### .throw(function, [constructor/regexp], [message])
     *
     * Asserts that `function` will _not_ throw an error that is an instance of
     * `constructor`, or alternately that it will not throw an error with message
     * matching `regexp`.
     *
     *     should.not.throw(fn, Error, 'function does not throw');
     *
     * @name not.throw
     * @alias not.Throw
     * @param {Function} function
     * @param {ErrorConstructor} constructor
     * @param {RegExp} regexp
     * @param {String} message
     * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
     * @namespace Should
     * @api public
     */

    should.not.Throw = function (fn, errt, errs, msg) {
      new Assertion(fn, msg).to.not.Throw(errt, errs);
    };

    /**
     * ### .not.exist
     *
     * Asserts that the target is neither `null` nor `undefined`.
     *
     *     var bar = null;
     *
     *     should.not.exist(bar, 'bar does not exist');
     *
     * @name not.exist
     * @namespace Should
     * @api public
     */

    should.not.exist = function (val, msg) {
      new Assertion(val, msg).to.not.exist;
    }

    should['throw'] = should['Throw'];
    should.not['throw'] = should.not['Throw'];

    return should;
  };

  chai.should = loadShould;
  chai.Should = loadShould;
};


/***/ }),

/***/ "./node_modules/chai/lib/chai/utils/addChainableMethod.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * Chai - addChainingMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var transferFlags = __webpack_require__("./node_modules/chai/lib/chai/utils/transferFlags.js");
var flag = __webpack_require__("./node_modules/chai/lib/chai/utils/flag.js");
var config = __webpack_require__("./node_modules/chai/lib/chai/config.js");

/*!
 * Module variables
 */

// Check whether `__proto__` is supported
var hasProtoSupport = '__proto__' in Object;

// Without `__proto__` support, this module will need to add properties to a function.
// However, some Function.prototype methods cannot be overwritten,
// and there seems no easy cross-platform way to detect them (@see chaijs/chai/issues/69).
var excludeNames = /^(?:length|name|arguments|caller)$/;

// Cache `Function` properties
var call  = Function.prototype.call,
    apply = Function.prototype.apply;

/**
 * ### addChainableMethod (ctx, name, method, chainingBehavior)
 *
 * Adds a method to an object, such that the method can also be chained.
 *
 *     utils.addChainableMethod(chai.Assertion.prototype, 'foo', function (str) {
 *       var obj = utils.flag(this, 'object');
 *       new chai.Assertion(obj).to.be.equal(str);
 *     });
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.addChainableMethod('foo', fn, chainingBehavior);
 *
 * The result can then be used as both a method assertion, executing both `method` and
 * `chainingBehavior`, or as a language chain, which only executes `chainingBehavior`.
 *
 *     expect(fooStr).to.be.foo('bar');
 *     expect(fooStr).to.be.foo.equal('foo');
 *
 * @param {Object} ctx object to which the method is added
 * @param {String} name of method to add
 * @param {Function} method function to be used for `name`, when called
 * @param {Function} chainingBehavior function to be called every time the property is accessed
 * @namespace Utils
 * @name addChainableMethod
 * @api public
 */

module.exports = function (ctx, name, method, chainingBehavior) {
  if (typeof chainingBehavior !== 'function') {
    chainingBehavior = function () { };
  }

  var chainableBehavior = {
      method: method
    , chainingBehavior: chainingBehavior
  };

  // save the methods so we can overwrite them later, if we need to.
  if (!ctx.__methods) {
    ctx.__methods = {};
  }
  ctx.__methods[name] = chainableBehavior;

  Object.defineProperty(ctx, name,
    { get: function () {
        chainableBehavior.chainingBehavior.call(this);

        var assert = function assert() {
          var old_ssfi = flag(this, 'ssfi');
          if (old_ssfi && config.includeStack === false)
            flag(this, 'ssfi', assert);
          var result = chainableBehavior.method.apply(this, arguments);
          return result === undefined ? this : result;
        };

        // Use `__proto__` if available
        if (hasProtoSupport) {
          // Inherit all properties from the object by replacing the `Function` prototype
          var prototype = assert.__proto__ = Object.create(this);
          // Restore the `call` and `apply` methods from `Function`
          prototype.call = call;
          prototype.apply = apply;
        }
        // Otherwise, redefine all properties (slow!)
        else {
          var asserterNames = Object.getOwnPropertyNames(ctx);
          asserterNames.forEach(function (asserterName) {
            if (!excludeNames.test(asserterName)) {
              var pd = Object.getOwnPropertyDescriptor(ctx, asserterName);
              Object.defineProperty(assert, asserterName, pd);
            }
          });
        }

        transferFlags(this, assert);
        return assert;
      }
    , configurable: true
  });
};


/***/ }),

/***/ "./node_modules/chai/lib/chai/utils/addMethod.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * Chai - addMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var config = __webpack_require__("./node_modules/chai/lib/chai/config.js");

/**
 * ### .addMethod (ctx, name, method)
 *
 * Adds a method to the prototype of an object.
 *
 *     utils.addMethod(chai.Assertion.prototype, 'foo', function (str) {
 *       var obj = utils.flag(this, 'object');
 *       new chai.Assertion(obj).to.be.equal(str);
 *     });
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.addMethod('foo', fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(fooStr).to.be.foo('bar');
 *
 * @param {Object} ctx object to which the method is added
 * @param {String} name of method to add
 * @param {Function} method function to be used for name
 * @namespace Utils
 * @name addMethod
 * @api public
 */
var flag = __webpack_require__("./node_modules/chai/lib/chai/utils/flag.js");

module.exports = function (ctx, name, method) {
  ctx[name] = function () {
    var old_ssfi = flag(this, 'ssfi');
    if (old_ssfi && config.includeStack === false)
      flag(this, 'ssfi', ctx[name]);
    var result = method.apply(this, arguments);
    return result === undefined ? this : result;
  };
};


/***/ }),

/***/ "./node_modules/chai/lib/chai/utils/addProperty.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * Chai - addProperty utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var config = __webpack_require__("./node_modules/chai/lib/chai/config.js");
var flag = __webpack_require__("./node_modules/chai/lib/chai/utils/flag.js");

/**
 * ### addProperty (ctx, name, getter)
 *
 * Adds a property to the prototype of an object.
 *
 *     utils.addProperty(chai.Assertion.prototype, 'foo', function () {
 *       var obj = utils.flag(this, 'object');
 *       new chai.Assertion(obj).to.be.instanceof(Foo);
 *     });
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.addProperty('foo', fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(myFoo).to.be.foo;
 *
 * @param {Object} ctx object to which the property is added
 * @param {String} name of property to add
 * @param {Function} getter function to be used for name
 * @namespace Utils
 * @name addProperty
 * @api public
 */

module.exports = function (ctx, name, getter) {
  Object.defineProperty(ctx, name,
    { get: function addProperty() {
        var old_ssfi = flag(this, 'ssfi');
        if (old_ssfi && config.includeStack === false)
          flag(this, 'ssfi', addProperty);

        var result = getter.call(this);
        return result === undefined ? this : result;
      }
    , configurable: true
  });
};


/***/ }),

/***/ "./node_modules/chai/lib/chai/utils/expectTypes.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * Chai - expectTypes utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### expectTypes(obj, types)
 *
 * Ensures that the object being tested against is of a valid type.
 *
 *     utils.expectTypes(this, ['array', 'object', 'string']);
 *
 * @param {Mixed} obj constructed Assertion
 * @param {Array} type A list of allowed types for this assertion
 * @namespace Utils
 * @name expectTypes
 * @api public
 */

var AssertionError = __webpack_require__("./node_modules/assertion-error/index.js");
var flag = __webpack_require__("./node_modules/chai/lib/chai/utils/flag.js");
var type = __webpack_require__("./node_modules/type-detect/index.js");

module.exports = function (obj, types) {
  var obj = flag(obj, 'object');
  types = types.map(function (t) { return t.toLowerCase(); });
  types.sort();

  // Transforms ['lorem', 'ipsum'] into 'a lirum, or an ipsum'
  var str = types.map(function (t, index) {
    var art = ~[ 'a', 'e', 'i', 'o', 'u' ].indexOf(t.charAt(0)) ? 'an' : 'a';
    var or = types.length > 1 && index === types.length - 1 ? 'or ' : '';
    return or + art + ' ' + t;
  }).join(', ');

  if (!types.some(function (expected) { return type(obj) === expected; })) {
    throw new AssertionError(
      'object tested must be ' + str + ', but ' + type(obj) + ' given'
    );
  }
};


/***/ }),

/***/ "./node_modules/chai/lib/chai/utils/flag.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * Chai - flag utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### flag(object, key, [value])
 *
 * Get or set a flag value on an object. If a
 * value is provided it will be set, else it will
 * return the currently set value or `undefined` if
 * the value is not set.
 *
 *     utils.flag(this, 'foo', 'bar'); // setter
 *     utils.flag(this, 'foo'); // getter, returns `bar`
 *
 * @param {Object} object constructed Assertion
 * @param {String} key
 * @param {Mixed} value (optional)
 * @namespace Utils
 * @name flag
 * @api private
 */

module.exports = function (obj, key, value) {
  var flags = obj.__flags || (obj.__flags = Object.create(null));
  if (arguments.length === 3) {
    flags[key] = value;
  } else {
    return flags[key];
  }
};


/***/ }),

/***/ "./node_modules/chai/lib/chai/utils/getActual.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * Chai - getActual utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * # getActual(object, [actual])
 *
 * Returns the `actual` value for an Assertion
 *
 * @param {Object} object (constructed Assertion)
 * @param {Arguments} chai.Assertion.prototype.assert arguments
 * @namespace Utils
 * @name getActual
 */

module.exports = function (obj, args) {
  return args.length > 4 ? args[4] : obj._obj;
};


/***/ }),

/***/ "./node_modules/chai/lib/chai/utils/getEnumerableProperties.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * Chai - getEnumerableProperties utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .getEnumerableProperties(object)
 *
 * This allows the retrieval of enumerable property names of an object,
 * inherited or not.
 *
 * @param {Object} object
 * @returns {Array}
 * @namespace Utils
 * @name getEnumerableProperties
 * @api public
 */

module.exports = function getEnumerableProperties(object) {
  var result = [];
  for (var name in object) {
    result.push(name);
  }
  return result;
};


/***/ }),

/***/ "./node_modules/chai/lib/chai/utils/getMessage.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * Chai - message composition utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependancies
 */

var flag = __webpack_require__("./node_modules/chai/lib/chai/utils/flag.js")
  , getActual = __webpack_require__("./node_modules/chai/lib/chai/utils/getActual.js")
  , inspect = __webpack_require__("./node_modules/chai/lib/chai/utils/inspect.js")
  , objDisplay = __webpack_require__("./node_modules/chai/lib/chai/utils/objDisplay.js");

/**
 * ### .getMessage(object, message, negateMessage)
 *
 * Construct the error message based on flags
 * and template tags. Template tags will return
 * a stringified inspection of the object referenced.
 *
 * Message template tags:
 * - `#{this}` current asserted object
 * - `#{act}` actual value
 * - `#{exp}` expected value
 *
 * @param {Object} object (constructed Assertion)
 * @param {Arguments} chai.Assertion.prototype.assert arguments
 * @namespace Utils
 * @name getMessage
 * @api public
 */

module.exports = function (obj, args) {
  var negate = flag(obj, 'negate')
    , val = flag(obj, 'object')
    , expected = args[3]
    , actual = getActual(obj, args)
    , msg = negate ? args[2] : args[1]
    , flagMsg = flag(obj, 'message');

  if(typeof msg === "function") msg = msg();
  msg = msg || '';
  msg = msg
    .replace(/#\{this\}/g, function () { return objDisplay(val); })
    .replace(/#\{act\}/g, function () { return objDisplay(actual); })
    .replace(/#\{exp\}/g, function () { return objDisplay(expected); });

  return flagMsg ? flagMsg + ': ' + msg : msg;
};


/***/ }),

/***/ "./node_modules/chai/lib/chai/utils/getName.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * Chai - getName utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * # getName(func)
 *
 * Gets the name of a function, in a cross-browser way.
 *
 * @param {Function} a function (usually a constructor)
 * @namespace Utils
 * @name getName
 */

module.exports = function (func) {
  if (func.name) return func.name;

  var match = /^\s?function ([^(]*)\(/.exec(func);
  return match && match[1] ? match[1] : "";
};


/***/ }),

/***/ "./node_modules/chai/lib/chai/utils/getPathInfo.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * Chai - getPathInfo utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var hasProperty = __webpack_require__("./node_modules/chai/lib/chai/utils/hasProperty.js");

/**
 * ### .getPathInfo(path, object)
 *
 * This allows the retrieval of property info in an
 * object given a string path.
 *
 * The path info consists of an object with the
 * following properties:
 *
 * * parent - The parent object of the property referenced by `path`
 * * name - The name of the final property, a number if it was an array indexer
 * * value - The value of the property, if it exists, otherwise `undefined`
 * * exists - Whether the property exists or not
 *
 * @param {String} path
 * @param {Object} object
 * @returns {Object} info
 * @namespace Utils
 * @name getPathInfo
 * @api public
 */

module.exports = function getPathInfo(path, obj) {
  var parsed = parsePath(path),
      last = parsed[parsed.length - 1];

  var info = {
    parent: parsed.length > 1 ? _getPathValue(parsed, obj, parsed.length - 1) : obj,
    name: last.p || last.i,
    value: _getPathValue(parsed, obj)
  };
  info.exists = hasProperty(info.name, info.parent);

  return info;
};


/*!
 * ## parsePath(path)
 *
 * Helper function used to parse string object
 * paths. Use in conjunction with `_getPathValue`.
 *
 *      var parsed = parsePath('myobject.property.subprop');
 *
 * ### Paths:
 *
 * * Can be as near infinitely deep and nested
 * * Arrays are also valid using the formal `myobject.document[3].property`.
 * * Literal dots and brackets (not delimiter) must be backslash-escaped.
 *
 * @param {String} path
 * @returns {Object} parsed
 * @api private
 */

function parsePath (path) {
  var str = path.replace(/([^\\])\[/g, '$1.[')
    , parts = str.match(/(\\\.|[^.]+?)+/g);
  return parts.map(function (value) {
    var re = /^\[(\d+)\]$/
      , mArr = re.exec(value);
    if (mArr) return { i: parseFloat(mArr[1]) };
    else return { p: value.replace(/\\([.\[\]])/g, '$1') };
  });
}


/*!
 * ## _getPathValue(parsed, obj)
 *
 * Helper companion function for `.parsePath` that returns
 * the value located at the parsed address.
 *
 *      var value = getPathValue(parsed, obj);
 *
 * @param {Object} parsed definition from `parsePath`.
 * @param {Object} object to search against
 * @param {Number} object to search against
 * @returns {Object|Undefined} value
 * @api private
 */

function _getPathValue (parsed, obj, index) {
  var tmp = obj
    , res;

  index = (index === undefined ? parsed.length : index);

  for (var i = 0, l = index; i < l; i++) {
    var part = parsed[i];
    if (tmp) {
      if ('undefined' !== typeof part.p)
        tmp = tmp[part.p];
      else if ('undefined' !== typeof part.i)
        tmp = tmp[part.i];
      if (i == (l - 1)) res = tmp;
    } else {
      res = undefined;
    }
  }
  return res;
}


/***/ }),

/***/ "./node_modules/chai/lib/chai/utils/getPathValue.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * Chai - getPathValue utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * @see https://github.com/logicalparadox/filtr
 * MIT Licensed
 */

var getPathInfo = __webpack_require__("./node_modules/chai/lib/chai/utils/getPathInfo.js");

/**
 * ### .getPathValue(path, object)
 *
 * This allows the retrieval of values in an
 * object given a string path.
 *
 *     var obj = {
 *         prop1: {
 *             arr: ['a', 'b', 'c']
 *           , str: 'Hello'
 *         }
 *       , prop2: {
 *             arr: [ { nested: 'Universe' } ]
 *           , str: 'Hello again!'
 *         }
 *     }
 *
 * The following would be the results.
 *
 *     getPathValue('prop1.str', obj); // Hello
 *     getPathValue('prop1.att[2]', obj); // b
 *     getPathValue('prop2.arr[0].nested', obj); // Universe
 *
 * @param {String} path
 * @param {Object} object
 * @returns {Object} value or `undefined`
 * @namespace Utils
 * @name getPathValue
 * @api public
 */
module.exports = function(path, obj) {
  var info = getPathInfo(path, obj);
  return info.value;
};


/***/ }),

/***/ "./node_modules/chai/lib/chai/utils/getProperties.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * Chai - getProperties utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .getProperties(object)
 *
 * This allows the retrieval of property names of an object, enumerable or not,
 * inherited or not.
 *
 * @param {Object} object
 * @returns {Array}
 * @namespace Utils
 * @name getProperties
 * @api public
 */

module.exports = function getProperties(object) {
  var result = Object.getOwnPropertyNames(object);

  function addProperty(property) {
    if (result.indexOf(property) === -1) {
      result.push(property);
    }
  }

  var proto = Object.getPrototypeOf(object);
  while (proto !== null) {
    Object.getOwnPropertyNames(proto).forEach(addProperty);
    proto = Object.getPrototypeOf(proto);
  }

  return result;
};


/***/ }),

/***/ "./node_modules/chai/lib/chai/utils/hasProperty.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * Chai - hasProperty utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var type = __webpack_require__("./node_modules/type-detect/index.js");

/**
 * ### .hasProperty(object, name)
 *
 * This allows checking whether an object has
 * named property or numeric array index.
 *
 * Basically does the same thing as the `in`
 * operator but works properly with natives
 * and null/undefined values.
 *
 *     var obj = {
 *         arr: ['a', 'b', 'c']
 *       , str: 'Hello'
 *     }
 *
 * The following would be the results.
 *
 *     hasProperty('str', obj);  // true
 *     hasProperty('constructor', obj);  // true
 *     hasProperty('bar', obj);  // false
 *
 *     hasProperty('length', obj.str); // true
 *     hasProperty(1, obj.str);  // true
 *     hasProperty(5, obj.str);  // false
 *
 *     hasProperty('length', obj.arr);  // true
 *     hasProperty(2, obj.arr);  // true
 *     hasProperty(3, obj.arr);  // false
 *
 * @param {Objuect} object
 * @param {String|Number} name
 * @returns {Boolean} whether it exists
 * @namespace Utils
 * @name getPathInfo
 * @api public
 */

var literals = {
    'number': Number
  , 'string': String
};

module.exports = function hasProperty(name, obj) {
  var ot = type(obj);

  // Bad Object, obviously no props at all
  if(ot === 'null' || ot === 'undefined')
    return false;

  // The `in` operator does not work with certain literals
  // box these before the check
  if(literals[ot] && typeof obj !== 'object')
    obj = new literals[ot](obj);

  return name in obj;
};


/***/ }),

/***/ "./node_modules/chai/lib/chai/utils/index.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * chai
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Main exports
 */

var exports = module.exports = {};

/*!
 * test utility
 */

exports.test = __webpack_require__("./node_modules/chai/lib/chai/utils/test.js");

/*!
 * type utility
 */

exports.type = __webpack_require__("./node_modules/type-detect/index.js");

/*!
 * expectTypes utility
 */
exports.expectTypes = __webpack_require__("./node_modules/chai/lib/chai/utils/expectTypes.js");

/*!
 * message utility
 */

exports.getMessage = __webpack_require__("./node_modules/chai/lib/chai/utils/getMessage.js");

/*!
 * actual utility
 */

exports.getActual = __webpack_require__("./node_modules/chai/lib/chai/utils/getActual.js");

/*!
 * Inspect util
 */

exports.inspect = __webpack_require__("./node_modules/chai/lib/chai/utils/inspect.js");

/*!
 * Object Display util
 */

exports.objDisplay = __webpack_require__("./node_modules/chai/lib/chai/utils/objDisplay.js");

/*!
 * Flag utility
 */

exports.flag = __webpack_require__("./node_modules/chai/lib/chai/utils/flag.js");

/*!
 * Flag transferring utility
 */

exports.transferFlags = __webpack_require__("./node_modules/chai/lib/chai/utils/transferFlags.js");

/*!
 * Deep equal utility
 */

exports.eql = __webpack_require__("./node_modules/deep-eql/index.js");

/*!
 * Deep path value
 */

exports.getPathValue = __webpack_require__("./node_modules/chai/lib/chai/utils/getPathValue.js");

/*!
 * Deep path info
 */

exports.getPathInfo = __webpack_require__("./node_modules/chai/lib/chai/utils/getPathInfo.js");

/*!
 * Check if a property exists
 */

exports.hasProperty = __webpack_require__("./node_modules/chai/lib/chai/utils/hasProperty.js");

/*!
 * Function name
 */

exports.getName = __webpack_require__("./node_modules/chai/lib/chai/utils/getName.js");

/*!
 * add Property
 */

exports.addProperty = __webpack_require__("./node_modules/chai/lib/chai/utils/addProperty.js");

/*!
 * add Method
 */

exports.addMethod = __webpack_require__("./node_modules/chai/lib/chai/utils/addMethod.js");

/*!
 * overwrite Property
 */

exports.overwriteProperty = __webpack_require__("./node_modules/chai/lib/chai/utils/overwriteProperty.js");

/*!
 * overwrite Method
 */

exports.overwriteMethod = __webpack_require__("./node_modules/chai/lib/chai/utils/overwriteMethod.js");

/*!
 * Add a chainable method
 */

exports.addChainableMethod = __webpack_require__("./node_modules/chai/lib/chai/utils/addChainableMethod.js");

/*!
 * Overwrite chainable method
 */

exports.overwriteChainableMethod = __webpack_require__("./node_modules/chai/lib/chai/utils/overwriteChainableMethod.js");


/***/ }),

/***/ "./node_modules/chai/lib/chai/utils/inspect.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
// This is (almost) directly from Node.js utils
// https://github.com/joyent/node/blob/f8c335d0caf47f16d31413f89aa28eda3878e3aa/lib/util.js

var getName = __webpack_require__("./node_modules/chai/lib/chai/utils/getName.js");
var getProperties = __webpack_require__("./node_modules/chai/lib/chai/utils/getProperties.js");
var getEnumerableProperties = __webpack_require__("./node_modules/chai/lib/chai/utils/getEnumerableProperties.js");

module.exports = inspect;

/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Boolean} showHidden Flag that shows hidden (not enumerable)
 *    properties of objects.
 * @param {Number} depth Depth in which to descend in object. Default is 2.
 * @param {Boolean} colors Flag to turn on ANSI escape codes to color the
 *    output. Default is false (no coloring).
 * @namespace Utils
 * @name inspect
 */
function inspect(obj, showHidden, depth, colors) {
  var ctx = {
    showHidden: showHidden,
    seen: [],
    stylize: function (str) { return str; }
  };
  return formatValue(ctx, obj, (typeof depth === 'undefined' ? 2 : depth));
}

// Returns true if object is a DOM element.
var isDOMElement = function (object) {
  if (typeof HTMLElement === 'object') {
    return object instanceof HTMLElement;
  } else {
    return object &&
      typeof object === 'object' &&
      object.nodeType === 1 &&
      typeof object.nodeName === 'string';
  }
};

function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (value && typeof value.inspect === 'function' &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes);
    if (typeof ret !== 'string') {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // If this is a DOM element, try to get the outer HTML.
  if (isDOMElement(value)) {
    if ('outerHTML' in value) {
      return value.outerHTML;
      // This value does not have an outerHTML attribute,
      //   it could still be an XML element
    } else {
      // Attempt to serialize it
      try {
        if (document.xmlVersion) {
          var xmlSerializer = new XMLSerializer();
          return xmlSerializer.serializeToString(value);
        } else {
          // Firefox 11- do not support outerHTML
          //   It does, however, support innerHTML
          //   Use the following to render the element
          var ns = "http://www.w3.org/1999/xhtml";
          var container = document.createElementNS(ns, '_');

          container.appendChild(value.cloneNode(false));
          html = container.innerHTML
            .replace('><', '>' + value.innerHTML + '<');
          container.innerHTML = '';
          return html;
        }
      } catch (err) {
        // This could be a non-native DOM implementation,
        //   continue with the normal flow:
        //   printing the element as if it is an object.
      }
    }
  }

  // Look up the keys of the object.
  var visibleKeys = getEnumerableProperties(value);
  var keys = ctx.showHidden ? getProperties(value) : visibleKeys;

  // Some type of object without properties can be shortcutted.
  // In IE, errors have a single `stack` property, or if they are vanilla `Error`,
  // a `stack` plus `description` property; ignore those for consistency.
  if (keys.length === 0 || (isError(value) && (
      (keys.length === 1 && keys[0] === 'stack') ||
      (keys.length === 2 && keys[0] === 'description' && keys[1] === 'stack')
     ))) {
    if (typeof value === 'function') {
      var name = getName(value);
      var nameSuffix = name ? ': ' + name : '';
      return ctx.stylize('[Function' + nameSuffix + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toUTCString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (typeof value === 'function') {
    var name = getName(value);
    var nameSuffix = name ? ': ' + name : '';
    base = ' [Function' + nameSuffix + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    return formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  switch (typeof value) {
    case 'undefined':
      return ctx.stylize('undefined', 'undefined');

    case 'string':
      var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                               .replace(/'/g, "\\'")
                                               .replace(/\\"/g, '"') + '\'';
      return ctx.stylize(simple, 'string');

    case 'number':
      if (value === 0 && (1/value) === -Infinity) {
        return ctx.stylize('-0', 'number');
      }
      return ctx.stylize('' + value, 'number');

    case 'boolean':
      return ctx.stylize('' + value, 'boolean');
  }
  // For some reason typeof null is "object", so special case here.
  if (value === null) {
    return ctx.stylize('null', 'null');
  }
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (Object.prototype.hasOwnProperty.call(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str;
  if (value.__lookupGetter__) {
    if (value.__lookupGetter__(key)) {
      if (value.__lookupSetter__(key)) {
        str = ctx.stylize('[Getter/Setter]', 'special');
      } else {
        str = ctx.stylize('[Getter]', 'special');
      }
    } else {
      if (value.__lookupSetter__(key)) {
        str = ctx.stylize('[Setter]', 'special');
      }
    }
  }
  if (visibleKeys.indexOf(key) < 0) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(value[key]) < 0) {
      if (recurseTimes === null) {
        str = formatValue(ctx, value[key], null);
      } else {
        str = formatValue(ctx, value[key], recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (typeof name === 'undefined') {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}

function isArray(ar) {
  return Array.isArray(ar) ||
         (typeof ar === 'object' && objectToString(ar) === '[object Array]');
}

function isRegExp(re) {
  return typeof re === 'object' && objectToString(re) === '[object RegExp]';
}

function isDate(d) {
  return typeof d === 'object' && objectToString(d) === '[object Date]';
}

function isError(e) {
  return typeof e === 'object' && objectToString(e) === '[object Error]';
}

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


/***/ }),

/***/ "./node_modules/chai/lib/chai/utils/objDisplay.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * Chai - flag utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependancies
 */

var inspect = __webpack_require__("./node_modules/chai/lib/chai/utils/inspect.js");
var config = __webpack_require__("./node_modules/chai/lib/chai/config.js");

/**
 * ### .objDisplay (object)
 *
 * Determines if an object or an array matches
 * criteria to be inspected in-line for error
 * messages or should be truncated.
 *
 * @param {Mixed} javascript object to inspect
 * @name objDisplay
 * @namespace Utils
 * @api public
 */

module.exports = function (obj) {
  var str = inspect(obj)
    , type = Object.prototype.toString.call(obj);

  if (config.truncateThreshold && str.length >= config.truncateThreshold) {
    if (type === '[object Function]') {
      return !obj.name || obj.name === ''
        ? '[Function]'
        : '[Function: ' + obj.name + ']';
    } else if (type === '[object Array]') {
      return '[ Array(' + obj.length + ') ]';
    } else if (type === '[object Object]') {
      var keys = Object.keys(obj)
        , kstr = keys.length > 2
          ? keys.splice(0, 2).join(', ') + ', ...'
          : keys.join(', ');
      return '{ Object (' + kstr + ') }';
    } else {
      return str;
    }
  } else {
    return str;
  }
};


/***/ }),

/***/ "./node_modules/chai/lib/chai/utils/overwriteChainableMethod.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * Chai - overwriteChainableMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### overwriteChainableMethod (ctx, name, method, chainingBehavior)
 *
 * Overwites an already existing chainable method
 * and provides access to the previous function or
 * property.  Must return functions to be used for
 * name.
 *
 *     utils.overwriteChainableMethod(chai.Assertion.prototype, 'length',
 *       function (_super) {
 *       }
 *     , function (_super) {
 *       }
 *     );
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.overwriteChainableMethod('foo', fn, fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(myFoo).to.have.length(3);
 *     expect(myFoo).to.have.length.above(3);
 *
 * @param {Object} ctx object whose method / property is to be overwritten
 * @param {String} name of method / property to overwrite
 * @param {Function} method function that returns a function to be used for name
 * @param {Function} chainingBehavior function that returns a function to be used for property
 * @namespace Utils
 * @name overwriteChainableMethod
 * @api public
 */

module.exports = function (ctx, name, method, chainingBehavior) {
  var chainableBehavior = ctx.__methods[name];

  var _chainingBehavior = chainableBehavior.chainingBehavior;
  chainableBehavior.chainingBehavior = function () {
    var result = chainingBehavior(_chainingBehavior).call(this);
    return result === undefined ? this : result;
  };

  var _method = chainableBehavior.method;
  chainableBehavior.method = function () {
    var result = method(_method).apply(this, arguments);
    return result === undefined ? this : result;
  };
};


/***/ }),

/***/ "./node_modules/chai/lib/chai/utils/overwriteMethod.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * Chai - overwriteMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### overwriteMethod (ctx, name, fn)
 *
 * Overwites an already existing method and provides
 * access to previous function. Must return function
 * to be used for name.
 *
 *     utils.overwriteMethod(chai.Assertion.prototype, 'equal', function (_super) {
 *       return function (str) {
 *         var obj = utils.flag(this, 'object');
 *         if (obj instanceof Foo) {
 *           new chai.Assertion(obj.value).to.equal(str);
 *         } else {
 *           _super.apply(this, arguments);
 *         }
 *       }
 *     });
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.overwriteMethod('foo', fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(myFoo).to.equal('bar');
 *
 * @param {Object} ctx object whose method is to be overwritten
 * @param {String} name of method to overwrite
 * @param {Function} method function that returns a function to be used for name
 * @namespace Utils
 * @name overwriteMethod
 * @api public
 */

module.exports = function (ctx, name, method) {
  var _method = ctx[name]
    , _super = function () { return this; };

  if (_method && 'function' === typeof _method)
    _super = _method;

  ctx[name] = function () {
    var result = method(_super).apply(this, arguments);
    return result === undefined ? this : result;
  }
};


/***/ }),

/***/ "./node_modules/chai/lib/chai/utils/overwriteProperty.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * Chai - overwriteProperty utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### overwriteProperty (ctx, name, fn)
 *
 * Overwites an already existing property getter and provides
 * access to previous value. Must return function to use as getter.
 *
 *     utils.overwriteProperty(chai.Assertion.prototype, 'ok', function (_super) {
 *       return function () {
 *         var obj = utils.flag(this, 'object');
 *         if (obj instanceof Foo) {
 *           new chai.Assertion(obj.name).to.equal('bar');
 *         } else {
 *           _super.call(this);
 *         }
 *       }
 *     });
 *
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.overwriteProperty('foo', fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(myFoo).to.be.ok;
 *
 * @param {Object} ctx object whose property is to be overwritten
 * @param {String} name of property to overwrite
 * @param {Function} getter function that returns a getter function to be used for name
 * @namespace Utils
 * @name overwriteProperty
 * @api public
 */

module.exports = function (ctx, name, getter) {
  var _get = Object.getOwnPropertyDescriptor(ctx, name)
    , _super = function () {};

  if (_get && 'function' === typeof _get.get)
    _super = _get.get

  Object.defineProperty(ctx, name,
    { get: function () {
        var result = getter(_super).call(this);
        return result === undefined ? this : result;
      }
    , configurable: true
  });
};


/***/ }),

/***/ "./node_modules/chai/lib/chai/utils/test.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * Chai - test utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependancies
 */

var flag = __webpack_require__("./node_modules/chai/lib/chai/utils/flag.js");

/**
 * # test(object, expression)
 *
 * Test and object for expression.
 *
 * @param {Object} object (constructed Assertion)
 * @param {Arguments} chai.Assertion.prototype.assert arguments
 * @namespace Utils
 * @name test
 */

module.exports = function (obj, args) {
  var negate = flag(obj, 'negate')
    , expr = args[0];
  return negate ? !expr : expr;
};


/***/ }),

/***/ "./node_modules/chai/lib/chai/utils/transferFlags.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * Chai - transferFlags utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### transferFlags(assertion, object, includeAll = true)
 *
 * Transfer all the flags for `assertion` to `object`. If
 * `includeAll` is set to `false`, then the base Chai
 * assertion flags (namely `object`, `ssfi`, and `message`)
 * will not be transferred.
 *
 *
 *     var newAssertion = new Assertion();
 *     utils.transferFlags(assertion, newAssertion);
 *
 *     var anotherAsseriton = new Assertion(myObj);
 *     utils.transferFlags(assertion, anotherAssertion, false);
 *
 * @param {Assertion} assertion the assertion to transfer the flags from
 * @param {Object} object the object to transfer the flags to; usually a new assertion
 * @param {Boolean} includeAll
 * @namespace Utils
 * @name transferFlags
 * @api private
 */

module.exports = function (assertion, object, includeAll) {
  var flags = assertion.__flags || (assertion.__flags = Object.create(null));

  if (!object.__flags) {
    object.__flags = Object.create(null);
  }

  includeAll = arguments.length === 3 ? includeAll : true;

  for (var flag in flags) {
    if (includeAll ||
        (flag !== 'object' && flag !== 'ssfi' && flag != 'message')) {
      object.__flags[flag] = flags[flag];
    }
  }
};


/***/ }),

/***/ "./node_modules/compare-module-exports/src/index.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
function generate(libraryName) {

  let hasError = false;
  let errors = [];
  const pushError = (err) => errors.push(err);

  function testFunction(a, b, file, name) {
    if (a.length !== b.length) {
      if (a.toString().indexOf('_could_be_any_') < 0) {
        pushError(name + ': in' + file + '\n\t\t' + a.toString() + '\n\tdoes not match\n\t\t' + b.toString());
        throw new Error(libraryName + ': function argument mismatch: ' + file + ': ' + name);
      }
    }
  }

  function test(a, b, file, name, options) {
    if (!b) {
      throw new Error(libraryName + ': mocked export "' + name + '" does not exists in ' + file);
    }
    const typeOfA = typeof a;
    const typeOfB = typeof b;
    if (typeOfA !== typeOfB) {
      throw new Error(libraryName + ': exported type mismatch: ' + file + ':' + name + '. Expected ' + typeOfB + ', got ' + typeOfA + '');
    }
    if (typeOfA === 'function') {
      if (!options.noFunctionCompare) {
        return testFunction(a, b, file, name);
      }
    }
  }

  function matchExports(realExports, mockedExports, realFile, mockFile, options = {}) {
    hasError = false;
    const typeOfA = typeof mockedExports;
    const typeOfB = typeof realExports
    if (typeOfA !== typeOfB) {
      pushError(
        libraryName + ': mock ' + mockFile + ' exports does not match a real file.' +
        ' Expected ' + typeOfB + ', got ' + typeOfA + ''
      );
      return true;
    }
    if (typeof mockedExports === 'function') {
      try {
        test(mockedExports, realExports, realFile, 'exports', options);
      } catch (e) {
        pushError(e.message);
        hasError = true;
      }
    } else if (typeof mockedExports === 'object') {
      Object.keys(mockedExports).forEach(key => {
        try {
          test(mockedExports[key], realExports[key], realFile, key, options)
        } catch (e) {
          pushError(e.message);
          hasError = true;
        }
      });
    }
    return hasError ? errors : false;
  }

  function tryMatchExports(realExports, mockedExports, realFile, mockFile, options = {}) {
    errors = [];
    if (matchExports(realExports, mockedExports, realFile, mockFile, options)) {
      errors = [];
      return matchExports(realExports, {default: mockedExports}, realFile, mockFile, options)
    }
    return false;
  }

  return tryMatchExports;
}

module.exports = generate;

/***/ }),

/***/ "./node_modules/deep-eql/index.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
module.exports = __webpack_require__("./node_modules/deep-eql/lib/eql.js");


/***/ }),

/***/ "./node_modules/deep-eql/lib/eql.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * deep-eql
 * Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var type = __webpack_require__("./node_modules/deep-eql/node_modules/type-detect/index.js");

/*!
 * Buffer.isBuffer browser shim
 */

var Buffer;
try { Buffer = __webpack_require__("./node_modules/buffer/index.js").Buffer; }
catch(ex) {
  Buffer = {};
  Buffer.isBuffer = function() { return false; }
}

/*!
 * Primary Export
 */

module.exports = deepEqual;

/**
 * Assert super-strict (egal) equality between
 * two objects of any type.
 *
 * @param {Mixed} a
 * @param {Mixed} b
 * @param {Array} memoised (optional)
 * @return {Boolean} equal match
 */

function deepEqual(a, b, m) {
  if (sameValue(a, b)) {
    return true;
  } else if ('date' === type(a)) {
    return dateEqual(a, b);
  } else if ('regexp' === type(a)) {
    return regexpEqual(a, b);
  } else if (Buffer.isBuffer(a)) {
    return bufferEqual(a, b);
  } else if ('arguments' === type(a)) {
    return argumentsEqual(a, b, m);
  } else if (!typeEqual(a, b)) {
    return false;
  } else if (('object' !== type(a) && 'object' !== type(b))
  && ('array' !== type(a) && 'array' !== type(b))) {
    return sameValue(a, b);
  } else {
    return objectEqual(a, b, m);
  }
}

/*!
 * Strict (egal) equality test. Ensures that NaN always
 * equals NaN and `-0` does not equal `+0`.
 *
 * @param {Mixed} a
 * @param {Mixed} b
 * @return {Boolean} equal match
 */

function sameValue(a, b) {
  if (a === b) return a !== 0 || 1 / a === 1 / b;
  return a !== a && b !== b;
}

/*!
 * Compare the types of two given objects and
 * return if they are equal. Note that an Array
 * has a type of `array` (not `object`) and arguments
 * have a type of `arguments` (not `array`/`object`).
 *
 * @param {Mixed} a
 * @param {Mixed} b
 * @return {Boolean} result
 */

function typeEqual(a, b) {
  return type(a) === type(b);
}

/*!
 * Compare two Date objects by asserting that
 * the time values are equal using `saveValue`.
 *
 * @param {Date} a
 * @param {Date} b
 * @return {Boolean} result
 */

function dateEqual(a, b) {
  if ('date' !== type(b)) return false;
  return sameValue(a.getTime(), b.getTime());
}

/*!
 * Compare two regular expressions by converting them
 * to string and checking for `sameValue`.
 *
 * @param {RegExp} a
 * @param {RegExp} b
 * @return {Boolean} result
 */

function regexpEqual(a, b) {
  if ('regexp' !== type(b)) return false;
  return sameValue(a.toString(), b.toString());
}

/*!
 * Assert deep equality of two `arguments` objects.
 * Unfortunately, these must be sliced to arrays
 * prior to test to ensure no bad behavior.
 *
 * @param {Arguments} a
 * @param {Arguments} b
 * @param {Array} memoize (optional)
 * @return {Boolean} result
 */

function argumentsEqual(a, b, m) {
  if ('arguments' !== type(b)) return false;
  a = [].slice.call(a);
  b = [].slice.call(b);
  return deepEqual(a, b, m);
}

/*!
 * Get enumerable properties of a given object.
 *
 * @param {Object} a
 * @return {Array} property names
 */

function enumerable(a) {
  var res = [];
  for (var key in a) res.push(key);
  return res;
}

/*!
 * Simple equality for flat iterable objects
 * such as Arrays or Node.js buffers.
 *
 * @param {Iterable} a
 * @param {Iterable} b
 * @return {Boolean} result
 */

function iterableEqual(a, b) {
  if (a.length !==  b.length) return false;

  var i = 0;
  var match = true;

  for (; i < a.length; i++) {
    if (a[i] !== b[i]) {
      match = false;
      break;
    }
  }

  return match;
}

/*!
 * Extension to `iterableEqual` specifically
 * for Node.js Buffers.
 *
 * @param {Buffer} a
 * @param {Mixed} b
 * @return {Boolean} result
 */

function bufferEqual(a, b) {
  if (!Buffer.isBuffer(b)) return false;
  return iterableEqual(a, b);
}

/*!
 * Block for `objectEqual` ensuring non-existing
 * values don't get in.
 *
 * @param {Mixed} object
 * @return {Boolean} result
 */

function isValue(a) {
  return a !== null && a !== undefined;
}

/*!
 * Recursively check the equality of two objects.
 * Once basic sameness has been established it will
 * defer to `deepEqual` for each enumerable key
 * in the object.
 *
 * @param {Mixed} a
 * @param {Mixed} b
 * @return {Boolean} result
 */

function objectEqual(a, b, m) {
  if (!isValue(a) || !isValue(b)) {
    return false;
  }

  if (a.prototype !== b.prototype) {
    return false;
  }

  var i;
  if (m) {
    for (i = 0; i < m.length; i++) {
      if ((m[i][0] === a && m[i][1] === b)
      ||  (m[i][0] === b && m[i][1] === a)) {
        return true;
      }
    }
  } else {
    m = [];
  }

  try {
    var ka = enumerable(a);
    var kb = enumerable(b);
  } catch (ex) {
    return false;
  }

  ka.sort();
  kb.sort();

  if (!iterableEqual(ka, kb)) {
    return false;
  }

  m.push([ a, b ]);

  var key;
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key], m)) {
      return false;
    }
  }

  return true;
}


/***/ }),

/***/ "./node_modules/deep-eql/node_modules/type-detect/index.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
module.exports = __webpack_require__("./node_modules/deep-eql/node_modules/type-detect/lib/type.js");


/***/ }),

/***/ "./node_modules/deep-eql/node_modules/type-detect/lib/type.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * type-detect
 * Copyright(c) 2013 jake luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Primary Exports
 */

var exports = module.exports = getType;

/*!
 * Detectable javascript natives
 */

var natives = {
    '[object Array]': 'array'
  , '[object RegExp]': 'regexp'
  , '[object Function]': 'function'
  , '[object Arguments]': 'arguments'
  , '[object Date]': 'date'
};

/**
 * ### typeOf (obj)
 *
 * Use several different techniques to determine
 * the type of object being tested.
 *
 *
 * @param {Mixed} object
 * @return {String} object type
 * @api public
 */

function getType (obj) {
  var str = Object.prototype.toString.call(obj);
  if (natives[str]) return natives[str];
  if (obj === null) return 'null';
  if (obj === undefined) return 'undefined';
  if (obj === Object(obj)) return 'object';
  return typeof obj;
}

exports.Library = Library;

/**
 * ### Library
 *
 * Create a repository for custom type detection.
 *
 * ```js
 * var lib = new type.Library;
 * ```
 *
 */

function Library () {
  this.tests = {};
}

/**
 * #### .of (obj)
 *
 * Expose replacement `typeof` detection to the library.
 *
 * ```js
 * if ('string' === lib.of('hello world')) {
 *   // ...
 * }
 * ```
 *
 * @param {Mixed} object to test
 * @return {String} type
 */

Library.prototype.of = getType;

/**
 * #### .define (type, test)
 *
 * Add a test to for the `.test()` assertion.
 *
 * Can be defined as a regular expression:
 *
 * ```js
 * lib.define('int', /^[0-9]+$/);
 * ```
 *
 * ... or as a function:
 *
 * ```js
 * lib.define('bln', function (obj) {
 *   if ('boolean' === lib.of(obj)) return true;
 *   var blns = [ 'yes', 'no', 'true', 'false', 1, 0 ];
 *   if ('string' === lib.of(obj)) obj = obj.toLowerCase();
 *   return !! ~blns.indexOf(obj);
 * });
 * ```
 *
 * @param {String} type
 * @param {RegExp|Function} test
 * @api public
 */

Library.prototype.define = function (type, test) {
  if (arguments.length === 1) return this.tests[type];
  this.tests[type] = test;
  return this;
};

/**
 * #### .test (obj, test)
 *
 * Assert that an object is of type. Will first
 * check natives, and if that does not pass it will
 * use the user defined custom tests.
 *
 * ```js
 * assert(lib.test('1', 'int'));
 * assert(lib.test('yes', 'bln'));
 * ```
 *
 * @param {Mixed} object
 * @param {String} type
 * @return {Boolean} result
 * @api public
 */

Library.prototype.test = function (obj, type) {
  if (type === getType(obj)) return true;
  var test = this.tests[type];

  if (test && 'regexp' === getType(test)) {
    return test.test(obj);
  } else if (test && 'function' === getType(test)) {
    return test(obj);
  } else {
    throw new ReferenceError('Type test "' + type + '" not defined or invalid.');
  }
};


/***/ }),

/***/ "./node_modules/ieee754/index.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "./node_modules/isarray/index.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ "./node_modules/lodash._reinterpolate/index.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used to match template delimiters. */
var reInterpolate = /<%=([\s\S]+?)%>/g;

module.exports = reInterpolate;


/***/ }),

/***/ "./node_modules/lodash.some/index.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* WEBPACK VAR INJECTION */(function(global, module) {/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__['delete'](key);
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache) {
    var pairs = cache.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {boolean} [bitmask] The bitmask of comparison flags.
 *  The bitmask may be composed of the following flags:
 *     1 - Unordered comparison
 *     2 - Partial comparison
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, bitmask, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = getTag(object);
    objTag = objTag == argsTag ? objectTag : objTag;
  }
  if (!othIsArr) {
    othTag = getTag(other);
    othTag = othTag == argsTag ? objectTag : othTag;
  }
  var objIsObj = objTag == objectTag && !isHostObject(object),
      othIsObj = othTag == objectTag && !isHostObject(other),
      isSameTag = objTag == othTag;

  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
      : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
  }
  if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
}

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
}

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
  };
}

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

/**
 * The base implementation of `_.some` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function baseSome(collection, predicate) {
  var result;

  baseEach(collection, function(value, index, collection) {
    result = predicate(value, index, collection);
    return !result;
  });
  return !!result;
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & UNORDERED_COMPARE_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!seen.has(othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
              return seen.add(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, customizer, bitmask, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= UNORDERED_COMPARE_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = isKey(path, object) ? [path] : castPath(path);

  var result,
      index = -1,
      length = path.length;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result) {
    return result;
  }
  var length = object ? object.length : 0;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Checks if `predicate` returns truthy for **any** element of `collection`.
 * Iteration is stopped once `predicate` returns truthy. The predicate is
 * invoked with three arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 * @example
 *
 * _.some([null, 0, 'yes', false], Boolean);
 * // => true
 *
 * var users = [
 *   { 'user': 'barney', 'active': true },
 *   { 'user': 'fred',   'active': false }
 * ];
 *
 * // The `_.matches` iteratee shorthand.
 * _.some(users, { 'user': 'barney', 'active': false });
 * // => false
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.some(users, ['active', false]);
 * // => true
 *
 * // The `_.property` iteratee shorthand.
 * _.some(users, 'active');
 * // => true
 */
function some(collection, predicate, guard) {
  var func = isArray(collection) ? arraySome : baseSome;
  if (guard && isIterateeCall(collection, predicate, guard)) {
    predicate = undefined;
  }
  return func(collection, baseIteratee(predicate, 3));
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = some;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js"), __webpack_require__("./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/lodash.template/index.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* WEBPACK VAR INJECTION */(function(global) {/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
var reInterpolate = __webpack_require__("./node_modules/lodash._reinterpolate/index.js"),
    templateSettings = __webpack_require__("./node_modules/lodash.templatesettings/index.js");

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match empty string literals in compiled template source. */
var reEmptyStringLeading = /\b__p \+= '';/g,
    reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
    reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

/**
 * Used to match
 * [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
 */
var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to ensure capturing order of template delimiters. */
var reNoMatch = /($^)/;

/** Used to match unescaped characters in compiled string literals. */
var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

/** Used to escape characters for inclusion in compiled string literals. */
var stringEscapes = {
  '\\': '\\',
  "'": "'",
  '\n': 'n',
  '\r': 'r',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}

/**
 * Used by `_.template` to escape characters for inclusion in compiled string literals.
 *
 * @private
 * @param {string} chr The matched character to escape.
 * @returns {string} Returns the escaped character.
 */
function escapeStringChar(chr) {
  return '\\' + stringEscapes[chr];
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var Symbol = root.Symbol,
    propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object),
    nativeMax = Math.max;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Used by `_.defaults` to customize its `_.assignIn` use.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to assign.
 * @param {Object} object The parent object of `objValue`.
 * @returns {*} Returns the value to assign.
 */
function assignInDefaults(objValue, srcValue, key, object) {
  if (objValue === undefined ||
      (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
    return srcValue;
  }
  return objValue;
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply(func, this, otherArgs);
  };
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    assignValue(object, key, newValue === undefined ? source[key] : newValue);
  }
  return object;
}

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
 * `SyntaxError`, `TypeError`, or `URIError` object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
 * @example
 *
 * _.isError(new Error);
 * // => true
 *
 * _.isError(Error);
 * // => false
 */
function isError(value) {
  if (!isObjectLike(value)) {
    return false;
  }
  return (objectToString.call(value) == errorTag) ||
    (typeof value.message == 'string' && typeof value.name == 'string');
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * This method is like `_.assignIn` except that it accepts `customizer`
 * which is invoked to produce the assigned values. If `customizer` returns
 * `undefined`, assignment is handled by the method instead. The `customizer`
 * is invoked with five arguments: (objValue, srcValue, key, object, source).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias extendWith
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @see _.assignWith
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   return _.isUndefined(objValue) ? srcValue : objValue;
 * }
 *
 * var defaults = _.partialRight(_.assignInWith, customizer);
 *
 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
  copyObject(source, keysIn(source), object, customizer);
});

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

/**
 * Creates a compiled template function that can interpolate data properties
 * in "interpolate" delimiters, HTML-escape interpolated data properties in
 * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
 * properties may be accessed as free variables in the template. If a setting
 * object is given, it takes precedence over `_.templateSettings` values.
 *
 * **Note:** In the development build `_.template` utilizes
 * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
 * for easier debugging.
 *
 * For more information on precompiling templates see
 * [lodash's custom builds documentation](https://lodash.com/custom-builds).
 *
 * For more information on Chrome extension sandboxes see
 * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category String
 * @param {string} [string=''] The template string.
 * @param {Object} [options={}] The options object.
 * @param {RegExp} [options.escape=_.templateSettings.escape]
 *  The HTML "escape" delimiter.
 * @param {RegExp} [options.evaluate=_.templateSettings.evaluate]
 *  The "evaluate" delimiter.
 * @param {Object} [options.imports=_.templateSettings.imports]
 *  An object to import into the template as free variables.
 * @param {RegExp} [options.interpolate=_.templateSettings.interpolate]
 *  The "interpolate" delimiter.
 * @param {string} [options.sourceURL='templateSources[n]']
 *  The sourceURL of the compiled template.
 * @param {string} [options.variable='obj']
 *  The data object variable name.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Function} Returns the compiled template function.
 * @example
 *
 * // Use the "interpolate" delimiter to create a compiled template.
 * var compiled = _.template('hello <%= user %>!');
 * compiled({ 'user': 'fred' });
 * // => 'hello fred!'
 *
 * // Use the HTML "escape" delimiter to escape data property values.
 * var compiled = _.template('<b><%- value %></b>');
 * compiled({ 'value': '<script>' });
 * // => '<b>&lt;script&gt;</b>'
 *
 * // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
 * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
 * compiled({ 'users': ['fred', 'barney'] });
 * // => '<li>fred</li><li>barney</li>'
 *
 * // Use the internal `print` function in "evaluate" delimiters.
 * var compiled = _.template('<% print("hello " + user); %>!');
 * compiled({ 'user': 'barney' });
 * // => 'hello barney!'
 *
 * // Use the ES delimiter as an alternative to the default "interpolate" delimiter.
 * var compiled = _.template('hello ${ user }!');
 * compiled({ 'user': 'pebbles' });
 * // => 'hello pebbles!'
 *
 * // Use backslashes to treat delimiters as plain text.
 * var compiled = _.template('<%= "\\<%- value %\\>" %>');
 * compiled({ 'value': 'ignored' });
 * // => '<%- value %>'
 *
 * // Use the `imports` option to import `jQuery` as `jq`.
 * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
 * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
 * compiled({ 'users': ['fred', 'barney'] });
 * // => '<li>fred</li><li>barney</li>'
 *
 * // Use the `sourceURL` option to specify a custom sourceURL for the template.
 * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
 * compiled(data);
 * // => Find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector.
 *
 * // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
 * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
 * compiled.source;
 * // => function(data) {
 * //   var __t, __p = '';
 * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
 * //   return __p;
 * // }
 *
 * // Use custom template delimiters.
 * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
 * var compiled = _.template('hello {{ user }}!');
 * compiled({ 'user': 'mustache' });
 * // => 'hello mustache!'
 *
 * // Use the `source` property to inline compiled templates for meaningful
 * // line numbers in error messages and stack traces.
 * fs.writeFileSync(path.join(process.cwd(), 'jst.js'), '\
 *   var JST = {\
 *     "main": ' + _.template(mainText).source + '\
 *   };\
 * ');
 */
function template(string, options, guard) {
  // Based on John Resig's `tmpl` implementation
  // (http://ejohn.org/blog/javascript-micro-templating/)
  // and Laura Doktorova's doT.js (https://github.com/olado/doT).
  var settings = templateSettings.imports._.templateSettings || templateSettings;

  if (guard && isIterateeCall(string, options, guard)) {
    options = undefined;
  }
  string = toString(string);
  options = assignInWith({}, options, settings, assignInDefaults);

  var imports = assignInWith({}, options.imports, settings.imports, assignInDefaults),
      importsKeys = keys(imports),
      importsValues = baseValues(imports, importsKeys);

  var isEscaping,
      isEvaluating,
      index = 0,
      interpolate = options.interpolate || reNoMatch,
      source = "__p += '";

  // Compile the regexp to match each delimiter.
  var reDelimiters = RegExp(
    (options.escape || reNoMatch).source + '|' +
    interpolate.source + '|' +
    (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
    (options.evaluate || reNoMatch).source + '|$'
  , 'g');

  // Use a sourceURL for easier debugging.
  var sourceURL = 'sourceURL' in options ? '//# sourceURL=' + options.sourceURL + '\n' : '';

  string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
    interpolateValue || (interpolateValue = esTemplateValue);

    // Escape characters that can't be included in string literals.
    source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

    // Replace delimiters with snippets.
    if (escapeValue) {
      isEscaping = true;
      source += "' +\n__e(" + escapeValue + ") +\n'";
    }
    if (evaluateValue) {
      isEvaluating = true;
      source += "';\n" + evaluateValue + ";\n__p += '";
    }
    if (interpolateValue) {
      source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
    }
    index = offset + match.length;

    // The JS engine embedded in Adobe products needs `match` returned in
    // order to produce the correct `offset` value.
    return match;
  });

  source += "';\n";

  // If `variable` is not specified wrap a with-statement around the generated
  // code to add the data object to the top of the scope chain.
  var variable = options.variable;
  if (!variable) {
    source = 'with (obj) {\n' + source + '\n}\n';
  }
  // Cleanup code by stripping empty strings.
  source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
    .replace(reEmptyStringMiddle, '$1')
    .replace(reEmptyStringTrailing, '$1;');

  // Frame code as the function body.
  source = 'function(' + (variable || 'obj') + ') {\n' +
    (variable
      ? ''
      : 'obj || (obj = {});\n'
    ) +
    "var __t, __p = ''" +
    (isEscaping
       ? ', __e = _.escape'
       : ''
    ) +
    (isEvaluating
      ? ', __j = Array.prototype.join;\n' +
        "function print() { __p += __j.call(arguments, '') }\n"
      : ';\n'
    ) +
    source +
    'return __p\n}';

  var result = attempt(function() {
    return Function(importsKeys, sourceURL + 'return ' + source)
      .apply(undefined, importsValues);
  });

  // Provide the compiled function's source by its `toString` method or
  // the `source` property as a convenience for inlining compiled templates.
  result.source = source;
  if (isError(result)) {
    throw result;
  }
  return result;
}

/**
 * Attempts to invoke `func`, returning either the result or the caught error
 * object. Any additional arguments are provided to `func` when it's invoked.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Util
 * @param {Function} func The function to attempt.
 * @param {...*} [args] The arguments to invoke `func` with.
 * @returns {*} Returns the `func` result or error object.
 * @example
 *
 * // Avoid throwing errors for invalid selectors.
 * var elements = _.attempt(function(selector) {
 *   return document.querySelectorAll(selector);
 * }, '>_>');
 *
 * if (_.isError(elements)) {
 *   elements = [];
 * }
 */
var attempt = baseRest(function(func, args) {
  try {
    return apply(func, undefined, args);
  } catch (e) {
    return isError(e) ? e : new Error(e);
  }
});

module.exports = template;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/lodash.templatesettings/index.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* WEBPACK VAR INJECTION */(function(global) {/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
var reInterpolate = __webpack_require__("./node_modules/lodash._reinterpolate/index.js");

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match HTML entities and HTML characters. */
var reUnescapedHtml = /[&<>"'`]/g,
    reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

/** Used to match template delimiters. */
var reEscape = /<%-([\s\S]+?)%>/g,
    reEvaluate = /<%([\s\S]+?)%>/g;

/** Used to map characters to HTML entities. */
var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#96;'
};

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * The base implementation of `_.propertyOf` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyOf(object) {
  return function(key) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Used by `_.escape` to convert characters to HTML entities.
 *
 * @private
 * @param {string} chr The matched character to escape.
 * @returns {string} Returns the escaped character.
 */
var escapeHtmlChar = basePropertyOf(htmlEscapes);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var Symbol = root.Symbol;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * By default, the template delimiters used by lodash are like those in
 * embedded Ruby (ERB). Change the following template settings to use
 * alternative delimiters.
 *
 * @static
 * @memberOf _
 * @type {Object}
 */
var templateSettings = {

  /**
   * Used to detect `data` property values to be HTML-escaped.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'escape': reEscape,

  /**
   * Used to detect code to be evaluated.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'evaluate': reEvaluate,

  /**
   * Used to detect `data` property values to inject.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'interpolate': reInterpolate,

  /**
   * Used to reference the data object in the template text.
   *
   * @memberOf _.templateSettings
   * @type {string}
   */
  'variable': '',

  /**
   * Used to import variables into the compiled template.
   *
   * @memberOf _.templateSettings
   * @type {Object}
   */
  'imports': {

    /**
     * A reference to the `lodash` function.
     *
     * @memberOf _.templateSettings.imports
     * @type {Function}
     */
    '_': { 'escape': escape }
  }
};

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Converts the characters "&", "<", ">", '"', "'", and "\`" in `string` to
 * their corresponding HTML entities.
 *
 * **Note:** No other characters are escaped. To escape additional
 * characters use a third-party library like [_he_](https://mths.be/he).
 *
 * Though the ">" character is escaped for symmetry, characters like
 * ">" and "/" don't need escaping in HTML and have no special meaning
 * unless they're part of a tag or unquoted attribute value. See
 * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
 * (under "semi-related fun fact") for more details.
 *
 * Backticks are escaped because in IE < 9, they can break out of
 * attribute values or HTML comments. See [#59](https://html5sec.org/#59),
 * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
 * [#133](https://html5sec.org/#133) of the
 * [HTML5 Security Cheatsheet](https://html5sec.org/) for more details.
 *
 * When working with HTML you should always
 * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
 * XSS vectors.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escape('fred, barney, & pebbles');
 * // => 'fred, barney, &amp; pebbles'
 */
function escape(string) {
  string = toString(string);
  return (string && reHasUnescapedHtml.test(string))
    ? string.replace(reUnescapedHtml, escapeHtmlChar)
    : string;
}

module.exports = templateSettings;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/path-browserify/index.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/path-parse/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* WEBPACK VAR INJECTION */(function(process) {

var isWindows = process.platform === 'win32';

// Regex to split a windows path into three parts: [*, device, slash,
// tail] windows-only
var splitDeviceRe =
    /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;

// Regex to split the tail part of the above into [*, dir, basename, ext]
var splitTailRe =
    /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/;

var win32 = {};

// Function to split a filename into [root, dir, basename, ext]
function win32SplitPath(filename) {
  // Separate device+slash from tail
  var result = splitDeviceRe.exec(filename),
      device = (result[1] || '') + (result[2] || ''),
      tail = result[3] || '';
  // Split the tail into dir, basename and extension
  var result2 = splitTailRe.exec(tail),
      dir = result2[1],
      basename = result2[2],
      ext = result2[3];
  return [device, dir, basename, ext];
}

win32.parse = function(pathString) {
  if (typeof pathString !== 'string') {
    throw new TypeError(
        "Parameter 'pathString' must be a string, not " + typeof pathString
    );
  }
  var allParts = win32SplitPath(pathString);
  if (!allParts || allParts.length !== 4) {
    throw new TypeError("Invalid path '" + pathString + "'");
  }
  return {
    root: allParts[0],
    dir: allParts[0] + allParts[1].slice(0, -1),
    base: allParts[2],
    ext: allParts[3],
    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
  };
};



// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var posix = {};


function posixSplitPath(filename) {
  return splitPathRe.exec(filename).slice(1);
}


posix.parse = function(pathString) {
  if (typeof pathString !== 'string') {
    throw new TypeError(
        "Parameter 'pathString' must be a string, not " + typeof pathString
    );
  }
  var allParts = posixSplitPath(pathString);
  if (!allParts || allParts.length !== 4) {
    throw new TypeError("Invalid path '" + pathString + "'");
  }
  allParts[1] = allParts[1] || '';
  allParts[2] = allParts[2] || '';
  allParts[3] = allParts[3] || '';

  return {
    root: allParts[0],
    dir: allParts[0] + allParts[1].slice(0, -1),
    base: allParts[2],
    ext: allParts[3],
    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
  };
};


if (isWindows)
  module.exports = win32.parse;
else /* posix */
  module.exports = posix.parse;

module.exports.posix = posix.parse;
module.exports.win32 = win32.parse;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/process/browser.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/type-detect/index.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
module.exports = __webpack_require__("./node_modules/type-detect/lib/type.js");


/***/ }),

/***/ "./node_modules/type-detect/lib/type.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/*!
 * type-detect
 * Copyright(c) 2013 jake luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Primary Exports
 */

var exports = module.exports = getType;

/**
 * ### typeOf (obj)
 *
 * Use several different techniques to determine
 * the type of object being tested.
 *
 *
 * @param {Mixed} object
 * @return {String} object type
 * @api public
 */
var objectTypeRegexp = /^\[object (.*)\]$/;

function getType(obj) {
  var type = Object.prototype.toString.call(obj).match(objectTypeRegexp)[1].toLowerCase();
  // Let "new String('')" return 'object'
  if (typeof Promise === 'function' && obj instanceof Promise) return 'promise';
  // PhantomJS has type "DOMWindow" for null
  if (obj === null) return 'null';
  // PhantomJS has type "DOMWindow" for undefined
  if (obj === undefined) return 'undefined';
  return type;
}

exports.Library = Library;

/**
 * ### Library
 *
 * Create a repository for custom type detection.
 *
 * ```js
 * var lib = new type.Library;
 * ```
 *
 */

function Library() {
  if (!(this instanceof Library)) return new Library();
  this.tests = {};
}

/**
 * #### .of (obj)
 *
 * Expose replacement `typeof` detection to the library.
 *
 * ```js
 * if ('string' === lib.of('hello world')) {
 *   // ...
 * }
 * ```
 *
 * @param {Mixed} object to test
 * @return {String} type
 */

Library.prototype.of = getType;

/**
 * #### .define (type, test)
 *
 * Add a test to for the `.test()` assertion.
 *
 * Can be defined as a regular expression:
 *
 * ```js
 * lib.define('int', /^[0-9]+$/);
 * ```
 *
 * ... or as a function:
 *
 * ```js
 * lib.define('bln', function (obj) {
 *   if ('boolean' === lib.of(obj)) return true;
 *   var blns = [ 'yes', 'no', 'true', 'false', 1, 0 ];
 *   if ('string' === lib.of(obj)) obj = obj.toLowerCase();
 *   return !! ~blns.indexOf(obj);
 * });
 * ```
 *
 * @param {String} type
 * @param {RegExp|Function} test
 * @api public
 */

Library.prototype.define = function(type, test) {
  if (arguments.length === 1) return this.tests[type];
  this.tests[type] = test;
  return this;
};

/**
 * #### .test (obj, test)
 *
 * Assert that an object is of type. Will first
 * check natives, and if that does not pass it will
 * use the user defined custom tests.
 *
 * ```js
 * assert(lib.test('1', 'int'));
 * assert(lib.test('yes', 'bln'));
 * ```
 *
 * @param {Mixed} object
 * @param {String} type
 * @return {Boolean} result
 * @api public
 */

Library.prototype.test = function(obj, type) {
  if (type === getType(obj)) return true;
  var test = this.tests[type];

  if (test && 'regexp' === getType(test)) {
    return test.test(obj);
  } else if (test && 'function' === getType(test)) {
    return test(obj);
  } else {
    throw new ReferenceError('Type test "' + type + '" not defined or invalid.');
  }
};


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./node_modules/webpack/buildin/harmony-module.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
module.exports = function(originalModule) {
	if(!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true,
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./node_modules/wipe-webpack-cache/src/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}


function waveCallback_default() {
  return true;
}

function removeFromCache(moduleName) {
  delete __webpack_require__.c[moduleName];
}
/**
 * Wipes webpack module cache.
 * First it look for modules to wipe, and wipe them.
 * Second it looks for users of that modules and wipe them to. Repeat.
 * Use waveCallback to control secondary wave.
 * @param {Object} stubs Any objects, which will just be passed as first parameter to resolver.
 * @param {Function} resolver function(stubs, moduleName) which shall return true, if module must be wiped out.
 * @param {Function} [waveCallback] function(moduleName) which shall return false, if parent module must not be wiped.
 */
function wipeCache(stubs, resolver, waveCallback) {

  if (false) {
    var error = new Error("wipeWebpackCache: HRM must be enabled, please add HotModuleReplacementPlugin or specify --hot");
    console.error(error.message);
    throw error;
  }

  if (false) {
    console.error('wipeWebpackCache:');
    throw new Error("wipeWebpackCache: requires webpack environment. Use wipeNodeCacheInstead");
  }

  if (Object.keys(__webpack_require__.m)[0] == '0') {
    var error = new Error("wipeWebpackCache: you have to provide modulesNames, please add NamedModulesPlugin to your webpack configuration");
    console.error(error.message);
    throw error;
  }

  waveCallback = waveCallback || waveCallback_default;
  var wipeList = [];

  var cache = __webpack_require__.c;

  // First wave
  Object.keys(cache).forEach(function (moduleName) {
    var test = resolver(stubs, moduleName);
    if (test) {
      wipeList.push.apply(wipeList, cache[moduleName].parents);
      removeFromCache(moduleName);
    }
  });

  // Secondary wave
  while (wipeList.length) {
    var removeList = wipeList;
    wipeList = [];

    removeList.forEach(function (moduleName) {
      if (cache[moduleName] && waveCallback(moduleName)) {
        wipeList.push.apply(wipeList, cache[moduleName].parents);
        removeFromCache(moduleName);
      }
    });
  }
}

module.exports = wipeCache;

/***/ }),

/***/ "./src/_common.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return extensions; });
/* unused harmony export magicProps */
const extensions = ['', '.js', '.jsx'];

const magicProps = [
    '__esModule',
];



/***/ }),

/***/ "./src/asyncModules.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mocks__ = __webpack_require__("./src/mocks.js");


let currentModule;

const loadInRoll = (mocks) => {
  if (mocks.length) {
    currentModule = mocks[0];
    return Promise.resolve()
      .then(currentModule.creator)
      .then(() => loadInRoll(mocks.slice(1)))
  } else {
    return Promise.resolve();
  }
};

const probeAsyncModules = {
  hasAsyncModules() {
    const mocks = Object(__WEBPACK_IMPORTED_MODULE_0__mocks__["a" /* getAllAsyncMocks */])();
    return mocks.length
      ? mocks
      : false;
  },

  load: (Module) => (request, parent) => {
    currentModule.loaded = true;
    const baseRequest = Module._resolveFilename(request, parent);
    currentModule.mock.name = baseRequest;
    Object(__WEBPACK_IMPORTED_MODULE_0__mocks__["f" /* insertMock */])(baseRequest, currentModule.mock);
  },

  execute() {
    const mocks = Object(__WEBPACK_IMPORTED_MODULE_0__mocks__["a" /* getAllAsyncMocks */])();
    return loadInRoll(mocks);
  }
};

/* harmony default export */ __webpack_exports__["a"] = (probeAsyncModules);

/***/ }),

/***/ "./src/executor.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_path__ = __webpack_require__("./node_modules/path-browserify/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__module__ = __webpack_require__("./src/module.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__plugins__ = __webpack_require__("./src/plugins.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__mocks__ = __webpack_require__("./src/mocks.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__globals__ = __webpack_require__("./src/globals.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__asyncModules__ = __webpack_require__("./src/asyncModules.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__getModule__ = __webpack_require__("./src/getModule.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_compare_module_exports__ = __webpack_require__("./node_modules/compare-module-exports/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_compare_module_exports___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_compare_module_exports__);










const matchOrigin = __WEBPACK_IMPORTED_MODULE_7_compare_module_exports___default()('rewiremock');
const thisModule = module;

const patternMatch = fileName => pattern => {
  if (typeof pattern == 'function') {
    return pattern(fileName)
  }
  return fileName.match(pattern);
};

const requireModule = (name, parentModule) => {
  if (true) {
    return __webpack_require__(name);
  } else {
    //return Module._load(name);
    return parentModule
      ? ModuleLoader._load(name, parentModule)
      : require(name);
  }
};
/* harmony export (immutable) */ __webpack_exports__["b"] = requireModule;


const testPassby = (request, module) => {
  const {
    parentModule,
    mockedModules,
  } = Object(__WEBPACK_IMPORTED_MODULE_4__globals__["b" /* default */])();

  const passBy = Object(__WEBPACK_IMPORTED_MODULE_4__globals__["a" /* collectScopeVariable */])('passBy');
  const isolation = Object(__WEBPACK_IMPORTED_MODULE_4__globals__["c" /* getScopeVariable */])('isolation');

  // was called from test
  if (Object(__WEBPACK_IMPORTED_MODULE_1__module__["e" /* moduleCompare */])(module, parentModule)) {
    //if (module === parentModule || module == module.parent) {
    return true;
  }
  // if parent is in the pass list - pass everything
  let fileName = __WEBPACK_IMPORTED_MODULE_1__module__["a" /* default */]._resolveFilename(request, module);
  let m = module;

  const test = (fileName) => (
    (!isolation.noAutoPassBy && mockedModules[fileName]) ||  // parent was mocked
    passBy.filter(patternMatch(fileName)).length             // parent is in pass list
  );

  while (m) {
    if (test(fileName)) {
      return true;
    }
    fileName = Object(__WEBPACK_IMPORTED_MODULE_1__module__["b" /* getModuleName */])(m);
    m = Object(__WEBPACK_IMPORTED_MODULE_1__module__["c" /* getModuleParent */])(m);
  }
  return test(fileName);
};


function mockResult(name, mock, data) {
  if (mock.matchOrigin) {
    const matchResult = matchOrigin(mock.original, data, name, '%mock%', {noFunctionCompare: true})
    if (matchResult) {
      // eslint-disable-next-line no-console
      matchResult.forEach(line => console.error(line));
      throw new Error('Rewiremock: provided mocks does not match ' + name);
    }
  }
  if (data && !data.default) {
    data.default = data;
  }
  return data;
}

function monkeyPatchPath(addr) {
  const path = addr.split('/');
  if (path[0] == '..') {
    path[0] = '.';
    return path.join('/');
  }
  return addr;
}

function asyncTest() {
  const asyncModulesLeft = __WEBPACK_IMPORTED_MODULE_5__asyncModules__["a" /* default */].hasAsyncModules();
  if (asyncModulesLeft) {
    /* eslint-disable no-console */
    console.error(
      'Rewiremock: listed async modules should finish loading first. Use async API of rewiremock.',
      asyncModulesLeft.map(module => module.creator.toString())
    );
    /* eslint-enable */
    throw new Error('Rewiremock: listed async modules should finish loading first. Use async API of rewiremock.')
  }
}

function mockLoader(request, parent, isMain) {
  const {
    parentModule,
    mockedModules,
    isolation
  } = Object(__WEBPACK_IMPORTED_MODULE_4__globals__["b" /* default */])();

  asyncTest();

  const baseRequest = __WEBPACK_IMPORTED_MODULE_1__module__["a" /* default */]._resolveFilename(request, parent);
  const shortRequest = monkeyPatchPath(Object(__WEBPACK_IMPORTED_MODULE_0_path__["relative"])(Object(__WEBPACK_IMPORTED_MODULE_1__module__["b" /* getModuleName */])(parent), request));

  if (Object(__WEBPACK_IMPORTED_MODULE_1__module__["e" /* moduleCompare */])(parent, parentModule) || Object(__WEBPACK_IMPORTED_MODULE_1__module__["e" /* moduleCompare */])(parent, thisModule)) {
    delete __WEBPACK_IMPORTED_MODULE_1__module__["a" /* default */]._cache[baseRequest];
    mockedModules[baseRequest] = true;
  }

  const mock = Object(__WEBPACK_IMPORTED_MODULE_3__mocks__["e" /* getMock */])(baseRequest) || Object(__WEBPACK_IMPORTED_MODULE_3__mocks__["e" /* getMock */])(request) || Object(__WEBPACK_IMPORTED_MODULE_3__mocks__["e" /* getMock */])(shortRequest);

  if (mock) {
    if (Object(__WEBPACK_IMPORTED_MODULE_2__plugins__["h" /* shouldMock */])(mock, request, parent, parentModule)) {
      // this file fill be not cached, but it`s opener - will. And we have to remember it
      mockedModules[Object(__WEBPACK_IMPORTED_MODULE_1__module__["b" /* getModuleName */])(parent)] = true;
      mock.usedAs = (mock.usedAs || []);
      mock.usedAs.push(baseRequest);

      mockedModules[baseRequest] = true;

      if (mock.allowCallThrough || mock.matchOrigin) {
        if (!mock.original) {
          mock.original = Object(__WEBPACK_IMPORTED_MODULE_1__module__["f" /* originalLoader */])(request, parent, isMain);
        }
      }

      if (mock.overrideBy) {
        if (!mock.override) {
          if (typeof mock.overrideBy === 'string') {
            mock.override = Object(__WEBPACK_IMPORTED_MODULE_1__module__["f" /* originalLoader */])(Object(__WEBPACK_IMPORTED_MODULE_1__module__["g" /* pickModuleName */])(mock.overrideBy, parent), parent, isMain)
          } else {
            mock.override = mock.overrideBy({
              name: request,
              fullName: baseRequest,
              parent: parent,
              original: mock.original,
              requireActual: (name) => Object(__WEBPACK_IMPORTED_MODULE_1__module__["f" /* originalLoader */])(Object(__WEBPACK_IMPORTED_MODULE_1__module__["g" /* pickModuleName */])(name, parent), parent, isMain)
            });
          }
        }
        return mockResult(request, mock, mock.override);
      }

      if (mock.allowCallThrough) {
        if (typeof(mock.original) === 'function') {
          if (
            typeof mock.value === 'object' &&
            Object.keys(mock.value).length === 0
          ) {
            return mockResult(request, mock, mock.original);
          } else {
            throw new Error('rewiremock: trying to merge Functional base with callThrough mock at '
              + request + '. Use overrideBy instead.');
          }
        }
        return mockResult(request, mock, Object.assign({},
          mock.original,
          mock.value,
          {__esModule: mock.original.__esModule}
        ));
      }
      return mockResult(request, mock, mock.value);
    } else {
      // why you shouldn't?
    }
  }

  if (isolation && !mockedModules[baseRequest]) {
    if (!testPassby(request, parent)) {
      throw new Error('rewiremock: isolation breach by [' + request + ']. Requested from ', Object(__WEBPACK_IMPORTED_MODULE_1__module__["b" /* getModuleName */])(parent));
    }
  }

  return Object(__WEBPACK_IMPORTED_MODULE_1__module__["f" /* originalLoader */])(request, parent, isMain);
}

/* harmony default export */ __webpack_exports__["a"] = (mockLoader);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__("./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/getModule.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
const Module =  true
  ? __webpack_require__("./webpack/module.js")
  : require('module');

/* harmony default export */ __webpack_exports__["a"] = (Module);

/***/ }),

/***/ "./src/globals.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
let currentScope = null;

const setScope = (scope) => currentScope = scope;
/* harmony export (immutable) */ __webpack_exports__["d"] = setScope;


const getScopeVariable = (name, scope = currentScope) => {
  if(name in scope){
    return scope[name];
  }
  if(scope.parentScope){
    return getScopeVariable(name, scope.parentScope);
  }
  return undefined;
}
/* harmony export (immutable) */ __webpack_exports__["c"] = getScopeVariable;


const collectScopeVariable = (name, scope = currentScope, collect = []) => {
  if(name in scope){
    if(Array.isArray(scope[name])) {
      collect.push(...scope[name])
    } else {
      collect.push(scope[name])
    }
  }
  if(scope.parentScope){
    collectScopeVariable(name, scope.parentScope, collect);
  }
  return collect;
}
/* harmony export (immutable) */ __webpack_exports__["a"] = collectScopeVariable;


/* harmony default export */ __webpack_exports__["b"] = (() => currentScope);


/***/ }),

/***/ "./src/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* WEBPACK VAR INJECTION */(function(module, __filename) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return addPlugin; });
/* unused harmony export removePlugin */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_path__ = __webpack_require__("./node_modules/path-browserify/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__wipeCache__ = __webpack_require__("./src/wipeCache.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__plugins__ = __webpack_require__("./src/plugins.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__plugins_index__ = __webpack_require__("./src/plugins/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__module__ = __webpack_require__("./src/module.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__mockModule__ = __webpack_require__("./src/mockModule.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_3__plugins_index__["a"]; });






const moduleName = Object(__WEBPACK_IMPORTED_MODULE_4__module__["b" /* getModuleName */])(module);
if(!moduleName) {
    throw new Error('Rewiremock: while you using Jest - disable automocking')
}

delete __webpack_require__.c[__WEBPACK_IMPORTED_MODULE_0_path___default.a.join(__WEBPACK_IMPORTED_MODULE_0_path___default.a.dirname(__filename), './mockModule.js')];
delete __webpack_require__.c[moduleName.replace('index.js', 'mockModule.js')];



const cleanup = () => {
    const wipeAll = (stubs, moduleName) => moduleName.indexOf(stubs) === 0;
    Object(__WEBPACK_IMPORTED_MODULE_1__wipeCache__["b" /* wipe */])(__WEBPACK_IMPORTED_MODULE_0_path___default.a.dirname(__filename), wipeAll);
};
/* unused harmony export cleanup */


const overrideEntryPoint = (module) => {
    delete __webpack_require__.c[Object(__WEBPACK_IMPORTED_MODULE_4__module__["b" /* getModuleName */])(module)];
    __WEBPACK_IMPORTED_MODULE_5__mockModule__["mockModule"].overrideEntryPoint(Object(__WEBPACK_IMPORTED_MODULE_4__module__["c" /* getModuleParent */])(module));
    //API.cleanup();
};
/* unused harmony export overrideEntryPoint */



overrideEntryPoint(module);

// instance must be clean
__WEBPACK_IMPORTED_MODULE_5__mockModule__["mockModule"].clear();
Object(__WEBPACK_IMPORTED_MODULE_2__plugins__["a" /* _clearPlugins */])();

const addPlugin = __WEBPACK_IMPORTED_MODULE_5__mockModule__["addPlugin"];
const removePlugin = __WEBPACK_IMPORTED_MODULE_5__mockModule__["removePlugin"];

//addPlugin(plugins.nodejs);

addPlugin(__WEBPACK_IMPORTED_MODULE_3__plugins_index__["a" /* default */].toBeUsed);
addPlugin(__WEBPACK_IMPORTED_MODULE_3__plugins_index__["a" /* default */].directChild);


/* harmony default export */ __webpack_exports__["b"] = (__WEBPACK_IMPORTED_MODULE_5__mockModule__["mockModule"]);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__("./node_modules/webpack/buildin/harmony-module.js")(module), "/index.js"))

/***/ }),

/***/ "./src/mock.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__plugins__ = __webpack_require__("./src/plugins.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__globals__ = __webpack_require__("./src/globals.js");



class ModuleMock {
    constructor(mock) {
        this.mock = mock;
        mock._parent = this;
    }

    nonStrict() {
        return this;
    }

    from(source){
        if(source instanceof  ModuleMock){
            const originalName = this.mock.name;
            Object.assign(this.mock, source.mock);
            this.mock.name= originalName;
        } else {
            return this.with(source);
        }
    }

    /**
     * Enabled call thought original module
     * @name ModuleMock.callThrough
     * @return {ModuleMock}
     */
    callThrough() {
        this.mock.allowCallThrough = true;
        return this;
    }

    /**
     * Setting es6 behavior for a current module
     * @return {ModuleMock}
     */
    es6() {
        Object.defineProperty(this.mock.value, "__esModule", {
            value: true
        });
        return this;
    }

    /**
     * Setting es6 behavior for a current module and overriding default export
     * @param stub
     * @return {ModuleMock}
     */
    withDefault(stub) {
        this.with({default: stub});
        return this.es6();
    }

    /**
     * Overriding export of a module
     * @param stubs
     * @return {ModuleMock}
     */
    with(stubs) {
        if (typeof stubs == 'object') {
            this.mock.value = Object.assign(this.mock.value, stubs);
        } else {
            this.mock.value = Object.assign(stubs, this.mock.value);
        }

        return this;
    }

    /**
     * Overriding export of one module by another
     * @param {String|Function} newTarget
     * @return {ModuleMock}
     */
    by(newTarget) {
        if (typeof newTarget == 'string') {
            this.mock.overrideBy = Object(__WEBPACK_IMPORTED_MODULE_0__plugins__["c" /* convertName */])(newTarget, Object(__WEBPACK_IMPORTED_MODULE_1__globals__["b" /* default */])().parentModule);
        } else {
            this.mock.overrideBy = newTarget;
        }
        return this;
    }

    disable() {
        this.mock.disabled = true;
        return this;
    }

    enable() {
        this.mock.disabled = false;
        return this;
    }

    directChildOnly() {
        this.mock.flag_directChildOnly = true;
        return this;
    }

    atAnyPlace() {
        this.mock.flag_directChildOnly = false;
        return this;
    }

    calledFromMock() {
        this.mock.flag_toBeCalledFromMock = true;
        return this;
    }

    calledFromAnywhere() {
        this.mock.flag_toBeCalledFromMock = false;
        return this;
    }

    toBeUsed() {
        this.mock.flag_toBeUsed = true;
        return this;
    }

    toMatchOrigin(){
        this.mock.matchOrigin = true;
        return this;
    }

    notToBeUsed() {
        this.mock.flag_toBeUsed = false;
        return this;
    }
}

ModuleMock.inlineConstructor = {};
Object.getOwnPropertyNames(ModuleMock.prototype).forEach( key => {
  ModuleMock.inlineConstructor[key] = function(...args) {
    const mock = new ModuleMock({value:{}});
    return mock[key](...args);
  }
});

/* harmony default export */ __webpack_exports__["a"] = (ModuleMock);

/***/ }),

/***/ "./src/mockModule.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mockModule", function() { return mockModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addPlugin", function() { return addPlugin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removePlugin", function() { return removePlugin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cleanup", function() { return cleanup; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__module__ = __webpack_require__("./src/module.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__wipeCache__ = __webpack_require__("./src/wipeCache.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scope__ = __webpack_require__("./src/scope.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__globals__ = __webpack_require__("./src/globals.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__plugins__ = __webpack_require__("./src/plugins.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__mocks__ = __webpack_require__("./src/mocks.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__mock__ = __webpack_require__("./src/mock.js");








let parentModule = Object(__WEBPACK_IMPORTED_MODULE_0__module__["c" /* getModuleParent */])(module);
let mockScope = null;
const scope = () => Object(__WEBPACK_IMPORTED_MODULE_3__globals__["d" /* setScope */])(mockScope);
const updateScope = (parentScope = null) => {
    mockScope = Object(__WEBPACK_IMPORTED_MODULE_2__scope__["a" /* default */])(parentScope, parentModule);
    scope();
};

updateScope();

/** main **/

/**
 * @name rewiremock
 * @param {String|Function} module name
 * @return {ModuleMock}
 */
function mockModule(moduleName) {
    scope();
    if(typeof moduleName === 'function'){
      return Object(__WEBPACK_IMPORTED_MODULE_4__plugins__["f" /* onMockCreate */])(new __WEBPACK_IMPORTED_MODULE_6__mock__["a" /* default */](Object(__WEBPACK_IMPORTED_MODULE_5__mocks__["c" /* getAsyncMock */])(moduleName, parentModule)));
    } else {
      const name = Object(__WEBPACK_IMPORTED_MODULE_4__plugins__["c" /* convertName */])(moduleName, parentModule);
      Object(__WEBPACK_IMPORTED_MODULE_5__mocks__["g" /* resetMock */])(name);
      return Object(__WEBPACK_IMPORTED_MODULE_4__plugins__["f" /* onMockCreate */])(new __WEBPACK_IMPORTED_MODULE_6__mock__["a" /* default */](Object(__WEBPACK_IMPORTED_MODULE_5__mocks__["e" /* getMock */])(name)));
    }
}

mockModule.getMock = (module) => {
  let moduleName = module;
  if(typeof moduleName === 'function'){
    moduleName = Object(__WEBPACK_IMPORTED_MODULE_5__mocks__["d" /* getAsyncModuleName */])(moduleName, parentModule);
  } else {
    moduleName = Object(__WEBPACK_IMPORTED_MODULE_4__plugins__["c" /* convertName */])(moduleName, parentModule);
  }
  const mock = Object(__WEBPACK_IMPORTED_MODULE_5__mocks__["e" /* getMock */])(moduleName);
  if(mock) {
    return new __WEBPACK_IMPORTED_MODULE_6__mock__["a" /* default */](mock)
  }
  return null;
}

/**
 * @name rewiremock.resolve
 * @param {String} module name
 * @return {String} converted module name
 */
mockModule.resolve = (module) => {
    scope();
    return Object(__WEBPACK_IMPORTED_MODULE_4__plugins__["c" /* convertName */])(module, parentModule);
};

/** flags **/

/**
 * Activates module isolation
 * @param {Object} [options]
 * @param {Boolean} [options.noAutoPassBy] includes mocked modules to a isolation scope. Usage with mock.callThrough.
 */
mockModule.isolation = (options = {}) => {
    mockScope.isolation = Object.assign({}, options);
    return mockModule;
};

/**
 * Deactivates isolation
 */
mockModule.withoutIsolation = () => {
    mockScope.isolation = false;
    return mockModule;
};

mockModule.forceCacheClear = (mode) => {
    mockScope.forceCacheClear = mode ? mode : true;
};

/**
 * Adding new passby record
 * @param {String|RegEx|Function} pattern
 */
mockModule.passBy = (pattern) => {
    mockScope.passBy.push(pattern);
    return mockModule;
};

mockModule.overrideEntryPoint = (parent) => {
    mockScope.parentModule = parentModule = parent || Object(__WEBPACK_IMPORTED_MODULE_0__module__["c" /* getModuleParent */])(Object(__WEBPACK_IMPORTED_MODULE_0__module__["c" /* getModuleParent */])(module));
};


/** interface **/

/**
 * enabled rewiremock
 */
mockModule.enable = () => {
    scope();
    __WEBPACK_IMPORTED_MODULE_0__module__["a" /* default */].overloadRequire();
    storeCache();
    Object(__WEBPACK_IMPORTED_MODULE_1__wipeCache__["a" /* default */])();
    Object(__WEBPACK_IMPORTED_MODULE_4__plugins__["e" /* onEnable */])(Object(__WEBPACK_IMPORTED_MODULE_5__mocks__["b" /* getAllMocks */])());
    return mockModule;
};

/**
 * disabled rewiremock
 */
mockModule.disable = () => {
    scope();
    __WEBPACK_IMPORTED_MODULE_0__module__["a" /* default */].restoreRequire();
    Object(__WEBPACK_IMPORTED_MODULE_4__plugins__["d" /* onDisable */])(Object(__WEBPACK_IMPORTED_MODULE_5__mocks__["b" /* getAllMocks */])());
    mockModule.withoutIsolation();
    mockModule.flush();
    return mockModule;
};


/**
 * Requires file with hooks
 * @param {String|Function} file
 * @param {Object|Function} overrides
 */
mockModule.proxy = (file, overrides = {}) => {
    let result = 0;
    const stubs =
      typeof overrides === 'function'
      ? overrides(__WEBPACK_IMPORTED_MODULE_6__mock__["a" /* default */].inlineConstructor)
      : overrides;

    mockModule.inScope( () => {
      Object
        .keys(stubs)
        .forEach( key => mockModule(key).from(stubs[key]));

      mockModule.enable();
      if(typeof file === 'string') {
        result = mockModule.requireActual(file);
      } else {
        result = file();
      }
      mockModule.disable();
    });
    return result;
};

/**
 * Imports file with hooks
 * @param {Function} importFunction (use import)
 * @param {Object|Function} overrides
 * @return {Promise}
 */
mockModule.module = (importFunction, overrides = {}) => {
  const stubs =
    typeof overrides === 'function'
      ? overrides(__WEBPACK_IMPORTED_MODULE_6__mock__["a" /* default */].inlineConstructor)
      : overrides;

  return mockModule.around(importFunction, () =>
    Object
      .keys(stubs)
      .forEach( key => mockModule(key).from(stubs[key]))
  );
};

/**
 * Creates temporary executing scope. All mocks and plugins you will add in callback will be removed at exit.
 * @param callback
 */
mockModule.inScope = (callback) => {
    const currentScope = mockScope;
    let error;
    updateScope(currentScope);
    try {
      callback();
    } catch(e) {
        error = e;
    }

    mockScope = currentScope;
    if(error) throw error;
    return mockModule;
};


/**
 * executes module in sandbox
 * @param {Function} loader loader callback
 * @param {Function} [createCallback] - optional callback to be executed before load.
 * @return {Promise}
 */
mockModule.around = (loader, createCallback) => {
    return new Promise((resolve, reject) => {
        const currentScope = mockScope;
        updateScope(currentScope);

        const restore = () => {
          mockModule.disable();
          mockScope = currentScope;
        };

        Promise.resolve(createCallback && createCallback(mockModule))
            .then(() => __WEBPACK_IMPORTED_MODULE_0__module__["a" /* default */].probeAsyncModules())
            .then(() => mockModule.enable())
            .then(() =>
                Promise.resolve(loader())
                  .then((mockedResult) => {
                    restore();
                    resolve(mockedResult);
                }, (err) => {
                    restore();
                    reject(err)
                })
            );
    });
};

const storeCache = () => {
  mockScope.requireCache = mockScope.requireCache || Object.assign({},__webpack_require__.c);
};

const restoreCache = () => {
  const oldCache = mockScope.requireCache;
  const newCache = __webpack_require__.c;
  if(oldCache) {
    Object
      .keys(oldCache)
      .filter(key => !newCache[key])
      .forEach(key => (newCache[key] = oldCache[key]));

    mockScope.requireCache = null;
  }
};

const swapCache = () => {
  const oldCache = mockScope.requireCache;
  const newCache = __webpack_require__.c;
  if(oldCache) {
    Object
      .keys(newCache)
      .filter(key => !oldCache[key])
      .filter(key => key.indexOf('\.node') < 0)
      .forEach(key => delete newCache[key]);

    Object
      .keys(oldCache)
      .forEach(key => (newCache[key] = oldCache[key]));

    mockScope.requireCache = null;
  }
};
/**
 * flushes all active overrides
 */
mockModule.flush = () => {
    const forceCacheClear = Object(__WEBPACK_IMPORTED_MODULE_3__globals__["c" /* getScopeVariable */])('forceCacheClear');
    // flush away soiled modules
    Object(__WEBPACK_IMPORTED_MODULE_1__wipeCache__["a" /* default */])(mockScope.mockedModules);
    mockScope.mockedModules = {};
    if(forceCacheClear) {
      if (forceCacheClear !== 'nocache') {
        // restore cache completely
        swapCache();
      }
    } else {
        // merge caches
        restoreCache();
    }
};

/**
 * Low-level require
 * @param {String} fileName
 */
mockModule.requireActual = (fileName) => __WEBPACK_IMPORTED_MODULE_0__module__["a" /* default */].require(__WEBPACK_IMPORTED_MODULE_0__module__["a" /* default */].relativeFileName(fileName, parentModule), parentModule);

/**
 * Low-level import
 * @param {String} fileName
 */
mockModule.importActual = (fileName) => Promise.resolve(this.requireActual(fileName));


/**
 * flushes anything
 */
mockModule.clear = () => {
    updateScope();
    scope();
    mockModule.withoutIsolation();
    mockModule.flush();
};

const cleanup = () => {
    delete __webpack_require__.c[/*require.resolve*/("./src/mockModule.js")];
};


const addPlugin = (plugin) => {
    scope();
    Object(__WEBPACK_IMPORTED_MODULE_4__plugins__["b" /* addPlugin */])(plugin);
};

const removePlugin = (plugin) => {
    scope();
    Object(__WEBPACK_IMPORTED_MODULE_4__plugins__["g" /* removePlugin */])(plugin);
};

mockModule.addPlugin = (plugin) => {
    addPlugin(plugin);
    return mockModule;
};



/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__("./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/mocks.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return insertMock; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return getMock; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getAsyncMock; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getAllAsyncMocks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getAllMocks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return resetMock; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_path__ = __webpack_require__("./node_modules/path-browserify/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_path_parse__ = __webpack_require__("./node_modules/path-parse/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_path_parse___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_path_parse__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__globals__ = __webpack_require__("./src/globals.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common__ = __webpack_require__("./src/_common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__module__ = __webpack_require__("./src/module.js");






const genMock = (name) => {
  return {
    name,
    value: {}
  };
};

const insertMock = (name, mock) => Object(__WEBPACK_IMPORTED_MODULE_2__globals__["b" /* default */])().mocks[name] = mock;
const resetMock = (name) => insertMock(name, genMock(name));

const pickFrom = (mocks, name) => {
  const ext = __WEBPACK_IMPORTED_MODULE_3__common__["a" /* extensions */].find(ext => mocks[name + ext]);
  if (ext !== undefined) {
    return mocks[name + ext]
  }
};

const getMock = (name, scope = Object(__WEBPACK_IMPORTED_MODULE_2__globals__["b" /* default */])()) => {
  const {mocks} = scope;
  const fn = __WEBPACK_IMPORTED_MODULE_1_path_parse___default()(name);
  const shortName = Object(__WEBPACK_IMPORTED_MODULE_0_path__["join"])(fn.dir, fn.name);
  const wshortName = fn.dir + '/' + fn.name;
  const indexName = fn.name === 'index' ? fn.dir : null;

  const mock =
    pickFrom(mocks, name) || (indexName && pickFrom(mocks, indexName)) ||
    pickFrom(mocks, shortName) || pickFrom(mocks, wshortName);


  if (!mock && scope.parentScope) {
    return getMock(name, scope.parentScope);
  }
  return mock;
};

const getAsyncModuleName = (creator, parent) => {
  return creator.toString() + ':' + Object(__WEBPACK_IMPORTED_MODULE_4__module__["b" /* getModuleName */])(parent);
};
/* harmony export (immutable) */ __webpack_exports__["d"] = getAsyncModuleName;


const getAsyncMock = (creator, parent, scope = Object(__WEBPACK_IMPORTED_MODULE_2__globals__["b" /* default */])()) => {
  const signature = getAsyncModuleName(creator, parent);
  const mock = resetMock(signature);
  scope.asyncMocks.push({
    mock,
    creator,
    loaded: false
  });
  return mock;
};

const collectMocks = (result, selector) => {
  const collect = (scope) => {
    if (scope.parentScope) {
      collect(scope.parentScope);
    }
    const mocks = selector(scope);
    Object.keys(mocks).forEach(key => result[key] = mocks[key]);
  };
  collect(Object(__WEBPACK_IMPORTED_MODULE_2__globals__["b" /* default */])());
  return result;
};

const getAllMocks = () => {
  return collectMocks({}, scope => scope.mocks);
};

const getAllAsyncMocks = () => {
  return collectMocks([], scope => scope.asyncMocks.filter(mock => !mock.loaded)).filter(mock => !!mock);
};



/***/ }),

/***/ "./src/module.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_path__ = __webpack_require__("./node_modules/path-browserify/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__getModule__ = __webpack_require__("./src/getModule.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__executor__ = __webpack_require__("./src/executor.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__asyncModules__ = __webpack_require__("./src/asyncModules.js");






const originalLoader = __WEBPACK_IMPORTED_MODULE_1__getModule__["a" /* default */]._load;
/* harmony export (immutable) */ __webpack_exports__["f"] = originalLoader;


const NodeModule = {
  overloadRequire() {
    __WEBPACK_IMPORTED_MODULE_1__getModule__["a" /* default */]._load = __WEBPACK_IMPORTED_MODULE_2__executor__["a" /* default */];
    // overload modules by internally
  },

  restoreRequire() {
    __WEBPACK_IMPORTED_MODULE_1__getModule__["a" /* default */]._load = originalLoader;
  },

  probeAsyncModules() {
    const load = __WEBPACK_IMPORTED_MODULE_1__getModule__["a" /* default */]._load;
    __WEBPACK_IMPORTED_MODULE_1__getModule__["a" /* default */]._load = __WEBPACK_IMPORTED_MODULE_3__asyncModules__["a" /* default */].load(this);
    return __WEBPACK_IMPORTED_MODULE_3__asyncModules__["a" /* default */]
      .execute()
      .then(() => {
        __WEBPACK_IMPORTED_MODULE_1__getModule__["a" /* default */]._load = load;
      })
  },

  _resolveFilename(fileName, module) {
    return __WEBPACK_IMPORTED_MODULE_1__getModule__["a" /* default */]._resolveFilename(fileName, module);
  },

  get _cache() {
    return __WEBPACK_IMPORTED_MODULE_1__getModule__["a" /* default */]._cache;
  },

  relativeFileName(name, parent) {
    if (name[0] == '.') {
      return this._resolveFilename(name, parent);
    }
    return name;
  },

  require(name, parentModule) {
    return Object(__WEBPACK_IMPORTED_MODULE_2__executor__["b" /* requireModule */])(name, parentModule);
  }
};

const toModule = (name) => name && __webpack_require__.c[name];

const pickModuleName = (fileName, parent) => {
  if (true) {
    const targetFile = Object(__WEBPACK_IMPORTED_MODULE_0_path__["resolve"])(Object(__WEBPACK_IMPORTED_MODULE_0_path__["dirname"])(getModuleName(parent)), fileName);
    return Object
      .keys(__webpack_require__.m)
      .find(name => name.indexOf(targetFile) > 0);
  } else {
    return fileName;
  }
};
/* harmony export (immutable) */ __webpack_exports__["g"] = pickModuleName;


const moduleCompare = (a, b) => a === b || getModuleName(a) === getModuleName(b);
/* harmony export (immutable) */ __webpack_exports__["e"] = moduleCompare;


const getModuleName = (module) => module.filename || module.i;
/* harmony export (immutable) */ __webpack_exports__["b"] = getModuleName;

const getModuleParent = (module) => module && (module.parent || toModule(module.parents && module.parents[0]));
/* harmony export (immutable) */ __webpack_exports__["c"] = getModuleParent;

const getModuleParents = (module) => module && (module.parent ? [getModuleName(module.parent)] : module.parents);
/* unused harmony export getModuleParents */


const inParents = (a, b) => {
  const B = getModuleName(b)
  return !!getModuleParents(a).find(x => x === B);
}
/* harmony export (immutable) */ __webpack_exports__["d"] = inParents;


/* harmony default export */ __webpack_exports__["a"] = (NodeModule);



/***/ }),

/***/ "./src/plugins.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return convertName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return shouldWipe; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return shouldMock; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return onMockCreate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return onDisable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return onEnable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return addPlugin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return removePlugin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _clearPlugins; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__globals__ = __webpack_require__("./src/globals.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__plugins_common__ = __webpack_require__("./src/plugins/_common.js");



const plugins = () => {
  const result = [];
  const collect = (scope) => {
    result.push(...scope.plugins);
    if (scope.parentScope) {
      collect(scope.parentScope);
    }
  };
  collect(Object(__WEBPACK_IMPORTED_MODULE_0__globals__["b" /* default */])());
  return result;
};

const convertName = (fileName, parentModule) => {
  const resultName = plugins().reduce(
    (name, plugin) => {
      if (plugin.fileNameTransformer) {
        return plugin.fileNameTransformer(name, parentModule) || name
      }
      return name;
    }, fileName);

  if (true) {
    if (resultName[0] !== '.') {
      return '.' + resultName;
    }
  }
  return resultName;
};

const triResult = (values, defaultValue) => {
  if (values.indexOf(__WEBPACK_IMPORTED_MODULE_1__plugins_common__["a" /* NO */]) >= 0) {
    return false;
  }
  if (values.indexOf(__WEBPACK_IMPORTED_MODULE_1__plugins_common__["c" /* YES */]) >= 0) {
    return true;
  }
  return defaultValue;
};

const shouldMock = (mock, request, parent, topModule) => (
  mock.disabled
    ? false
    : triResult(plugins().map(
    plugin =>
      plugin.shouldMock ? plugin.shouldMock(mock, request, parent, topModule) : __WEBPACK_IMPORTED_MODULE_1__plugins_common__["b" /* PASS */]
  ), true)
);

const shouldWipe = (stubs, moduleName) => (
  triResult(plugins().map(
    plugin =>
      plugin.wipeCheck ? plugin.wipeCheck(stubs, moduleName) : __WEBPACK_IMPORTED_MODULE_1__plugins_common__["b" /* PASS */]
  ), false)
);

const onMockCreate = (mock) => (
  plugins().reduce(
    (mock, plugin) => {
      if (plugin.onMockCreate) {
        return plugin.onMockCreate(mock) || mock
      }
      return mock;
    }, mock)
);

const onDisable = (mocks) => {
  const plugs = plugins();
  Object.keys(mocks).forEach(mockName => {
    const mock = mocks[mockName];
    plugs.forEach(plugin => plugin.onDisable && plugin.onDisable(mock._parent))
  });
};

const onEnable = (mocks) => {
  const plugs = plugins();
  Object.keys(mocks).forEach(mockName => {
    const mock = mocks[mockName];
    plugs.forEach(plugin => plugin.onEnable && plugin.onEnable(mock._parent))
  });
};

const addPlugin = (plugin) => {
  Object(__WEBPACK_IMPORTED_MODULE_0__globals__["b" /* default */])().plugins.push(plugin);
};

const removePlugin = (plugin) => {
  Object(__WEBPACK_IMPORTED_MODULE_0__globals__["b" /* default */])().plugins = Object(__WEBPACK_IMPORTED_MODULE_0__globals__["b" /* default */])().plugins.filter(plug => (plug !== plugin));
};

const _clearPlugins = () => {
  Object(__WEBPACK_IMPORTED_MODULE_0__globals__["b" /* default */])().plugins = []
};



/***/ }),

/***/ "./src/plugins/_common.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return standardWipeCheck; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return YES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NO; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return PASS; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__("./src/_common.js");


const YES = 'yes';
const NO = 'no';
const PASS = true;

const onetoone = a => a;
const pass = () => PASS;



const createPlugin = (plugin) => {
    const result = Object.assign({
        fileNameTransformer: onetoone,
        wipeCheck: pass,
        shouldMock: pass,
    }, plugin);
    return result;
}

const standardWipeCheck = (stubs, moduleName) => {
    if (__WEBPACK_IMPORTED_MODULE_0__common__["a" /* extensions */].find(ext => stubs[moduleName + ext]) !== undefined) {
        return YES;
    }
};



/* harmony default export */ __webpack_exports__["d"] = (createPlugin);

/***/ }),

/***/ "./src/plugins/childOnly.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__("./src/plugins/_common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__module__ = __webpack_require__("./src/module.js");



const shouldMock = (mock, request, parent, topModule) => {
  return Object(__WEBPACK_IMPORTED_MODULE_1__module__["d" /* inParents */])(parent, topModule) ? __WEBPACK_IMPORTED_MODULE_0__common__["b" /* PASS */] : __WEBPACK_IMPORTED_MODULE_0__common__["a" /* NO */];
};

const plugin = Object(__WEBPACK_IMPORTED_MODULE_0__common__["d" /* default */])({
  shouldMock,

  name: 'childOnly'
});

/* harmony default export */ __webpack_exports__["a"] = (plugin);

/***/ }),

/***/ "./src/plugins/common recursive":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./src/plugins/common recursive";

/***/ }),

/***/ "./src/plugins/common/aliases.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return readAliases; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return processFile; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_path__ = __webpack_require__("./node_modules/path-browserify/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_template__ = __webpack_require__("./node_modules/lodash.template/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_template___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_template__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_some__ = __webpack_require__("./node_modules/lodash.some/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_some___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash_some__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__executor__ = __webpack_require__("./src/executor.js");





const FS_MODULE_NAME = 'fs';
const DEFAULT_CONFIG_NAMES = ['webpack.config.js', 'webpack.config.babel.js'];

// most of this file is a copypaste from https://github.com/trayio/babel-plugin-webpack-alias/blob/master/src/index.js
// just cos we emulate its behavior

function fileExists(path) {
  if (true) {
    return __webpack_require__.m['.' + path] && '.' + path;
  }
  try {
    const fs = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }());
    return !fs.accessSync(path, fs.F_OK) && path;
  } catch (e) {
    return false;
  }
}

function getConfigPath(configPaths) {
  let conf = null;

  // Try all config paths and return for the first found one
  __WEBPACK_IMPORTED_MODULE_2_lodash_some___default()(configPaths, configPath => {
    if (!configPath) return;

    // Compile config using environment variables
    const compiledConfigPath = __WEBPACK_IMPORTED_MODULE_1_lodash_template___default()(configPath)(process.env);

    let resolvedConfigPath = Object(__WEBPACK_IMPORTED_MODULE_0_path__["resolve"])(process.cwd(), compiledConfigPath);
    const resolvedName = fileExists(resolvedConfigPath);

    if (resolvedConfigPath && resolvedName) {
      conf = resolvedName;
    }

    return conf;
  });

  return conf;
}

function readAliases(configPath) {
  const configPaths = configPath ? [configPath, ...DEFAULT_CONFIG_NAMES] : DEFAULT_CONFIG_NAMES;

  // Get webpack config
  const confPath = getConfigPath(configPaths);

  // If the config comes back as null, we didn't find it, so throw an exception.
  if (!confPath) {
    throw new Error(`Cannot find any of these configuration files: ${configPaths.join(', ')}`);
  }

  // Require the config
  let conf = Object(__WEBPACK_IMPORTED_MODULE_3__executor__["b" /* requireModule */])(confPath);

  if (conf && conf.__esModule && conf.default) {
    conf = conf.default;
  }

  // exit if there's no alias config and the config is not an array
  if (!(conf.resolve && conf.resolve.alias) && !Array.isArray(conf)) {
    throw new Error('The resolved config file doesn\'t contain a resolve configuration');
  }

  // Get the webpack alias config
  let aliasConf;
  let extensionsConf;

  if (Array.isArray(conf)) {
    // the exported webpack config is an array ...
    // (i.e., the project is using webpack's multicompile feature) ...

    // reduce the configs to a single alias object
    aliasConf = conf.reduce((prev, curr) => {
      const next = Object.assign({}, prev);
      if (curr.resolve && curr.resolve.alias) {
        Object.assign(next, curr.resolve.alias);
      }
      return next;
    }, {});

    // if the object is empty, bail
    if (!Object.keys(aliasConf).length) {
      return;
    }

    // reduce the configs to a single extensions array
    extensionsConf = conf.reduce((prev, curr) => {
      const next = [].concat(prev);
      if (curr.resolve && curr.resolve.extensions && curr.resolve.extensions.length) {
        curr.resolve.extensions.forEach(ext => {
          if (next.indexOf(ext) === -1) {
            next.push(ext);
          }
        });
      }
      return next;
    }, []);

    if (!extensionsConf.length) {
      extensionsConf = null;
    }
  } else {
    // the exported webpack config is a single object...

    // use it's resolve.alias property
    aliasConf = conf.resolve.alias;

    // use it's resolve.extensions property, if available
    extensionsConf =
      (conf.resolve.extensions && conf.resolve.extensions.length) ?
        conf.resolve.extensions :
        null;
  }

  if (true)
    Object
      .keys(aliasConf)
      .forEach(alias => {
        const location = aliasConf[alias];
        if (!__webpack_require__.m[location]) {
          aliasConf[alias] = '.' + Object(__WEBPACK_IMPORTED_MODULE_0_path__["resolve"])(Object(__WEBPACK_IMPORTED_MODULE_0_path__["dirname"])(confPath), '.' + location);
        }
      });

  return {
    aliasConf,
    extensionsConf
  }
}

function processFile(filePath, {aliasConf, extensionsConf}) {
  for (const aliasFrom in aliasConf) {
    if (aliasConf.hasOwnProperty(aliasFrom)) {

      let aliasTo = aliasConf[aliasFrom];
      const regex = new RegExp(`^${aliasFrom}(\/|$)`);

      // If the regex matches, replace by the right config
      if (regex.test(filePath)) {

        // notModuleRegExp from https://github.com/webpack/enhanced-resolve/blob/master/lib/Resolver.js
        const notModuleRegExp = /^\.$|^\.[\\\/]|^\.\.$|^\.\.[\/\\]|^\/|^[A-Z]:[\\\/]/i;
        const isModule = !notModuleRegExp.test(aliasTo);

        if (isModule) {
          return aliasTo;
        }

        // If the filepath is not absolute, make it absolute
        if (!Object(__WEBPACK_IMPORTED_MODULE_0_path__["isAbsolute"])(aliasTo)) {
          aliasTo = Object(__WEBPACK_IMPORTED_MODULE_0_path__["join"])(process.cwd(), aliasTo);
        }
        let relativeFilePath = Object(__WEBPACK_IMPORTED_MODULE_0_path__["resolve"])(Object(__WEBPACK_IMPORTED_MODULE_0_path__["dirname"])(filePath), aliasTo).split(__WEBPACK_IMPORTED_MODULE_0_path__["sep"]).join('/');

        // In case the file path is the root of the alias, need to put a dot to avoid having an absolute path
        if (relativeFilePath.length === 0) {
          relativeFilePath = '.';
        }

        let requiredFilePath = filePath.replace(aliasFrom, relativeFilePath);

        // In the unfortunate case of a file requiring the current directory which is the alias, we need to add
        // an extra slash
        if (requiredFilePath === '.') {
          requiredFilePath = './';
        }

        // In the case of a file requiring a child directory of the current directory, we need to add a dot slash
        if (['.', '/'].indexOf(requiredFilePath[0]) === -1) {
          requiredFilePath = `./${requiredFilePath}`;
        }

        // In case the extension option is passed
        if (extensionsConf) {
          // Get an absolute path to the file
          const absoluteRequire = Object(__WEBPACK_IMPORTED_MODULE_0_path__["join"])(aliasTo, Object(__WEBPACK_IMPORTED_MODULE_0_path__["basename"])(filePath));

          let extension = null;
          __WEBPACK_IMPORTED_MODULE_2_lodash_some___default()(extensionsConf, ext => {
            if (!ext) return;

            // If the file with this extension exists set it
            if (fileExists(absoluteRequire + ext)) {
              extension = ext;
            }

            return extension;
          });

          // Set the extension to the file path, or keep the original one
          requiredFilePath += extension || '';
        }

        return requiredFilePath;
      }
    }
  }
}


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/plugins/directChild.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__("./src/plugins/_common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__globals__ = __webpack_require__("./src/globals.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__module__ = __webpack_require__("./src/module.js");





const shouldMock = (mock, request, parent, topModule) => {
  if (mock.flag_directChildOnly) {
    return Object(__WEBPACK_IMPORTED_MODULE_2__module__["d" /* inParents */])(parent, topModule) ? __WEBPACK_IMPORTED_MODULE_0__common__["b" /* PASS */] : __WEBPACK_IMPORTED_MODULE_0__common__["a" /* NO */];
  }
  if (mock.flag_toBeCalledFromMock) {
    const {mockedModules} = Object(__WEBPACK_IMPORTED_MODULE_1__globals__["b" /* default */])();
    return Object(__WEBPACK_IMPORTED_MODULE_2__module__["b" /* getModuleName */])(parent) in mockedModules ? __WEBPACK_IMPORTED_MODULE_0__common__["b" /* PASS */] : __WEBPACK_IMPORTED_MODULE_0__common__["a" /* NO */];
  }
};

const plugin = Object(__WEBPACK_IMPORTED_MODULE_0__common__["d" /* default */])({
  shouldMock,

  name: 'directChild'
});

/* harmony default export */ __webpack_exports__["a"] = (plugin);

/***/ }),

/***/ "./src/plugins/disabledByDefault.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__("./src/plugins/_common.js");


const onMockCreate = (mock) => {
    mock.disable();
    return mock;
};

const plugin = Object(__WEBPACK_IMPORTED_MODULE_0__common__["d" /* default */])({
    onMockCreate,
    onDisable: onMockCreate,

    name: 'disabledByDefault'
});

/* harmony default export */ __webpack_exports__["a"] = (plugin);

/***/ }),

/***/ "./src/plugins/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__childOnly__ = __webpack_require__("./src/plugins/childOnly.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__nodejs__ = __webpack_require__("./src/plugins/nodejs.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__protectNodeModules__ = __webpack_require__("./src/plugins/protectNodeModules.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__relative__ = __webpack_require__("./src/plugins/relative.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__webpack_alias__ = __webpack_require__("./src/plugins/webpack-alias.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__toBeUsed__ = __webpack_require__("./src/plugins/toBeUsed.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__directChild__ = __webpack_require__("./src/plugins/directChild.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__disabledByDefault__ = __webpack_require__("./src/plugins/disabledByDefault.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__usedByDefault__ = __webpack_require__("./src/plugins/usedByDefault.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__toMatchOrigin__ = __webpack_require__("./src/plugins/toMatchOrigin.js");












const exports = {
    childOnly: __WEBPACK_IMPORTED_MODULE_0__childOnly__["a" /* default */],
    nodejs: __WEBPACK_IMPORTED_MODULE_1__nodejs__["a" /* default */],
    protectNodeModules: __WEBPACK_IMPORTED_MODULE_2__protectNodeModules__["a" /* default */],
    relative: __WEBPACK_IMPORTED_MODULE_3__relative__["a" /* default */],
    webpackAlias: __WEBPACK_IMPORTED_MODULE_4__webpack_alias__["b" /* default */],
    toBeUsed: __WEBPACK_IMPORTED_MODULE_5__toBeUsed__["a" /* default */],

    disabledByDefault: __WEBPACK_IMPORTED_MODULE_7__disabledByDefault__["a" /* default */],
    alwaysMatchOrigin: __WEBPACK_IMPORTED_MODULE_9__toMatchOrigin__["a" /* default */],
    usedByDefault: __WEBPACK_IMPORTED_MODULE_8__usedByDefault__["a" /* default */],
    directChild: __WEBPACK_IMPORTED_MODULE_6__directChild__["a" /* default */]
};

/* harmony default export */ __webpack_exports__["a"] = (exports);

/***/ }),

/***/ "./src/plugins/nodejs.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__module__ = __webpack_require__("./src/module.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common__ = __webpack_require__("./src/plugins/_common.js");



const fileNameTransformer = (fileName, module) => __WEBPACK_IMPORTED_MODULE_0__module__["a" /* default */]._resolveFilename(fileName, module);
const wipeCheck = (stubs, moduleName) => Object(__WEBPACK_IMPORTED_MODULE_1__common__["e" /* standardWipeCheck */])(stubs, moduleName);

const plugin = Object(__WEBPACK_IMPORTED_MODULE_1__common__["d" /* default */])({
    fileNameTransformer,
    wipeCheck,

    name: 'nodejs'
});

/* harmony default export */ __webpack_exports__["a"] = (plugin);

/***/ }),

/***/ "./src/plugins/protectNodeModules.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__("./src/plugins/_common.js");


const wipeCheck = (stubs, moduleName) => {
    if (moduleName.indexOf('/node_modules/') > -1) {
        return __WEBPACK_IMPORTED_MODULE_0__common__["a" /* NO */];
    }
};

const plugin = Object(__WEBPACK_IMPORTED_MODULE_0__common__["d" /* default */])({
    wipeCheck,

    name: 'protectNodeModules'
});

/* harmony default export */ __webpack_exports__["a"] = (plugin);

/***/ }),

/***/ "./src/plugins/relative.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__("./src/plugins/_common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__module__ = __webpack_require__("./src/module.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common__ = __webpack_require__("./src/_common.js");




const trimKey = (key) => key[0] == '.' ? trimKey(key.substr(1)) : key;

const relativeWipeCheck = (stubs, moduleName) => {
  if (Object
      .keys(stubs)
      .find(key =>
        __WEBPACK_IMPORTED_MODULE_2__common__["a" /* extensions */].find( ext => moduleName.endsWith(trimKey(key+ext)))
      )
  ) {
    return __WEBPACK_IMPORTED_MODULE_0__common__["c" /* YES */];
  }
};
/* harmony export (immutable) */ __webpack_exports__["b"] = relativeWipeCheck;


const fileNameTransformer = (fileName/*, module*/) => fileName;
//const wipeCheck = (stubs, moduleName) => relativeWipeCheck(stubs, moduleName);

const shouldMock = (mock, request, parent, topModule) => {
  return Object(__WEBPACK_IMPORTED_MODULE_1__module__["d" /* inParents */])(parent, topModule) ? __WEBPACK_IMPORTED_MODULE_0__common__["b" /* PASS */] : __WEBPACK_IMPORTED_MODULE_0__common__["a" /* NO */];
};

const plugin = Object(__WEBPACK_IMPORTED_MODULE_0__common__["d" /* default */])({
  fileNameTransformer,
  //wipeCheck,
  shouldMock,

  name: 'relative'
});

/* harmony default export */ __webpack_exports__["a"] = (plugin);

/***/ }),

/***/ "./src/plugins/toBeUsed.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__("./src/plugins/_common.js");


const onEnable = ({mock}) => {
    mock.usedAs = undefined;
};


const onDisable = ({mock}) => {
    const name = mock.name;
    if (mock.flag_toBeUsed && !mock.usedAs) {
        throw new Error(name + ' is set toBeUsed, but was unused')
    }
};

const plugin = Object(__WEBPACK_IMPORTED_MODULE_0__common__["d" /* default */])({
    onDisable,
    onEnable,

    name: 'toBeUsed'
});

/* harmony default export */ __webpack_exports__["a"] = (plugin);

/***/ }),

/***/ "./src/plugins/toMatchOrigin.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__("./src/plugins/_common.js");


const onMockCreate = (mock) => {
  mock.toMatchOrigin();
  return mock;
};

const plugin = Object(__WEBPACK_IMPORTED_MODULE_0__common__["d" /* default */])({
  onMockCreate,
  name: 'alwaysMatchOrigin'
});

/* harmony default export */ __webpack_exports__["a"] = (plugin);

/***/ }),

/***/ "./src/plugins/usedByDefault.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__("./src/plugins/_common.js");


const onMockCreate = (mock) => {
    mock.toBeUsed();
    return mock;
};

const plugin = Object(__WEBPACK_IMPORTED_MODULE_0__common__["d" /* default */])({
    onMockCreate,

    name: 'usedByDefault'
});

/* harmony default export */ __webpack_exports__["a"] = (plugin);

/***/ }),

/***/ "./src/plugins/webpack-alias.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return configure; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_aliases__ = __webpack_require__("./src/plugins/common/aliases.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common__ = __webpack_require__("./src/plugins/_common.js");



let settings = null;

const configure = (fileName) => {
    settings = Object(__WEBPACK_IMPORTED_MODULE_0__common_aliases__["b" /* readAliases */])(fileName);
};

const fileNameTransformer = (fileName) => {
    if (!settings) {
        configure();
    }
    return Object(__WEBPACK_IMPORTED_MODULE_0__common_aliases__["a" /* processFile */])(fileName, settings);
};

const wipeCheck = (stubs, moduleName) => Object(__WEBPACK_IMPORTED_MODULE_1__common__["e" /* standardWipeCheck */])(stubs, moduleName);



/* harmony default export */ __webpack_exports__["b"] = (Object(__WEBPACK_IMPORTED_MODULE_1__common__["d" /* default */])({
    fileNameTransformer,
    wipeCheck,

    name: 'webpack-alias'
}));



/***/ }),

/***/ "./src/scope.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
const createScope = (parentScope, parentModule) => ({
    parentScope,
    parentModule: parentModule || (parentScope ? parentScope.parentModule : null),

    mockedModules: {},
    mocks: {},
    asyncMocks: [],

    passBy: [],
    isolation: false,

    plugins: []
});

/* harmony default export */ __webpack_exports__["a"] = (createScope);

/***/ }),

/***/ "./src/wipeCache.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mocks__ = __webpack_require__("./src/mocks.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__plugins__ = __webpack_require__("./src/plugins.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__plugins_relative__ = __webpack_require__("./src/plugins/relative.js");




// which one?
const wipe =  true
    ? __webpack_require__("./node_modules/wipe-webpack-cache/src/index.js")
    : require('wipe-node-cache');
/* harmony export (immutable) */ __webpack_exports__["b"] = wipe;


const primaryResolver = (stubs, moduleName) =>
  stubs[moduleName];

const resolver = (stubs, moduleName) => {
  // never wipe .node(native) module
  if (moduleName.indexOf('\.node') > -1) {
    return false;
  }
  return Object(__WEBPACK_IMPORTED_MODULE_1__plugins__["i" /* shouldWipe */])(stubs, moduleName) || primaryResolver(stubs, moduleName) || Object(__WEBPACK_IMPORTED_MODULE_2__plugins_relative__["b" /* relativeWipeCheck */])(stubs, moduleName);
};

const wipeCache = (primaryCache = {}) => {
  wipe(primaryCache, primaryResolver);
  wipe(Object(__WEBPACK_IMPORTED_MODULE_0__mocks__["b" /* getAllMocks */])(), resolver);
};

/* harmony default export */ __webpack_exports__["a"] = (wipeCache);

/***/ }),

/***/ "./webpack/interceptor.js":
/***/ (function(module, exports) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
const requires = [];
let Module;

const loader = function baseLoader(request, parent, isMain) {
  return requires[requires.length - 1](request);
};


function interceptor(superRequire, parentModule) {
  function RQ(fileName) {
    interceptor.pushLoader(superRequire);
    const result = Module
      ? Module._load(fileName, parentModule)
      : loader(fileName, parentModule);

    interceptor.popLoader(superRequire);
    return result;
  }

  Object.getOwnPropertyNames(superRequire).forEach(key => {
    try {
      RQ[key] = superRequire[key]
    } catch (e) {
      // could not set length, for example
    }
  });
  return RQ;
}

interceptor.pushLoader = (loader) => {
  requires.push(loader)
};

interceptor.popLoader = (loader) => {
  requires.pop();
};

interceptor.provideModule = (_Module) => {
  Module = _Module;
}

interceptor.load = loader;


module.exports = interceptor;

/***/ }),

/***/ "./webpack/module.js":
/***/ (function(module, exports, __webpack_require__) {

/***/if(typeof __webpack_require__!=='undefined'){__webpack_require__ = __webpack_require__('./webpack/interceptor.js')(__webpack_require__, module);}
const {dirname, resolve} = __webpack_require__("./node_modules/path-browserify/index.js");
const interceptor = __webpack_require__("./webpack/interceptor.js");

const Module = {
  _load: interceptor.load,
  _resolveFilename(fileName, parent){
    const targetFile = resolve(dirname(parent.i), fileName);
    const keys = Object
      .keys(__webpack_require__.m)
      .sort((a,b) => a.length - b.length);
    const targetFileIndex = targetFile + '/index';

    const asFile = keys.find(name => name.indexOf(targetFile) > 0);
    const asIndex = keys.find(name => name.indexOf(targetFileIndex) > 0);
    if (asFile && asIndex && asFile.substr(targetFile.length+1).indexOf('/') >= 0) {
        return asIndex;
    }
    return asFile || fileName;
  },
  get _cache() {
    return __webpack_require__.c;
  }
};

interceptor.provideModule(Module);

module.exports = Module;

/***/ })

/******/ });