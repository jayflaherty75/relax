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

