#! /usr/bin/env node
const shell = require("shelljs");
const chalk = require("chalk");
const prompt = require("prompt");
const fs = require("fs");
const constants = require("../common/constants");
const PkgJsonParser = require("../common/pkg-json-parser");
const PlaykitRepoController = require("../controllers/playkit-repo-controller");
const KalturaPlayerRepoController = require("../controllers/kaltura-player-repo-controller");
const Utils = require("../common/utils");
const ReleaseDataHandler = require("../common/release-data-handler");

const PLAYKIT_REPO_LIST = require("../configuration/repo-list.json");
const PLAYKIT_REPO_DATA = require("../configuration/repo-data.json");

class ReleaseStart {
  constructor() {
    shell.config.silent = true;
    Utils.clearConsole();
    shell.cd(constants.KALTURA_PLAYER_RELATIVE_PATH);
    const envManagerConfiguration = PkgJsonParser.parse(constants.ENV_MANAGER);
    const configuredRepos = envManagerConfiguration[constants.RELEASE_MODE];
    this.playkits = initPlaykitRepos.call(this, configuredRepos);
    this.kp = new KalturaPlayerRepoController(this.playkits);
    printInfo.call(this, configuredRepos);
  }

  start() {
    try {
      startReleaseOnPlaykitRepos.call(this)
        .then(() => {
          Utils.showPrompt('Ready to publish playkit-js-*?', (ans) => {
            if (ans) {
              completeReleaseOnPlaykitRepos.call(this)
                .then(() => {
                  startReleaseOnKalturaPlayerRepo.call(this);
                  Utils.showPrompt('Observe release commits. Ready to publish kaltura-player-js?', (ans) => {
                    if (ans) {
                      completeReleaseOnKalturaPlayerRepo.call(this);
                    } else {
                      cancelReleaseOnKalturaPlayerRepo.call(this);
                    }
                  });
                });
            } else {
              cancelReleaseOnPlaykitRepos.call(this);
            }
          });
        });
    } catch (e) {
      Utils.printError(e.message);
    }
  }
}

function initPlaykitRepos(configuredRepos) {
  const playkits = {};
  PLAYKIT_REPO_LIST.forEach((repoAlias) => {
    const options = {
      mode: constants.RELEASE_MODE,
      alias: repoAlias,
      name: PLAYKIT_REPO_DATA[repoAlias].name,
      include: configuredRepos.includes(repoAlias)
    };
    playkits[repoAlias] = new PlaykitRepoController(options);
  });
  return playkits;
}

function printInfo(configuredRepos) {
  Utils.print(chalk.bold.bgGreen(constants.START_REL_MODE));
  Utils.printSeparator();
  Utils.print(chalk.bold(constants.BUILDING_FOR_CONFIGURATION));
  Utils.print(chalk.italic(JSON.stringify(configuredRepos, null, 2)));
}

function startReleaseOnPlaykitRepos() {
  return Promise.resolve();

  // return PLAYKIT_REPO_LIST.reduce((previousPromise, repoAlias) => {
  //   return previousPromise.then(() => {
  //     const playkit = this.playkits[repoAlias];
  //     if (playkit.include) {
  //       Utils.printSeparator();
  //       Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(playkit.name));
  //       Utils.moveDirectory(playkit.name);
  //       return playkit.startReleaseMode();
  //     } else {
  //       return Promise.resolve();
  //     }
  //   });
  // }, Promise.resolve());
}

function completeReleaseOnPlaykitRepos() {
  return Promise.resolve();

  // return PLAYKIT_REPO_LIST.reduce((previousPromise, repoAlias) => {
  //   return previousPromise.then(() => {
  //     const playkit = this.playkits[repoAlias];
  //     if (playkit.include) {
  //       Utils.printSeparator();
  //       Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(playkit.name));
  //       Utils.moveDirectory(playkit.name);
  //       return playkit.completeReleaseMode();
  //     } else {
  //       return Promise.resolve();
  //     }
  //   });
  // }, Promise.resolve());
}

function cancelReleaseOnPlaykitRepos() {
  return Promise.resolve();

  // return PLAYKIT_REPO_LIST.reduce((previousPromise, repoAlias) => {
  //   return previousPromise.then(() => {
  //     const playkit = this.playkits[repoAlias];
  //     if (playkit.include) {
  //       Utils.printSeparator();
  //       Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(playkit.name));
  //       Utils.moveDirectory(playkit.name);
  //       return playkit.cancelReleaseMode();
  //     } else {
  //       return Promise.resolve();
  //     }
  //   });
  // }, Promise.resolve());
}

function startReleaseOnKalturaPlayerRepo() {
  Utils.printSeparator();
  Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(constants.KALTURA_PLAYER_JS));
  Utils.moveDirectory(constants.KALTURA_PLAYER_JS);
  this.kp.startReleaseMode();
}

function completeReleaseOnKalturaPlayerRepo() {
  // Utils.printSeparator();
  // Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(constants.KALTURA_PLAYER_JS));
  // Utils.moveDirectory(constants.KALTURA_PLAYER_JS);
  // this.kp.completeReleaseMode();
}

function cancelReleaseOnKalturaPlayerRepo() {
  Utils.printSeparator();
  Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(constants.KALTURA_PLAYER_JS));
  Utils.moveDirectory(constants.KALTURA_PLAYER_JS);
  this.kp.cancelReleaseMode();
}

module.exports = ReleaseStart;
