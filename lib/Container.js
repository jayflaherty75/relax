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

    return _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, props, content));

    /*const dispatch = props.dispatch;
    const config = this.config();
    const store = this.initialStore();
      if (typeof dispatch == 'undefined') {
      throw new Error ('Relax.Container must be connected to Redux store');
    }
      let methods = _scanMethods(this, Container.prototype, function (method, func) {
      let args = this._scanArguments(func);
      let dispatcher = this._createDispatcher(func.bind(this), dispatch, args);
        let result = args[0] == 'state'
        ? {
          'id': _generateId (config.module_id, method),
          'method': method,
          'arguments': args,
          'original': func,
          'dispatcher': dispatcher
        }
        : false;
        return result;
    }.bind(this));
      for (method in methods) {
      let descriptor = methods[method];
      _actions_idx[descriptor.id] = descriptor;
    }
      this._config = config;
    this._state = state;
    this._methods = methods;
    //*/
  }

  /**
   *
   * @returns {{module_id: string}}
   */


  _createClass(Container, [{
    key: 'config',
    value: function config() {
      return {
        module_id: 'sdkfjghkdf' //TODO: generate unique identifier if not implemented by child
      };
    }

    /**
     *
     * @returns {undefined}
     */

  }, {
    key: 'initialStore',
    value: function initialStore() {
      return undefined;
    }

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
     * @param obj
     * @param ignore_map
     * @param func
     * @returns {[]}
     * @private
     */

  }, {
    key: '_scanMethods',
    value: function _scanMethods(obj, ignore_map, func) {
      if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) != 'object') {
        throw new TypeError('Object is required as first parameter of _scanMethods');
      }

      if (typeof func != 'function') {
        throw new TypeError('Function is required as third parameter of _scanMethods');
      }

      if ((typeof ignore_map === 'undefined' ? 'undefined' : _typeof(ignore_map)) != 'object') {
        throw new TypeError('Object is required as second parameter of _scanMethods');
      } else {
        if (Array.isArray(ignore_map)) {
          ignore_map = _.zipObject(ignore_map, _.map(ignore_map, function () {
            return true;
          }));
        }
      }

      var result = [];

      for (var key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        if (typeof obj[key] != 'function') continue;
        if (typeof ignore_map[key] != 'undefined') continue;

        result.push(key);
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
    value: function _generateId() {
      return '';
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