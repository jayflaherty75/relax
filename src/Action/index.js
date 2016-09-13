
import { _store } from '../index';

import {
  payloadMapper,
  reducerMapper,
  payloadIdentity,
  reducerIdentity
} from '../utils/helpers';

/**
 * Builds a representation of a Redux action from an object method.
 */
export default class Action {
  /**
   *
   * @param component
   * @param method
   * @param func
   */
  constructor(obj, method) {
    if (typeof obj != 'object') {
      throw new Error (
        'Parameter obj must be an object'
      )
    }

    if (typeof method != 'string') {
      throw new Error (
        'Parameter method must be an object'
      )
    }

    this.object = obj;
    this.method = method;
    this.original = false;
    this.type = false;
    this.arguments = false;
    this.action = false;
    this.reducerMap = false;

    if (typeof obj[method] == 'function') {
      this.build(obj, method);
    }
  }

  /**
   * Main action builder method.
   * @param obj
   * @param method
   */
  build(obj, method) {
    let func = obj[method],
      args = this.scanArguments(func);

    if (args[args.length - 1] == '__state') {
      const dispatch = _store.dispatch.bind(_store);

      let is_mapped = args[0] != 'payload',
        type = this.generateType(this.object.getName(), this.method);

      this.original = func.bind(this.object);
      this.type = type;
      this.arguments = args;

      this.setActionCreator(is_mapped ? payloadMapper : payloadIdentity)
      this.setReducerMapping(is_mapped ? reducerMapper : reducerIdentity);

      this.dispatcher = ((...args) => {
        dispatch(this.action(...args));
      }).bind(this);
    }
  }

  /**
   * Sets the payload "shaper" function to be used to build the action object.
   * Function is given an array of argument names along with the each
   * individual argument value and returns a payload object.
   * @param payload
   * @returns {function}
   */
  setActionCreator(payload) {
    const type = this.type,
      arg_list = this.arguments;

    this.action = (...args) => ({
      'type': type,
      'payload': payload(arg_list, ...args)
    });

    return this.action;
  }

  /**
   * Sets the reducer mapper function (opposite process of payload shaper)
   * which takes a payload object and returns an array of argument values.
   * @param reducer
   */
  setReducerMapping(reducer) {
    this.reducerMap = reducer;
  }

  /**
   * Returns true if action is valid.
   * @returns {boolean}
   */
  isValid() {
    return this.type !== false;
  }

  /**
   * Given a functions, returns an array of arguments from the function.
   * @param func
   * @returns {Array.<T>}
   * @private
   */
  scanArguments(func) {
    let args = func.toString()
      .match(/function\s.*?\(([^)]*)\)/)[1];

    return args.split(',')
      .map(
        (arg) => arg.replace(/\/\*.*\*\//, '')
          .trim()
      )
      .filter((arg) => arg);
  }

  /**
   * Generates an action type from a namespace (usually the container name) and
   * a method name separated by forward slash.  Method name is converted to
   * uppercase snake case.  Ex:
   *  FooContainer.allTheThings becomes 'FooContainer/ALL_THE_THINGS'
   * @param namespace
   * @param method
   * @returns {string}
   * @private
   */
  generateType(namespace, method) {
    return [
      namespace,
      _.snakeCase(method).toUpperCase()
    ].join('/');
  }
}