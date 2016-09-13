
import _ from 'lodash';

import React, { Component } from 'react';
import Action from '../Action';
import { registry } from '../index';

/**
 * Relax Container (required usage with Relax connect() wrapper).  Provides a
 * definitive Container for React and provides all the necessary "wiring" for
 * Redux.  Simply provide a method in the Container with it's last argument as
 * "__store" and Relax will recognize it as a reducer and create the action
 * type, creator and dispatcher automatically (note: method must return __store).
 * For a Container named Foo with a reducer method named barFight, an action of
 * type 'Foo/BAR_FIGHT' will be created.
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
   * Root config.  Return object of child class implementations will be mapped
   * with the root config object.
   * @returns {{name: *, reducer: string, initial_state: {}, single_instance: boolean}}
   */
  config() {
    const reference = this.prototype ? this.prototype : this,
      name = reference.constructor.name;

    return {
      'name': name,
      'reducer': name.toLowerCase(),
      'initial_state': {},
      'single_instance': true,
    };
  }

  /**
   * Gets the container name from the config which is used for namespacing
   * actions.
   * @returns {string}
   */
  getName() {
    return this.config().name;
  }

  /**
   * Validates any action constant created by Relax.  Shared constants may be
   * set manually and passed to this method to insure they are correct.
   * @param type
   * @returns {boolean}
   */
  actionValidate(type) {
    return typeof registry(type) == 'object';
  };

  /**
   * Returns an action creator function for any Relax action.
   * @param type
   * @returns {*|number|boolean|string}
   */
  actionCreator(type) {
    return registry(type).action;
  }

  /**
   * Returns an action object for the given type and arguments.
   * @param type
   * @param args
   * @returns {*|{type, payload}}
   */
  actionCreate(type, ...args) {
    return this.actionCreator(type)(...args);
  }

  /**
   * Dispatches an action for the given type.
   * @param type
   * @param args
   * @returns {*}
   */
  actionDispatch(type, ...args) {
    return registry(type).dispatcher(...args);
  }
}
