import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import login from './states/login';

export default combineReducers({
  routing: routerReducer,
  login,
});
