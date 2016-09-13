
import Container from './Container/index';
import Action from './Action/index';
import connect from './connect';
import { combineReducers } from 'redux';

let _store = false;
let _reducers = {};
let _combine = combineReducers;

/**
 * Global actions registry for referencing actions from other modules
 * @type {{}}
 * @private
 */
let _actions_idx = {};

/**
 *
 * @param store
 * @param reducers
 * @constructor
 */
const Relax = (store, reducers) => {
  _store = store;
  _reducers = reducers;
};

/**
 *
 * @param name
 * @param reducer
 */
const addReducer = (name, reducer) => {
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
 *
 * @param name
 */
const removeReducer = (name) => {
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
 *
 * @param func
 */
const overrideCombineReducers = (func) => {
  if (typeof func != 'function') {
    throw new Error (
      'Relax: Reducer combiner must be a function'
    );
  }

  _combine = func;
};

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
  overrideCombineReducers,
  registry,
  removeReducer,
  _store
};

export default Relax;
