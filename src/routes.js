import {LitElement, html} from 'lit';
import './components/employee-list/employee-list.js';
import './components/employee-form/employee-form.js';

export class RouterOutlet extends LitElement {
  static properties = {
    route: {type: String},
  };

  constructor() {
    super();
    this.route = window.location.pathname;

    // Listen for route changes from browser history
    window.addEventListener('popstate', () => {
      this.route = window.location.pathname;
      this.requestUpdate();
    });

    // Listen for custom navigation events
    window.addEventListener('route-changed', (e) => {
      this.route = e.detail.path;
      this.requestUpdate();
    });
  }

  render() {
    if (this.route === '/' || this.route === '/employees') {
      return html`<employee-list></employee-list>`;
    } else if (this.route === '/new') {
      return html`<employee-form></employee-form>`;
    } else if (this.route.match(/\/edit\/(.+)/)) {
      const id = this.route.match(/\/edit\/(.+)/)[1];
      return html`<employee-form
        .isEdit="${true}"
        .employeeId="${id}"
      ></employee-form>`;
    } else {
      return html`<div>Page not found</div>`;
    }
  }
}

customElements.define('router-outlet', RouterOutlet);
