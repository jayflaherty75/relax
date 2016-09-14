
import Container from './Container/index';
import Action from './Action/index';
import connect from './connect';
import { combineReducers } from 'redux';

/**
 * Reference to application store.
 * @type {boolean}
 * @private
 */
let _store = false;

/**
 * Current state of reducers used to dynamically modify root reducer.
 * @type {{}}
 * @private
 */
let _reducers = {};

/**
 * Reducer combiner function.  Default is redux combinerReducer but can be
 * changed for use with other libraries such as redux-immutable.
 */
let _combine = combineReducers;

/**
 * Global actions registry for referencing actions from other modules
 * @type {{}}
 * @private
 */
let _actions_idx = {};

/**
 * Relax initialization to be called from application store.
 * @param store
 * @param reducers
 * @param combineReducers
 * @constructor
 */
function Relax(store, reducers, combineReducers) {
  if (typeof store != 'object') {
    throw new Error (
      'Relax parameter #1 must be a valid Redux store'
    );
  }

  _store = store;
  _reducers = reducers || {};
  _combine = combineReducers || _combine;

  return store;
};

/**
 * Generic function for dynamically adding a reducer to Redux.
 * @param name
 * @param reducer
 */
function addReducer(name, reducer) {
  if (!_store) {
    throw new Error (
      'Relax: You must initialize by calling Relax(store [, reducers])'
    );
  }

  if (typeof _reducers[name] != 'undefined') {
    throw new Error (
      'Relax.addReducer: Attempt to set reducer that already exists: ' + name
    );
  }

  _reducers[name] = reducer;
  _store.replaceReducer(_combine(_reducers));
};

/**
 * Generic function for dynamically removing a reducer to Redux.
 * @param name
 */
function removeReducer(name) {
  if (!_store) {
    throw new Error (
      'Relax: You must initialize by calling Relax(store)'
    );
  }

  if (typeof _reducers[name] == 'undefined') {
    throw new Error (
      'Relax.removeReducer: Reducer does not exist: ' + name
    );
  }

  delete _reducers[name];
  _store.replaceReducer(_combine(_reducers));
};

/**
 * Action registry.  Passing type returns the associated action.  If an action
 * is provided, associates the action to the given type (overwrites).  If
 * action is false, action of the given type is deleted.
 * @param type
 * @param action
 * @returns {*}
 */
function registry(type, action) {
  if (typeof action == 'object') {
    _actions_idx[type] = action;
  }
  else if (action === false) {
    delete _actions_idx[type];

    return false;
  }

  return _actions_idx[type]
}

export {
  Action,
  Container,
  addReducer,
  connect,
  registry,
  removeReducer,
  _store
};

export default Relax;
