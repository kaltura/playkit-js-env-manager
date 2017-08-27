#! /usr/bin/env node
const constants = require("../common/constants");
const utils = require("../common/utils");
const chalk = require("chalk");
const prompt = require("prompt");
const shell = require("shelljs");
const go = require("./go");
const args = process.argv.splice(2);
const command = args[0];
const opt_configFilePath = args[1];

prompt.start();

utils.print(chalk.dim("Mode: " + constants.RELEASE_MODE));
utils.print(chalk.dim("Command: " + command));
utils.printSeparator();

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
        go(opt_configFilePath);
        break;
      default:
        utils.print(chalk.bold.red(constants.COMMAND_NOT_FOUND + ': ' + command));
        break;
    }
  }
});

