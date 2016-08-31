
import Immutable from 'immutable';
import createSagaMiddleware from 'redux-saga';
import { relaxAndInitialize, addReducer } from 'relax';     //Relax functions for initialization
import { combineReducers } from 'redux-immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';

import {
  createStore,
  applyMiddleware,
  compose
} from 'redux';

import { rootSaga } from './sagas';
import createReducer from './reducers'

const initialState = Immutable.Map({ locationBeforeTransitions: null });

const relaxMiddleware = relaxAndInitialize(combineReducers);//Create Relax middleware
const sagaMiddleware = createSagaMiddleware();

function routeReducer (state = initialState, action) {
  switch(action.type) {
    case(LOCATION_CHANGE):
      return state.merge({ locationBeforeTransitions: action.payload });
    default:
      return state;
  }
}

const middlewares = [
  sagaMiddleware,
  routerMiddleware(browserHistory),
  relaxMiddleware                                         //Include Relax middleware
];

const store = createStore(
    addReducer({                                          //Use addReducer to build root reducer
      'routing': routeReducer
    }),
    compose(applyMiddleware(...middlewares),
    typeof window != 'undefined' && window.devToolsExtension
      ? window.devToolsExtension()
      : f => f
));


sagaMiddleware.run(rootSaga);

export default store;
