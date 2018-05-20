import { LOGIN, REGISTER, SET_PARAMS, LOGIN_CLEAR } from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
    case LOGIN:
    case REGISTER:
      return {
        ...state,
        errors: action.error ? action.payload.errors : null,
      };
    case SET_PARAMS:
      return { ...state, [action.key]: action.value };
    case LOGIN_CLEAR:
      return {};
    default:
      return state;
  }
};
