
import _ from 'lodash';

import React, { Component } from 'react';
import Action from '../Action/index';
import Reducer from '../Reducer/index';
import { register, addReducer } from '../index';
import { scanMethods } from '../utils/helpers';

/**
 * Global actions registry for referencing actions from other modules
 * @type {{}}
 * @private
 */
let _actions_idx = {};

/**
 *
 */
export default class Container extends Component {
  constructor (props, content) {
    super (props, content);

    if (typeof props.dispatch == 'undefined') {
      throw new Error ('Relax.Container must be connected to Redux store');
    }

    this._actionsIdx = {};
    this.reducer = new Reducer(this);
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
      let descriptor = new Action(this, method);

      if (descriptor.isValid()) {
        methods[method] = descriptor;
        _actions_idx[descriptor.type] = descriptor;

        this._actionsIdx[descriptor.type] = descriptor;
        this.reducer.add(descriptor, func);

        (this)[method] = descriptor.dispatcher;
      }
      else {
        (this)[method] = func;
      }
    });

    this._methods = methods;

    addReducer(config.reducer, this.reducer.create(initialState));
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
