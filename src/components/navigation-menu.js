import {LitElement, html, css} from 'lit';
import {LocalizeMixin} from '../utils/localization.js';
import {localizationService} from '../utils/localization.js';

export class NavigationMenu extends LocalizeMixin(LitElement) {
  static properties = {
    currentPath: {type: String},
  };

  static styles = css`
    :host {
      display: block;
      background-color: #f8f8f8;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: #ff6b00;
      text-decoration: none;
      display: flex;
      align-items: center;
    }

    .logo-icon {
      width: 65px;
      height: 32px;
      margin-right: 0.5rem;
      background-color: #ff6b00;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }

    .nav-links {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .nav-link {
      text-decoration: none;
      color: #333;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .nav-link:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .nav-link.active {
      background-color: #ff6b00;
      color: white;
    }

    .language-toggle {
      display: flex;
      align-items: center;
      margin-left: 1rem;
      border-left: 1px solid #ddd;
      padding-left: 1rem;
    }

    .language-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      opacity: 0.5;
      font-weight: bold;
    }

    .language-btn.active {
      opacity: 1;
      color: #ff6b00;
    }

    @media (max-width: 768px) {
      .container {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .nav-links {
        width: 100%;
        flex-wrap: wrap;
      }

      .language-toggle {
        margin-left: 0;
        margin-top: 0.5rem;
        padding-left: 0;
        border-left: none;
        width: 100%;
        justify-content: flex-end;
      }
    }
  `;

  constructor() {
    super();
    this.currentPath = window.location.hash.slice(1) || '/'; // Get initial hash path
  }

  connectedCallback() {
    super.connectedCallback();
    // Update active link when hash changes
    window.addEventListener('hashchange', () => this.updateCurrentPath());
    // Initial path update
    this.updateCurrentPath();
  }

  disconnectedCallback() {
    // Cleanup event listeners to prevent memory leaks
    window.removeEventListener('hashchange', () => this.updateCurrentPath());
    super.disconnectedCallback();
  }

  updateCurrentPath() {
    this.currentPath = window.location.hash.slice(1) || '/';
    this.requestUpdate();
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

  switchLanguage(lang, e) {
    e.preventDefault();
    localizationService.setLocale(lang);
    this.requestUpdate();
  }

  render() {
    const currentLang = localizationService.locale;

    return html`
      <div class="container">
        <a href="#/" class="logo" @click="${(e) => this.navigateTo('/', e)}">
          <div class="logo-icon">ING</div>
        </a>

        <div class="nav-links">
          <a
            href="/"
            class="nav-link ${this.currentPath === '/' ||
            this.currentPath === '/employees'
              ? 'active'
              : ''}"
            @click="${(e) => this.navigateTo('/', e)}"
          >
            ${this.t('nav.employees')}
          </a>
          <a
            href="#/new"
            class="nav-link ${this.currentPath === '/new' ? 'active' : ''}"
            @click="${(e) => this.navigateTo('/new', e)}"
          >
            ${this.t('nav.addEmployee')}
          </a>

          <div class="language-toggle">
            <button
              @click="${(e) => this.switchLanguage('en', e)}"
              class="language-btn ${currentLang === 'en' ? 'active' : ''}"
            >
              EN
            </button>
            <button
              @click="${(e) => this.switchLanguage('tr', e)}"
              class="language-btn ${currentLang === 'tr' ? 'active' : ''}"
            >
              TR
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('navigation-menu', NavigationMenu);
