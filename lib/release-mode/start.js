#! /usr/bin/env node
const shell = require("shelljs");
const chalk = require("chalk");
const fs = require("fs");
const constants = require("../common/constants");
const PkgJsonParser = require("../common/pkg-json-parser");
const PlaykitRepoController = require("../controllers/playkit-repo-controller");
const KalturaPlayerRepoController = require("../controllers/kaltura-player-repo-controller");
const Utils = require("../common/utils");
const pkReposList = require("../configuration/repo-list.json");
const pkReposData = require("../configuration/repo-data.json");

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
      runReleaseOnPlaykitRepos.call(this)
        .then(() => {
          runReleaseOnKalturaPlayerRepo.call(this);
          fs.writeFileSync(constants.RELEASE_NOTES_FILE_PATH, Utils.getReleaseNotes());
        });
    } catch (e) {
      Utils.printError(e.message);
    }
  }
}

function initPlaykitRepos(configuredRepos) {
  const playkits = {};
  pkReposList.forEach((repoAlias) => {
    const options = {
      mode: constants.RELEASE_MODE,
      alias: repoAlias,
      name: pkReposData[repoAlias].name,
      url: pkReposData[repoAlias].url,
      peerDependencies: pkReposData[repoAlias].peerDependencies,
      devDependencies: pkReposData[repoAlias].devDependencies,
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

function runReleaseOnPlaykitRepos() {
  return pkReposList.reduce((previousPromise, repoAlias) => {
    return previousPromise.then(() => {
      const playkit = this.playkits[repoAlias];
      if (playkit.include) {
        Utils.printSeparator();
        Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(playkit.name));
        Utils.moveDirectory(playkit.name);
        return playkit.runReleaseMode();
      } else {
        return Promise.resolve();
      }
    });
  }, Promise.resolve());
}

function runReleaseOnKalturaPlayerRepo() {
  Utils.printSeparator();
  Utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.cyan.italic(constants.KALTURA_PLAYER_JS));
  Utils.moveDirectory(constants.KALTURA_PLAYER_JS);
  this.kp.runReleaseMode();
}

module.exports = ReleaseStart;
