#! /usr/bin/env node
const constants = require("../common/constants");
const Utils = require("../common/utils");
const chalk = require("chalk");
const prompt = require("prompt");
const shell = require("shelljs");
const ReleaseStart = require("./start");
const args = process.argv.splice(2);
const command = args[0];
const opt_configFilePath = args[1];

prompt.start();

Utils.print(chalk.dim("Mode: " + constants.RELEASE_MODE));
Utils.print(chalk.dim("Command: " + command));
Utils.printSeparator();

let property = {
  name: 'yesno',
  message: 'are you sure? (y/n)',
  validator: /y[es]*|n[o]?/,
  warning: 'Must respond yes or no',
  default: 'n'
};

prompt.get(property, function (err, result) {
  if (result.yesno === 'y' || result.yesno === 'yes') {
    shell.exec("clear");
    switch (command) {
      case constants.GO:
        new ReleaseStart(opt_configFilePath).start();
        break;
      default:
        Utils.print(chalk.bold.red(constants.COMMAND_NOT_FOUND + ': ' + command));
        break;
    }
  }
});

