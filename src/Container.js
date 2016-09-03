
import React, { Component } from 'react';
import _ from 'lodash';
import { addReducer } from './index';

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

    if (typeof props.dispatch == 'undefined') {
      throw new Error ('Relax.Container must be connected to Redux store');
    }

    this._buildMethod = this._buildMethod.bind(this);

    this._config = {
      'name': _.uniqueId(this.constructor.name),
      'single_reducer': false,
      'props': props
    };
    this._actionsIdx = {};
  }

  /**
   *
   * @param config
   * @param initialState
   */
  initialize(config, initialState) {
    const proto = Object.getPrototypeOf(this);
    const parent = Container.prototype;

    //TODO: Break out building method descriptors so new methods are handled by proxy
    let methods = this._scanMethods(proto, parent, this._buildMethod);

    for (let method in methods) {
      let descriptor = methods[method];

      this._actionsIdx[descriptor.type] = descriptor;
      _actions_idx[descriptor.type] = descriptor;
    }

    this._config = Object.assign (this._config, config);
    this._methods = methods;
    this._initial_state = initialState;

    this._reducer = function (state = initialState, action) {
      const descriptor = this._actionsIdx[action.type];
      if (descriptor && typeof descriptor.reducer == 'function') {
        return descriptor.reducer (state, action);
      }

      return state;
    }.bind(this);

    addReducer(config.name, this._reducer);
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
  getActionType (methodName) {
    return '';
  }

  /**
   *
   * @param actionId
   * @param func
   */
  overrideAction(actionId, func) {

  }

  /**
   *
   * @param actionId
   * @param func
   */
  implement (actionType, func) {

  }

  /**
   *
   * @param actionId
   */
  remove (actionType) {

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
      if (method == 'render') continue;
      if (typeof instance[method] != 'function') continue;
      if (typeof parent_proto[method] != 'undefined') continue;

      let descriptor = func(method, instance[method]);

      if (descriptor) {
        result[method] = descriptor;
      }
    }

    return result;
  }

  /**
   *
   * @param method
   * @param func
   * @returns {*}
   * @private
   */
  _buildMethod (method, func) {
    const dispatch = this._config.props.dispatch;

    let args = this._scanArguments(func);
    let original = func.bind(this);

    if (args[args.length - 1] == STATE_IDENTIFIER) {
      let type = this._generateId(this._config.name, method);
      let is_mapped = args[0] != 'payload';
      let action = this._createAction (type, args, is_mapped);
      let reducer = this._createReducer (this, func, args, is_mapped);
      let dispatcher = this._createDispatcher(dispatch, action);

      (this)[method] = dispatcher;

      return {
        'component': this,
        'type': type,
        'method': method,
        'arguments': args,
        'action': action,
        'dispatcher': dispatcher,
        'reducer': reducer,
        'original': original,
      };
    }
    else {
      (this)[method] = original;

      return false;
    }
  }

  /**
   *
   * @param func
   * @returns {Array.<T>}
   * @private
   */
  _scanArguments(func) {
    var args = func.toString()
      .match(/function\s.*?\(([^)]*)\)/)[1];

    return args.split(',')
      .map(
        (arg) => arg.replace(/\/\*.*\*\//, '')
          .trim()
      )
      .filter((arg) => arg);
  }

  /**
   *
   * @param type
   * @param arg_list
   * @param is_mapped
   * @returns {Function}
   * @private
   */
  _createAction(type, arg_list, is_mapped) {
    let payload = is_mapped ? _payloadMapper : _payloadIdentity;

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
   * @param instance
   * @param original
   * @param args
   * @param is_mapped
   * @private
   */
  _createReducer(instance, original, args, is_mapped) {
    if (!is_mapped) {
      return (state, action) => {
        return original.apply(instance, [ action.payload, state ]);
      }
    }
    else {
      return (state = this._initial_state, action) => {
        let payload = action.payload;
        let apply_args = [];

        args.map ((arg_name) => {
          if (typeof payload[arg_name] != 'undefined') {
            apply_args.push (payload[arg_name]);
          }
        });

        apply_args.push (state);

        return original.apply(instance, apply_args);
      }
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
