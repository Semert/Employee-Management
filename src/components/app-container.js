import {LitElement, html, css} from 'lit';
import './navigation-menu.js';
import '../routes.js';
import {LocalizeMixin} from '../utils/localization.js';

export class AppContainer extends LocalizeMixin(LitElement) {
  static styles = css`
    :host {
      display: block;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
      line-height: 1.6;
      min-height: 100vh;
    }

    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    main {
      flex: 1;
      padding: 1rem;
      background-color: #f9f9f9;
    }

    .content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .app-footer {
      text-align: center;
      padding: 1rem;
      margin-top: 2rem;
      color: #777;
      font-size: 0.8rem;
      background-color: #f0f0f0;
    }
  `;

  render() {
    return html`
      <div class="app-container">
        <header>
          <navigation-menu></navigation-menu>
        </header>

        <main>
          <div class="content">
            <router-outlet></router-outlet>
          </div>
        </main>

        <footer class="app-footer">
          <p>&copy; 2024 ${this.t('app.title')}</p>
        </footer>
      </div>
    `;
  }
}

customElements.define('app-container', AppContainer);
