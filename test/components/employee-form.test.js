import {store} from '../../src/redux/store.js';
import '../../src/components/employee-form/employee-form.js';
import '../setup.js';

describe('employee-form', () => {
  let originalDispatch;
  let dispatchCalls;

  beforeEach(() => {
    fixtureCleanup();

    // Mock store dispatch
    originalDispatch = store.dispatch;
    dispatchCalls = [];
    store.dispatch = (action) => {
      dispatchCalls.push(action);
      return originalDispatch(action);
    };
  });

  afterEach(() => {
    // Restore original dispatch
    store.dispatch = originalDispatch;
  });

  it('renders empty form fields for a new employee', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    const firstNameInput = el.shadowRoot.querySelector('#firstName');
    const lastNameInput = el.shadowRoot.querySelector('#lastName');
    const emailInput = el.shadowRoot.querySelector('#email');

    expect(firstNameInput.value).to.equal('');
    expect(lastNameInput.value).to.equal('');
    expect(emailInput.value).to.equal('');
  });

  it('shows validation errors when submitting empty form', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    // Submit the form
    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit', {cancelable: true}));

    await el.updateComplete;

    // Check for validation errors
    const errorMessages = el.shadowRoot.querySelectorAll('.error');
    expect(errorMessages.length).to.be.greaterThan(0);
  });

  it('updates employee data when input values change', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    // Get input fields
    const firstNameInput = el.shadowRoot.querySelector('#firstName');
    const lastNameInput = el.shadowRoot.querySelector('#lastName');

    // Update input values
    firstNameInput.value = 'John';
    firstNameInput.dispatchEvent(new Event('input'));

    lastNameInput.value = 'Doe';
    lastNameInput.dispatchEvent(new Event('input'));

    await el.updateComplete;

    // Check if employee object is updated
    expect(el.employee.firstName).to.equal('John');
    expect(el.employee.lastName).to.equal('Doe');
  });

  it('validates email format correctly', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);

    // Set employee with invalid email
    el.employee = {
      ...el.getEmptyEmployee(),
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
    };

    await el.updateComplete;

    // Submit the form
    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit', {cancelable: true}));

    await el.updateComplete;

    // Check for email validation error
    const emailError = el.shadowRoot.querySelector('#email + .error');
    expect(emailError).to.exist;
  });

  it('shows confirmation dialog when updating existing employee', async () => {
    const el = await fixture(
      html`<employee-form .isEdit="${true}"></employee-form>`
    );

    // Set a valid employee
    el.employee = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      dateOfEmployment: '01/01/2020',
      dateOfBirth: '01/01/1980',
      department: 'Tech',
      position: 'Senior',
    };

    await el.updateComplete;

    // Submit the form
    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit', {cancelable: true}));

    await el.updateComplete;

    // Check that confirmation dialog is shown
    expect(el.showUpdateConfirmation).to.be.true;

    // Confirmation dialog should be rendered
    const dialog = el.shadowRoot.querySelector('confirmation-dialog');
    expect(dialog).to.exist;
  });
  let dispatchSpy;

  it('dispatches update action when confirmation is confirmed', async () => {
    const el = await fixture(
      html`<employee-form .isEdit="${true}"></employee-form>`
    );

    // Set a valid employee
    const testEmployee = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      dateOfEmployment: '01/01/2020',
      dateOfBirth: '01/01/1980',
      department: 'Tech',
      position: 'Senior',
    };

    el.employee = testEmployee;
    el.showUpdateConfirmation = true;

    await el.updateComplete;

    // Create a spy for the store's dispatch method
    dispatchSpy = sinon.spy(store, 'dispatch');

    // Call confirmUpdate method
    el.confirmUpdate(); // This should trigger saveEmployee and then cancelUpdate

    // Check that the update action was dispatched
    expect(dispatchSpy.calledOnce).to.be.true; // Ensure dispatch was called once

    // Verify the action type and payload
    const dispatchedAction = dispatchSpy.getCall(0).args[0]; // Get the first call's arguments
    expect(dispatchedAction.type).to.equal('UPDATE_EMPLOYEE'); // Check action type
    expect(dispatchedAction.payload).to.deep.equal(testEmployee); // Check payload

    // Check if navigation occurred
    expect(window.location.hash).to.equal('#/'); // Ensure navigation to the root
    const dispatchEventSpy = sinon.spy(window, 'dispatchEvent');
    expect(dispatchEventSpy.calledOnce).to.be.false;

    // Cleanup
    dispatchEventSpy.restore();
  });
});
