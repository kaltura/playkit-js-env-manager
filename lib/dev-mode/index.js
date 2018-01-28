#! /usr/bin/env node
const constants = require("../common/constants");
const Utils = require("../common/utils");
const chalk = require("chalk");
const DevStart = require("./start");
const DevStop = require("./stop");
const pkg = require("../../package.json");
const args = process.argv.splice(2);
const command = args[0];
const type = args[1];

Utils.print(chalk.dim("PlayKitJS-Env-Manger Version " + pkg.version));
Utils.print(chalk.dim("Mode: " + constants.DEV_MODE));
Utils.print(chalk.dim("Command: " + command));
Utils.print(chalk.dim("Type: " + type));
Utils.printSeparator();

switch (command) {
  case constants.START:
    new DevStart().start(type);
    break;
  case constants.STOP:
    new DevStop().stop();
    break;
  default:
    Utils.print(chalk.bold.red(constants.COMMAND_NOT_FOUND + ': ' + command));
    break;
}
