
import React, { Component } from 'react';
import _ from 'lodash';

const STATE_IDENTIFIER = '__state';

let _actions_idx = {};

/**
 *
 * @param arg_list
 * @returns {{}}
 * @private
 */
const _payloadMapper = function (arg_list) {
  let result = {};

  for (let i = 0, l = arg_list.length - 1; i < l; i++) {
    result[arg_list[i]] = arguments[i + 1];
  }

  return result;
};

/**
 *
 * @param ignore
 * @param x
 * @private
 */
const _payloadIdentity = (ignore_args, x) => x;

/**
 *
 */
class Container extends Component {
  constructor (props, content) {
    super (props, content);

    this._config = {
      'name': _.uniqueId(this.constructor.name),
      'single_reducer': false,
      'props': props
    };
  }

  /**
   *
   * @param config
   * @param initialState
   */
  initialize(config, initialState) {
    const proto = Object.getPrototypeOf(this);
    const parent = Container.prototype;
    const dispatch = this._config.props.dispatch;

    if (typeof dispatch == 'undefined') {
      throw new Error ('Relax.Container must be connected to Redux store');
    }

    //TODO: Break out bulding method descriptors so new methods are handled
    let methods = this._scanMethods(proto, parent, function (method, func) {
      let type = this._generateId(this._config.name, method);
      let args = this._scanArguments(func);
      let reducer = func.bind(this);
      let action = this._createAction (type, args);
      let dispatcher = this._createDispatcher(dispatch, action);

      if (args[args.length - 1] == STATE_IDENTIFIER) {
        (this)[method] = dispatcher;

        return {
          'type': type,
          'method': method,
          'arguments': args,
          'action': action,
          'dispatcher': dispatcher,
          'reducer': reducer,
        };
      }
      else {
        (this)[method] = reducer;

        return false;
      }
    }.bind(this));

    for (let method in methods) {
      let descriptor = methods[method];
      _actions_idx[descriptor.id] = descriptor;
    }

    this._config = config;
    this._methods = methods;
  }

  /**
   *
   */
  uninitialize() {

  }

  /**
   *
   * @param methodName
   * @returns {string}
   */
  getActionId (methodName) {
    return '';
  }

  /**
   *
   * @param actionId
   * @param func
   */
  overridePayload (actionId, func) {

  }

  /**
   *
   * @param actionId
   * @param func
   */
  implement (actionId, func) {

  }

  /**
   *
   * @param actionId
   */
  remove (actionId) {

  }

  /**
   *
   * @returns {Function}
   */
  mapStateToProps() {
    return (x) => x;
  }

  /**
   *
   * @param func
   * @returns {Function}
   */
  mapDispatchToProps(func) {
    return (x) => x;
  }

  /**
   *
   * @param instance
   * @param parent_proto
   * @param func
   * @returns {[]}
   * @private
   */
  _scanMethods(instance, parent_proto, func) {
    if (typeof instance != 'object') {
      throw new TypeError (
        'Object is required as first parameter of _scanMethods'
      );
    }

    if (typeof func != 'function') {
      throw new TypeError (
        'Function is required as third parameter of _scanMethods'
      );
    }

    if (typeof parent_proto != 'object') {
      throw new TypeError(
        'Object is required as second parameter of _scanMethods'
      );
    }
    else {
      if (Array.isArray(parent_proto)) {
        parent_proto = _.zipObject(parent_proto, _.map(parent_proto, () => true));
      }
    }

    let result = {};

    for (let method of Object.getOwnPropertyNames(instance)) {
      if (typeof instance[method] != 'function') continue;
      if (typeof parent_proto[method] != 'undefined') continue;

      let descriptor = func(method, instance[method]);

      if (descriptor) {
        result[method] = func(method, instance[method]);
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
  _scanArguments(func) {
    var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];

    return args.split(',').map(function(arg) {
      return arg.replace(/\/\*.*\*\//, '').trim();
    }).filter(function(arg) {
      return arg;
    });
  }

  /**
   *
   * @param type
   * @param arg_list
   * @returns {Function}
   * @private
   */
  _createAction(type, arg_list) {
    let payload = arg_list[0] != 'payload' ? _payloadMapper : _payloadIdentity;

    return (...args) => ({
      'type': type,
      'payload': payload(arg_list, ...args)
    });
  }

  /**
   *
   * @param dispatch
   * @param action
   * @returns {Function}
   * @private
   */
  _createDispatcher(dispatch, action) {
    return (...args) => {
      dispatch(action(...args));
    }
  }

  /**
   *
   * @returns {string}
   * @private
   */
  _generateId(namespace, method) {
    return [
      namespace,
      _.snakeCase(method).toUpperCase()
    ].join('/');
  }

  /**
   *
   * @private
   */
  _registerAction() {

  }

  /**
   *
   * @private
   */
  _createReducerFromMethod() {

  }

  /**
   *
   * @param relaxClass
   * @returns {{}}
   */
  connect(relaxClass) {
    return {};
  }
}

export default Container;
