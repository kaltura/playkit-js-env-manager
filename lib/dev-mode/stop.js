#! /usr/bin/env node
const fs = require("fs");
const shell = require("shelljs");
const chalk = require("chalk");
const constants = require("../common/constants");
const PlaykitRepoController = require("../controllers/playkit-repo-controller");
const KalturaPlayerRepoController = require("../controllers/kaltura-player-repo-controller");
const Utils = require("../common/utils");

class DevStop {
  constructor(opt_configFilePath) {
    shell.config.silent = true;
    Utils.clearConsole();
    this.configProps = Utils.getConfigProps(opt_configFilePath);
    this.playkits = initPlaykitRepos.call(this);
    this.kp = new KalturaPlayerRepoController(this.configProps.obj, this.configProps.keys);
    printInfo.call(this);
  }

  stop() {
    handleKalturaPlayerRepo.call(this);
    handlePlaykitRepos.call(this);
    restoreConfiguration.call(this);
    Utils.print(chalk.bold.red(constants.KILLING_NODES));
    shell.exec("killall node");
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
  Utils.print(chalk.bold.bgRed(constants.STOP_DEV_MODE));
}

function restoreConfiguration() {
  this.configProps.keys.forEach((key) => {
    Utils.printSeparator();
    Utils.print(chalk.bold(constants.RESTORING_CONF) + chalk.underline.italic.cyan(key));
    this.configProps.obj[key][constants.DEV_MODE][constants.LINK] = false;
    this.configProps.obj[key][constants.DEV_MODE][constants.WATCH] = false;
  });
  Utils.printSeparator();
  Utils.print(chalk.bold(constants.OVERWRITING) + chalk.underline.italic.cyan(this.configProps.fileName));
  fs.writeFileSync(this.configProps.filePath, JSON.stringify(this.configProps.obj, null, 2));
}

function handlePlaykitRepos() {
  this.configProps.keys.forEach((key) => {
    Utils.printSeparator();
    Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.italic.cyan(key));
    Utils.moveDirectory(key);
    this.playkits[key].stopDevMode();
  });
}

function handleKalturaPlayerRepo() {
  Utils.printSeparator();
  Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.italic.cyan(constants.KALTURA_PLAYER_JS));
  Utils.moveDirectory(constants.KALTURA_PLAYER_JS);
  this.kp.stopDevMode();
}

module.exports = DevStop;
