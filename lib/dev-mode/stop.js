#! /usr/bin/env node
const fs = require("fs");
const shell = require("shelljs");
const chalk = require("chalk");
const config = require("../playkit-repos.json");
const utils = require("../common/utils");
const constants = require("../common/constants");
const playkitRepo = require("../common/playkit-repo");
const kalturaPlayerRepo = require("../common/kaltura-player-repo");
const keys = Object.keys(config);

function stop() {
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
  kalturaPlayerRepo.init();
  keys.forEach(function (key) {
    utils.printSeparator();
    utils.print(chalk.bold("Restoring configuration for ") + chalk.underline.italic.cyan(key));
    config[key][constants.DEV_MODE][constants.LINK] = false;
    config[key][constants.DEV_MODE][constants.WATCH] = false;
  });
  utils.printSeparator();
  utils.print(chalk.bold("Overwriting ") + chalk.underline.italic.cyan("playkit-repos.json"));
  fs.writeFile('./lib/playkit-repos.json', JSON.stringify(config, null, 2));
}

function handlePlaykitRepos() {
  keys.forEach(function (key) {
    utils.printSeparator();
    utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.italic.cyan(key));
    playkitRepo.init(key);
    playkitRepo.stopDevMode();
  });
}

function handleKalturaPlayerRepo() {
  utils.printSeparator();
  utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.italic.cyan(constants.KALTURA_PLAYER_JS));
  kalturaPlayerRepo.init();
  kalturaPlayerRepo.stopDevMode();
}

module.exports = stop;
