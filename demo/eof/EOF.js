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
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Parser = __webpack_require__(1);
	
	var _Parser2 = _interopRequireDefault(_Parser);
	
	var _DataProxy = __webpack_require__(2);
	
	var _DataProxy2 = _interopRequireDefault(_DataProxy);
	
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
	    this._data = data;
	    this.name = elmId;
	    this.$; // data proxy
	    this._dataKey;
	
	    this._init();
	  }
	
	  _createClass(EOF, [{
	    key: '_init',
	    value: function _init() {
	      var self = this;
	      var tpl = this._tpl;
	      var tplParser = new _Parser2.default(tpl, this._data);
	      var result = tplParser.parse();
	      var tplContent = result.tplContent;
	      this._data = result.data;
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
	
	      var setHandler = function setHandler(target, key, value) {
	        console.log('set ' + key + ' = ' + value);
	        var idList = _this._dataKey[key];
	        var elms = [];
	
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
	      };
	
	      var dataProxy = new _DataProxy2.default(this._data);
	
	      dataProxy.handleSet(setHandler);
	      this.$ = dataProxy.setup();
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
	
	var _utils = __webpack_require__(3);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var parser = function () {
	  function parser(tpl, data) {
	    _classCallCheck(this, parser);
	
	    this._data = data;
	    this._tpl = tpl;
	  }
	
	  _createClass(parser, [{
	    key: 'parse',
	    value: function parse() {
	      var tplStr = this._tpl.innerHTML;
	      var data = this._data;
	      var dataKey = this._getDatakey();
	
	      var attrPattern = /\w*="{{[\s\w]*}}"/g;
	      var textPattern = /[^"]{{[\s\w]*}}/g;
	      var attrMatch = tplStr.match(attrPattern);
	      var textMatch = tplStr.match(textPattern);
	      attrMatch = (0, _utils.arrUnique)(attrMatch);
	      textMatch = (0, _utils.arrUnique)(textMatch);
	
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
	
	        if (dataKey.hasOwnProperty(replace.key)) {
	          dataKey[replace.key].push(dataKeyItem);
	        } else {
	          this._data[replace.key] = null;
	          dataKey[replace.key] = [dataKeyItem];
	        }
	      }
	
	      for (var _i = 0; _i < textMatch.length; _i++) {
	        var _replace = this._replaceVar('text', tplStr, textMatch[_i]);
	        tplStr = _replace.htmlStr;
	
	        var _dataKeyItem = {
	          id: _replace.elmId,
	          type: 'text',
	          attr: null
	        };
	
	        if (dataKey.hasOwnProperty(_replace.key)) {
	          dataKey[_replace.key].push(_dataKeyItem);
	        } else {
	          this._data[_replace.key] = null;
	          dataKey[_replace.key] = [_dataKeyItem];
	        }
	      }
	
	      this._tpl.innerHTML = tplStr;
	
	      return {
	        tplContent: this._tpl.content,
	        dataKey: dataKey,
	        data: this._data // padding obj
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
	      var variable = item.match(/{{\s*(\w*)\s*}}/)[1];
	      var value = this._data[variable] ? this._data[variable] : '';
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
	        replaceMent = item.replace(/{{\s*\w*\s*}}/, value + '" ' + bindFlag);
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
	    key: '_getDatakey',
	    value: function _getDatakey() {
	      var obj = {};
	
	      for (var key in this._data) {
	        obj[key] = [];
	      }
	
	      return obj;
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
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var DataProxy = function () {
	  function DataProxy(target) {
	    _classCallCheck(this, DataProxy);
	
	    this._target = target;
	    this._handler = {};
	  }
	
	  _createClass(DataProxy, [{
	    key: 'setup',
	    value: function setup() {
	      return new Proxy(this._target, this._handler);
	    }
	  }, {
	    key: 'handleSet',
	    value: function handleSet(callback) {
	      this._handler['set'] = callback;
	    }
	  }]);
	
	  return DataProxy;
	}();
	
	exports.default = DataProxy;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.arrUnique = arrUnique;
	function arrUnique(arr) {
	  var obj = {};
	
	  for (var i = arr.length; i--;) {
	    arr[i] = arr[i].trim();
	    obj[arr[i]] = null;
	  }
	
	  return Object.keys(obj);
	}

/***/ }
/******/ ]);
//# sourceMappingURL=EOF.js.map