import {ofType} from 'redux-observable';
import {of, from} from 'rxjs';
import {mergeMap, map} from 'rxjs/operators';
import {ActionTypes, fetchEmployeesSuccess} from './actions.js';

// This would normally fetch from an API, but since we're using local storage we'll simulate it
export const fetchEmployeesEpic = (action$) =>
  action$.pipe(
    ofType(ActionTypes.FETCH_EMPLOYEES),
    mergeMap(() => {
      // In a real app, we would fetch from an API
      // For now, we'll retrieve from localStorage or use mock data
      const storedEmployees = localStorage.getItem('employees');
      const employees = storedEmployees ? JSON.parse(storedEmployees) : [];

      return of(fetchEmployeesSuccess(employees.length > 0 ? employees : []));
    })
  );

// Store employees in localStorage whenever they change
export const persistEmployeesEpic = (action$, state$) =>
  action$.pipe(
    ofType(
      ActionTypes.ADD_EMPLOYEE,
      ActionTypes.UPDATE_EMPLOYEE,
      ActionTypes.DELETE_EMPLOYEE
    ),
    map(() => {
      const employees = state$.value.employees;
      localStorage.setItem('employees', JSON.stringify(employees));
      return {type: 'PERSIST_COMPLETE'};
    })
  );

export const rootEpic = (action$, state$) => {
  return from([
    fetchEmployeesEpic(action$, state$),
    persistEmployeesEpic(action$, state$),
  ]).pipe(mergeMap((epic) => epic));
};
