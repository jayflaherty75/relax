
import Immutable from 'immutable';
import Module from 'relax';

class FormModule extends Module {
  setConfig() {
    return {
      name: 'FormModule',
    };
  }

  setInitialState() {
    return Immutable.Map({
      'property': 123
    });
  }
  /**
   * Called when module is installed
   * @param module
   */
  register(module) {

  }

  fooMethod(state, arg1, arg2) {

  }
}

/**
 * Initial State - Provided by module for a container
 * Constant - Auto gen (?) value used internally but may be extracted for external use
 * Action Creator - Defined by specified payload object
 * Handler - Optional function receives state and returns a new state
 */