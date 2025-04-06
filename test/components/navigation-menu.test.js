import '../../src/components/navigation-menu.js';
import {localizationService} from '../../src/utils/localization.js';
import '../setup.js';

describe('navigation-menu', () => {
  beforeEach(() => {
    fixtureCleanup();
  });

  it('renders with default language', async () => {
    const el = await fixture(html`<navigation-menu></navigation-menu>`);
    expect(el).to.exist;

    const logo = el.shadowRoot.querySelector('.logo');
    expect(logo).to.exist;
  });

  it('changes active link based on current path', async () => {
    const el = await fixture(html`<navigation-menu></navigation-menu>`);

    // Simulate navigation to add new employee
    el.currentPath = '/new';
    await el.updateComplete;

    // Query the links in the shadow DOM
    const employeesLink = el.shadowRoot.querySelector('a[href="#/"]');
    const newEmployeeLink = el.shadowRoot.querySelector('a[href="#/new"]');

    expect(employeesLink.classList.contains('active')).to.be.false;
    expect(newEmployeeLink.classList.contains('active')).to.be.true;
  });

  it('switches language when language button is clicked', async () => {
    const el = await fixture(html`<navigation-menu></navigation-menu>`);

    // Get language buttons
    const trButton = el.shadowRoot.querySelector('.language-btn:not(.active)');

    // Save original language setting to restore later
    const originalLang = localizationService.locale;

    // Click Turkish language button
    trButton.click();
    await el.updateComplete;

    expect(localizationService.locale).to.equal('tr');

    // Restore original language
    localizationService.setLocale(originalLang);
  });
});
