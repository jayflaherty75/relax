
import { _store, registry } from '../index';

/**
 * Representation of a Redux reducer handling multiple actions for a given
 * container.  Individual instances of a container may have a reducer with
 * each action handler bound to it.  Must be passed to addReducers to
 * install.
 */
export default class Reducer {
  /**
   *
   */
  constructor() {
    this.handlers = {};
  }

  /**
   * For the given container instance and action, adds a handler.  These are
   * associated with the reducer even if it is already installed so the handler
   * immediately processes actions.
   * @param instance
   * @param action
   * @param handler
   */
  addAction(instance, action, handler) {
    if (typeof action == 'string') {
      action = registry(action);
    }

    if (typeof this.handlers[action.type] == 'undefined') {
      this.handlers[action.type] = {};
    }

    this.handlers[action.type][instance.id] = this.createMapper(instance, action, handler);
  }

  /**
   * Removes all action handlers for the given instance.
   * @param instance
   */
  removeInstance(instance) {
    for (let type in this.handlers) {
      if (this.handlers.hasOwnProperty(type)) {
        let instances = this.handlers[type];

        if (typeof instances[instance.id] != 'undefined') {
          delete instances[instance.id];
        }
      }
    }
  }

  /**
   * Creates a reducer function usable by Redux.  The addReducer() function
   * may be used to install and uninstall reducers more easily.
   * @param initialState
   * @returns {function(this:(*|string))}
   */
  create(initialState) {
    return (state = initialState, action) => {
      const handlers = this.handlers[action.type];

      if (typeof handlers != 'undefined') {
        return (() => {
          for (let id in handlers) {
            if (handlers.hasOwnProperty(id)) {
              state = handlers[id] (state, action);
            }
          }

          return state;
        })();
      }

      return state;
    };
  }

  /**
   * Wraps original reducer method from Container with reducer mapper to
   * map action payload to reducer arguments and adds store as last argument.
   * @param instance
   * @param actionObj
   * @param handler
   * @returns {Function}
   */
  createMapper(instance, actionObj, handler) {
    const argList = actionObj.arguments;

    return (state, action) => {
      let applyArgs = actionObj.reducerMap(action, argList);

      applyArgs.push (state);

      return handler.apply(instance, applyArgs);
    }
  }
}
