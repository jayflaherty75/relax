
import Container from './Container';
import Action from './Action';
import Reducer from './Reducer';
import { addReducer, registry } from './index';
import { connect as connectRedux } from 'react-redux';
import { scanMethods } from './utils/helpers';
import _ from 'lodash';

/**
 * Wrapper for react-redux connect() function.  Handles all initialization and
 * "wiring" of Redux actions and reducers for the given Relax Container.
 * @param mapStateToProps
 * @param mapDispatchToProps
 * @param mergeProps
 * @param options
 * @returns {Function}
 */
export default function connect(mapStateToProps, mapDispatchToProps, mergeProps, options) {
  return (cont) => {
    const config = buildConfig(cont);

    initialize(config, cont);

    /*
    const newMapStateToProps = (state, ownProps) => {
      // Mapping is here in case anything has to be auto-mapped to props.
      // Currently not in use.
      let mapping = {},
        custom_map = {};

      switch (typeof mapStateToProps) {
        case 'function':
          custom_map = mapStateToProps(state, ownProps);
          break;
        case 'object':
          custom_map = mapStateToProps;
      }

      return Object.assign (
        custom_map,
        mapping
      );
    };
    */

    return connectRedux(
      mapStateToProps,
      mapDispatchToProps,
      mergeProps,
      options
    )(cont);
  };
};

/**
 * Manageg configuration of child Container classes.
 * @param cont
 * @private
 */
function buildConfig(cont) {
  let config = cont.prototype.config ? cont.prototype.config : false,
    base = Container.prototype.config.bind(cont)(),
    override = config ? config.bind(cont)() : {};

  if (typeof override.single_instance == 'boolean') {
    base.single_instance = override.single_instance;
  }

  if (typeof override.initial_state != 'undefined') {
    base.initial_state = override.initial_state;
  }

  if (typeof override.name == 'string') {
    base.name = override.name;
  }

  base.reducer = typeof override.reducer == 'string'
    ? override.reducer
    : base.name.toLowerCase();

  cont.prototype.config = () => base;

  return base;
};

/**
 * Initializes Container class, adding methods for to initialize and
 * uninitialize reducer which may be added or removed at any time during
 * component lifecycle, including construction.
 * @param config
 * @param cont
 * @private
 */
function initialize(config, cont) {
  const proto = cont.prototype,
    parent = Container.prototype,
    reducer = new Reducer();

  let actions = {};

  scanMethods(proto, parent).map((method) => {
    let action = new Action(proto, method);

    if (action.isValid()) {
      registry(action.type, action);
      actions[action.type] = action;
    }
  });

  proto.getActions = function getActions(type) {
    return Object.keys(actions);
  };

  proto.getReducer = function getReducer() {
    return reducer;
  };

  proto.on = function(type, handler) {
    reducer.addAction(this, type, handler);
  };

  proto.initialize = function initialize() {
    this.getActions().map((type) => {
      let action = registry(type);
      let func = proto[action.method];

      if (typeof action == 'object') {
        reducer.addAction(this, action, func);

        (this)[action.method] = action.dispatcher;
      }
    });
  };

  proto.uninitialize = function uninitialize() {
    reducer.removeInstance(this);
  };

  addReducer(config.reducer, reducer.create(config.initial_state));

  return actions;
}