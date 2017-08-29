#! /usr/bin/env node
const shell = require("shelljs");
const chalk = require("chalk");
const prompt = require("prompt");
const fs = require("fs");
const PlaykitRepoController = require("../controllers/playkit-repo-controller");
const kalturaPlayerRepoController = require("../controllers/kaltura-player-repo-controller");
const Utils = require("../common/utils");
const constants = require("../common/constants");
const ReleaseDataHandler = require("../common/release-data-handler");

class ReleaseStart {
  constructor(opt_configFilePath) {
    this.configProps = Utils.getConfigProps(opt_configFilePath);
    shell.config.silent = true;
    printInfo.call(this);
  }

  start() {
    startReleaseOnPlaykitRepos.call(this);
    fs.writeFileSync(constants.VALIDATION_FILE_PATH, JSON.stringify(ReleaseDataHandler.get(), null, 2));
    let property = {
      name: 'yesno',
      message: 'release output is pending on ' + constants.VALIDATION_FILE_PATH + ' for your review.\n ' +
      'please check and if it\'s all good continue the process.\n ' +
      'do you want to continue? ಠ‿↼ (y/n)',
      validator: /y[es]*|n[o]?/,
      warning: 'Must respond yes or no',
      default: 'n'
    };
    prompt.get(property, (err, result) => {
      fs.unlinkSync(constants.VALIDATION_FILE_PATH);
      if (result.yesno === 'y' || result.yesno === 'yes') {
        // continueReleaseOnPlaykitRepos.call(this);
        startReleaseOnKalturaPlayerRepo.call(this);
        cancelReleaseOnPlaykitRepos.call(this);
      } else {
        cancelReleaseOnPlaykitRepos.call(this);
      }
    });
  }
}

function printInfo() {
  Utils.print(chalk.bold.bgGreen(constants.START_REL_MODE));
  Utils.printSeparator();
  Utils.print(chalk.bold(constants.BUILDING_FOR_CONFIGURATION));
  Utils.print(chalk.italic(JSON.stringify(this.configProps.obj, null, 2)));
}

function startReleaseOnPlaykitRepos() {
  this.configProps.keys.forEach((key) => {
    Utils.printSeparator();
    Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(key));
    new PlaykitRepoController(key, this.configProps.obj[key][constants.RELEASE_MODE] || {}, constants.RELEASE_MODE).startReleaseMode();
  });
}

function continueReleaseOnPlaykitRepos() {
  this.configProps.keys.forEach((key) => {
    Utils.printSeparator();
    Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(key));
    new PlaykitRepoController(key, this.configProps.obj[key][constants.RELEASE_MODE] || {}, constants.RELEASE_MODE).continueReleaseMode();
  });
}

function cancelReleaseOnPlaykitRepos() {
  this.configProps.keys.forEach((key) => {
    Utils.printSeparator();
    Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(key));
    new PlaykitRepoController(key, this.configProps.obj[key][constants.RELEASE_MODE], constants.RELEASE_MODE).cancelReleaseMode();
  });
}

function startReleaseOnKalturaPlayerRepo() {
  Utils.printSeparator();
  Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(constants.KALTURA_PLAYER_JS));
  new kalturaPlayerRepoController(this.configProps.obj, this.configProps.keys).startReleaseMode();
}

module.exports = ReleaseStart;
