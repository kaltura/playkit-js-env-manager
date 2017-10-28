#! /usr/bin/env node
const chalk = require("chalk");
const shell = require("shelljs");
const prompt = require("prompt");
const constants = require("./constants");
const PkgJsonParser = require("./pkg-json-parser");
const ChangelogParser = require("./changelog-parser");
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

  static printGit(msg) {
    this.print(chalk.bgWhite(chalk.bold.underline.blue("- (git) " + msg)));
  }

  static printYarn(msg) {
    this.print(chalk.bgWhite(chalk.bold.underline.green("- (yarn) " + msg)));
  }

  static printDone() {
    console.log(chalk.bold.green("✔ Done"));
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

  static showPrompt(msg, callback) {
    let property = getPromptObject(msg);
    prompt.get(property, (err, result) => {
      if (err) throw err;
      (result.yesno.trim() === 'y' || result.yesno.trim() === 'yes') ? callback(true) : callback(false);
    });
  }
}

function getPromptObject(msg) {
  return {
    name: 'yesno',
    message: msg,
    validator: /y[es]*|n[o]?/,
    warning: 'Must respond y[es] or n[o]',
    default: 'n'
  };
}

module.exports = Utils;
