'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _actions_idx = {};

var Container = function (_Component) {
  _inherits(Container, _Component);

  /**
   *
   */
  function Container(props, content) {
    _classCallCheck(this, Container);

    var _this = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, props, content));

    _this._config = {
      'name': _lodash2.default.uniqueId(_this.constructor.name)
    };
    return _this;
  }

  /**
   *
   * @param config
   * @param initialState
   */


  _createClass(Container, [{
    key: 'initialize',
    value: function initialize(config, initialState) {
      var proto = Object.getPrototypeOf(this);
      var parent = Container.prototype;
      //const dispatch = props.dispatch;

      /*if (typeof dispatch == 'undefined') {
        throw new Error ('Relax.Container must be connected to Redux store');
      }
      //*/
      var methods = this._scanMethods(proto, parent, function (method, func) {
        var args = this._scanArguments(func);
        //let dispatcher = this._createDispatcher(func.bind(this), dispatch, args);

        var result = args[0] == 'state' ? {
          'id': this._generateId(this._config.name, method),
          'method': method,
          'arguments': args,
          'original': func
        } : false;

        return result;
      }.bind(this));

      for (var method in methods) {
        var descriptor = methods[method];
        _actions_idx[descriptor.id] = descriptor;
      }

      console.log('methods', methods);
      console.log('_actions_idx', _actions_idx);

      this._config = config;
      this._methods = methods;
    }

    /**
     *
     */

  }, {
    key: 'uninitialize',
    value: function uninitialize() {}

    /**
     *
     * @param methodName
     * @returns {string}
     */

  }, {
    key: 'getActionId',
    value: function getActionId(methodName) {
      return '';
    }

    /**
     *
     * @param actionId
     * @param func
     */

  }, {
    key: 'overridePayload',
    value: function overridePayload(actionId, func) {}

    /**
     *
     * @param actionId
     * @param func
     */

  }, {
    key: 'implement',
    value: function implement(actionId, func) {}

    /**
     *
     * @param actionId
     */

  }, {
    key: 'remove',
    value: function remove(actionId) {}

    /**
     *
     * @returns {Function}
     */

  }, {
    key: 'mapStateToProps',
    value: function mapStateToProps() {
      return function (x) {
        return x;
      };
    }

    /**
     *
     * @param func
     * @returns {Function}
     */

  }, {
    key: 'mapDispatchToProps',
    value: function mapDispatchToProps(func) {
      return function (x) {
        return x;
      };
    }

    /**
     *
     * @param instance
     * @param parent_proto
     * @param func
     * @returns {[]}
     * @private
     */

  }, {
    key: '_scanMethods',
    value: function _scanMethods(instance, parent_proto, func) {
      if ((typeof instance === 'undefined' ? 'undefined' : _typeof(instance)) != 'object') {
        throw new TypeError('Object is required as first parameter of _scanMethods');
      }

      if (typeof func != 'function') {
        throw new TypeError('Function is required as third parameter of _scanMethods');
      }

      if ((typeof parent_proto === 'undefined' ? 'undefined' : _typeof(parent_proto)) != 'object') {
        throw new TypeError('Object is required as second parameter of _scanMethods');
      } else {
        if (Array.isArray(parent_proto)) {
          parent_proto = _lodash2.default.zipObject(parent_proto, _lodash2.default.map(parent_proto, function () {
            return true;
          }));
        }
      }

      var result = {};

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.getOwnPropertyNames(instance)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var method = _step.value;

          if (typeof instance[method] != 'function') continue;
          if (typeof parent_proto[method] != 'undefined') continue;

          var descriptor = func(method, instance[method]);

          if (descriptor) {
            result[method] = func(method, instance[method]);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return result;
    }

    /**
     *
     * @param func
     * @returns {Array.<T>}
     * @private
     */

  }, {
    key: '_scanArguments',
    value: function _scanArguments(func) {
      var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];

      return args.split(',').map(function (arg) {
        return arg.replace(/\/\*.*\*\//, '').trim();
      }).filter(function (arg) {
        return arg;
      });
    }

    /**
     *
     * @returns {Function}
     * @private
     */

  }, {
    key: '_createDispatcher',
    value: function _createDispatcher() {
      return function (x) {
        return x;
      };
    }

    /**
     *
     * @returns {string}
     * @private
     */

  }, {
    key: '_generateId',
    value: function _generateId(namespace, method) {
      return [namespace, _lodash2.default.snakeCase(method).toUpperCase()].join('/');
    }

    /**
     *
     * @private
     */

  }, {
    key: '_registerAction',
    value: function _registerAction() {}

    /**
     *
     * @private
     */

  }, {
    key: '_createReducerFromMethod',
    value: function _createReducerFromMethod() {}

    /**
     *
     * @param relaxClass
     * @returns {{}}
     */

  }, {
    key: 'connect',
    value: function connect(relaxClass) {
      return {};
    }
  }]);

  return Container;
}(_react.Component);

exports.default = Container;