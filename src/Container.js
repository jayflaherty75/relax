
import React, { Component } from 'react';
import _ from 'lodash';
import { addReducer } from './index';
import MethodDescriptor from './utils/MethodDescriptor';

/**
 * Global actions registry for referencing actions from other modules
 * @type {{}}
 * @private
 */
let _actions_idx = {};

/**
 *
 */
class Container extends Component {
  constructor (props, content) {
    super (props, content);

    if (typeof props.dispatch == 'undefined') {
      throw new Error ('Relax.Container must be connected to Redux store');
    }

    this._config = {
      'name': _.uniqueId(this.constructor.name),
      'single_reducer': false,
      'props': props
    };
    this._actionsIdx = {};
    this._reducersIdx = {};
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

    let methods = {};

    this._scanMethods(proto, parent).map((method) => {
      let func = (this)[method];
      let descriptor = new MethodDescriptor(this, dispatch, method, func);

      if (descriptor.type !== false) {
        methods[method] = descriptor;
        _actions_idx[descriptor.type] = descriptor;

        this._actionsIdx[descriptor.type] = descriptor;
        this._reducersIdx[descriptor.type] = descriptor.createReducer(this, func);

        (this)[method] = descriptor.dispatcher;
      }
      else {
        (this)[method] = func;
      }
    });

    this._config = Object.assign (this._config, config);
    this._methods = methods;
    this._initial_state = initialState;

    addReducer(config.name, ((state = initialState, action) => {
        const reducer = this._reducersIdx[action.type];

        if (typeof reducer == 'function') {
          return reducer (state, action);
        }

        return state;
      }
    ).bind(this));
  }

  /**
   *
   */
  uninitialize() {

  }

  getName() {
    return this._config.name;
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
   * @param instance
   * @param parent_proto
   * @param func
   * @returns {[]}
   * @private
   */
  _scanMethods(instance, parent_proto) {
    if (typeof instance != 'object') {
      throw new TypeError (
        'Object is required as first parameter of _scanMethods'
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

    let result = [];

    for (let method of Object.getOwnPropertyNames(instance)) {
      if (method == 'render') continue;
      if (typeof instance[method] != 'function') continue;
      if (typeof parent_proto[method] != 'undefined') continue;

      result.push(method);
    }

    return result;
  }
}

export default Container;
