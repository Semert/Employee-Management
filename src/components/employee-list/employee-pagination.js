import {LitElement, html, css} from 'lit';

export class EmployeePagination extends LitElement {
  static get properties() {
    return {
      currentPage: {type: Number},
      totalPages: {type: Number},
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        margin-top: 1.5rem;
      }

      .pagination {
        display: flex;
        justify-content: center;
        gap: 0.25rem;
        align-items: center;
        flex-wrap: wrap;
      }

      .page-btn {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #ddd;
        background-color: white;
        color: #333;
        cursor: pointer;
        border-radius: 4px;
        font-size: 0.9rem;
      }

      .page-btn:hover {
        background-color: #f5f5f5;
      }

      .page-btn.active {
        background-color: #ff6b00;
        color: white;
        border-color: #ff6b00;
      }

      .page-btn.disabled {
        opacity: 0.5;
        pointer-events: none;
      }

      .ellipsis {
        padding: 0 0.5rem;
      }
    `;
  }

  goToPage(page) {
    if (page < 1 || page > this.totalPages) return;

    this.dispatchEvent(
      new CustomEvent('page-change', {
        detail: page,
        bubbles: true,
        composed: true,
      })
    );
  }

  renderPageNumbers() {
    const pages = [];

    // Always show first page, last page, and pages around current page
    const delta = 2; // Number of pages to show before and after current page

    // Calculate range
    let leftBound = Math.max(1, this.currentPage - delta);
    let rightBound = Math.min(this.totalPages, this.currentPage + delta);

    // Adjust range if needed
    if (leftBound > 1) {
      pages.push(
        html`<button class="page-btn" @click="${() => this.goToPage(1)}">
          1
        </button>`
      );
      if (leftBound > 2) {
        pages.push(html`<span class="ellipsis">...</span>`);
      }
    }

    // Add pages in range
    for (let i = leftBound; i <= rightBound; i++) {
      pages.push(html`
        <button
          class="page-btn ${i === this.currentPage ? 'active' : ''}"
          @click="${() => this.goToPage(i)}"
        >
          ${i}
        </button>
      `);
    }

    // Add last page if not included
    if (rightBound < this.totalPages) {
      if (rightBound < this.totalPages - 1) {
        pages.push(html`<span class="ellipsis">...</span>`);
      }
      pages.push(html`
        <button
          class="page-btn"
          @click="${() => this.goToPage(this.totalPages)}"
        >
          ${this.totalPages}
        </button>
      `);
    }

    return pages;
  }

  render() {
    if (this.totalPages <= 1) return html``;

    return html`
      <div class="pagination">
        <button
          class="page-btn ${this.currentPage <= 1 ? 'disabled' : ''}"
          @click="${() => this.goToPage(this.currentPage - 1)}"
          title="Previous page"
        >
          &lt;
        </button>

        ${this.renderPageNumbers()}

        <button
          class="page-btn ${this.currentPage >= this.totalPages
            ? 'disabled'
            : ''}"
          @click="${() => this.goToPage(this.currentPage + 1)}"
          title="Next page"
        >
          &gt;
        </button>
      </div>
    `;
  }
}

customElements.define('employee-pagination', EmployeePagination);
