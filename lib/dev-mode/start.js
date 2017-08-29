#! /usr/bin/env node
const shell = require("shelljs");
const chalk = require("chalk");
const PlaykitRepoController = require("../controllers/playkit-repo-controller");
const KalturaPlayerRepoController = require("../controllers/kaltura-player-repo-controller");
const Utils = require("../common/utils");
const constants = require("../common/constants");

class DevStart {
  constructor(opt_configFilePath) {
    this.configProps = Utils.getConfigProps(opt_configFilePath);
    shell.config.silent = true;
    shell.exec("clear");
    printInfo.call(this);
  }

  start() {
    handlePlaykitRepos.call(this);
    handleKalturaPlayerRepo.call(this);
  }
}

function printInfo() {
  Utils.print(chalk.bold.bgGreen(constants.START_DEV_MODE));
  Utils.printSeparator();
  Utils.print(chalk.bold(constants.BUILDING_FOR_CONFIGURATION));
  Utils.print(chalk.italic(JSON.stringify(this.configProps.obj, null, 2)));
}

function handlePlaykitRepos() {
  this.configProps.keys.forEach((key) => {
    Utils.printSeparator();
    Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(key));
    new PlaykitRepoController(key, this.configProps.obj[key][constants.DEV_MODE] || {}, constants.DEV_MODE).startDevMode();
  });
}

function handleKalturaPlayerRepo() {
  Utils.printSeparator();
  Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(constants.KALTURA_PLAYER_JS));
  new KalturaPlayerRepoController(this.configProps.obj, this.configProps.keys).startDevMode();
}

module.exports = DevStart;
