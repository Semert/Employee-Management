import '../setup.js';
import '../../src/components/common/confirmation-dialog.js';

describe('confirmation-dialog', () => {
  beforeEach(() => {
    fixtureCleanup();
  });

  it('does not render content when open is false', async () => {
    const el = await fixture(html`
      <confirmation-dialog
        .title="Test Title"
        .message="Test Message"
        .open="${false}"
      ></confirmation-dialog>
    `);

    // Instead of checking innerHTML directly, verify no dialog element exists
    const dialog = el.shadowRoot.querySelector('.dialog');
    expect(dialog).to.be.null;
  });

  it('renders with provided title and message when open', async () => {
    const title = 'Test Title';
    const message = 'Test Message';

    const el = await fixture(html`
      <confirmation-dialog
        .title="${title}"
        .message="${message}"
        .open="${true}"
      ></confirmation-dialog>
    `);

    const titleElement = el.shadowRoot.querySelector('.dialog-title');
    const messageElement = el.shadowRoot.querySelector('.dialog-message');

    expect(titleElement.textContent).to.equal(title);
    expect(messageElement.textContent).to.equal(message);
  });

  it('emits proceed event when proceed button is clicked', async () => {
    const el = await fixture(html`
      <confirmation-dialog
        .title="Test Title"
        .message="Test Message"
        .open="${true}"
      ></confirmation-dialog>
    `);

    let proceedCalled = false;
    el.addEventListener('proceed', () => {
      proceedCalled = true;
    });

    const proceedButton = el.shadowRoot.querySelector('.proceed-btn');
    proceedButton.click();

    expect(proceedCalled).to.be.true;
  });

  it('emits cancel event when cancel button is clicked', async () => {
    const el = await fixture(html`
      <confirmation-dialog
        .title="Test Title"
        .message="Test Message"
        .open="${true}"
      ></confirmation-dialog>
    `);

    let cancelCalled = false;
    el.addEventListener('cancel', () => {
      cancelCalled = true;
    });

    const cancelButton = el.shadowRoot.querySelector('.cancel-btn');
    cancelButton.click();

    expect(cancelCalled).to.be.true;
  });
});
