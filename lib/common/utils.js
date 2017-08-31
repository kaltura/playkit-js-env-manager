#! /usr/bin/env node
const chalk = require("chalk");
const shell = require("shelljs");
const PkgJsonParser = require("./pkg-json-parser");
const ChangelogParser = require("./changelog-parser");
const constants = require("./constants");
const ReleaseDataHandler = require("./release-data-handler");

class Utils {
  static getReleaseNotes() {
    let result = '';
    let releaseData = ReleaseDataHandler.get();
    Object.keys(releaseData).forEach((key) => {
      let obj = releaseData[key];
      result += '## _' + key + ' ' + obj.changeLog.title + '_\n';
      if (obj.changeLog.bugFixes.content.length > 0) {
        result += '#### ' + obj.changeLog.bugFixes.title + ':\n';
        obj.changeLog.bugFixes.content.forEach((bugFix) => {
          result += bugFix + '\n';
        });
      }
      if (obj.changeLog.features.content.length > 0) {
        result += '#### ' + obj.changeLog.features.title + ':\n';
        obj.changeLog.features.content.forEach((feat) => {
          result += feat + '\n';
        });
      }
      result += '\n\n';
    });
    return result;
  }

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
    orderKeys(configKeys);
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

  static printError(s) {
    console.error(s);
  }

  static moveDirectory(to) {
    shell.cd("../" + to);
  }

  static clearConsole() {
    shell.exec("clear");
  }
}

function orderKeys(keys) {
  insertFirst(constants.PLAYKIT_JS_PROVIDERS, keys);
  insertFirst(constants.PLAYKIT_JS, keys);
}

function insertFirst(key, keys) {
  let index = keys.indexOf(key);
  if (index > -1) {
    keys.splice(index, 1);
  }
  keys.unshift(key);
  console.log(keys)
}

module.exports = Utils;
