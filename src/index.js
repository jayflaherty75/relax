
import Container from './Container';
import { combineReducers } from 'redux';

let _store = false;
let _reducers = {};
let _combine = combineReducers;

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
      'Relax: You must initialize by calling Relax(store)'
    );
  }

  if (typeof _reducers[name] != 'undefined') {
    throw new Error (
      'Relax: Attempt to set reducer that already exists: ' + name
    );
  }

  _reducers[name] = reducer;
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

export {
  Container,
  addReducer,
  overrideCombineReducers,
};

export default Relax;
