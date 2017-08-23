#! /usr/bin/env node
const constants = require("../common/constants");
const go = require("./go");

module.exports.run = function (command) {
  switch (command) {
    case constants.GO:
      go();
      break;
    default:
      break;
  }
};
