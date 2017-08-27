#! /usr/bin/env node
const shell = require("shelljs");
const chalk = require("chalk");
const prompt = require("prompt");
const fs = require("fs");
const playkitRepo = require("../common/playkit-repo");
const kalturaPlayerRepo = require("../common/kaltura-player-repo");
const utils = require("../common/utils");
const constants = require("../common/constants");

let configProps;
let releaseData;

function go(opt_configFilePath) {
  configProps = utils.getConfigProps(opt_configFilePath);
  shell.config.silent = true;
  printInfo();
  startReleaseOnPlaykitRepos();
  releaseData = playkitRepo.getReleaseData();
  fs.writeFileSync(constants.VALIDATION_FILE_PATH, JSON.stringify(releaseData, null, 2));
  let property = {
    name: 'yesno',
    message:
    'release output is pending on ' + constants.VALIDATION_FILE_PATH + ' for your review.\n ' +
    'please check and if it\'s all good continue the process.\n ' +
    'do you want to continue? ಠ‿↼ (y/n)',
    validator: /y[es]*|n[o]?/,
    warning: 'Must respond yes or no',
    default: 'n'
  };
  prompt.get(property, function (err, result) {
    fs.unlinkSync(constants.VALIDATION_FILE_PATH);
    if (result.yesno === 'y' || result.yesno === 'yes') {
      continueReleaseOnPlaykitRepos();
    } else {
      cancelReleaseOnPlaykitRepos()
    }
  });
}

function printInfo() {
  utils.print(chalk.bold.bgGreen(constants.START_REL_MODE));
  utils.printSeparator();
  utils.print(chalk.bold(constants.BUILDING_FOR_CONFIGURATION));
  utils.print(chalk.italic(JSON.stringify(configProps.obj, null, 2)));
}

function startReleaseOnPlaykitRepos() {
  configProps.keys.forEach(function (key) {
    utils.printSeparator();
    utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(key));
    playkitRepo.init(key, configProps.obj[key][constants.RELEASE_MODE]);
    playkitRepo.startReleaseMode();
  });
}

function continueReleaseOnPlaykitRepos() {
  configProps.keys.forEach(function (key) {
    utils.printSeparator();
    utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(key));
    playkitRepo.init(key, configProps.obj[key][constants.RELEASE_MODE]);
    playkitRepo.continueReleaseMode();
  });
}

function cancelReleaseOnPlaykitRepos() {
  configProps.keys.forEach(function (key) {
    utils.printSeparator();
    utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(key));
    playkitRepo.init(key, configProps.obj[key][constants.RELEASE_MODE]);
    playkitRepo.cancelReleaseMode();
  });
}

module.exports = go;
