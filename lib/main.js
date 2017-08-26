#! /usr/bin/env node
const devMode = require("./dev-mode/index");
const chalk = require("chalk");
const constants = require("./common/constants");
const utils = require("./common/utils");
const args = process.argv.splice(2);
const mode = args[0];
const command = args[1];

utils.print(chalk.dim("Mode: " + mode));
utils.print(chalk.dim("Command: " + command));
utils.printSeparator();

switch (mode) {
  case constants.DEV_MODE:
    devMode.run(command);
    break;
  case constants.RELEASE_MODE:
    break;
  default:
    utils.print(chalk.bold.red(constants.MODE_NOT_FOUND + ': ' + mode));
    break;
}
