
import { _store } from '../index';

/**
 *
 */
export default class Reducer {
  /**
   *
   */
  constructor() {
    this.handlers = {};
  }

  /**
   *
   * @param instance
   * @param action
   * @param handler
   */
  addAction(instance, action, handler) {
    if (typeof this.handlers[action.type] == 'undefined') {
      this.handlers[action.type] = {};
    }

    this.handlers[action.type][instance.id] = this.createMapper(instance, action, handler);
  }

  /**
   *
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
   *
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
   *
   * @param instance
   * @param action_obj
   * @param handler
   * @returns {Function}
   */
  createMapper(instance, action_obj, handler) {
    const arg_list = action_obj.arguments;

    return (state, action) => {
      let apply_args = action_obj.reducer_map(action, arg_list);

      apply_args.push (state);

      return handler.apply(instance, apply_args);
    }
  }
}
