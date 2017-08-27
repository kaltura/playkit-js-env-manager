#! /usr/bin/env node
const shell = require("shelljs");
const chalk = require("chalk");
const playkitRepo = require("../common/playkit-repo");
const kalturaPlayerRepo = require("../common/kaltura-player-repo");
const utils = require("../common/utils");
const constants = require("../common/constants");

let configProps;

function start(opt_configFilePath) {
  configProps = utils.getConfigProps(opt_configFilePath);
  shell.config.silent = true;
  shell.exec("clear");
  printInfo();
  handlePlaykitRepos();
  handleKalturaPlayerRepo();
}

function printInfo() {
  utils.print(chalk.bold.bgGreen(constants.START_DEV_MODE));
  utils.printSeparator();
  utils.print(chalk.bold(constants.BUILDING_FOR_CONFIGURATION));
  utils.print(chalk.italic(JSON.stringify(configProps.obj, null, 2)));
}

function handlePlaykitRepos() {
  configProps.keys.forEach(function (key) {
    utils.printSeparator();
    utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(key));
    playkitRepo.init(key, configProps.obj[key][constants.DEV_MODE]);
    playkitRepo.startDevMode();
  });
}

function handleKalturaPlayerRepo() {
  utils.printSeparator();
  utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(constants.KALTURA_PLAYER_JS));
  kalturaPlayerRepo.init(configProps.obj, configProps.keys);
  kalturaPlayerRepo.startDevMode();
}

module.exports = start;
