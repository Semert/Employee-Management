import {LitElement, html, css} from 'lit';
import {connect} from '../../pwa-helpers/connect-mixin.js';
import {store} from '../../redux/store.js';
import {LocalizeMixin} from '../../utils/localization.js';
import {
  setEmployeeFilter,
  setViewMode,
  deleteEmployee,
  setCurrentPage,
} from '../../redux/actions.js';
import '../common/confirmation-dialog.js';

class EmployeeList extends LocalizeMixin(connect(store)(LitElement)) {
  static properties = {
    employees: {type: Array},
    filteredEmployees: {type: Array},
    currentPage: {type: Number},
    itemsPerPage: {type: Number},
    viewMode: {type: String},
    filterText: {type: String},
    showDeleteConfirmation: {type: Boolean},
    employeeToDelete: {type: Object},
  };

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    h1 {
      color: #ff6b00;
      margin: 0;
      font-size: 1.5rem;
    }

    .add-button {
      background-color: #ff6b00;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0.5rem 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: bold;
      text-decoration: none;
    }

    .controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .search-box {
      position: relative;
      flex: 1;
      max-width: 300px;
    }

    .search-input {
      width: 100%;
      padding: 0.6rem 1rem 0.6rem 2.2rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #777;
    }

    .view-toggles {
      display: flex;
      gap: 0.5rem;
    }

    .view-toggle {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      color: #888;
    }

    .view-toggle.active {
      color: #ff6b00;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #eee;
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
      color: #ff6b00;
    }

    .checkbox {
      width: 40px;
      text-align: center;
    }

    .actions {
      width: 100px;
      text-align: right;
    }

    .action-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: #ff6b00;
      font-size: 1.2rem;
      padding: 0.25rem;
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
    }

    .card-header {
      background-color: #f8f8f8;
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }

    .card-title {
      margin: 0;
      font-weight: bold;
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
      padding: 1rem;
      background-color: #f8f8f8;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 1rem;
      gap: 0.5rem;
    }

    .page-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #ddd;
      background-color: white;
      cursor: pointer;
      border-radius: 4px;
    }

    .page-btn.active {
      background-color: #ff6b00;
      color: white;
      border-color: #ff6b00;
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .ellipsis {
      padding: 0 0.5rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      background-color: #f8f8f8;
      border-radius: 8px;
      margin: 2rem 0;
    }

    /* Mobile responsive adjustments */
    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .controls {
        flex-direction: column;
        align-items: stretch;
      }

      .search-box {
        max-width: none;
      }

      table,
      th,
      td {
        font-size: 0.85rem;
        padding: 0.5rem;
      }

      .actions,
      .card-footer {
        flex-direction: column;
        align-items: flex-end;
      }

      /* Hide the table view toggle on mobile to force card view */
      .view-toggle.table-toggle {
        display: none;
      }
    }
  `;

  constructor() {
    super();
    this.employees = [];
    this.filteredEmployees = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.viewMode = 'table';
    this.filterText = '';
    this.showDeleteConfirmation = false;
    this.employeeToDelete = null;
    this._resizeHandler = this._handleResize.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this._resizeHandler);
    this._handleResize();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this._resizeHandler);
  }

  _handleResize() {
    if (window.innerWidth < 1100 && this.viewMode !== 'list') {
      store.dispatch(setViewMode('list'));
    }
  }

  stateChanged(state) {
    this.employees = state.employees;
    this.filteredEmployees = state.filteredEmployees;
    this.currentPage = state.currentPage;
    this.viewMode = state.viewMode;
    this.filterText = state.filterText;
    this.itemsPerPage = state.itemsPerPage;
  }

  handleSearch(e) {
    store.dispatch(setEmployeeFilter(e.target.value));
  }

  handleViewModeChange(mode) {
    if (window.innerWidth < 768) {
      store.dispatch(setViewMode('list'));
    } else {
      store.dispatch(setViewMode(mode));
    }
  }

  handlePageChange(page) {
    store.dispatch(setCurrentPage(page));
  }
  handleEdit(employee) {
    const path = `#/edit/${employee.id}`;
    window.location.hash = path;

    window.dispatchEvent(
      new CustomEvent('route-changed', {
        detail: {path},
      })
    );
  }

  handleDelete(employee) {
    this.employeeToDelete = employee;
    this.showDeleteConfirmation = true;
  }

  confirmDelete() {
    if (this.employeeToDelete) {
      store.dispatch(deleteEmployee(this.employeeToDelete.id));
      this.cancelDelete();
    }
  }

  cancelDelete() {
    this.showDeleteConfirmation = false;
    this.employeeToDelete = null;
  }

  getCurrentPageEmployees() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredEmployees.slice(startIndex, endIndex);
  }

  getTotalPages() {
    return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
  }

  renderPageNumbers() {
    const pages = [];
    const totalPages = this.getTotalPages();
    const delta = 2;
    let leftBound = Math.max(1, this.currentPage - delta);
    let rightBound = Math.min(totalPages, this.currentPage + delta);

    if (leftBound > 1) {
      pages.push(
        html`<button
          class="page-btn"
          @click="${() => this.handlePageChange(1)}"
        >
          1
        </button>`
      );
      if (leftBound > 2) {
        pages.push(html`<span class="ellipsis">...</span>`);
      }
    }

    for (let i = leftBound; i <= rightBound; i++) {
      pages.push(html`
        <button
          class="page-btn ${i === this.currentPage ? 'active' : ''}"
          @click="${() => this.handlePageChange(i)}"
        >
          ${i}
        </button>
      `);
    }

    if (rightBound < totalPages) {
      if (rightBound < totalPages - 1) {
        pages.push(html`<span class="ellipsis">...</span>`);
      }
      pages.push(html`
        <button
          class="page-btn"
          @click="${() => this.handlePageChange(totalPages)}"
        >
          ${totalPages}
        </button>
      `);
    }

    return pages;
  }

  renderPagination() {
    const totalPages = this.getTotalPages();
    if (totalPages <= 1) return html``;
    return html`
      <div class="pagination">
        <button
          class="page-btn"
          @click="${() => this.handlePageChange(this.currentPage - 1)}"
          ?disabled="${this.currentPage <= 1}"
        >
          &lt;
        </button>
        ${this.renderPageNumbers()}
        <button
          class="page-btn"
          @click="${() => this.handlePageChange(this.currentPage + 1)}"
          ?disabled="${this.currentPage >= totalPages}"
        >
          &gt;
        </button>
      </div>
    `;
  }

  renderTableView() {
    const currentPageEmployees = this.getCurrentPageEmployees();
    return html`
      <table>
        <thead>
          <tr>
            <th class="checkbox"><input type="checkbox" /></th>
            <th>${this.t('employeeList.firstName')}</th>
            <th>${this.t('employeeList.lastName')}</th>
            <th>${this.t('employeeList.dateOfEmployment')}</th>
            <th>${this.t('employeeList.dateOfBirth')}</th>
            <th>${this.t('employeeList.phone')}</th>
            <th>${this.t('employeeList.email')}</th>
            <th>${this.t('employeeList.department')}</th>
            <th>${this.t('employeeList.position')}</th>
            <th class="actions">${this.t('employeeList.actions')}</th>
          </tr>
        </thead>
        <tbody>
          ${currentPageEmployees.map(
            (employee) => html`
              <tr>
                <td class="checkbox"><input type="checkbox" /></td>
                <td>${employee.firstName}</td>
                <td>${employee.lastName}</td>
                <td>${employee.dateOfEmployment}</td>
                <td>${employee.dateOfBirth}</td>
                <td>${employee.phone}</td>
                <td>${employee.email}</td>
                <td>${employee.department}</td>
                <td>${employee.position}</td>
                <td class="actions">
                  <button
                    class="action-btn edit-btn"
                    @click="${() => this.handleEdit(employee)}"
                    title="${this.t('actions.edit')}"
                  >
                    ✏️
                  </button>
                  <button
                    class="action-btn delete-btn"
                    @click="${() => this.handleDelete(employee)}"
                    title="${this.t('actions.delete')}"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }

  renderCardView() {
    const currentPageEmployees = this.getCurrentPageEmployees();
    return html`
      <div class="card-list">
        ${currentPageEmployees.map(
          (employee) => html`
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">
                  ${employee.firstName} ${employee.lastName}
                </h3>
              </div>
              <div class="card-body">
                <div class="info-row">
                  <div class="info-label">${this.t('employeeList.email')}:</div>
                  <div class="info-value">${employee.email}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">${this.t('employeeList.phone')}:</div>
                  <div class="info-value">${employee.phone}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">
                    ${this.t('employeeList.department')}:
                  </div>
                  <div class="info-value">${employee.department}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">
                    ${this.t('employeeList.position')}:
                  </div>
                  <div class="info-value">${employee.position}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">
                    ${this.t('employeeList.dateOfEmployment')}:
                  </div>
                  <div class="info-value">${employee.dateOfEmployment}</div>
                </div>
              </div>
              <div class="card-footer">
                <button
                  class="action-btn edit-btn"
                  @click="${() => this.handleEdit(employee)}"
                  title="${this.t('actions.edit')}"
                >
                  ✏️
                </button>
                <button
                  class="action-btn delete-btn"
                  @click="${() => this.handleDelete(employee)}"
                  title="${this.t('actions.delete')}"
                >
                  🗑️
                </button>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }

  navigateTo(path, e) {
    e.preventDefault();
    window.location.hash = path;

    window.dispatchEvent(
      new CustomEvent('route-changed', {
        detail: {path},
      })
    );
  }

  render() {
    return html`
      <div>
        <div class="header">
          <h1>${this.t('employeeList.title')}</h1>
        </div>

        <div class="controls">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              class="search-input"
              placeholder="${this.t('employeeList.search')}"
              .value="${this.filterText}"
              @input="${this.handleSearch}"
            />
          </div>

          <div class="view-toggles">
            <!-- Only show table view toggle on desktop -->
            <button
              class="view-toggle table-toggle ${this.viewMode === 'table'
                ? 'active'
                : ''}"
              @click="${() => this.handleViewModeChange('table')}"
              title="Table View"
            >
              ⊞
            </button>
            <button
              class="view-toggle ${this.viewMode === 'list' ? 'active' : ''}"
              @click="${() => this.handleViewModeChange('list')}"
              title="Card View"
            >
              ≡
            </button>
          </div>
        </div>

        ${this.filteredEmployees.length === 0
          ? html`<div class="empty-state">
              ${this.t('employeeList.noResults')}
            </div>`
          : html`
              ${this.viewMode === 'table'
                ? this.renderTableView()
                : this.renderCardView()}
              ${this.renderPagination()}
            `}
        ${this.showDeleteConfirmation
          ? html`
              <confirmation-dialog
                .title="${this.t('confirm.delete.title')}"
                .message="${this.t('confirm.delete.message')} ${this
                  .employeeToDelete
                  ? `${this.employeeToDelete.firstName} ${this.employeeToDelete.lastName}`
                  : ''} ${this.t('confirm.delete.will')}"
                .open="${true}"
                @proceed="${this.confirmDelete}"
                @cancel="${this.cancelDelete}"
              >
              </confirmation-dialog>
            `
          : ''}
      </div>
    `;
  }
}

customElements.define('employee-list', EmployeeList);
