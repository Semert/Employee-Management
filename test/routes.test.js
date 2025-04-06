import '../src/routes.js';
import './setup.js';

describe('router-outlet', () => {
  beforeEach(() => {
    fixtureCleanup();
  });

  it('renders employee-list for root path', async () => {
    const el = await fixture(html`<router-outlet></router-outlet>`);

    // Manually set the route to root
    el.route = '/';
    await el.updateComplete;

    const employeeList = el.shadowRoot.querySelector('employee-list');
    expect(employeeList).to.exist;
  });

  it('renders employee-form for new path', async () => {
    const el = await fixture(html`<router-outlet></router-outlet>`);

    // Manually set the route to new
    el.route = '/new';
    await el.updateComplete;

    const employeeForm = el.shadowRoot.querySelector('employee-form');
    expect(employeeForm).to.exist;

    // Should not be in edit mode
    expect(employeeForm.isEdit).to.be.false;
  });

  it('renders employee-form in edit mode for edit path', async () => {
    const el = await fixture(html`<router-outlet></router-outlet>`);

    // Manually set the route to edit
    el.route = '/edit/123';
    await el.updateComplete;

    const employeeForm = el.shadowRoot.querySelector('employee-form');
    expect(employeeForm).to.exist;

    // Should be in edit mode
    expect(employeeForm.isEdit).to.be.true;

    // Should have the correct employee ID
    expect(employeeForm.employeeId).to.equal('123');
  });
});
