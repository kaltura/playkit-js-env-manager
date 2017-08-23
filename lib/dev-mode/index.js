#! /usr/bin/env node
const constants = require("../common/constants");
const start = require("./start");
const stop = require("./stop");

module.exports.run = function (command) {
  switch (command) {
    case constants.START:
      start();
      break;
    case constants.STOP:
      stop();
      break;
    default:
      break;
  }
};
