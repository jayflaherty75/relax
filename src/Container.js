
import React, { Component } from 'react';
import _ from 'lodash';
import map from 'lodash';
import snakeCase from 'lodash';
import uniqueId from 'lodash';
import zipObject from 'lodash';

let _actions_idx = {};

class Container extends Component {
  /**
   *
   */
  constructor (props, content) {
    super (props, content);

    this._config = {
      'name': _.uniqueId(this.constructor.name)
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
    //const dispatch = props.dispatch;

    /*if (typeof dispatch == 'undefined') {
      throw new Error ('Relax.Container must be connected to Redux store');
    }
    //*/
    let methods = this._scanMethods(proto, parent, function (method, func) {
      let args = this._scanArguments(func);
      //let dispatcher = this._createDispatcher(func.bind(this), dispatch, args);

      let result = args[0] == 'state'
        ? {
          'id': this._generateId (this._config.name, method),
          'method': method,
          'arguments': args,
          'original': func,
          //'dispatcher': dispatcher
        }
        : false;

      return result;
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
