import {LitElement, html, css} from 'lit';
import {t} from '../../utils/localization.js';

export class EmployeeCardList extends LitElement {
  static get properties() {
    return {
      employees: {type: Array},
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .card-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
      }

      .card {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        transition: transform 0.3s, box-shadow 0.3s;
      }

      .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }

      .card-header {
        background-color: #f8f8f8;
        padding: 1rem;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .card-title {
        font-weight: bold;
        margin: 0;
      }

      .card-body {
        padding: 1rem;
      }

      .info-row {
        display: flex;
        margin-bottom: 0.5rem;
      }

      .info-label {
        width: 40%;
        font-weight: bold;
        color: #777;
      }

      .info-value {
        width: 60%;
      }

      .card-footer {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        padding: 1rem;
        background-color: #f8f8f8;
        border-top: 1px solid #eee;
      }

      .btn {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        border: none;
      }

      .edit-btn {
        background-color: #2196f3;
        color: white;
      }

      .delete-btn {
        background-color: #f44336;
        color: white;
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
      <div class="card-list">
        ${this.employees.map(
          (employee) => html`
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">
                  ${employee.firstName} ${employee.lastName}
                </h3>
                <span>${employee.position}</span>
              </div>
              <div class="card-body">
                <div class="info-row">
                  <div class="info-label">${t('employeeList.department')}</div>
                  <div class="info-value">${employee.department}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">${t('employeeList.email')}</div>
                  <div class="info-value">${employee.email}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">${t('employeeList.phone')}</div>
                  <div class="info-value">${employee.phone}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">
                    ${t('employeeList.dateOfEmployment')}
                  </div>
                  <div class="info-value">${employee.dateOfEmployment}</div>
                </div>
              </div>
              <div class="card-footer">
                <button
                  class="btn edit-btn"
                  @click="${() => this.handleEdit(employee)}"
                >
                  <span>✏️</span> ${t('actions.edit')}
                </button>
                <button
                  class="btn delete-btn"
                  @click="${() => this.handleDelete(employee)}"
                >
                  <span>🗑️</span> ${t('actions.delete')}
                </button>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }
}

customElements.define('employee-card-list', EmployeeCardList);
