import {LitElement, html, css} from 'lit';
import {connect} from '../../pwa-helpers/connect-mixin.js';
import {store} from '../../redux/store.js';
import {LocalizeMixin} from '../../utils/localization.js';
import {addEmployee, updateEmployee} from '../../redux/actions.js';
import {validateEmployeeForm} from '../../utils/validation.js';
import {DEPARTMENTS, POSITIONS} from '../../utils/constants.js';
import '../common/confirmation-dialog.js';

class EmployeeForm extends LocalizeMixin(connect(store)(LitElement)) {
  static properties = {
    employee: {type: Object},
    isEdit: {type: Boolean},
    employeeId: {type: String},
    errors: {type: Object},
    employees: {type: Array},
    showUpdateConfirmation: {type: Boolean},
  };

  static styles = css`
    :host {
      display: block;
      padding: 2.5rem;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      max-width: 900px;
      margin: 2.5rem auto;
    }

    .header {
      margin-bottom: 3rem;
      border-bottom: 1px solid #eaeaea;
      padding-bottom: 1.5rem;
    }

    h1 {
      color: #333;
      margin-bottom: 0.75rem;
      font-size: 2rem;
      font-weight: 600;
    }

    .form-subtitle {
      color: #666;
      margin-top: 0;
      font-size: 1.1rem;
      line-height: 1.5;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2.5rem 3rem;
      margin-bottom: 2.5rem;
    }

    .form-field {
      position: relative;
    }

    label {
      display: block;
      margin-bottom: 0.85rem;
      font-weight: 600;
      color: #444;
      font-size: 1rem;
      transition: color 0.2s;
    }

    input:focus + label,
    select:focus + label {
      color: #ff6b00;
    }

    input,
    select {
      width: 100%;
      padding: 1rem 0;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1.05rem;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
      background-color: #fff;
    }

    input:focus,
    select:focus {
      border-color: #ff6b00;
      box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.15);
      outline: none;
    }

    .date-input {
      position: relative;
    }

    .date-input input {
      padding-right: 0rem;
    }

    .date-icon {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #aaa;
      pointer-events: none;
    }

    .error {
      color: #f44336;
      font-size: 0.9rem;
      margin-top: 0.6rem;
      padding-left: 0.3rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .error::before {
      content: '⚠️';
      font-size: 0.9rem;
    }

    input.invalid,
    select.invalid {
      border-color: #f44336;
      box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.08);
      background-color: #fff8f8;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 1.5rem;
      margin-top: 3.5rem;
      padding-top: 2rem;
      border-top: 1px solid #eaeaea;
    }

    .btn {
      padding: 1rem 2.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      border: none;
      font-size: 1.05rem;
      transition: all 0.2s ease;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      min-width: 150px;
      letter-spacing: 0.01em;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .btn:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .cancel-btn {
      background-color: #f5f5f5;
      color: #555;
    }

    .cancel-btn:hover {
      background-color: #e8e8e8;
    }

    .submit-btn {
      background-color: #ff6b00;
      color: white;
    }

    .submit-btn:hover {
      background-color: #e85f00;
    }

    input::placeholder {
      color: #aaa;
      font-size: 0.95rem;
      font-style: italic;
      opacity: 0.8;
      padding: 0px 12px;
    }

    select {
      appearance: none;
      padding-right: 0rem;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 1rem center;
      background-size: 1.2rem;
    }

    select option {
      font-size: 1rem;
      padding: 0.5rem;
    }

    /* Improve focus indicator for accessibility */
    input:focus-visible,
    select:focus-visible {
      outline: 2px solid #ff6b00;
      outline-offset: 1px;
    }

    /* Add a hover effect to inputs */
    input:hover,
    select:hover {
      border-color: #ccc;
    }

    @media (max-width: 768px) {
      :host {
        padding: 1.5rem;
        margin: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      h1 {
        font-size: 1.8rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .actions {
        flex-direction: column-reverse;
        gap: 1rem;
      }

      .btn {
        width: 100%;
        padding: 1rem;
        min-width: auto;
      }
    }
  `;

  constructor() {
    super();
    this.isEdit = false;
    this.employeeId = null;
    this.employee = this.getEmptyEmployee();
    this.errors = {};
    this.employees = [];
    this.showUpdateConfirmation = false;
  }

  stateChanged(state) {
    this.employees = state.employees;

    // If we're editing, find the employee in the state
    if (this.isEdit && this.employeeId && this.employees.length > 0) {
      const employeeToEdit = this.employees.find(
        (emp) => emp.id === this.employeeId
      );
      if (
        employeeToEdit &&
        (!this.employee.id || this.employee.id === employeeToEdit.id)
      ) {
        this.employee = {...employeeToEdit};
      }
    }
  }

  getEmptyEmployee() {
    return {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: '',
      position: '',
    };
  }

  handleInput(e, field) {
    this.employee = {
      ...this.employee,
      [field]: e.target.value,
    };

    // Clear error when user starts typing
    if (this.errors[field]) {
      this.errors = {
        ...this.errors,
        [field]: '',
      };
    }
  }

  validateForm() {
    return validateEmployeeForm(this.employee, this.employees, this.isEdit);
  }

  handleSubmit(e) {
    e.preventDefault();

    // Validate the form
    const errors = this.validateForm();

    if (Object.keys(errors).length === 0) {
      if (this.isEdit) {
        // Show confirmation dialog for updates
        this.showUpdateConfirmation = true;
      } else {
        // Directly save new employees
        this.saveEmployee();
      }
    } else {
      this.errors = errors;
    }
  }

  confirmUpdate() {
    this.saveEmployee();
    this.cancelUpdate();
  }

  cancelUpdate() {
    this.showUpdateConfirmation = false;
  }

  saveEmployee() {
    if (this.isEdit) {
      store.dispatch(updateEmployee(this.employee));
    } else {
      store.dispatch(addEmployee(this.employee));
    }

    // Navigate back to list
    history.pushState(null, '', '/');
    window.dispatchEvent(
      new CustomEvent('route-changed', {
        detail: {path: '/'},
      })
    );
  }

  cancel() {
    // Navigate back to list
    history.pushState(null, '', '/');
    window.dispatchEvent(
      new CustomEvent('route-changed', {
        detail: {path: '/'},
      })
    );
  }

  render() {
    const departments = DEPARTMENTS;
    const positions = POSITIONS;

    return html`
      <div>
        <div class="header">
          <h1>
            ${this.isEdit ? this.t('form.editTitle') : this.t('form.addTitle')}
          </h1>
          <p class="form-subtitle">
            ${this.isEdit
              ? html`${this.t('form.editTitle')}
                  <strong
                    >${this.employee.firstName}
                    ${this.employee.lastName}</strong
                  >`
              : this.t('form.addTitle')}
          </p>
        </div>

        <form @submit="${this.handleSubmit}">
          <div class="form-grid">
            <!-- First Name -->
            <div class="form-field">
              <label for="firstName">${this.t('form.firstName')}</label>
              <input
                type="text"
                id="firstName"
                .value="${this.employee.firstName}"
                @input="${(e) => this.handleInput(e, 'firstName')}"
                class="${this.errors.firstName ? 'invalid' : ''}"
              />
              ${this.errors.firstName
                ? html`<div class="error">${this.errors.firstName}</div>`
                : ''}
            </div>

            <!-- Last Name -->
            <div class="form-field">
              <label for="lastName">${this.t('form.lastName')}</label>
              <input
                type="text"
                id="lastName"
                .value="${this.employee.lastName}"
                @input="${(e) => this.handleInput(e, 'lastName')}"
                class="${this.errors.lastName ? 'invalid' : ''}"
              />
              ${this.errors.lastName
                ? html`<div class="error">${this.errors.lastName}</div>`
                : ''}
            </div>

            <!-- Date of Employment -->
            <div class="form-field">
              <label for="dateOfEmployment"
                >${this.t('form.dateOfEmployment')}</label
              >
              <div class="date-input">
                <input
                  type="text"
                  id="dateOfEmployment"
                  placeholder="DD/MM/YYYY"
                  .value="${this.employee.dateOfEmployment}"
                  @input="${(e) => this.handleInput(e, 'dateOfEmployment')}"
                  class="${this.errors.dateOfEmployment ? 'invalid' : ''}"
                />
                <span class="date-icon">📅</span>
              </div>
              ${this.errors.dateOfEmployment
                ? html`<div class="error">${this.errors.dateOfEmployment}</div>`
                : ''}
            </div>

            <!-- Date of Birth -->
            <div class="form-field">
              <label for="dateOfBirth">${this.t('form.dateOfBirth')}</label>
              <div class="date-input">
                <input
                  type="text"
                  id="dateOfBirth"
                  placeholder="DD/MM/YYYY"
                  .value="${this.employee.dateOfBirth}"
                  @input="${(e) => this.handleInput(e, 'dateOfBirth')}"
                  class="${this.errors.dateOfBirth ? 'invalid' : ''}"
                />
                <span class="date-icon">📅</span>
              </div>
              ${this.errors.dateOfBirth
                ? html`<div class="error">${this.errors.dateOfBirth}</div>`
                : ''}
            </div>

            <!-- Phone Number -->
            <div class="form-field">
              <label for="phone">${this.t('form.phone')}</label>
              <input
                type="text"
                id="phone"
                placeholder="+90 XXX XXX XX XX"
                .value="${this.employee.phone}"
                @input="${(e) => this.handleInput(e, 'phone')}"
                class="${this.errors.phone ? 'invalid' : ''}"
              />
              ${this.errors.phone
                ? html`<div class="error">${this.errors.phone}</div>`
                : ''}
            </div>

            <!-- Email -->
            <div class="form-field">
              <label for="email">${this.t('form.email')}</label>
              <input
                type="email"
                id="email"
                placeholder="example@domain.com"
                .value="${this.employee.email}"
                @input="${(e) => this.handleInput(e, 'email')}"
                class="${this.errors.email ? 'invalid' : ''}"
              />
              ${this.errors.email
                ? html`<div class="error">${this.errors.email}</div>`
                : ''}
            </div>

            <!-- Department -->
            <div class="form-field">
              <label for="department">${this.t('form.department')}</label>
              <select
                id="department"
                .value="${this.employee.department}"
                @change="${(e) => this.handleInput(e, 'department')}"
                class="${this.errors.department ? 'invalid' : ''}"
              >
                <option value="" disabled selected>
                  ${this.t('form.selectDepartment')}
                </option>
                ${departments.map(
                  (dept) => html`
                    <option
                      value="${dept}"
                      ?selected="${this.employee.department === dept}"
                    >
                      ${this.t(`department.${dept.toLowerCase()}`)}
                    </option>
                  `
                )}
              </select>
              ${this.errors.department
                ? html`<div class="error">${this.errors.department}</div>`
                : ''}
            </div>

            <!-- Position -->
            <div class="form-field">
              <label for="position">${this.t('form.position')}</label>
              <select
                id="position"
                .value="${this.employee.position}"
                @change="${(e) => this.handleInput(e, 'position')}"
                class="${this.errors.position ? 'invalid' : ''}"
              >
                <option value="" disabled selected>
                  ${this.t('form.selectPosition')}
                </option>
                ${positions.map(
                  (pos) => html`
                    <option
                      value="${pos}"
                      ?selected="${this.employee.position === pos}"
                    >
                      ${this.t(`position.${pos.toLowerCase()}`)}
                    </option>
                  `
                )}
              </select>
              ${this.errors.position
                ? html`<div class="error">${this.errors.position}</div>`
                : ''}
            </div>
          </div>

          <div class="actions">
            <button
              type="button"
              class="btn cancel-btn"
              @click="${this.cancel}"
            >
              ${this.t('actions.cancel')}
            </button>
            <button type="submit" class="btn submit-btn">
              ${this.t('actions.save')}
            </button>
          </div>
        </form>

        ${this.showUpdateConfirmation
          ? html`
              <confirmation-dialog
                .title="${this.t('confirm.update.title')}"
                .message="${this.t('confirm.update.message')}"
                .open="${true}"
                @proceed="${this.confirmUpdate}"
                @cancel="${this.cancelUpdate}"
              ></confirmation-dialog>
            `
          : ''}
      </div>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
