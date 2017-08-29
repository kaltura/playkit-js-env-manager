#! /usr/bin/env node
const shell = require("shelljs");
const chalk = require("chalk");
const prompt = require("prompt");
const fs = require("fs");
const PlaykitRepoController = require("../controllers/playkit-repo-controller");
const KalturaPlayerRepoController = require("../controllers/kaltura-player-repo-controller");
const Utils = require("../common/utils");
const constants = require("../common/constants");
const ReleaseDataHandler = require("../common/release-data-handler");

class ReleaseStart {
  constructor(opt_configFilePath) {
    shell.config.silent = true;
    Utils.clearConsole();
    this.configProps = Utils.getConfigProps(opt_configFilePath);
    this.playkits = initPlaykitRepos.call(this);
    this.kp = new KalturaPlayerRepoController(this.configProps.obj, this.configProps.keys);
    printInfo.call(this);
  }

  start() {
    try {
      startReleaseOnPlaykitRepos.call(this);
      fs.writeFileSync(constants.VALIDATION_FILE_PATH, JSON.stringify(ReleaseDataHandler.get(), null, 2));
      showPrompt(1, (ans) => {
        fs.unlinkSync(constants.VALIDATION_FILE_PATH);
        if (ans) {
          startReleaseOnKalturaPlayerRepo.call(this);
          fs.writeFileSync(constants.VALIDATION_FILE_PATH, JSON.stringify(ReleaseDataHandler.get(), null, 2));
          showPrompt(2, (ans) => {
            fs.unlinkSync(constants.VALIDATION_FILE_PATH);
            if (ans) {
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
    } catch (e) {
      Utils.printError(e.message);
    }
  }
}

function initPlaykitRepos() {
  let playkits = {};
  this.configProps.keys.forEach((key) => {
    playkits[key] = new PlaykitRepoController(key, this.configProps.obj[key][constants.RELEASE_MODE] || {}, constants.RELEASE_MODE);
  });
  return playkits;
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
    Utils.moveDirectory(key);
    this.playkits[key].startReleaseMode();
  });
}

function completeReleaseOnPlaykitRepos() {
  this.configProps.keys.forEach((key) => {
    Utils.printSeparator();
    Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(key));
    Utils.moveDirectory(key);
    this.playkits[key].completeReleaseMode();
  });
}

function cancelReleaseOnPlaykitRepos() {
  this.configProps.keys.forEach((key) => {
    Utils.printSeparator();
    Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(key));
    Utils.moveDirectory(key);
    this.playkits[key].cancelReleaseMode();
  });
}

function startReleaseOnKalturaPlayerRepo() {
  Utils.printSeparator();
  Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(constants.KALTURA_PLAYER_JS));
  Utils.moveDirectory(constants.KALTURA_PLAYER_JS);
  this.kp.startReleaseMode();
}

function completeReleaseOnKalturaPlayerRepo() {
  Utils.printSeparator();
  Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(constants.KALTURA_PLAYER_JS));
  Utils.moveDirectory(constants.KALTURA_PLAYER_JS);
  this.kp.completeReleaseMode();
}

function cancelReleaseOnKalturaPlayerRepo() {
  Utils.printSeparator();
  Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(constants.KALTURA_PLAYER_JS));
  Utils.moveDirectory(constants.KALTURA_PLAYER_JS);
  this.kp.cancelReleaseMode();
}

function showPrompt(phase, callback) {
  let msg = (phase === 1 ? constants.PHASE_1_MSG : constants.PHASE_2_MSG);
  let property = getPromptObject(msg);
  prompt.get(property, (err, result) => {
    if (err) throw err;
    (result.yesno === 'y' || result.yesno === 'yes') ? callback(true) : callback(false);
  });
}

function getPromptObject(msg) {
  return {
    name: 'yesno',
    message: msg + '\n[see: ' + constants.VALIDATION_FILE_PATH + ']',
    validator: /y[es]*|n[o]?/,
    warning: 'Must respond yes or no',
    default: 'n'
  };
}

module.exports = ReleaseStart;
