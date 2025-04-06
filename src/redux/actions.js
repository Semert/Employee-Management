export const ActionTypes = {
  FETCH_EMPLOYEES: 'FETCH_EMPLOYEES',
  ADD_EMPLOYEE: 'ADD_EMPLOYEE',
  UPDATE_EMPLOYEE: 'UPDATE_EMPLOYEE',
  DELETE_EMPLOYEE: 'DELETE_EMPLOYEE',
  SET_EMPLOYEE_FILTER: 'SET_EMPLOYEE_FILTER',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  SET_VIEW_MODE: 'SET_VIEW_MODE',
};

export const fetchEmployees = () => ({
  type: ActionTypes.FETCH_EMPLOYEES,
});

export const addEmployee = (employee) => ({
  type: ActionTypes.ADD_EMPLOYEE,
  payload: employee,
});

export const updateEmployee = (employee) => ({
  type: ActionTypes.UPDATE_EMPLOYEE,
  payload: employee,
});

export const deleteEmployee = (id) => ({
  type: ActionTypes.DELETE_EMPLOYEE,
  payload: id,
});

export const setEmployeeFilter = (filterText) => ({
  type: ActionTypes.SET_EMPLOYEE_FILTER,
  payload: filterText,
});

export const setCurrentPage = (page) => ({
  type: ActionTypes.SET_CURRENT_PAGE,
  payload: page,
});

export const setViewMode = (viewMode) => ({
  type: ActionTypes.SET_VIEW_MODE,
  payload: viewMode,
});
