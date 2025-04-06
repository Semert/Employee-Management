import '../../src/components/app-container.js';
import '../setup.js';

describe('app-container', () => {
  beforeEach(() => {
    fixtureCleanup();
  });

  it('renders the navigation menu', async () => {
    const el = await fixture(html`<app-container></app-container>`);

    const navigationMenu = el.shadowRoot.querySelector('navigation-menu');
    expect(navigationMenu).to.exist;
  });

  it('renders the router outlet', async () => {
    const el = await fixture(html`<app-container></app-container>`);

    const routerOutlet = el.shadowRoot.querySelector('router-outlet');
    expect(routerOutlet).to.exist;
  });

  it('renders the footer with correct text', async () => {
    const el = await fixture(html`<app-container></app-container>`);

    const footer = el.shadowRoot.querySelector('.app-footer');
    expect(footer).to.exist;
    expect(footer.textContent).to.include('2024');
    expect(footer.textContent).to.include('Employee Management');
  });
});
