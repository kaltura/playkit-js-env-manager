#! /usr/bin/env node
const fs = require("fs");
const shell = require("shelljs");
const chalk = require("chalk");
const PlaykitRepoController = require("../controllers/playkit-repo-controller");
const KalturaPlayerRepoController = require("../controllers/kaltura-player-repo-controller");
const Utils = require("../common/utils");
const constants = require("../common/constants");

class DevStop {
  constructor(opt_configFilePath) {
    this.configProps = Utils.getConfigProps(opt_configFilePath);
    shell.config.silent = true;
    shell.exec("clear");
    printInfo.call(this);
  }

  stop() {
    handleKalturaPlayerRepo.call(this);
    handlePlaykitRepos.call(this);
    restoreConfiguration.call(this);
    Utils.print(chalk.bold.red("✘ killing all node processes ✘"));
    shell.exec("killall node");
  }
}

function printInfo() {
  Utils.print(chalk.bold.bgRed(constants.STOP_DEV_MODE));
}

function restoreConfiguration() {
  this.configProps.keys.forEach((key) => {
    Utils.printSeparator();
    Utils.print(chalk.bold("Restoring configuration for ") + chalk.underline.italic.cyan(key));
    this.configProps.obj[key][constants.DEV_MODE][constants.LINK] = false;
    this.configProps.obj[key][constants.DEV_MODE][constants.WATCH] = false;
  });
  Utils.printSeparator();
  Utils.print(chalk.bold("Overwriting ") + chalk.underline.italic.cyan(this.configProps.fileName));
  fs.writeFileSync(this.configProps.filePath, JSON.stringify(this.configProps.obj, null, 2));
}

function handlePlaykitRepos() {
  this.configProps.keys.forEach((key) => {
    Utils.printSeparator();
    Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.italic.cyan(key));
    new PlaykitRepoController(key, this.configProps.obj[key][constants.DEV_MODE] || {}).stopDevMode();
  });
}

function handleKalturaPlayerRepo() {
  Utils.printSeparator();
  Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.italic.cyan(constants.KALTURA_PLAYER_JS));
  new KalturaPlayerRepoController(this.configProps.obj, this.configProps.keys).stopDevMode();
}

module.exports = DevStop;
