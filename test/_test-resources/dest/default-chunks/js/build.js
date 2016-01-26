/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**********************!*\
  !*** multi js/build ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	eval("__webpack_require__(/*! ./test/test-resources/src/vendor/v_a.js */1);\n__webpack_require__(/*! ./test/test-resources/src/vendor/v_b.js */2);\n__webpack_require__(/*! events */3);\n__webpack_require__(/*! ./test/test-resources/src/app/deps/d_a.js */4);\n__webpack_require__(/*! ./test/test-resources/src/app/a_a.js */5);\nmodule.exports = __webpack_require__(/*! ./test/test-resources/src/app/a_b.js */9);\n\n\n/*****************\n ** WEBPACK FOOTER\n ** multi js/build\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///multi_js/build?");

/***/ },
/* 1 */
/*!***********************************************!*\
  !*** ./test/test-resources/src/vendor/v_a.js ***!
  \***********************************************/
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, '__esModule', {\n  value: true\n});\nconsole.log('v_a');\n\nexports['default'] = function () {\n  console.log('v_a inner');\n};\n\nmodule.exports = exports['default'];\n\n/*****************\n ** WEBPACK FOOTER\n ** ./test/test-resources/src/vendor/v_a.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./test/test-resources/src/vendor/v_a.js?");

/***/ },
/* 2 */
/*!***********************************************!*\
  !*** ./test/test-resources/src/vendor/v_b.js ***!
  \***********************************************/
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, '__esModule', {\n  value: true\n});\nconsole.log('v_b');\n\nexports['default'] = function () {\n  console.log('v_b inner');\n};\n\nmodule.exports = exports['default'];\n\n/*****************\n ** WEBPACK FOOTER\n ** ./test/test-resources/src/vendor/v_b.js\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./test/test-resources/src/vendor/v_b.js?");

/***/ },
/* 3 */
/*!************************************************!*\
  !*** ./~/node-libs-browser/~/events/events.js ***!
  \************************************************/
/***/ function(module, exports) {

	eval("// Copyright Joyent, Inc. and other Node contributors.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\nfunction EventEmitter() {\n  this._events = this._events || {};\n  this._maxListeners = this._maxListeners || undefined;\n}\nmodule.exports = EventEmitter;\n\n// Backwards-compat with node 0.10.x\nEventEmitter.EventEmitter = EventEmitter;\n\nEventEmitter.prototype._events = undefined;\nEventEmitter.prototype._maxListeners = undefined;\n\n// By default EventEmitters will print a warning if more than 10 listeners are\n// added to it. This is a useful default which helps finding memory leaks.\nEventEmitter.defaultMaxListeners = 10;\n\n// Obviously not all Emitters should be limited to 10. This function allows\n// that to be increased. Set to zero for unlimited.\nEventEmitter.prototype.setMaxListeners = function(n) {\n  if (!isNumber(n) || n < 0 || isNaN(n))\n    throw TypeError('n must be a positive number');\n  this._maxListeners = n;\n  return this;\n};\n\nEventEmitter.prototype.emit = function(type) {\n  var er, handler, len, args, i, listeners;\n\n  if (!this._events)\n    this._events = {};\n\n  // If there is no 'error' event listener then throw.\n  if (type === 'error') {\n    if (!this._events.error ||\n        (isObject(this._events.error) && !this._events.error.length)) {\n      er = arguments[1];\n      if (er instanceof Error) {\n        throw er; // Unhandled 'error' event\n      }\n      throw TypeError('Uncaught, unspecified \"error\" event.');\n    }\n  }\n\n  handler = this._events[type];\n\n  if (isUndefined(handler))\n    return false;\n\n  if (isFunction(handler)) {\n    switch (arguments.length) {\n      // fast cases\n      case 1:\n        handler.call(this);\n        break;\n      case 2:\n        handler.call(this, arguments[1]);\n        break;\n      case 3:\n        handler.call(this, arguments[1], arguments[2]);\n        break;\n      // slower\n      default:\n        len = arguments.length;\n        args = new Array(len - 1);\n        for (i = 1; i < len; i++)\n          args[i - 1] = arguments[i];\n        handler.apply(this, args);\n    }\n  } else if (isObject(handler)) {\n    len = arguments.length;\n    args = new Array(len - 1);\n    for (i = 1; i < len; i++)\n      args[i - 1] = arguments[i];\n\n    listeners = handler.slice();\n    len = listeners.length;\n    for (i = 0; i < len; i++)\n      listeners[i].apply(this, args);\n  }\n\n  return true;\n};\n\nEventEmitter.prototype.addListener = function(type, listener) {\n  var m;\n\n  if (!isFunction(listener))\n    throw TypeError('listener must be a function');\n\n  if (!this._events)\n    this._events = {};\n\n  // To avoid recursion in the case that type === \"newListener\"! Before\n  // adding it to the listeners, first emit \"newListener\".\n  if (this._events.newListener)\n    this.emit('newListener', type,\n              isFunction(listener.listener) ?\n              listener.listener : listener);\n\n  if (!this._events[type])\n    // Optimize the case of one listener. Don't need the extra array object.\n    this._events[type] = listener;\n  else if (isObject(this._events[type]))\n    // If we've already got an array, just append.\n    this._events[type].push(listener);\n  else\n    // Adding the second element, need to change to array.\n    this._events[type] = [this._events[type], listener];\n\n  // Check for listener leak\n  if (isObject(this._events[type]) && !this._events[type].warned) {\n    var m;\n    if (!isUndefined(this._maxListeners)) {\n      m = this._maxListeners;\n    } else {\n      m = EventEmitter.defaultMaxListeners;\n    }\n\n    if (m && m > 0 && this._events[type].length > m) {\n      this._events[type].warned = true;\n      console.error('(node) warning: possible EventEmitter memory ' +\n                    'leak detected. %d listeners added. ' +\n                    'Use emitter.setMaxListeners() to increase limit.',\n                    this._events[type].length);\n      if (typeof console.trace === 'function') {\n        // not supported in IE 10\n        console.trace();\n      }\n    }\n  }\n\n  return this;\n};\n\nEventEmitter.prototype.on = EventEmitter.prototype.addListener;\n\nEventEmitter.prototype.once = function(type, listener) {\n  if (!isFunction(listener))\n    throw TypeError('listener must be a function');\n\n  var fired = false;\n\n  function g() {\n    this.removeListener(type, g);\n\n    if (!fired) {\n      fired = true;\n      listener.apply(this, arguments);\n    }\n  }\n\n  g.listener = listener;\n  this.on(type, g);\n\n  return this;\n};\n\n// emits a 'removeListener' event iff the listener was removed\nEventEmitter.prototype.removeListener = function(type, listener) {\n  var list, position, length, i;\n\n  if (!isFunction(listener))\n    throw TypeError('listener must be a function');\n\n  if (!this._events || !this._events[type])\n    return this;\n\n  list = this._events[type];\n  length = list.length;\n  position = -1;\n\n  if (list === listener ||\n      (isFunction(list.listener) && list.listener === listener)) {\n    delete this._events[type];\n    if (this._events.removeListener)\n      this.emit('removeListener', type, listener);\n\n  } else if (isObject(list)) {\n    for (i = length; i-- > 0;) {\n      if (list[i] === listener ||\n          (list[i].listener && list[i].listener === listener)) {\n        position = i;\n        break;\n      }\n    }\n\n    if (position < 0)\n      return this;\n\n    if (list.length === 1) {\n      list.length = 0;\n      delete this._events[type];\n    } else {\n      list.splice(position, 1);\n    }\n\n    if (this._events.removeListener)\n      this.emit('removeListener', type, listener);\n  }\n\n  return this;\n};\n\nEventEmitter.prototype.removeAllListeners = function(type) {\n  var key, listeners;\n\n  if (!this._events)\n    return this;\n\n  // not listening for removeListener, no need to emit\n  if (!this._events.removeListener) {\n    if (arguments.length === 0)\n      this._events = {};\n    else if (this._events[type])\n      delete this._events[type];\n    return this;\n  }\n\n  // emit removeListener for all listeners on all events\n  if (arguments.length === 0) {\n    for (key in this._events) {\n      if (key === 'removeListener') continue;\n      this.removeAllListeners(key);\n    }\n    this.removeAllListeners('removeListener');\n    this._events = {};\n    return this;\n  }\n\n  listeners = this._events[type];\n\n  if (isFunction(listeners)) {\n    this.removeListener(type, listeners);\n  } else {\n    // LIFO order\n    while (listeners.length)\n      this.removeListener(type, listeners[listeners.length - 1]);\n  }\n  delete this._events[type];\n\n  return this;\n};\n\nEventEmitter.prototype.listeners = function(type) {\n  var ret;\n  if (!this._events || !this._events[type])\n    ret = [];\n  else if (isFunction(this._events[type]))\n    ret = [this._events[type]];\n  else\n    ret = this._events[type].slice();\n  return ret;\n};\n\nEventEmitter.listenerCount = function(emitter, type) {\n  var ret;\n  if (!emitter._events || !emitter._events[type])\n    ret = 0;\n  else if (isFunction(emitter._events[type]))\n    ret = 1;\n  else\n    ret = emitter._events[type].length;\n  return ret;\n};\n\nfunction isFunction(arg) {\n  return typeof arg === 'function';\n}\n\nfunction isNumber(arg) {\n  return typeof arg === 'number';\n}\n\nfunction isObject(arg) {\n  return typeof arg === 'object' && arg !== null;\n}\n\nfunction isUndefined(arg) {\n  return arg === void 0;\n}\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/node-libs-browser/~/events/events.js\n ** module id = 3\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/node-libs-browser/~/events/events.js?");

/***/ },
/* 4 */
/*!*************************************************!*\
  !*** ./test/test-resources/src/app/deps/d_a.js ***!
  \*************************************************/
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, '__esModule', {\n  value: true\n});\nconsole.log('d_a');\n\nexports['default'] = function () {\n  console.log('d_a inner');\n};\n\nmodule.exports = exports['default'];\n\n/*****************\n ** WEBPACK FOOTER\n ** ./test/test-resources/src/app/deps/d_a.js\n ** module id = 4\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./test/test-resources/src/app/deps/d_a.js?");

/***/ },
/* 5 */
/*!********************************************!*\
  !*** ./test/test-resources/src/app/a_a.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, '__esModule', {\n  value: true\n});\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }\n\nvar _depsD_a = __webpack_require__(/*! ./deps/d_a */ 4);\n\nvar _depsD_a2 = _interopRequireDefault(_depsD_a);\n\nvar _depsD_b = __webpack_require__(/*! ./deps/d_b */ 6);\n\nvar _depsD_b2 = _interopRequireDefault(_depsD_b);\n\nvar _vendorV_b = __webpack_require__(/*! ../vendor/v_b */ 2);\n\nvar _vendorV_b2 = _interopRequireDefault(_vendorV_b);\n\nvar _a_c = __webpack_require__(/*! ./a_c */ 8);\n\nvar _a_c2 = _interopRequireDefault(_a_c);\n\nconsole.log('a_a');\n\n(0, _depsD_a2['default'])();\n(0, _depsD_b2['default'])();\n(0, _vendorV_b2['default'])();\n\nexports['default'] = function () {\n  console.log('a_a inner');\n};\n\nmodule.exports = exports['default'];\n\n/*****************\n ** WEBPACK FOOTER\n ** ./test/test-resources/src/app/a_a.js\n ** module id = 5\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./test/test-resources/src/app/a_a.js?");

/***/ },
/* 6 */
/*!*************************************************!*\
  !*** ./test/test-resources/src/app/deps/d_b.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, '__esModule', {\n  value: true\n});\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }\n\nvar _d_f = __webpack_require__(/*! ./d_f */ 7);\n\nvar _d_f2 = _interopRequireDefault(_d_f);\n\nconsole.log('d_b');\n\nexports['default'] = function () {\n  console.log('d_b inner');\n};\n\nmodule.exports = exports['default'];\n\n/*****************\n ** WEBPACK FOOTER\n ** ./test/test-resources/src/app/deps/d_b.js\n ** module id = 6\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./test/test-resources/src/app/deps/d_b.js?");

/***/ },
/* 7 */
/*!*************************************************!*\
  !*** ./test/test-resources/src/app/deps/d_f.js ***!
  \*************************************************/
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, '__esModule', {\n  value: true\n});\nconsole.log('d_f');\n\nexports['default'] = function () {\n  console.log('d_f inner');\n};\n\nmodule.exports = exports['default'];\n\n/*****************\n ** WEBPACK FOOTER\n ** ./test/test-resources/src/app/deps/d_f.js\n ** module id = 7\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./test/test-resources/src/app/deps/d_f.js?");

/***/ },
/* 8 */
/*!********************************************!*\
  !*** ./test/test-resources/src/app/a_c.js ***!
  \********************************************/
/***/ function(module, exports) {

	eval("'use strict';\n\nconsole.log('a_c');\n\n/*****************\n ** WEBPACK FOOTER\n ** ./test/test-resources/src/app/a_c.js\n ** module id = 8\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./test/test-resources/src/app/a_c.js?");

/***/ },
/* 9 */
/*!********************************************!*\
  !*** ./test/test-resources/src/app/a_b.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, '__esModule', {\n  value: true\n});\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }\n\nvar _depsD_b = __webpack_require__(/*! ./deps/d_b */ 6);\n\nvar _depsD_b2 = _interopRequireDefault(_depsD_b);\n\nvar _vendorV_a = __webpack_require__(/*! ../vendor/v_a */ 1);\n\nvar _vendorV_a2 = _interopRequireDefault(_vendorV_a);\n\nconsole.log('a_b');\n\nexports['default'] = function () {\n  console.log('a_b inner');\n};\n\nmodule.exports = exports['default'];\n\n/*****************\n ** WEBPACK FOOTER\n ** ./test/test-resources/src/app/a_b.js\n ** module id = 9\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./test/test-resources/src/app/a_b.js?");

/***/ }
/******/ ]);