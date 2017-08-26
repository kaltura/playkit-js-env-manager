#! /usr/bin/env node
const constants = require("../common/constants");
const utils = require("../common/utils");
const chalk = require("chalk");
const args = process.argv.splice(2);
const command = args[0];

utils.print(chalk.dim("Mode: " + constants.RELEASE_MODE));
utils.print(chalk.dim("Command: " + command));
utils.printSeparator();

switch (command) {

}
