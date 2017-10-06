#! /usr/bin/env node
const fs = require("fs");
const shell = require("shelljs");
const chalk = require("chalk");
const constants = require("../common/constants");
const PlaykitRepoController = require("../controllers/playkit-repo-controller");
const KalturaPlayerRepoController = require("../controllers/kaltura-player-repo-controller");
const PkgJsonParser = require("../common/pkg-json-parser");
const Utils = require("../common/utils");
const pkReposList = require("../configuration/repo-list.json");
const pkReposData = require("../configuration/repo-data.json");

class DevStop {
  constructor() {
    shell.config.silent = true;
    Utils.clearConsole();
    shell.cd(constants.KALTURA_PLAYER_RELATIVE_PATH);
    const envManagerConfiguration = PkgJsonParser.parse(constants.ENV_MANAGER);
    const reposConfiguration = envManagerConfiguration[constants.DEV_MODE];
    const configuredRepos = Object.keys(reposConfiguration);
    this.playkits = initPlaykitRepos.call(this, reposConfiguration, configuredRepos);
    this.kp = new KalturaPlayerRepoController(this.playkits);
    printInfo.call(this, reposConfiguration);
  }

  stop() {
    handleKalturaPlayerRepo.call(this);
    handlePlaykitRepos.call(this);
    Utils.print(chalk.bold.red(constants.KILLING_NODES));
    shell.exec("killall node");
  }
}

function initPlaykitRepos(reposConfiguration, configuredRepos) {
  const playkits = {};
  pkReposList.forEach((repoAlias) => {
    const options = {
      mode: constants.DEV_MODE,
      name: pkReposData[repoAlias].name,
      url: pkReposData[repoAlias].url,
      peerDependencies: pkReposData[repoAlias].peerDependencies,
      devDependencies: pkReposData[repoAlias].devDependencies,
      include: configuredRepos.includes(repoAlias),
      version: reposConfiguration[repoAlias]
    };
    playkits[repoAlias] = new PlaykitRepoController(options);
  });
  return playkits;
}

function printInfo() {
  Utils.print(chalk.bold.bgRed(constants.STOP_DEV_MODE));
}

function handlePlaykitRepos() {
  pkReposList.forEach((repoAlias) => {
    const playkit = this.playkits[repoAlias];
    if (playkit.include) {
      Utils.printSeparator();
      Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(playkit.name));
      Utils.moveDirectory(playkit.name);
      playkit.stopDevMode();
    }
  });
}

function handleKalturaPlayerRepo() {
  Utils.printSeparator();
  Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(constants.KALTURA_PLAYER_JS));
  Utils.moveDirectory(constants.KALTURA_PLAYER_JS);
  this.kp.stopDevMode();
}

module.exports = DevStop;
