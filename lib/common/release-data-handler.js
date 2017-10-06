#! /usr/bin/env node
class ReleaseDataHandler {
  constructor() {
    this._releaseData = {};
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

  remove(key) {
    if (key) {
      delete this._releaseData[key];
    }
  }
}

module.exports = new ReleaseDataHandler();
