
import _ from 'lodash';

import React, { Component } from 'react';
import Action from '../Action';
import { registry } from '../index';

/**
 *
 */
export default class Container extends Component {
  constructor (props, content) {
    super (props, content);

    if (typeof props.dispatch == 'undefined') {
      throw new Error ('Relax.Container must be connected to Redux store');
    }

    this.id = _.uniqueId(this.config().name);
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
      'initial_state': {},
      'single_instance': true,
    };
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
   * @param type
   * @returns {boolean}
   */
  actionValidate(type) {
    return typeof registry(type) == 'object';
  };

  /**
   *
   * @param type
   * @returns {*|number|boolean|string}
   */
  actionCreator(type) {
    return registry(type).action;
  }

  /**
   *
   * @param type
   * @param args
   * @returns {*|{type, payload}}
   */
  actionCreate(type, ...args) {
    return this.actionCreator(type)(...args);
  }

  /**
   *
   * @param type
   * @param args
   * @returns {*}
   */
  actionDispatch(type, ...args) {
    return registry(type).dispatcher(...args);
  }
}
