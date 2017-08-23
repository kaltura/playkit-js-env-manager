#! /usr/bin/env node
const shell = require("shelljs");
const chalk = require("chalk");
const config = require("../playkit-repos.json");
const playkitRepo = require("../common/playkit-repo");
const kalturaPlayerRepo = require("../common/kaltura-player-repo");
const utils = require("../common/utils");
const constants = require("../common/constants");
const keys = Object.keys(config);

function start() {
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
  utils.print(chalk.italic(JSON.stringify(config, null, 2)));
}

function handlePlaykitRepos() {
  keys.forEach(function (key) {
    utils.printSeparator();
    utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(key));
    playkitRepo.init(key);
    playkitRepo.startDevMode();
  });
}

function handleKalturaPlayerRepo() {
  utils.printSeparator();
  utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(constants.KALTURA_PLAYER_JS));
  kalturaPlayerRepo.init();
  kalturaPlayerRepo.startDevMode();
}

module.exports = start;
