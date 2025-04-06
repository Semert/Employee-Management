import {html, fixture, fixtureCleanup} from '@open-wc/testing';
import {expect} from 'chai';
import sinon from 'sinon';

// Configure global test variables
window.html = html;
window.fixture = fixture;
window.fixtureCleanup = fixtureCleanup;
window.expect = expect;
window.sinon = sinon;

// Mock localStorage
const localStorageMock = (function () {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {value: localStorageMock});

// Mock for HTML lang attribute
document.documentElement.lang = 'en';
