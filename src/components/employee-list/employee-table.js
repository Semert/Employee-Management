import {LitElement, html, css} from 'lit';
import {t} from '../../utils/localization.js';

export class EmployeeTable extends LitElement {
  static get properties() {
    return {
      employees: {type: Array},
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        overflow-x: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #eee;
        font-size: 0.9rem;
      }

      th,
      td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #eee;
      }

      th {
        background-color: #f8f8f8;
        font-weight: bold;
        color: #333;
        position: sticky;
        top: 0;
      }

      tr:hover {
        background-color: #f5f5f5;
      }

      .checkbox {
        width: 40px;
        text-align: center;
      }

      .actions {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
      }

      .edit-btn,
      .delete-btn {
        background: none;
        border: none;
        cursor: pointer;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
      }

      .edit-btn {
        color: #2196f3;
      }

      .delete-btn {
        color: #f44336;
      }

      .edit-btn:hover,
      .delete-btn:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    `;
  }

  handleEdit(employee) {
    this.dispatchEvent(
      new CustomEvent('edit-employee', {
        detail: employee,
        bubbles: true,
        composed: true,
      })
    );
  }

  handleDelete(employee) {
    this.dispatchEvent(
      new CustomEvent('delete-employee', {
        detail: employee,
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <table>
        <thead>
          <tr>
            <th class="checkbox">
              <input type="checkbox" disabled />
            </th>
            <th>${t('employeeList.firstName')}</th>
            <th>${t('employeeList.lastName')}</th>
            <th>${t('employeeList.dateOfEmployment')}</th>
            <th>${t('employeeList.dateOfBirth')}</th>
            <th>${t('employeeList.phone')}</th>
            <th>${t('employeeList.email')}</th>
            <th>${t('employeeList.department')}</th>
            <th>${t('employeeList.position')}</th>
            <th>${t('employeeList.actions')}</th>
          </tr>
        </thead>
        <tbody>
          ${this.employees.map(
            (employee) => html`
              <tr>
                <td class="checkbox">
                  <input type="checkbox" />
                </td>
                <td>${employee.firstName}</td>
                <td>${employee.lastName}</td>
                <td>${employee.dateOfEmployment}</td>
                <td>${employee.dateOfBirth}</td>
                <td>${employee.phone}</td>
                <td>${employee.email}</td>
                <td>${employee.department}</td>
                <td>${employee.position}</td>
                <td>
                  <div class="actions">
                    <button
                      class="edit-btn"
                      @click="${() => this.handleEdit(employee)}"
                      title="${t('actions.edit')}"
                    >
                      ✏️
                    </button>
                    <button
                      class="delete-btn"
                      @click="${() => this.handleDelete(employee)}"
                      title="${t('actions.delete')}"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }
}

customElements.define('employee-table', EmployeeTable);
