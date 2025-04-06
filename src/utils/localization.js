import enTranslations from '../locales/en.js';
import trTranslations from '../locales/tr.js';

// Simple localization service
class LocalizationService {
  constructor() {
    this.locale = document.documentElement.lang || 'en';
    this.translations = {
      en: enTranslations,
      tr: trTranslations,
    };
  }

  setLocale(locale) {
    if (this.translations[locale]) {
      this.locale = locale;
      document.documentElement.lang = locale;
      // Dispatch event to notify components of language change
      window.dispatchEvent(
        new CustomEvent('language-changed', {detail: locale})
      );
    }
  }

  translate(key) {
    const translation = this.translations[this.locale][key];
    return translation !== undefined ? translation : key;
  }
}

export const localizationService = new LocalizationService();

// Translation helper function
export const t = (key) => localizationService.translate(key);

// Mixin for localized components
export const LocalizeMixin = (superClass) =>
  class extends superClass {
    connectedCallback() {
      super.connectedCallback && super.connectedCallback();
      // Force re-render when language changes
      this._languageChangedHandler = () => this.requestUpdate();
      window.addEventListener('language-changed', this._languageChangedHandler);
    }

    disconnectedCallback() {
      window.removeEventListener(
        'language-changed',
        this._languageChangedHandler
      );
      super.disconnectedCallback && super.disconnectedCallback();
    }

    t(key) {
      return t(key);
    }
  };
