import React from 'react';
import { Container, connect, registry } from 'relax';
import Link from '../components/Link'

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
      registry('FilterLink/SET_FILTER').dispatcher(ownProps.filter);
    }
  }
};

export default connect(mapStateToProps)(FilterLink);
