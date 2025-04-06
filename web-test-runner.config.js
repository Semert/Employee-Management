/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {legacyPlugin} from '@web/dev-server-legacy';
import {puppeteerLauncher} from '@web/test-runner-puppeteer';

const mode = process.env.MODE || 'dev';
if (!['dev', 'prod'].includes(mode)) {
  throw new Error(`MODE must be "dev" or "prod", was "${mode}"`);
}

// Use puppeteer launcher instead of playwright
const browsers = {
  // Local browser testing via puppeteer (just uses Chromium)
  chromium: puppeteerLauncher({
    launchOptions: {
      headless: true,
    },
  }),
};

// Prepend BROWSERS=x,y to `npm run test` to run a subset of browsers
// e.g. `BROWSERS=chromium npm run test`
const noBrowser = (b) => {
  throw new Error(`No browser configured named '${b}'; using defaults`);
};
let commandLineBrowsers;
try {
  commandLineBrowsers = process.env.BROWSERS?.split(',').map(
    (b) => browsers[b] ?? noBrowser(b)
  );
} catch (e) {
  console.warn(e);
}

// https://modern-web.dev/docs/test-runner/cli-and-configuration/
export default {
  rootDir: '.',
  files: ['./test/**/*.test.js'], // Updated to match your test file naming
  nodeResolve: {exportConditions: mode === 'dev' ? ['development'] : []},
  preserveSymlinks: true,
  browsers: commandLineBrowsers ?? [browsers.chromium], // Only use Chromium by default
  testFramework: {
    // https://mochajs.org/api/mocha
    config: {
      ui: 'bdd', // Changed to 'bdd' instead of 'tdd' to match your tests
      timeout: '60000',
    },
  },
  plugins: [
    // Detect browsers without modules (e.g. IE11) and transform to SystemJS
    // (https://modern-web.dev/docs/dev-server/plugins/legacy/).
    legacyPlugin({
      polyfills: {
        webcomponents: true,
        // Inject lit's polyfill-support module into test files, which is required
        // for interfacing with the webcomponents polyfills
        custom: [
          {
            name: 'lit-polyfill-support',
            path: 'node_modules/lit/polyfill-support.js',
            test: "!('attachShadow' in Element.prototype) || !('getRootNode' in Element.prototype) || window.ShadyDOM && window.ShadyDOM.force",
            module: false,
          },
        ],
      },
    }),
  ],
  coverage: true,
  coverageConfig: {
    include: ['src/**/*.js'],
    exclude: ['node_modules/**/*', 'test/**/*'],
    threshold: {
      statements: 85,
      branches: 85,
      functions: 85,
      lines: 85,
    },
  },
};
