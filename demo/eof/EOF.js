var EOF =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Parser = __webpack_require__(1);
	
	var _Parser2 = _interopRequireDefault(_Parser);
	
	var _DataProxy = __webpack_require__(3);
	
	var _DataProxy2 = _interopRequireDefault(_DataProxy);
	
	var _utils = __webpack_require__(2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var EOF = function () {
	  /**
	   * @param {String} elmId
	   * @param {Object} data
	   */
	
	  function EOF(elmId, data) {
	    _classCallCheck(this, EOF);
	
	    this.version = '0.0.2';
	
	    this._doc = document.currentScript.ownerDocument;
	    this._tpl = this._doc.querySelector('#' + elmId);
	    this.data = data;
	    this.name = elmId;
	    this._dataKey;
	
	    this._init();
	  }
	
	  _createClass(EOF, [{
	    key: '_init',
	    value: function _init() {
	      var self = this;
	      var tpl = this._tpl;
	      var tplParser = new _Parser2.default(tpl, this.data);
	      var result = tplParser.parse();
	      var tplContent = result.tplContent;
	      this._dataKey = result.dataKey;
	
	      if (!tpl) {
	        throw new Error('Can\'t find template Node: ' + this.name);
	      }
	
	      var proto = Object.create(HTMLElement.prototype, {
	        createdCallback: {
	          value: function value() {
	            var clone = document.importNode(tplContent, true);
	
	            // `this` is new Element, diff from `this` of EOF class
	            var shadowRoot = this.createShadowRoot();
	
	            shadowRoot.appendChild(clone);
	            self._setDataProxy(shadowRoot);
	          }
	        }
	      });
	
	      document.registerElement(this.name, { prototype: proto });
	    }
	  }, {
	    key: '_setDataProxy',
	    value: function _setDataProxy(doc) {
	      var _this = this;
	
	      var handleSet = function handleSet(target, key, value, receiver) {
	        var idList = void 0,
	            oldDataType = void 0;
	        var newDataType = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	
	        if (_this._dataKey.hasOwnProperty(key)) {
	          idList = _this._dataKey[key];
	          oldDataType = _typeof(_this.data[key]);
	        } else {
	          for (var k in _this.data) {
	            if ((0, _utils.isObjEqual)(target, _this.data[k])) {
	              idList = _this._dataKey[k][key];
	              oldDataType = _typeof(_this.data[k][key]);
	            }
	          }
	        }
	        var elms = [];
	
	        // if (this.data[key] === value) {
	        if (0) {
	          return;
	        } else if (oldDataType !== newDataType) {
	          throw new Error('Can\'t change data type from ' + oldDataType + ' to ' + newDataType);
	        }
	
	        console.log('set ' + key);
	
	        for (var i = idList.length; i--;) {
	          var id = idList[i]['id'];
	          var allElms = doc.querySelectorAll('[data-bind-id="' + id + '"]');
	
	          for (var j = allElms.length; j--;) {
	            var elmInfo = {
	              elm: allElms[j],
	              type: idList[i]['type'],
	              attr: idList[i]['attr']
	            };
	
	            elms.push(elmInfo);
	          }
	        }
	
	        for (var _i = elms.length; _i--;) {
	          var elm = elms[_i]['elm'];
	          var type = elms[_i]['type'];
	          var attr = elms[_i]['attr'];
	
	          if (type === 'attr') {
	            elm.setAttribute(attr, value);
	          } else {
	            elm.textContent = value;
	          }
	        }
	
	        return Reflect.set(target, key, value, receiver);
	      };
	
	      var handleDefine = function handleDefine(target, key, value, receiver) {
	        console.log('define ' + key + ' = ' + value + ', receiver is ' + receiver);
	      };
	
	      var dataProxy = new _DataProxy2.default(this.data, {
	        set: handleSet
	        // defineProperty: handleDefine     
	      });
	
	      this.data = dataProxy.setup();
	    }
	  }]);
	
	  return EOF;
	}();
	
	exports.default = EOF;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _utils = __webpack_require__(2);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var parser = function () {
	  function parser(tpl, data) {
	    _classCallCheck(this, parser);
	
	    this._data = data;
	    this._tpl = tpl;
	    this._dataKey = (0, _utils.objTree)();
	  }
	
	  _createClass(parser, [{
	    key: 'parse',
	    value: function parse() {
	      var tplStr = this._tpl.innerHTML;
	      var attrPattern = /\w*="{{[\s\w\.\-]*}}"/g;
	      var textPattern = /[^"]{{[\s\w\.\-]*}}/g;
	      var attrMatch = tplStr.match(attrPattern);
	      var textMatch = tplStr.match(textPattern);
	      attrMatch = (0, _utils.arrUnique)(attrMatch);
	      textMatch = (0, _utils.arrUnique)(textMatch);
	
	      // replace order cannot change! replace attr first.
	
	      /**
	       * TODO:
	       * multi element has same attr bind
	       * remove same item in array
	       * replace them with same data-bind-key 
	       */
	      for (var i = 0; i < attrMatch.length; i++) {
	        var replace = this._replaceVar('attr', tplStr, attrMatch[i]);
	        tplStr = replace.htmlStr;
	
	        var dataKeyItem = {
	          id: replace.elmId,
	          type: 'attr',
	          attr: replace.elmAttr
	        };
	
	        this._setDataKey(replace.key, dataKeyItem);
	      }
	
	      for (var _i = 0; _i < textMatch.length; _i++) {
	        var _replace = this._replaceVar('text', tplStr, textMatch[_i]);
	        tplStr = _replace.htmlStr;
	
	        var _dataKeyItem = {
	          id: _replace.elmId,
	          type: 'text',
	          attr: null
	        };
	
	        this._setDataKey(_replace.key, _dataKeyItem);
	      }
	
	      this._tpl.innerHTML = tplStr;
	
	      return {
	        tplContent: this._tpl.content,
	        dataKey: (0, _utils.removeObjProxy)(this._dataKey)
	      };
	    }
	
	    /**
	     * @param {String} replaceType: attr or text
	     * @param {String} htmlStr: template innerHTML
	     * @param {String} item: replace pattern {{ variable }}
	     * @return {String} htmlStr
	     */
	
	  }, {
	    key: '_replaceVar',
	    value: function _replaceVar(replaceType, htmlStr, item) {
	      var randKey = String(Math.random()).slice(2);
	      var variable = item.match(/{{([\s\w\.\-]*)}}/)[1];
	      variable = variable.trim();
	
	      var value = (0, _utils.getValFromExp)(this._data, variable);
	      var pattern = new RegExp(item, 'g');
	      var attr = null;
	      var replaceMent = void 0;
	
	      if (replaceType === 'attr') {
	        /**
	         * before: <input value="{{ abc }}">
	         * after: <input value="xxx" data-bind-key="xyz">
	         * replace [[ {{ abc }} ]] with [[ xxx" data-bind-key="xyz ]]
	         * so data-bind-key just has singal quotation marks
	         */
	        var bindFlag = 'data-bind-id="' + randKey;
	        replaceMent = item.replace(/{{[\s\w\.\-]*}}/, value + '" ' + bindFlag);
	        attr = item.match(/(\w*)=.*/)[1];
	      } else {
	        /**
	         * before: <p>hello {{ name }}</p>
	         * after: <p>hello <span data-bind-key="xxx"> xyz </span></p>
	         */
	        var bindFlagStart = '<span data-bind-id="' + randKey + '">';
	        var bindFlagEnd = '</span>';
	        replaceMent = '' + bindFlagStart + value + bindFlagEnd;
	      }
	
	      htmlStr = htmlStr.replace(pattern, replaceMent);
	
	      return {
	        htmlStr: htmlStr,
	        key: variable,
	        elmId: randKey,
	        elmAttr: attr
	      };
	    }
	  }, {
	    key: '_setDataKey',
	    value: function _setDataKey(key, value) {
	      var val = value; // ???
	      if (key.indexOf('.') === -1) {
	        if (this._dataKey.hasOwnProperty(key)) {
	          this._dataKey[key].push(value);
	        } else {
	          this._dataKey[key] = [value];
	        }
	      } else {
	        // console.log(value)   // undefined????
	
	        var keyArr = key.split('.');
	        var keyLen = keyArr.length;
	        var codeStr = 'this._dataKey';
	        var obj = this._dataKey;
	        var hasKey = true;
	        var _value = JSON.stringify(val);
	
	        for (var i = 0; i < keyLen; i++) {
	          codeStr += '["' + keyArr[i] + '"]';
	          if (obj.hasOwnProperty(keyArr[i])) {
	            obj = obj[keyArr[i]];
	          } else {
	            hasKey = false;
	          }
	        }
	
	        if (!hasKey) {
	          eval(codeStr + ' = []');
	        }
	
	        eval(codeStr + '.push(' + _value + ')');
	      }
	    }
	  }]);
	
	  return parser;
	}();
	
	exports.default = parser;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.arrUnique = arrUnique;
	exports.getValFromExp = getValFromExp;
	exports.objTree = objTree;
	exports.removeObjProxy = removeObjProxy;
	exports.isObjEqual = isObjEqual;
	function arrUnique(arr) {
	  var obj = {};
	
	  for (var i = arr.length; i--;) {
	    arr[i] = arr[i].trim();
	    obj[arr[i]] = null;
	  }
	
	  return Object.keys(obj);
	}
	
	function getValFromExp(obj, exp) {
	  if (exp.indexOf('.') === -1) {
	    return obj[exp] ? obj[exp] : '';
	  } else {
	    var expArr = exp.split('.');
	    for (var i = 0; i < expArr.length; i++) {
	      obj = obj[expArr[i]];
	    }
	
	    return obj;
	  }
	}
	
	function objTree() {
	  var target = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  var handler = {
	    get: function get(target, key, receiver) {
	      if (!(key in target)) {
	        target[key] = objTree();
	      }
	
	      return Reflect.get(target, key, receiver);
	    }
	  };
	
	  return new Proxy(target, handler);
	}
	
	function removeObjProxy(obj) {
	  var clone = {};
	
	  for (var key in obj) {
	    if (key !== 'splice') {
	      if (obj[key].toString() === "[object Object]") {
	        clone[key] = removeObjProxy(obj[key]);
	      } else {
	        clone[key] = obj[key];
	      }
	    }
	  }
	
	  return clone;
	}
	
	function isObjEqual(a, b) {
	  // Create arrays of property names
	  var aProps = Object.getOwnPropertyNames(a);
	  var bProps = Object.getOwnPropertyNames(b);
	
	  if (aProps.length != bProps.length) {
	    return false;
	  }
	
	  for (var i = 0; i < aProps.length; i++) {
	    var propName = aProps[i];
	
	    // If values of same property are not equal,
	    // objects are not equivalent
	    if (a[propName] !== b[propName]) {
	      return false;
	    }
	  }
	
	  return true;
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var DataProxy = function () {
	  function DataProxy(target) {
	    var handler = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	    _classCallCheck(this, DataProxy);
	
	    this._target = target;
	    this._handler = handler;
	  }
	
	  _createClass(DataProxy, [{
	    key: 'setup',
	    value: function setup() {
	      var obj = arguments.length <= 0 || arguments[0] === undefined ? this._target : arguments[0];
	
	      for (var key in obj) {
	        if (_typeof(obj[key]) === 'object') {
	          obj[key] = this.setup(obj[key]);
	        }
	      }
	
	      return new Proxy(obj, this._handler);
	    }
	  }]);
	
	  return DataProxy;
	}();
	
	exports.default = DataProxy;
	module.exports = exports['default'];

/***/ }
/******/ ]);
//# sourceMappingURL=EOF.js.map