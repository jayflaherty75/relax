import { connect } from 'react-redux'
import TodoList from '../components/TodoList'
import { registry } from 'relax';

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
    default:
      throw new Error('Unknown filter: ' + filter)
  }
}

const mapStateToProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter),
    onTodoClick: (id) => {
      registry('Todos/TOGGLE_TODO').dispatcher(id);
    }
  }
}

const VisibleTodoList = connect(
  mapStateToProps
)(TodoList)

export default VisibleTodoList
