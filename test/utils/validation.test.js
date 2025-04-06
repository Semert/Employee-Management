import {
  validateRequired,
  validateEmail,
  validatePhone,
  validateDate,
  validateUniqueEmail,
  validateEmployeeForm,
} from '../../src/utils/validation.js';
import '../setup.js';

describe('validation utilities', () => {
  it('should validate required fields', () => {
    expect(validateRequired('')).to.not.equal('');
    expect(validateRequired('  ')).to.not.equal('');
    expect(validateRequired(null)).to.not.equal('');
    expect(validateRequired(undefined)).to.not.equal('');

    expect(validateRequired('value')).to.equal('');
  });

  it('should validate email format', () => {
    expect(validateEmail('')).to.not.equal('');
    expect(validateEmail('not-an-email')).to.not.equal('');
    expect(validateEmail('missing@tld')).to.not.equal('');

    expect(validateEmail('valid@example.com')).to.equal('');
    expect(validateEmail('valid.email+tag@example.co.uk')).to.equal('');
  });

  it('should validate phone format', () => {
    expect(validatePhone('')).to.not.equal('');
    expect(validatePhone('not-a-phone')).to.not.equal('');

    expect(validatePhone('+1 234 567 8900')).to.equal('');
    expect(validatePhone('123 456 7890')).to.equal('');
    expect(validatePhone('+90 532 123 45 67')).to.equal('');
  });

  it('should validate date format', () => {
    expect(validateDate('')).to.not.equal('');
    expect(validateDate('not-a-date')).to.not.equal('');
    expect(validateDate('2020-01-01')).to.not.equal(''); // Wrong format
    expect(validateDate('01/01/20')).to.not.equal(''); // Incomplete year
    expect(validateDate('31/02/2020')).to.not.equal(''); // Invalid date (Feb 31)

    expect(validateDate('01/01/2020')).to.equal('');
    expect(validateDate('31/12/2020')).to.equal('');
    expect(validateDate('29/02/2020')).to.equal(''); // Leap year
  });

  it('should validate unique email', () => {
    const employees = [
      {id: '1', email: 'existing@example.com'},
      {id: '2', email: 'another@example.com'},
    ];

    // New email should pass
    expect(validateUniqueEmail('new@example.com', employees)).to.equal('');

    // Existing email should fail
    expect(validateUniqueEmail('existing@example.com', employees)).to.not.equal(
      ''
    );

    // Existing email but same ID (editing) should pass
    expect(
      validateUniqueEmail('existing@example.com', employees, '1')
    ).to.equal('');
  });

  it('should validate the entire employee form', () => {
    const employees = [{id: '1', email: 'existing@example.com'}];

    // Empty employee should have errors
    const emptyEmployee = {};
    const emptyResult = validateEmployeeForm(emptyEmployee, employees);
    expect(Object.keys(emptyResult).length).to.be.greaterThan(0);

    // Valid employee should pass
    const validEmployee = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      dateOfEmployment: '01/01/2020',
      dateOfBirth: '01/01/1980',
      department: 'Tech',
      position: 'Senior',
    };

    const validResult = validateEmployeeForm(validEmployee, employees);
    expect(Object.keys(validResult).length).to.equal(0);

    // Employee with existing email should fail
    const duplicateEmailEmployee = {
      ...validEmployee,
      email: 'existing@example.com',
    };

    const duplicateResult = validateEmployeeForm(
      duplicateEmailEmployee,
      employees
    );
    expect(Object.keys(duplicateResult).length).to.be.greaterThan(0);
    expect(duplicateResult.email).to.exist;

    // Editing same employee with same email should pass
    const editingSameEmployee = {
      ...duplicateEmailEmployee,
      id: '1',
    };

    const editingResult = validateEmployeeForm(
      editingSameEmployee,
      employees,
      true
    );
    expect(Object.keys(editingResult).length).to.equal(0);
  });
});
