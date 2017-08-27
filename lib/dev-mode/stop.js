#! /usr/bin/env node
const fs = require("fs");
const shell = require("shelljs");
const chalk = require("chalk");
const utils = require("../common/utils");
const constants = require("../common/constants");
const playkitRepo = require("../common/playkit-repo");
const kalturaPlayerRepo = require("../common/kaltura-player-repo");

let configProps;

function stop(opt_configFilePath) {
  configProps = utils.getConfigProps(opt_configFilePath);
  shell.config.silent = true;
  shell.exec("clear");
  printInfo();
  handleKalturaPlayerRepo();
  handlePlaykitRepos();
  restoreConfiguration();
  utils.print(chalk.bold.magenta("✘ killing all node processes ✘"));
  shell.exec("killall node");
}

function printInfo() {
  utils.print(chalk.bold.bgRed(constants.STOP_DEV_MODE));
}

function restoreConfiguration() {
  configProps.keys.forEach(function (key) {
    utils.printSeparator();
    utils.print(chalk.bold("Restoring configuration for ") + chalk.underline.italic.cyan(key));
    configProps.obj[key][constants.DEV_MODE][constants.LINK] = false;
    configProps.obj[key][constants.DEV_MODE][constants.WATCH] = false;
  });
  utils.printSeparator();
  utils.print(chalk.bold("Overwriting ") + chalk.underline.italic.cyan(configProps.fileName));
  fs.writeFileSync(configProps.filePath, JSON.stringify(configProps.obj, null, 2));
}

function handlePlaykitRepos() {
  configProps.keys.forEach(function (key) {
    utils.printSeparator();
    utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.italic.cyan(key));
    playkitRepo.init(key, configProps.obj[key][constants.DEV_MODE]);
    playkitRepo.stopDevMode();
  });
}

function handleKalturaPlayerRepo() {
  utils.printSeparator();
  utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.italic.cyan(constants.KALTURA_PLAYER_JS));
  kalturaPlayerRepo.init(configProps.obj, configProps.keys);
  kalturaPlayerRepo.stopDevMode();
}

module.exports = stop;
