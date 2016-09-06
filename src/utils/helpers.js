
import _ from 'lodash';

/**
 *
 * @param arg_list
 * @returns {{}}
 */
export const payloadMapper = function (arg_list) {
  let result = {};

  for (let i = 0, l = arg_list.length - 1; i < l; i++) {
    result[arg_list[i]] = arguments[i + 1];
  }

  return result;
};

/**
 *
 * @param action
 * @param arg_list
 * @returns {Array}
 */
export const reducerMapper = (action, arg_list) => {
  let payload = action.payload;
  let apply_args = [];

  arg_list.map ((arg_name) => {
    if (typeof payload[arg_name] != 'undefined') {
      apply_args.push (payload[arg_name]);
    }
  });

  return apply_args;
};

/**
 *
 * @param ignore_args
 * @param x
 */
export const payloadIdentity = (ignore_args, x) => x;

/**
 *
 * @param action
 * @param arg_list
 */
export const reducerIdentity = (action, arg_list) => [ action.payload ];

/**
 *
 * @param instance
 * @param parent_proto
 * @returns {[]}
 * @private
 */
export const scanMethods = (instance, parent_proto) => {
  if (typeof instance != 'object') {
    throw new TypeError (
      'Object is required as first parameter of scanMethods'
    );
  }

  if (typeof parent_proto != 'object') {
    throw new TypeError(
      'Object is required as second parameter of scanMethods'
    );
  }
  else {
    if (Array.isArray(parent_proto)) {
      parent_proto = _.zipObject(parent_proto, _.map(parent_proto, () => true));
    }
  }

  let result = [];

  for (let method of Object.getOwnPropertyNames(instance)) {
    if (method == 'render') continue;
    if (typeof instance[method] != 'function') continue;
    if (typeof parent_proto[method] != 'undefined') continue;

    result.push(method);
  }

  return result;
}

