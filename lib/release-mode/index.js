#! /usr/bin/env node
const constants = require("../common/constants");
const ReleaseStart = require("./start");
const Utils = require("../common/utils");
const chalk = require("chalk");
const prompt = require("prompt");
const args = process.argv.splice(2);
const command = args[0];

prompt.start();

Utils.print(chalk.dim("Mode: " + constants.RELEASE_MODE));
Utils.print(chalk.dim("Command: " + command));
Utils.printSeparator();

let property = {
  name: 'yesno',
  message: 'start release new kaltura-player version? (y/n)',
  validator: /y[es]*|n[o]?/,
  warning: 'Must respond y[es] or n[o]',
  default: 'n'
};

prompt.get(property, function (err, result) {
  if (result.yesno.trim() === 'y' || result.yesno.trim() === 'yes') {
    Utils.clearConsole();
    switch (command) {
      case constants.START:
        new ReleaseStart().start();
        break;
      default:
        Utils.print(chalk.bold.red(constants.COMMAND_NOT_FOUND + ': ' + command));
        break;
    }
  }
});

