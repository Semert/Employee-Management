import {ActionTypes} from './actions.js';

const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Initial sample data
// src/redux/reducers.js (partial update - initial data section)

// Initial mock data with more diverse sample employees
const initialEmployees = [
  {
    id: generateId(),
    firstName: 'Ahmet',
    lastName: 'Sourtimes',
    dateOfEmployment: '23/09/2022',
    dateOfBirth: '15/05/1988',
    phone: '+90 532 123 45 67',
    email: 'ahmet@sourtimes.org',
    department: 'Analytics',
    position: 'Junior',
  },
  {
    id: generateId(),
    firstName: 'Mehmet',
    lastName: 'Yilmaz',
    dateOfEmployment: '15/03/2021',
    dateOfBirth: '10/05/1990',
    phone: '+90 532 987 65 43',
    email: 'mehmet@sourtimes.org',
    department: 'Tech',
    position: 'Senior',
  },
  {
    id: generateId(),
    firstName: 'Ayşe',
    lastName: 'Kaya',
    dateOfEmployment: '05/11/2020',
    dateOfBirth: '22/08/1992',
    phone: '+90 532 456 78 90',
    email: 'ayse@sourtimes.org',
    department: 'Analytics',
    position: 'Medior',
  },
  {
    id: generateId(),
    firstName: 'Fatma',
    lastName: 'Demir',
    dateOfEmployment: '12/02/2021',
    dateOfBirth: '03/04/1985',
    phone: '+90 533 111 22 33',
    email: 'fatma@sourtimes.org',
    department: 'Tech',
    position: 'Senior',
  },
  {
    id: generateId(),
    firstName: 'Ali',
    lastName: 'Yıldız',
    dateOfEmployment: '01/06/2022',
    dateOfBirth: '17/09/1993',
    phone: '+90 535 444 55 66',
    email: 'ali@sourtimes.org',
    department: 'Tech',
    position: 'Junior',
  },
  {
    id: generateId(),
    firstName: 'Zeynep',
    lastName: 'Şahin',
    dateOfEmployment: '20/10/2020',
    dateOfBirth: '11/12/1991',
    phone: '+90 536 777 88 99',
    email: 'zeynep@sourtimes.org',
    department: 'Analytics',
    position: 'Medior',
  },
  {
    id: generateId(),
    firstName: 'Mustafa',
    lastName: 'Özdemir',
    dateOfEmployment: '10/08/2021',
    dateOfBirth: '25/07/1986',
    phone: '+90 537 123 45 67',
    email: 'mustafa@sourtimes.org',
    department: 'Tech',
    position: 'Medior',
  },
  {
    id: generateId(),
    firstName: 'Elif',
    lastName: 'Çelik',
    dateOfEmployment: '05/01/2022',
    dateOfBirth: '30/03/1994',
    phone: '+90 538 987 65 43',
    email: 'elif@sourtimes.org',
    department: 'Analytics',
    position: 'Junior',
  },
  {
    id: generateId(),
    firstName: 'Emre',
    lastName: 'Kara',
    dateOfEmployment: '15/04/2020',
    dateOfBirth: '14/02/1988',
    phone: '+90 539 456 78 90',
    email: 'emre@sourtimes.org',
    department: 'Tech',
    position: 'Senior',
  },
  {
    id: generateId(),
    firstName: 'Selin',
    lastName: 'Aydın',
    dateOfEmployment: '01/12/2021',
    dateOfBirth: '19/11/1990',
    phone: '+90 531 111 22 33',
    email: 'selin@sourtimes.org',
    department: 'Analytics',
    position: 'Senior',
  },
  {
    id: generateId(),
    firstName: 'Burak',
    lastName: 'Koç',
    dateOfEmployment: '10/05/2022',
    dateOfBirth: '21/06/1992',
    phone: '+90 532 444 55 66',
    email: 'burak@sourtimes.org',
    department: 'Tech',
    position: 'Junior',
  },
  {
    id: generateId(),
    firstName: 'Deniz',
    lastName: 'Şen',
    dateOfEmployment: '20/07/2020',
    dateOfBirth: '07/09/1987',
    phone: '+90 533 777 88 99',
    email: 'deniz@sourtimes.org',
    department: 'Analytics',
    position: 'Medior',
  },
];

const initialState = {
  employees: initialEmployees,
  filteredEmployees: initialEmployees,
  filterText: '',
  currentPage: 1,
  itemsPerPage: 10,
  viewMode: 'table',
};

const employeesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_EMPLOYEES:
      try {
        const storedEmployees = localStorage.getItem('employees');
        if (storedEmployees) {
          const parsedEmployees = JSON.parse(storedEmployees);
          if (Array.isArray(parsedEmployees) && parsedEmployees.length > 0) {
            return {
              ...state,
              employees: parsedEmployees,
              filteredEmployees: applyFilter(parsedEmployees, state.filterText),
            };
          }
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
      return state;

    case ActionTypes.ADD_EMPLOYEE: {
      const newEmployee = {
        ...action.payload,
        id: generateId(),
      };
      const updatedEmployees = [...state.employees, newEmployee];
      return {
        ...state,
        employees: updatedEmployees,
        filteredEmployees: applyFilter(updatedEmployees, state.filterText),
      };
    }

    case ActionTypes.UPDATE_EMPLOYEE: {
      const updatedEmployees = state.employees.map((employee) =>
        employee.id === action.payload.id ? action.payload : employee
      );
      return {
        ...state,
        employees: updatedEmployees,
        filteredEmployees: applyFilter(updatedEmployees, state.filterText),
      };
    }

    case ActionTypes.DELETE_EMPLOYEE: {
      const filteredEmployees = state.employees.filter(
        (employee) => employee.id !== action.payload
      );
      return {
        ...state,
        employees: filteredEmployees,
        filteredEmployees: applyFilter(filteredEmployees, state.filterText),
      };
    }

    case ActionTypes.SET_EMPLOYEE_FILTER: {
      const filterText = action.payload;
      return {
        ...state,
        filterText,
        filteredEmployees: applyFilter(state.employees, filterText),
        currentPage: 1, // Reset to first page when filtering
      };
    }

    case ActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };

    case ActionTypes.SET_VIEW_MODE:
      return {
        ...state,
        viewMode: action.payload,
      };

    default:
      return state;
  }
};

// Helper function to filter employees
const applyFilter = (employees, filterText) => {
  if (!filterText) return employees;

  const lowerCaseFilter = filterText.toLowerCase();
  return employees.filter(
    (employee) =>
      employee.firstName.toLowerCase().includes(lowerCaseFilter) ||
      employee.lastName.toLowerCase().includes(lowerCaseFilter) ||
      employee.email.toLowerCase().includes(lowerCaseFilter) ||
      employee.department.toLowerCase().includes(lowerCaseFilter) ||
      employee.position.toLowerCase().includes(lowerCaseFilter)
  );
};

export default employeesReducer;
