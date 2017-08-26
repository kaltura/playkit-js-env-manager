#! /usr/bin/env node
const chalk = require("chalk");
const constants = require("./constants");

module.exports = {
  printDone: function () {
    console.log(chalk.bold.green("✔ Done"));
  },
  printNoAction() {
    console.log(chalk.bold.green("✔ No additional actions needs to be done"));
  },
  printSeparator: function () {
    console.log(chalk.dim("################################################"));
  },
  print(s) {
    console.log(s);
  },
  getConfigProps(configFilePath) {
    let filePath = (configFilePath ? configFilePath : constants.DEFAULT_CONFIG_PATH);
    let parts = filePath.split('/');
    let fileName = parts[parts.length - 1];
    let configObject = require(filePath);
    let configKeys = Object.keys(configObject);
    return {filePath: filePath, fileName: fileName, obj: configObject, keys: configKeys};
  }
};
