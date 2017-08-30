#! /usr/bin/env node
const shell = require("shelljs");
const chalk = require("chalk");
const PlaykitRepoController = require("../controllers/playkit-repo-controller");
const KalturaPlayerRepoController = require("../controllers/kaltura-player-repo-controller");
const Utils = require("../common/utils");
const constants = require("../common/constants");

class DevStart {
  constructor(opt_configFilePath) {
    shell.config.silent = true;
    Utils.clearConsole();
    this.configProps = Utils.getConfigProps(opt_configFilePath);
    this.playkits = initPlaykitRepos.call(this);
    this.kp = new KalturaPlayerRepoController(this.configProps.obj, this.configProps.keys);
    printInfo.call(this);
  }

  start() {
    handlePlaykitRepos.call(this);
    handleKalturaPlayerRepo.call(this);
  }
}

function initPlaykitRepos() {
  let playkits = {};
  this.configProps.keys.forEach((key) => {
    playkits[key] = new PlaykitRepoController(key, this.configProps.obj[key][constants.DEV_MODE] || {}, constants.DEV_MODE);
  });
  return playkits;
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
    Utils.moveDirectory(key);
    this.playkits[key].startDevMode();
  });
}

function handleKalturaPlayerRepo() {
  Utils.printSeparator();
  Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(constants.KALTURA_PLAYER_JS));
  Utils.moveDirectory(constants.KALTURA_PLAYER_JS);
  this.kp.startDevMode();
}

module.exports = DevStart;
