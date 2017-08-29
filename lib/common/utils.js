#! /usr/bin/env node
const chalk = require("chalk");
const PkgJsonParser = require("./pkg-json-parser");
const ChangelogParser = require("./changelog-parser");
const constants = require("./constants");

class Utils {
  static getNewVersion() {
    let newVersion = PkgJsonParser.parse(constants.VERSION);
    Utils.print(chalk.bold.hex('#ff6600').underline("- extract new version:") + chalk.yellow(" " + newVersion));
    Utils.printDone();
    return newVersion;
  }

  static getChangeLog() {
    Utils.print(chalk.bold.hex('#ff6600').underline("- extract changelog"));
    let changelog = ChangelogParser.parse();
    Utils.printDone();
    return changelog;
  }

  static getConfigProps(configFilePath) {
    let filePath = (configFilePath ? configFilePath : constants.DEFAULT_CONFIG_PATH);
    let parts = filePath.split('/');
    let fileName = parts[parts.length - 1];
    let configObject = require(filePath);
    let configKeys = Object.keys(configObject);
    if (configKeys[0] !== constants.PLAYKIT_JS && configKeys.includes(constants.PLAYKIT_JS)) {
      orderKeys(configKeys);
    }
    return {filePath: filePath, fileName: fileName, obj: configObject, keys: configKeys};
  }

  static printDone() {
    console.log(chalk.bold.green("✔ Done"));
  }

  static printNoAction() {
    console.log(chalk.bold.green("✔ No additional actions needs to be done"));
  }

  static printSeparator() {
    console.log(chalk.dim("################################################"));
  }

  static print(s) {
    console.log(s);
  }
}

function orderKeys(keys) {
  let index = keys.indexOf(constants.PLAYKIT_JS);
  if (index > -1) {
    keys.splice(index, 1);
  }
  keys.unshift(constants.PLAYKIT_JS);
}

module.exports = Utils;
