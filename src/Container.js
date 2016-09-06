
import _ from 'lodash';

import React, { Component } from 'react';
import ActionDescriptor from './ActionDescriptor';
import { register, addReducer } from './index';
import { scanMethods } from './utils/helpers';

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

    this._actionsIdx = {};
    this._reducersIdx = {};
  }

  /**
   *
   * @returns {{name: string, reducer: string, single_state: boolean, single_reducer: boolean}}
   */
  config() {
    const reference = this.prototype ? this.prototype : this;
    const name = reference.constructor.name;

    return {
      'name': name,
      'reducer': name.toLowerCase(),
      'single_instance': true
    };
  }

  /**
   *
   * @param initialState
   */
  initialize(initialState) {
    const config = this.config();
    const proto = Object.getPrototypeOf(this);
    const parent = Container.prototype;

    let methods = {};

    scanMethods(proto, parent).map((method) => {
      let func = (this)[method];
      let descriptor = new ActionDescriptor(this, method, func);

      if (descriptor.isValid()) {
        methods[method] = descriptor;
        _actions_idx[descriptor.type] = descriptor;

        register(this.getName(), descriptor.type);

        this._actionsIdx[descriptor.type] = descriptor;
        this._reducersIdx[descriptor.type] = descriptor.createReducer(this, func);

        (this)[method] = descriptor.dispatcher;
      }
      else {
        (this)[method] = func;
      }
    });

    this._methods = methods;

    addReducer(config.reducer, ((state = initialState, action) => {
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

  /**
   *
   * @returns {string}
   */
  getName() {
    return this.config().name;
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
   * @param name
   * @returns {boolean}
   */
  static getAction(name) {
    return typeof _actions_idx[name] != 'undefined'
      ? _actions_idx[name]
      : false;
  }
}

export default Container;
