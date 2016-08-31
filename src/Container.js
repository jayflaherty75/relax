
import React, { Component } from 'react';
import map from 'lodash';
import zipObject from 'lodash';

let _actions_idx = {};

class Container extends Component {
  /**
   *
   */
  constructor (props, content) {
    super (props, content);

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
  config() {
    return {
      module_id: 'sdkfjghkdf'   //TODO: generate unique identifier if not implemented by child
    }
  }

  /**
   *
   * @returns {undefined}
   */
  initialStore() {
    return undefined;
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
   * @param obj
   * @param ignore_map
   * @param func
   * @returns {[]}
   * @private
   */
  _scanMethods(obj, ignore_map, func) {
    if (typeof obj != 'object') {
      throw new TypeError ('Object is required as first parameter of _scanMethods');
    }

    if (typeof func != 'function') {
      throw new TypeError ('Function is required as third parameter of _scanMethods');
    }

    if (typeof ignore_map != 'object') {
      throw new TypeError('Object is required as second parameter of _scanMethods');
    }
    else {
      if (Array.isArray(ignore_map)) {
        ignore_map = _.zipObject(ignore_map, _.map(ignore_map, () => true));
      }
    }

    let result = [];

    for (let key in obj) {
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
   * @returns {Function}
   * @private
   */
  _createDispatcher() {
    return (x) => x;
  }

  /**
   *
   * @returns {string}
   * @private
   */
  _generateId() {
    return '';
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
