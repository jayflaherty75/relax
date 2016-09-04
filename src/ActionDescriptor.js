
import Container from './Container';

import {
  payloadMapper,
  reducerMapper,
  payloadIdentity,
  reducerIdentity
} from './utils/helpers';

/**
 *
 */
export default class ActionDescriptor {
  /**
   *
   * @param component
   * @param dispatch
   * @param method
   * @param func
   */
  constructor(component, dispatch, method, func) {
    if (!(component instanceof Container)) {
      throw new Error (
        'Relax.MethodDescriptor: component must be a Relax.Container'
      )
    }

    if (typeof dispatch != 'function') {
      throw new Error (
        'Relax.MethodDescriptor: dispatch must be a function'
      )
    }

    this.component = component;
    this.method = method;
    this.original = false;
    this.type = false;
    this.arguments = false;
    this.action = false;
    this.reducer = false;

    this.dispatcher = ((...args) => {
      dispatch(this.action(...args));
    }).bind(this);

    if (typeof func == 'function') {
      this.build(func);
    }
  }

  /**
   *
   * @param func
   */
  build(func) {
    let args = this._scanArguments(func);

    if (args[args.length - 1] == '__state') {
      let is_mapped = args[0] != 'payload';

      let type = this._generateType(this.component.getName(), this.method);

      this.original = func.bind(this.component);
      this.type = type;
      this.arguments = args;

      this.setActionCreator(is_mapped ? payloadMapper : payloadIdentity)
      this.setReducerMapping(is_mapped ? reducerMapper : reducerIdentity);
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
    this.reducer = reducer;
  }

  /**
   *
   * @param component
   * @param handler
   * @returns {Function}
   */
  createReducer(component, handler) {
    const arg_list = this.arguments;

    return (state, action) => {
      let apply_args = this.reducer(action, arg_list);

      apply_args.push (state);

      return handler.apply(component, apply_args);
    }
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
   * @param namespace
   * @param method
   * @returns {string}
   * @private
   */
  _generateType(namespace, method) {
    return [
      namespace,
      _.snakeCase(method).toUpperCase()
    ].join('/');
  }
}