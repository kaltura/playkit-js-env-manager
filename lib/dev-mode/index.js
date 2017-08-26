#! /usr/bin/env node
const constants = require("../common/constants");
const utils = require("../common/utils");
const chalk = require("chalk");
const start = require("./start");
const stop = require("./stop");
const args = process.argv.splice(2);
const command = args[0];
const opt_configFilePath = args[1];

utils.print(chalk.dim("Mode: " + constants.DEV_MODE));
utils.print(chalk.dim("Command: " + command));
utils.printSeparator();

switch (command) {
  case constants.START:
    start(opt_configFilePath);
    break;
  case constants.STOP:
    stop(opt_configFilePath);
    break;
  default:
    utils.print(chalk.bold.red(constants.COMMAND_NOT_FOUND + ': ' + command));
    break;
}
