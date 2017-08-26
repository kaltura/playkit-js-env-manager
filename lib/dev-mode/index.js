#! /usr/bin/env node
const constants = require("../common/constants");
const utils = require("../common/utils");
const chalk = require("chalk");
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
      utils.print(chalk.bold.red(constants.COMMAND_NOT_FOUND + ': ' + command));
      break;
  }
};
