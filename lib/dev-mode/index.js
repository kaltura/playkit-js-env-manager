#! /usr/bin/env node
const constants = require("../common/constants");
const Utils = require("../common/utils");
const chalk = require("chalk");
const DevStart = require("./start");
const DevStop = require("./stop");
const args = process.argv.splice(2);
const command = args[0];
const opt_configFilePath = args[1];

Utils.print(chalk.dim("Mode: " + constants.DEV_MODE));
Utils.print(chalk.dim("Command: " + command));
Utils.printSeparator();

switch (command) {
  case constants.START:
    new DevStart().start(opt_configFilePath);
    break;
  case constants.STOP:
    new DevStop().stop(opt_configFilePath);
    break;
  default:
    Utils.print(chalk.bold.red(constants.COMMAND_NOT_FOUND + ': ' + command));
    break;
}
