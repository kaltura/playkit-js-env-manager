#! /usr/bin/env node
class ReleaseDataHandler {
  constructor() {
    // this._releaseData = {};

    this._releaseData = {
      "playkit-js": {
        version: "0.9.0"
      }
    };

  }

  get(key) {
    if (key) {
      return this._releaseData[key];
    }
    return this._releaseData;
  }

  set(key, data) {
    if (!this._releaseData[key]) {
      this._releaseData[key] = data;
    }
  }
}

module.exports = new ReleaseDataHandler();
