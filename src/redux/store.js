import {createStore} from 'redux';
import employeesReducer from './reducers.js';

export const store = createStore(
  employeesReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
