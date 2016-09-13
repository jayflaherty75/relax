
import { _store } from '../index';

import {
  payloadMapper,
  reducerMapper,
  payloadIdentity,
  reducerIdentity
} from '../utils/helpers';

/**
 *
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
    this.reducer_map = false;

    if (typeof obj[method] == 'function') {
      this.build(obj, method);
    }
  }

  /**
   *
   * @param func
   */
  build(obj, method) {
    let func = obj[method];
    let args = this.scanArguments(func);

    if (args[args.length - 1] == '__state') {
      const dispatch = _store.dispatch.bind(_store);

      let is_mapped = args[0] != 'payload';

      let type = this.generateType(this.object.getName(), this.method);

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
   *
   * @param payload
   * @returns {MethodDescriptor.action|*}
   */
  setActionCreator(payload) {
    const type = this.type;
    const arg_list = this.arguments;

    this.action = (...args) => ({
      'type': type,
      'payload': payload(arg_list, ...args)
    });

    return this.action;
  }

  /**
   *
   * @param reducer
   */
  setReducerMapping(reducer) {
    this.reducer_map = reducer;
  }

  /**
   *
   * @returns {boolean}
   */
  isValid() {
    return this.type !== false;
  }

  /**
   *
   * @param func
   * @returns {Array.<T>}
   * @private
   */
  scanArguments(func) {
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