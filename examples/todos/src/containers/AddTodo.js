import React from 'react';
import { Container, connect } from 'react-redux-relax';

class AddTodo extends Container {
  /**
   * Initializes Relax Container, adding reducers to class Reducer instance.
   * @param props
   * @param content
   */
  constructor (props, content) {
    super (props, content);

    // Note that 'nextTodoId' from Redux example is now a state variable.
    this.state = {
      nextTodoId: 0
    };

    this.initialize();

    // Listen for actions defined elsewhere. Note that the reducer is binded
    // to 'this' and receives this component's state. This wiring may be
    // automated in the future.
    this.on('FilterLink/SET_FILTER', this.onSetFilter)
  }

  /**
   * Overrides base class config but keeps values from base class that are
   * not set here.  This is handled in connect().
   * @returns {{name: string, initial_state: Array, reducer: string}}
   */
  config() {
    return {
      'name': 'Todos',
      'initial_state': [],
      'reducer': 'todos'
    }
  }

  /**
   * Argument '__state' identifies method as a reducer. An action of type
   * 'Todos/ADD_TODO' will be automatically created. A Reducer instance will
   * be associated with this class and a copy of this method will be added to
   * it for each instance, each one binded to 'this'.
   * @param text
   * @param __state
   * @returns {*[]}
   */
  addTodo(id, text, __state) {
    return [
      ...__state,
      {
        'id': id,
        'text': text,
        'completed': false
      }
    ];
  }

  /**
   * Reducer method to toggle completed.
   * @param id
   * @param __state
   * @returns {*}
   */
  toggleTodo(id, __state) {
    return __state.map(t => {
      if (t.id !== id) {
        return t
      }

      return {
        ...t,
        completed: !t.completed
      }
    });
  }

  /**
   * Example of a reducer that handles an action defined elsewhere. Note that
   * state argument is not '__state' as we are not defining an action here.
   * Method name is prefixed with 'on' to express this.  This wiring may be
   * automated in the future.
   * @param filter
   * @param state
   */
  onSetFilter(filter, state) {
    console.log ('Filter changed', filter, this.state.nextTodoId, state);
    return state;
  }

  /**
   *
   * @returns {XML}
   */
  render() {
    let input;

    return (
      <div>
        <form onSubmit={e => {
          e.preventDefault();
          if (!input.value.trim()) {
            return
          }

          // Calls the action dispatcher, not the original reducer method
          this.addTodo(++this.state.nextTodoId, input.value);

          input.value = ''
        }}>
          <input ref={node => {
          input = node
        }} />
          <button type="submit">
            Add Todo
          </button>
        </form>
      </div>
    )
  }
}

AddTodo = connect()(AddTodo);

export default AddTodo;
