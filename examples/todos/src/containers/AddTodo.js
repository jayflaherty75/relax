import React from 'react';
import { Container, connect } from 'react-redux-relax';

class AddTodo extends Container {
  constructor (props, content) {
    super (props, content);

    this.state = {
      nextTodoId: 0
    };

    this.initialize();
  }

  config() {
    return {
      'name': 'Todos',
      'initial_state': [],
      'reducer': 'todos'
    }
  }

  addTodo(text, __state) {
    this.setState({
      'nextTodoId': this.state.nextTodoId + 1
    });

    return [
      ...__state,
      {
        'id': this.state.nextTodoId,
        'text': text,
        'completed': false
      }
    ];
  }

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
          this.addTodo(input.value);

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
