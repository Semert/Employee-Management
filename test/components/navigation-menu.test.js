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

    const employeesLink = el.shadowRoot.querySelector('.nav-link[href="/"]');
    const newEmployeeLink = el.shadowRoot.querySelector(
      '.nav-link[href="/new"]'
    );

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

  it('navigates when a link is clicked', async () => {
    const el = await fixture(html`<navigation-menu></navigation-menu>`);

    // Create a spy for pushState
    const historyPushStateSpy = sinon.spy(history, 'pushState');

    // Create a spy for custom event dispatch
    const dispatchEventSpy = sinon.spy(window, 'dispatchEvent');

    // Click the Add Employee link
    const addLink = el.shadowRoot.querySelector('a[href="/new"]');
    addLink.click();

    expect(historyPushStateSpy.calledOnce).to.be.true;
    expect(dispatchEventSpy.calledOnce).to.be.true;

    // Cleanup
    historyPushStateSpy.restore();
    dispatchEventSpy.restore();
  });
});
