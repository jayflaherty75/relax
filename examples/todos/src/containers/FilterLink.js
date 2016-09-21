import React from 'react';
import { Container, connect, dispatch } from 'react-redux-relax';
import Link from '../components/Link'

/**
 * Simple Container example.
 */
class FilterLink extends Container {
  constructor (props, content) {
    super (props, content);

    this.initialize();
  }

  config() {
    return {
      'initial_state': 'SHOW_ALL',
      'reducer': 'visibilityFilter'
    }
  }

  /**
   * Reducer passes new filter value to replace state.
   * @param filter
   * @param __state
   * @returns {*}
   */
  setFilter(filter, __state) {
    return filter;
  }

  render() {
    return (
      <Link active={this.props.active} onClick={this.props.onClick}>
        { this.props.children }
      </Link>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter,
    onClick: () => {
      // Action may be dispatched directly from mapStateToProps or anywhere
      // for that matter.
      dispatch('FilterLink/SET_FILTER', ownProps.filter);
    }
  }
};

export default connect(mapStateToProps)(FilterLink);
