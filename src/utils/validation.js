import {t} from './localization.js';

export const validateRequired = (value) => {
  if (!value || value.trim() === '') {
    return t('validation.required');
  }
  return '';
};

export const validateEmail = (value) => {
  if (!value) {
    return t('validation.required');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return t('validation.email');
  }

  return '';
};

export const validatePhone = (value) => {
  if (!value) {
    return t('validation.required');
  }

  // Basic phone validation for international format: +XXX XXX XXX XX XX
  const phoneRegex = /^\+?[\d\s]+$/;
  if (!phoneRegex.test(value)) {
    return t('validation.phone');
  }

  return '';
};

export const validateDate = (value) => {
  if (!value) {
    return t('validation.required');
  }

  // Check date format (DD/MM/YYYY)
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  if (!dateRegex.test(value)) {
    return t('validation.date');
  }

  // Check if date is valid
  const [day, month, year] = value.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return t('validation.date');
  }

  return '';
};

export const validateUniqueEmail = (
  value,
  employees,
  currentEmployeeId = null
) => {
  if (!value) return '';

  const isExisting = employees.some(
    (employee) => employee.email === value && employee.id !== currentEmployeeId
  );

  if (isExisting) {
    return t('validation.unique');
  }

  return '';
};

// Validate the entire employee form
export const validateEmployeeForm = (employee, employees, isEdit = false) => {
  const errors = {};

  errors.firstName = validateRequired(employee.firstName);
  errors.lastName = validateRequired(employee.lastName);
  errors.dateOfEmployment = validateDate(employee.dateOfEmployment);
  errors.dateOfBirth = validateDate(employee.dateOfBirth);
  errors.phone = validatePhone(employee.phone);
  errors.email = validateEmail(employee.email);

  // Check unique email only if valid email format
  if (!errors.email) {
    errors.email = validateUniqueEmail(
      employee.email,
      employees,
      isEdit ? employee.id : null
    );
  }

  errors.department = validateRequired(employee.department);
  errors.position = validateRequired(employee.position);

  // Clean up errors object by removing empty error messages
  Object.keys(errors).forEach((key) => {
    if (!errors[key]) delete errors[key];
  });

  return errors;
};
