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
      message: 'phase 1 ended - do you want to continue? ಠ‿↼ (y/n) (see: ' + constants.VALIDATION_FILE_PATH + ')',
      validator: /y[es]*|n[o]?/,
      warning: 'Must respond yes or no',
      default: 'n'
    };
    prompt.get(property, (err, result) => {
      fs.unlinkSync(constants.VALIDATION_FILE_PATH);
      if (result.yesno === 'y' || result.yesno === 'yes') {
        startReleaseOnKalturaPlayerRepo.call(this);
        fs.writeFileSync(constants.VALIDATION_FILE_PATH, JSON.stringify(ReleaseDataHandler.get(), null, 2));
        property = {
          name: 'yesno',
          message: 'phase 2 ended - complete release? ಠ‿↼ (y/n) (see: ' + constants.VALIDATION_FILE_PATH + ')',
          validator: /y[es]*|n[o]?/,
          warning: 'Must respond yes or no',
          default: 'n'
        };
        prompt.get(property, (err, result) => {
          fs.unlinkSync(constants.VALIDATION_FILE_PATH);
          if (result.yesno === 'y' || result.yesno === 'yes') {
            completeReleaseOnPlaykitRepos.call(this);
            completeReleaseOnKalturaPlayerRepo.call(this);
          } else {
            cancelReleaseOnPlaykitRepos.call(this);
            cancelReleaseOnKalturaPlayerRepo.call(this);
          }
        });
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

function completeReleaseOnPlaykitRepos() {
  this.configProps.keys.forEach((key) => {
    Utils.printSeparator();
    Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(key));
    new PlaykitRepoController(key, this.configProps.obj[key][constants.RELEASE_MODE] || {}, constants.RELEASE_MODE).completeReleaseMode();
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

function completeReleaseOnKalturaPlayerRepo() {
  Utils.printSeparator();
  Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(constants.KALTURA_PLAYER_JS));
  new kalturaPlayerRepoController(this.configProps.obj, this.configProps.keys).completeReleaseMode();
}

function cancelReleaseOnKalturaPlayerRepo() {
  Utils.printSeparator();
  Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(constants.KALTURA_PLAYER_JS));
  new kalturaPlayerRepoController(this.configProps.obj, this.configProps.keys).cancelReleaseMode();
}

module.exports = ReleaseStart;
