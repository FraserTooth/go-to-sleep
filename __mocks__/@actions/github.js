class github {
  constructor() {
    this.context = {
      payload: {},
    };
  }

  mockSetPayload(payload) {
    this.context = {
      payload,
    };
  }
}

module.exports = new github();
