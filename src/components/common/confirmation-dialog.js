import {LitElement, html, css} from 'lit';

export class ConfirmationDialog extends LitElement {
  static properties = {
    title: {type: String},
    message: {type: String},
    open: {type: Boolean},
  };

  static styles = css`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .dialog {
      background-color: white;
      border-radius: 8px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      overflow: hidden;
    }

    .dialog-header {
      padding: 1rem;
      background-color: #f8f8f8;
      border-bottom: 1px solid #eee;
    }

    .dialog-title {
      margin: 0;
      color: #ff6b00;
      font-size: 1.2rem;
    }

    .dialog-body {
      padding: 1.5rem;
    }

    .dialog-message {
      margin: 0;
      color: #555;
    }

    .dialog-footer {
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
      font-weight: bold;
      cursor: pointer;
      border: none;
    }

    .cancel-btn {
      background-color: white;
      color: #333;
      border: 1px solid #ddd;
    }

    .proceed-btn {
      background-color: #ff6b00;
      color: white;
    }
  `;

  constructor() {
    super();
    this.title = 'Are you sure?';
    this.message = '';
    this.open = false;
  }

  cancel() {
    this.dispatchEvent(new CustomEvent('cancel'));
  }

  proceed() {
    this.dispatchEvent(new CustomEvent('proceed'));
  }

  render() {
    if (!this.open) return html``;

    return html`
      <div class="dialog">
        <div class="dialog-header">
          <h2 class="dialog-title">${this.title}</h2>
        </div>
        <div class="dialog-body">
          <p class="dialog-message">${this.message}</p>
        </div>
        <div class="dialog-footer">
          <button class="btn cancel-btn" @click="${this.cancel}">Cancel</button>
          <button class="btn proceed-btn" @click="${this.proceed}">
            Proceed
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('confirmation-dialog', ConfirmationDialog);
