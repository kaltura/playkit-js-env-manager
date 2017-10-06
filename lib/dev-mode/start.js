#! /usr/bin/env node
const shell = require("shelljs");
const chalk = require("chalk");
const constants = require("../common/constants");
const PlaykitRepoController = require("../controllers/playkit-repo-controller");
const KalturaPlayerRepoController = require("../controllers/kaltura-player-repo-controller");
const Utils = require("../common/utils");
const PkgJsonParser = require("../common/pkg-json-parser");
const pkReposList = require("../configuration/repo-list.json");
const pkReposData = require("../configuration/repo-data.json");

class DevStart {
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

  start() {
    handlePlaykitRepos.call(this);
    handleKalturaPlayerRepo.call(this);
  }
}

function initPlaykitRepos(reposConfiguration, configuredRepos) {
  const playkits = {};
  pkReposList.forEach((repoAlias) => {
    const options = {
      mode: constants.DEV_MODE,
      alias: repoAlias,
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

function printInfo(reposConfiguration) {
  Utils.print(chalk.bold.bgGreen(constants.START_DEV_MODE));
  Utils.printSeparator();
  Utils.print(chalk.bold(constants.BUILDING_FOR_CONFIGURATION));
  Utils.print(chalk.italic(JSON.stringify(reposConfiguration, null, 2)));
}

function handlePlaykitRepos() {
  pkReposList.forEach((repoAlias) => {
    const playkit = this.playkits[repoAlias];
    if (playkit.include) {
      Utils.printSeparator();
      Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(playkit.name));
      Utils.moveDirectory(playkit.name);
      playkit.startDevMode();
    }
  });
}

function handleKalturaPlayerRepo() {
  Utils.printSeparator();
  Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(constants.KALTURA_PLAYER_JS));
  Utils.moveDirectory(constants.KALTURA_PLAYER_JS);
  this.kp.startDevMode();
}

module.exports = DevStart;
