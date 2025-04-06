import {store} from '../../src/redux/store.js';
import {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  setEmployeeFilter,
  setViewMode,
  setCurrentPage,
} from '../../src/redux/actions.js';
import '../setup.js';

describe('redux store', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
  });

  it('should add a new employee', () => {
    const initialState = store.getState();
    const initialCount = initialState.employees.length;

    const newEmployee = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '+1 234 567 8900',
      dateOfEmployment: '01/01/2020',
      dateOfBirth: '01/01/1980',
      department: 'Tech',
      position: 'Senior',
    };

    store.dispatch(addEmployee(newEmployee));

    const newState = store.getState();
    expect(newState.employees.length).to.equal(initialCount + 1);

    const addedEmployee = newState.employees.find(
      (e) => e.email === 'test@example.com'
    );
    expect(addedEmployee).to.exist;
    expect(addedEmployee.firstName).to.equal('Test');
    expect(addedEmployee.lastName).to.equal('User');
  });

  it('should update an existing employee', () => {
    // First add an employee
    const newEmployee = {
      firstName: 'Original',
      lastName: 'Name',
      email: 'original@example.com',
      phone: '+1 234 567 8900',
      dateOfEmployment: '01/01/2020',
      dateOfBirth: '01/01/1980',
      department: 'Tech',
      position: 'Senior',
    };

    store.dispatch(addEmployee(newEmployee));

    const stateAfterAdd = store.getState();
    const employeeToUpdate = stateAfterAdd.employees.find(
      (e) => e.email === 'original@example.com'
    );

    // Now update the employee
    const updatedEmployee = {
      ...employeeToUpdate,
      firstName: 'Updated',
      lastName: 'Employee',
    };

    store.dispatch(updateEmployee(updatedEmployee));

    const newState = store.getState();
    const updatedEmployeeInStore = newState.employees.find(
      (e) => e.id === employeeToUpdate.id
    );

    expect(updatedEmployeeInStore.firstName).to.equal('Updated');
    expect(updatedEmployeeInStore.lastName).to.equal('Employee');
  });

  it('should delete an employee', () => {
    // First add an employee
    const newEmployee = {
      firstName: 'To',
      lastName: 'Delete',
      email: 'delete@example.com',
      phone: '+1 234 567 8900',
      dateOfEmployment: '01/01/2020',
      dateOfBirth: '01/01/1980',
      department: 'Tech',
      position: 'Senior',
    };

    store.dispatch(addEmployee(newEmployee));

    const stateAfterAdd = store.getState();
    const employeeToDelete = stateAfterAdd.employees.find(
      (e) => e.email === 'delete@example.com'
    );
    const countBeforeDelete = stateAfterAdd.employees.length;

    // Now delete the employee
    store.dispatch(deleteEmployee(employeeToDelete.id));

    const newState = store.getState();
    expect(newState.employees.length).to.equal(countBeforeDelete - 1);
    expect(newState.employees.find((e) => e.id === employeeToDelete.id)).to.be
      .undefined;
  });

  it('should filter employees based on search text', () => {
    // Add a couple of employees with different names
    store.dispatch(
      addEmployee({
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@example.com',
        phone: '+1 234 567 8900',
        dateOfEmployment: '01/01/2020',
        dateOfBirth: '01/01/1980',
        department: 'Tech',
        position: 'Senior',
      })
    );

    store.dispatch(
      addEmployee({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        phone: '+1 234 567 8901',
        dateOfEmployment: '02/02/2020',
        dateOfBirth: '02/02/1982',
        department: 'Analytics',
        position: 'Junior',
      })
    );

    // Apply filter
    store.dispatch(setEmployeeFilter('John'));

    const stateAfterFilter = store.getState();
    expect(stateAfterFilter.filterText).to.equal('John');
    expect(stateAfterFilter.filteredEmployees.length).to.be.lessThan(
      stateAfterFilter.employees.length
    );

    // All filtered employees should contain "John"
    stateAfterFilter.filteredEmployees.forEach((employee) => {
      const values = Object.values(employee).join(' ').toLowerCase();
      expect(values.includes('john')).to.be.true;
    });
  });

  it('should change view mode', () => {
    const initialState = store.getState();
    const initialViewMode = initialState.viewMode;

    // Toggle view mode
    const newViewMode = initialViewMode === 'table' ? 'list' : 'table';
    store.dispatch(setViewMode(newViewMode));

    const newState = store.getState();
    expect(newState.viewMode).to.equal(newViewMode);
  });

  it('should change current page', () => {
    const initialState = store.getState();
    expect(initialState.currentPage).to.equal(1);

    // Change page
    store.dispatch(setCurrentPage(2));

    const newState = store.getState();
    expect(newState.currentPage).to.equal(2);
  });
});
