
import _ from 'lodash';

/**
 *
 * @param argList
 * @returns {{}}
 */
export function payloadMapper(argList) {
  let result = {};

  for (let i = 0, l = argList.length - 1; i < l; i++) {
    result[argList[i]] = arguments[i + 1];
  }

  return result;
};

/**
 *
 * @param action
 * @param argList
 * @returns {Array}
 */
export function reducerMapper(action, argList) {
  let payload = action.payload;
  let applyArgs = [];

  argList.map ((argName) => {
    if (typeof payload[argName] != 'undefined') {
      applyArgs.push (payload[argName]);
    }
  });

  return applyArgs;
};

/**
 *
 * @param ignoreArgs
 * @param x
 */
export const payloadIdentity = (ignoreArgs, x) => x;

/**
 *
 * @param action
 * @param argList
 */
export const reducerIdentity = (action, argList) => [ action.payload ];

/**
 *
 * @param instance
 * @param parentProto
 * @returns {[]}
 * @private
 */
export function scanMethods(instance, parentProto) {
  if (typeof instance != 'object') {
    throw new TypeError (
      'Object is required as first parameter of scanMethods'
    );
  }

  if (typeof parentProto != 'object') {
    throw new TypeError(
      'Object is required as second parameter of scanMethods'
    );
  }
  else {
    if (Array.isArray(parentProto)) {
      parentProto = _.zipObject(parentProto, _.map(parentProto, () => true));
    }
  }

  let result = [];

  for (let method of Object.getOwnPropertyNames(instance)) {
    if (method == 'render') continue;
    if (typeof instance[method] != 'function') continue;
    if (typeof parentProto[method] != 'undefined') continue;

    result.push(method);
  }

  return result;
}
