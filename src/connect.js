
import Container from './Container';
import { getActions, _store } from './index';
import { connect as connectRedux } from 'react-redux';
import _ from 'lodash';

/**
 *
 * @param mapStateToProps
 * @param mapDispatchToProps
 * @param mergeProps
 * @param options
 * @returns {Function}
 */
export default (mapStateToProps, mapDispatchToProps, mergeProps, options) => {
  return (cont) => {
    _buildConfig(cont);

    _initialize(cont);

    const newMapStateToProps = (state) => {
      let custom_map = {};

      /*
      const config = cont.prototype.config();

      let actions = getActions(config.name);
      let mapping = {};

      for (let i = 0, l = actions.length; i < l; i++) {
        let action = actions[i];
        let desc = Container.getAction(action);

        mapping[desc.method] = desc.dispatcher;
      }
      */

      switch (typeof mapStateToProps) {
        case 'function':
          custom_map = mapStateToProps(state);
          break;
        case 'object':
          custom_map = mapStateToProps;
      }

      return Object.assign (
        custom_map,
        //mapping
      );
    };

    return connectRedux(
      newMapStateToProps,
      mapDispatchToProps,
      mergeProps,
      options
    )(cont);
  };
};

/**
 *
 * @param cont
 * @private
 */
const _buildConfig = function (cont) {
  let config = cont.prototype.config ? cont.prototype.config : false;
  let base = Container.prototype.config.bind(cont)();
  let override = config ? config.bind(cont)() : {};

  if (typeof override.single_instance == 'boolean') {
    base.single_instance = override.single_instance;
  }

  if (typeof override.name == 'string') {
    if (base.single_instance) {
      base.name = override.name;
    }
    else {
      base.name = _.uniqueId(override.name);
    }
  }
  else {
    base.name = _.uniqueId(base.name);
  }

  if (typeof override.reducer == 'string') {
    base.reducer = override.reducer;
  }
  else {
    base.reducer = base.name.toLowerCase();
  }

  cont.prototype.config = () => base;
};

const _initialize = function (cont) {

};