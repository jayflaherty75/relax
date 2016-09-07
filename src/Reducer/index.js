
import { _store } from '../index';

/**
 *
 */
export default class {
  /**
   *
   * @param component
   */
  constructor(component) {
    if (typeof component != 'object') {
      throw new Error (
        'Parameter component must be an object'
      )
    }

    this.component = component;
    this.handlers = {};
  }

  /**
   *
   * @param action
   * @param handler
   */
  add(action, handler) {
    this.handlers[action.type] = this.createMapper(action, handler);
  }

  /**
   *
   * @param initialState
   * @returns {function(this:(*|string))}
   */
  create(initialState) {
    return ((state = initialState, action) => {
        const handler = this.handlers[action.type];

        if (typeof handler == 'function') {
          return handler (state, action);
        }

        return state;
      }
    ).bind(this.component);
  }

  /**
   *
   * @param action
   * @param handler
   * @returns {Function}
   */
  createMapper(action_obj, handler) {
    const arg_list = action_obj.arguments;

    return (state, action) => {
      let apply_args = action_obj.reducer_map(action, arg_list);

      apply_args.push (state);

      return handler.apply(this.component, apply_args);
    }
  }
}
