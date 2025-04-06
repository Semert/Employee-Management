export const connect = (store) => (baseElement) =>
  class extends baseElement {
    constructor() {
      super();
      this._stateChanged = this._stateChanged.bind(this);
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      this._storeUnsubscribe = store.subscribe(this._stateChanged);
      this._stateChanged();
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
      this._storeUnsubscribe();
    }

    _stateChanged() {
      const state = store.getState();
      if (this.stateChanged) {
        this.stateChanged(state);
      }
    }
  };
